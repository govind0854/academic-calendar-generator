
using System;
using System.IO;
using Windows.Graphics.Imaging;
using Windows.Media.Ocr;
using Windows.Storage;
using Windows.Storage.Streams;

class Program {
    static void Main(string[] args) {
        if (args.Length < 2) {
            Console.WriteLine("Usage: OcrTool <image_path> <output_txt_path>");
            return;
        }
        string imagePath = args[0];
        string outputPath = args[1];
        try {
            string text = RecognizeText(imagePath);
            File.WriteAllText(outputPath, text);
            Console.WriteLine("OCR succeeded: " + outputPath);
        } catch (Exception ex) {
            Console.WriteLine("Error processing " + imagePath + ": " + ex.ToString());
        }
    }

    static string RecognizeText(string imagePath) {
        var fileOp = StorageFile.GetFileFromPathAsync(Path.GetFullPath(imagePath));
        var fileTask = System.WindowsRuntimeSystemExtensions.AsTask(fileOp);
        var file = fileTask.Result;

        var streamOp = file.OpenAsync(FileAccessMode.Read);
        var streamTask = System.WindowsRuntimeSystemExtensions.AsTask(streamOp);
        var stream = streamTask.Result;

        var decoderOp = BitmapDecoder.CreateAsync(stream);
        var decoderTask = System.WindowsRuntimeSystemExtensions.AsTask(decoderOp);
        var decoder = decoderTask.Result;

        var bitmapOp = decoder.GetSoftwareBitmapAsync();
        var bitmapTask = System.WindowsRuntimeSystemExtensions.AsTask(bitmapOp);
        using (var bitmap = bitmapTask.Result) {
            OcrEngine engine = OcrEngine.TryCreateFromUserProfileLanguages();
            if (engine == null) {
                if (OcrEngine.AvailableRecognizerLanguages.Count > 0) {
                    engine = OcrEngine.TryCreateFromLanguage(OcrEngine.AvailableRecognizerLanguages[0]);
                }
            }
            if (engine == null) return "Error: OCR Engine not available";
            var ocrOp = engine.RecognizeAsync(bitmap);
            var ocrTask = System.WindowsRuntimeSystemExtensions.AsTask(ocrOp);
            var result = ocrTask.Result;
            return result.Text;
        }
    }
}
