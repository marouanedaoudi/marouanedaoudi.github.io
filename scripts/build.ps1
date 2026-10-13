$ErrorActionPreference = 'Stop'
$projectRoot = Split-Path -Parent $PSScriptRoot
$portableHugo = Join-Path $projectRoot '.tools\hugo\hugo.exe'
$hugoCommand = Get-Command hugo -ErrorAction SilentlyContinue
if (Test-Path -LiteralPath $portableHugo) { $hugoBinary = $portableHugo }
elseif ($hugoCommand) { $hugoBinary = $hugoCommand.Source }
else { throw 'Hugo is missing. Run .\scripts\setup.ps1 first.' }
Push-Location -LiteralPath $projectRoot
try {
  & $hugoBinary --gc --minify --environment production
  if ($LASTEXITCODE -ne 0) { throw 'Hugo build failed.' }
  if (Get-Command node -ErrorAction SilentlyContinue) {
    node scripts/validate-site.mjs public
    if ($LASTEXITCODE -ne 0) { throw 'Site validation failed.' }
  } else { Write-Warning 'Build completed; install Node.js 22+ to run the validation script locally. CI runs this check before publishing.' }
} finally { Pop-Location }
