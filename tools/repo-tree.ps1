# ============================================
# AKVEZ Repository Audit Tool
# Version: 1.0
# ============================================

$ErrorActionPreference = "Stop"

$ExcludeFolders = @(
    ".git",
    "node_modules",
    "dist",
    "build",
    ".next",
    ".vite",
    ".idea",
    ".vscode",
    "coverage"
)

function Show-Tree {
    param(
        [string]$Path,
        [string]$Indent = ""
    )

    $items = Get-ChildItem $Path | Sort-Object PSIsContainer -Descending, Name

    foreach ($item in $items) {

        if ($item.PSIsContainer) {

            if ($ExcludeFolders -contains $item.Name) {
                continue
            }

            Write-Host "$Indent📁 $($item.Name)"
            Show-Tree -Path $item.FullName -Indent "$Indent    "
        }
        else {
            Write-Host "$Indent📄 $($item.Name)"
        }
    }
}

Write-Host ""
Write-Host "========================================="
Write-Host " AKVEZ Repository Structure"
Write-Host "========================================="
Write-Host ""

Show-Tree -Path (Get-Location)

Write-Host ""
Write-Host "========================================="
Write-Host " End of Repository Structure"
Write-Host "========================================="