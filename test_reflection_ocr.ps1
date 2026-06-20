
Add-Type -AssemblyName "System.Runtime.WindowsRuntime"
[void][Windows.Graphics.Imaging.BitmapDecoder, Windows.Graphics.Imaging, ContentType = WindowsRuntime]
[void][Windows.Media.Ocr.OcrEngine, Windows.Media.Ocr, ContentType = WindowsRuntime]
[void][Windows.Storage.StorageFile, Windows.Storage, ContentType = WindowsRuntime]
[void][Windows.Storage.Streams.IRandomAccessStreamWithContentType, Windows.Storage, ContentType = WindowsRuntime]
[void][Windows.Globalization.Language, Windows.Foundation, ContentType = WindowsRuntime]

# Find the AsTask method for IAsyncOperation
$methods = [System.WindowsRuntimeSystemExtensions].GetMethods()
$global:asTaskMethod = $methods | Where-Object { 
    $_.Name -eq "AsTask" -and 
    $_.GetParameters().Length -eq 1 -and 
    $_.GetParameters()[0].ParameterType.Name -like "IAsyncOperation*" 
} | Select-Object -First 1

if ($global:asTaskMethod -eq $null) {
    Write-Host "AsTask method not found!"
    exit
}

function Await-Operation($asyncOp, $type) {
    $genericMethod = $global:asTaskMethod.MakeGenericMethod($type)
    $task = $genericMethod.Invoke($null, @($asyncOp))
    return $task.Result
}

$imagePath = Join-Path (Get-Location).Path "extracted_pages\page_1.png"
if (-not (Test-Path $imagePath)) {
    Write-Host "Image not found at $imagePath"
    exit
}

$fileOp = [Windows.Storage.StorageFile]::GetFileFromPathAsync($imagePath)
$file = Await-Operation $fileOp ([Windows.Storage.StorageFile])

$streamOp = $file.OpenAsync([Windows.Storage.FileAccessMode]::Read)
$stream = Await-Operation $streamOp ([Windows.Storage.Streams.IRandomAccessStreamWithContentType])

$decoderOp = [Windows.Graphics.Imaging.BitmapDecoder]::CreateAsync($stream)
$decoder = Await-Operation $decoderOp ([Windows.Graphics.Imaging.BitmapDecoder])

$bitmapOp = $decoder.GetSoftwareBitmapAsync()
$bitmap = Await-Operation $bitmapOp ([Windows.Graphics.Imaging.SoftwareBitmap])

$lang = New-Object Windows.Globalization.Language("en-US")
$engine = [Windows.Media.Ocr.OcrEngine]::TryCreateFromLanguage($lang)
if ($engine -eq $null) {
    Write-Host "OcrEngine is null!"
    exit
}

$ocrOp = $engine.RecognizeAsync($bitmap)
$ocrResult = Await-Operation $ocrOp ([Windows.Media.Ocr.OcrResult])

Write-Host "OCR Result:"
Write-Host $ocrResult.Text
