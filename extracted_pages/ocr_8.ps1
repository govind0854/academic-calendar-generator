
[void][Windows.Graphics.Imaging.BitmapDecoder, Windows.Graphics.Imaging, ContentType = WindowsRuntime]
[void][Windows.Media.Ocr.OcrEngine, Windows.Media.Ocr, ContentType = WindowsRuntime]
[void][Windows.Storage.StorageFile, Windows.Storage, ContentType = WindowsRuntime]
[void][Windows.Storage.Streams.IRandomAccessStreamWithContentType, Windows.Storage, ContentType = WindowsRuntime]
[void][Windows.Globalization.Language, Windows.Foundation, ContentType = WindowsRuntime]
[void][Windows.Foundation.IAsyncInfo, Windows.Foundation, ContentType = WindowsRuntime]

function Await-Operation($asyncOp, $type) {
    $asyncInfoType = [Windows.Foundation.IAsyncInfo]
    $statusProp = $asyncInfoType.GetProperty("Status")
    
    while ($statusProp.GetValue($asyncOp) -eq 0 -or $statusProp.GetValue($asyncOp) -eq 'Started') {
        Start-Sleep -Milliseconds 10
    }
    
    $interfaceType = [Windows.Foundation.IAsyncOperation`1].MakeGenericType($type)
    $method = $interfaceType.GetMethod("GetResults")
    return $method.Invoke($asyncOp, $null)
}

$imagePath = "D:\\Desktop\\Academic_Calender_Generator\\academic-calendar-generator-main\\extracted_pages\\page_8.png"
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

$ocrResult.Text
