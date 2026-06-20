
Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing
[void][Windows.Media.Ocr.OcrEngine, Windows.Foundation, ContentType = WindowsRuntime]
[void][Windows.Graphics.Imaging.SoftwareBitmap, Windows.Foundation, ContentType = WindowsRuntime]
[void][Windows.Storage.Streams.RandomAccessStream, Windows.Foundation, ContentType = WindowsRuntime]

$imagePath = "extracted_pages\\page_1.png"
$bitmap = [System.Drawing.Bitmap]::FromFile($imagePath)

$memoryStream = New-Object System.IO.MemoryStream
$bitmap.Save($memoryStream, [System.Drawing.Imaging.ImageFormat]::Png)
$memoryStream.Position = 0
$randomAccessStream = [Windows.Storage.Streams.RandomAccessStream]::CreateFromStream($memoryStream)

$ocrEngine = [Windows.Media.Ocr.OcrEngine]::TryCreateFromUserProfileLanguages()
if ($ocrEngine -eq $null) {
    Write-Host "OCR engine could not be initialized."
    exit
}

# Try to get stream buffer
$inputStream = $randomAccessStream.GetInputStreamAt(0)
$size = $randomAccessStream.Size
$buffer = New-Object Windows.Storage.Streams.Buffer($size)

$asyncOp = $inputStream.ReadAsync($buffer, $size, [Windows.Storage.Streams.InputStreamOptions]::None)
while ($asyncOp.Status -eq 'Started' -or $asyncOp.Status -eq 0) {
    Start-Sleep -Milliseconds 10
}
$readBuffer = $asyncOp.GetResults()

$sb = [Windows.Graphics.Imaging.SoftwareBitmap]::CreateCopyFromBuffer(
    $readBuffer, 
    [Windows.Graphics.Imaging.BitmapPixelFormat]::Bgra8, 
    $bitmap.Width, 
    $bitmap.Height
)

$asyncOp2 = $ocrEngine.RecognizeAsync($sb)
while ($asyncOp2.Status -eq 'Started' -or $asyncOp2.Status -eq 0) {
    Start-Sleep -Milliseconds 10
}
$ocrResult = $asyncOp2.GetResults()

Write-Host "OCR Result Text:"
Write-Host $ocrResult.Text
