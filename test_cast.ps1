
[void][Windows.Storage.StorageFile, Windows.Storage, ContentType = WindowsRuntime]
$imagePath = Join-Path (Get-Location).Path "extracted_pages\page_1.png"
$fileOp = [Windows.Storage.StorageFile]::GetFileFromPathAsync($imagePath)

$castOp = $fileOp -as [Windows.Foundation.IAsyncOperation`1[Windows.Storage.StorageFile]]
Write-Host "Cast succeeded:" ($castOp -ne $null)

$results = $castOp.GetResults()
Write-Host "Got results:" ($results -ne $null)
