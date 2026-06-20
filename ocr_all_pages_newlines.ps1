
[void][Windows.Graphics.Imaging.BitmapDecoder, Windows.Graphics.Imaging, ContentType = WindowsRuntime]
[void][Windows.Media.Ocr.OcrEngine, Windows.Media.Ocr, ContentType = WindowsRuntime]
[void][Windows.Storage.StorageFile, Windows.Storage, ContentType = WindowsRuntime]
[void][Windows.Storage.Streams.IRandomAccessStream, Windows.Storage, ContentType = WindowsRuntime]
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

$lang = New-Object Windows.Globalization.Language("en-US")
$engine = [Windows.Media.Ocr.OcrEngine]::TryCreateFromLanguage($lang)
if ($engine -eq $null) {
    Write-Host "OcrEngine is null!"
    exit
}

$dir = Join-Path (Get-Location).Path "extracted_pages"
for ($i = 1; $i -le 22; $i++) {
    $imgName = "page_$i.png"
    $imgPath = Join-Path $dir $imgName
    $txtName = "page_$i.txt"
    $txtPath = Join-Path $dir $txtName
    
    if (-not (Test-Path $imgPath)) { continue }
    
    try {
        $fileOp = [Windows.Storage.StorageFile]::GetFileFromPathAsync($imgPath)
        $file = Await-Operation $fileOp ([Windows.Storage.StorageFile])

        $streamOp = $file.OpenAsync([Windows.Storage.FileAccessMode]::Read)
        $stream = Await-Operation $streamOp ([Windows.Storage.Streams.IRandomAccessStream])

        $decoderOp = [Windows.Graphics.Imaging.BitmapDecoder]::CreateAsync($stream)
        $decoder = Await-Operation $decoderOp ([Windows.Graphics.Imaging.BitmapDecoder])

        $bitmapOp = $decoder.GetSoftwareBitmapAsync()
        $bitmap = Await-Operation $bitmapOp ([Windows.Graphics.Imaging.SoftwareBitmap])

        $ocrOp = $engine.RecognizeAsync($bitmap)
        $ocrResult = Await-Operation $ocrOp ([Windows.Media.Ocr.OcrResult])
        
        # Build text line by line
        $txt = ""
        foreach ($line in $ocrResult.Lines) {
            $txt += $line.Text + "`r`n"
        }
        
        [System.IO.File]::WriteAllText($txtPath, $txt)
        Write-Host "OCRed page $i successfully (with lines)"
    } catch {
        Write-Host "Failed page $i : $_"
    }
}
