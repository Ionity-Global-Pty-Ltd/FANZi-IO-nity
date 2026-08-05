#requires -version 5.1
<#
.SYNOPSIS
    Resilient launcher for FANZi IO-nity (Fanzi.FanControl).

.DESCRIPTION
    - Ensures the app runs elevated (required for hardware/RGB/fan access).
    - Optionally checks GitHub Releases for a newer build and updates the local
      copy before launching (self-updating launcher).
    - Supervises the running process and automatically restarts it if it exits
      unexpectedly (crashes), with a bounded retry budget so a crash-loop bug
      (see known SocketException/UnobservedTaskException issue) cannot spin
      forever or hammer the machine.
    - Logs every launch/crash/restart/update event to a rotating log file.

.PARAMETER ExePath
    Path to the Fanzi.FanControl executable. Defaults to a copy named
    "Fanzi.FanControl.exe" next to this script.

.PARAMETER CheckForUpdates
    When set (default), queries the GitHub Releases API for
    Ionity-Global-Pty-Ltd/FANZi-IO-nity and downloads a newer asset if the
    published version is higher than the local file's version.

.PARAMETER MaxRestarts
    Maximum number of automatic restarts allowed within -RestartWindowMinutes
    before the launcher gives up and exits with an error. Default: 5.

.PARAMETER RestartWindowMinutes
    Rolling time window (minutes) used to evaluate -MaxRestarts. Default: 10.

.EXAMPLE
    powershell -ExecutionPolicy Bypass -File .\Launch-FanziIOnity.ps1

.EXAMPLE
    powershell -File .\Launch-FanziIOnity.ps1 -ExePath "C:\Apps\Fanzi.FanControl.exe" -NoUpdateCheck
#>
[CmdletBinding()]
param(
    [string]$ExePath = (Join-Path $PSScriptRoot "Fanzi.FanControl.exe"),
    [switch]$NoUpdateCheck,
    [int]$MaxRestarts = 5,
    [int]$RestartWindowMinutes = 10,
    [string]$GitHubRepo = "Ionity-Global-Pty-Ltd/FANZi-IO-nity"
)

$ErrorActionPreference = "Stop"

# ---------------------------------------------------------------------------
# Logging
# ---------------------------------------------------------------------------
$logDir = Join-Path $env:APPDATA "FANZI\launcher-logs"
New-Item -ItemType Directory -Force -Path $logDir | Out-Null
$logFile = Join-Path $logDir ("launcher_{0}.log" -f (Get-Date -Format "yyyyMMdd"))

function Write-Log {
    param([string]$Message, [string]$Level = "INFO")
    $line = "[{0}] [{1}] {2}" -f (Get-Date -Format "yyyy-MM-dd HH:mm:ss"), $Level, $Message
    Add-Content -Path $logFile -Value $line
    switch ($Level) {
        "ERROR" { Write-Host $line -ForegroundColor Red }
        "WARN"  { Write-Host $line -ForegroundColor Yellow }
        default { Write-Host $line }
    }
}

# Prune log files older than 30 days
Get-ChildItem $logDir -Filter "launcher_*.log" -ErrorAction SilentlyContinue |
    Where-Object { $_.LastWriteTime -lt (Get-Date).AddDays(-30) } |
    Remove-Item -Force -ErrorAction SilentlyContinue

# ---------------------------------------------------------------------------
# Elevation
# ---------------------------------------------------------------------------
function Test-IsElevated {
    $identity = [Security.Principal.WindowsIdentity]::GetCurrent()
    $principal = New-Object Security.Principal.WindowsPrincipal($identity)
    return $principal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
}

if (-not (Test-IsElevated)) {
    Write-Log "Not elevated - relaunching launcher with administrator rights."
    $argList = @("-NoProfile", "-ExecutionPolicy", "Bypass", "-File", "`"$PSCommandPath`"")
    foreach ($key in $PSBoundParameters.Keys) {
        $val = $PSBoundParameters[$key]
        if ($val -is [switch]) {
            if ($val.IsPresent) { $argList += "-$key" }
        } else {
            $argList += "-$key"; $argList += "`"$val`""
        }
    }
    Start-Process -FilePath "powershell.exe" -ArgumentList $argList -Verb RunAs
    exit 0
}

