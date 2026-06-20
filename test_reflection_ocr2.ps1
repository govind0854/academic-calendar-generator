
[void][Windows.Graphics.Imaging.BitmapDecoder, Windows.Graphics.Imaging, ContentType = WindowsRuntime]
[void][Windows.Media.Ocr.OcrEngine, Windows.Media.Ocr, ContentType = WindowsRuntime]
[void][Windows.Storage.StorageFile, Windows.Storage, ContentType = WindowsRuntime]
[void][Windows.Storage.Streams.IRandomAccessStreamWithContentType, Windows.Storage, ContentType = WindowsRuntime]
[void][Windows.Globalization.Language, Windows.Foundation, ContentType = WindowsRuntime]

function Await-Operation($asyncOp, $type) {
    while ($asyncOp.Status -eq 'Started' -or $asyncOp.Status -eq 0) {
        Start-Sleep -Milliseconds 10
    }
    # Invoke GetResults via reflection
    $interfaceType = [Windows.Foundation.IAsyncOperation`1].MakeGenericType($type)
    $method = $interfaceType.GetMethod("GetResults")
    return $method.Invoke($asyncOp, $null)
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
