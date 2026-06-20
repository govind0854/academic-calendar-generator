
[void][Windows.Storage.StorageFile, Windows.Storage, ContentType = WindowsRuntime]
[void][Windows.Foundation.IAsyncInfo, Windows.Foundation, ContentType = WindowsRuntime]

$imagePath = Join-Path (Get-Location).Path "extracted_pages\page_1.png"
$fileOp = [Windows.Storage.StorageFile]::GetFileFromPathAsync($imagePath)

$asyncInfoType = [Windows.Foundation.IAsyncInfo]
$statusProp = $asyncInfoType.GetProperty("Status")

$status = $statusProp.GetValue($fileOp)
Write-Host "Initial status via reflection:" $status
Write-Host "Initial status type:" $status.GetType().FullName
Write-Host "Initial status integer value:" [int]$status

while ($statusProp.GetValue($fileOp) -eq 0 -or $statusProp.GetValue($fileOp) -eq 'Started') {
    Start-Sleep -Milliseconds 10
}

Write-Host "Final status via reflection:" ($statusProp.GetValue($fileOp))