# ---------------------------------------------------------------------------
# Update check
# ---------------------------------------------------------------------------
function Get-LocalVersion([string]$path) {
    if (-not (Test-Path $path)) { return $null }
    try {
        return [System.Version]((Get-Item $path).VersionInfo.FileVersion.Split("+")[0])
    } catch {
        return $null
    }
}

function Invoke-UpdateCheck {
    param([string]$ExePath, [string]$Repo)

    Write-Log "Checking for updates against GitHub release for $Repo..."
    try {
        $headers = @{ "User-Agent" = "FANZi-IOnity-Launcher" }
        $release = Invoke-RestMethod -Uri "https://api.github.com/repos/$Repo/releases/latest" -Headers $headers -TimeoutSec 15
    } catch {
        Write-Log "Update check failed (offline or rate-limited): $($_.Exception.Message)" "WARN"
        return
    }

    $tag = $release.tag_name -replace '^v', ''
    $remoteVersion = $null
    try { $remoteVersion = [System.Version]$tag } catch { }
    if (-not $remoteVersion) {
        Write-Log "Could not parse remote version from tag '$($release.tag_name)'." "WARN"
        return
    }

    $localVersion = Get-LocalVersion $ExePath
    Write-Log "Local version: $localVersion | Latest published: $remoteVersion"

    if ($localVersion -and $localVersion -ge $remoteVersion) {
        Write-Log "Local copy is already up to date."
        return
    }

    $asset = $release.assets | Where-Object { $_.name -like "*.exe" } | Select-Object -First 1
    if (-not $asset) {
        Write-Log "No .exe asset found on latest release; skipping update." "WARN"
        return
    }

    Write-Log "Newer version available ($remoteVersion). Downloading $($asset.name)..."
    $tempFile = Join-Path $env:TEMP $asset.name
    try {
        Invoke-WebRequest -Uri $asset.browser_download_url -OutFile $tempFile -Headers $headers -TimeoutSec 120
    } catch {
        Write-Log "Download failed: $($_.Exception.Message)" "ERROR"
        return
    }

    if (Test-Path $ExePath) {
        $backup = "$ExePath.bak"
        Copy-Item $ExePath $backup -Force
        Write-Log "Backed up existing exe to $backup"
    }

    Move-Item $tempFile $ExePath -Force
    Write-Log "Updated local copy to version $remoteVersion."
}

if (-not $NoUpdateCheck) {
    Invoke-UpdateCheck -ExePath $ExePath -Repo $GitHubRepo
}

if (-not (Test-Path $ExePath)) {
    Write-Log "Executable not found at '$ExePath'. Aborting." "ERROR"
    exit 1
}

# ---------------------------------------------------------------------------
# Already-running guard
# ---------------------------------------------------------------------------
$procName = [System.IO.Path]::GetFileNameWithoutExtension($ExePath)
$existing = Get-Process -Name $procName -ErrorAction SilentlyContinue
if ($existing) {
    Write-Log "FANZi IO-nity is already running (PID $($existing.Id -join ',')). Nothing to do."
    exit 0
}

# ---------------------------------------------------------------------------
# Supervised launch loop
# ---------------------------------------------------------------------------
$restartTimestamps = New-Object System.Collections.Generic.List[DateTime]

Write-Log "Starting FANZi IO-nity from '$ExePath'."

while ($true) {
    $proc = Start-Process -FilePath $ExePath -PassThru
    Write-Log "Launched PID $($proc.Id)."
    $proc.WaitForExit()
    $exitCode = $proc.ExitCode
    Write-Log "Process PID $($proc.Id) exited with code $exitCode." "WARN"

    # Prune restart timestamps outside the rolling window
    $cutoff = (Get-Date).AddMinutes(-$RestartWindowMinutes)
    $restartTimestamps.RemoveAll({ param($t) $t -lt $cutoff }) | Out-Null

    if ($exitCode -eq 0) {
        Write-Log "Clean exit (code 0) - not restarting."
        break
    }

    if ($restartTimestamps.Count -ge $MaxRestarts) {
        Write-Log "Reached max restarts ($MaxRestarts) within $RestartWindowMinutes minute window. Giving up to avoid a crash-loop." "ERROR"
        break
    }

    $restartTimestamps.Add((Get-Date))
    Write-Log "Restarting ($($restartTimestamps.Count)/$MaxRestarts in window)..."
    Start-Sleep -Seconds 2
}

Write-Log "Launcher exiting."
