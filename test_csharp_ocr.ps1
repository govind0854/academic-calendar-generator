
$assemblies = @(
    "System.Runtime.WindowsRuntime",
    "C:\Windows\System32\WinMetadata\Windows.Foundation.winmd",
    "C:\Windows\System32\WinMetadata\Windows.Graphics.winmd",
    "C:\Windows\System32\WinMetadata\Windows.Media.winmd",
    "C:\Windows\System32\WinMetadata\Windows.Storage.winmd"
)

$source = @"
using System;
using System.IO;
using System.Threading.Tasks;
using Windows.Graphics.Imaging;
using Windows.Media.Ocr;
using Windows.Storage;
using Windows.Storage.Streams;

public class OcrService {
    public static string DoOcr(string imgPath) {
        try {
            return DoOcrAsync(imgPath).GetAwaiter().GetResult();
        } catch (Exception ex) {
            return "Error in C# OCR: " + ex.ToString();
        }
    }

    private static async Task<string> DoOcrAsync(string imgPath) {
        StorageFile file = await StorageFile.GetFileFromPathAsync(imgPath);
        using (IRandomAccessStream stream = await file.OpenAsync(FileAccessMode.Read)) {
            BitmapDecoder decoder = await BitmapDecoder.CreateAsync(stream);
            using (SoftwareBitmap bitmap = await decoder.GetSoftwareBitmapAsync()) {
                OcrEngine engine = OcrEngine.TryCreateFromUserProfileLanguages();
                if (engine == null) {
                    if (OcrEngine.AvailableRecognizerLanguages.Count > 0) {
                        engine = OcrEngine.TryCreateFromLanguage(OcrEngine.AvailableRecognizerLanguages[0]);
                    }
                }
                if (engine == null) return "Error: OCR Engine not available";
                OcrResult result = await engine.RecognizeAsync(bitmap);
                return result.Text;
            }
        }
    }
}
"@

Add-Type -TypeDefinition $source -ReferencedAssemblies $assemblies
$result = [OcrService]::DoOcr("extracted_pages\page_1.png")
Write-Host "OCR Text page 1:"
Write-Host $result
