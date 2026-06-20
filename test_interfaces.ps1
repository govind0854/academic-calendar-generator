
[void][Windows.Storage.StorageFile, Windows.Storage, ContentType = WindowsRuntime]
$imagePath = Join-Path (Get-Location).Path "extracted_pages\page_1.png"
$fileOp = [Windows.Storage.StorageFile]::GetFileFromPathAsync($imagePath)

Write-Host "fileOp Interfaces:"
$fileOp.GetType().GetInterfaces() | ForEach-Object { Write-Host $_.FullName }
