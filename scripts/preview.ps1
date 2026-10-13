$ErrorActionPreference = 'Stop'
$projectRoot = Split-Path -Parent $PSScriptRoot
$portableHugo = Join-Path $projectRoot '.tools\hugo\hugo.exe'
$hugoCommand = Get-Command hugo -ErrorAction SilentlyContinue
if (Test-Path -LiteralPath $portableHugo) { $hugoBinary = $portableHugo }
elseif ($hugoCommand) { $hugoBinary = $hugoCommand.Source }
else { throw 'Hugo is missing. Run .\scripts\setup.ps1 first.' }
Push-Location -LiteralPath $projectRoot
try {
  Write-Host 'Preview: http://localhost:1313/ (English) and http://localhost:1313/fr/ (French)'
  & $hugoBinary server --bind 127.0.0.1 --port 1313 --disableFastRender --noHTTPCache
  exit $LASTEXITCODE
} finally { Pop-Location }
