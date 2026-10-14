$ErrorActionPreference = 'Stop'
$projectRoot = Split-Path -Parent $PSScriptRoot
$toolsRoot = Join-Path $projectRoot '.tools\hugo'
$version = '0.143.0'
$archiveName = 'hugo_extended_' + $version + '_windows-amd64.zip'
$archivePath = Join-Path $toolsRoot $archiveName
$checksumsPath = Join-Path $toolsRoot 'checksums.txt'
New-Item -ItemType Directory -Force -Path $toolsRoot | Out-Null
$releaseURL = "https://github.com/gohugoio/hugo/releases/download/v$version"
Invoke-WebRequest -Uri "$releaseURL/$archiveName" -OutFile $archivePath
$checksumURL = $releaseURL + '/hugo_' + $version + '_checksums.txt'
Invoke-WebRequest -Uri $checksumURL -OutFile $checksumsPath
$checksumLine = Get-Content -LiteralPath $checksumsPath | Where-Object { $_ -match ([regex]::Escape($archiveName) + '$') } | Select-Object -First 1
if (-not $checksumLine) { throw 'The official checksum was not found.' }
$expectedHash = ($checksumLine -split '\s+')[0].ToUpperInvariant()
$actualHash = (Get-FileHash -LiteralPath $archivePath -Algorithm SHA256).Hash
if ($actualHash -ne $expectedHash) { throw 'Hugo archive checksum mismatch. Installation stopped.' }
Expand-Archive -LiteralPath $archivePath -DestinationPath $toolsRoot -Force
Push-Location -LiteralPath $projectRoot
try {
  $gitCommand = Get-Command git -ErrorAction Stop
  $gitRoot = Split-Path -Parent (Split-Path -Parent $gitCommand.Source)
  $gitUtilities = Join-Path $gitRoot 'usr\bin'
  $gitBinaries = Join-Path $gitRoot 'mingw64\bin'
  if (Test-Path -LiteralPath $gitUtilities) { $env:PATH = "$gitUtilities;$gitBinaries;" + $env:PATH }
  git submodule update --init --recursive
  if ($LASTEXITCODE -ne 0) { throw 'The theme could not be restored.' }
  & (Join-Path $toolsRoot 'hugo.exe') version
} finally { Pop-Location }
Write-Host 'Ready. Run .\scripts\preview.ps1'
