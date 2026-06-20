
using System;
using System.Collections.Generic;
using Windows.Media.Ocr;

class Program {
    static void Main() {
        Console.WriteLine("Hello from C#!");
        try {
            var langs = OcrEngine.AvailableRecognizerLanguages;
            Console.WriteLine("Available OCR languages count: " + langs.Count);
            foreach (var lang in langs) {
                Console.WriteLine(" - " + lang.LanguageTag);
            }
        } catch (Exception ex) {
            Console.WriteLine("Error: " + ex.Message);
        }
    }
}
