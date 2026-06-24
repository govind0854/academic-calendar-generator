import pypdf
import os

reader = pypdf.PdfReader("official_calendar.pdf")
print("Total pages:", len(reader.pages))

# Write full file
with open("official_calendar_text.txt", "w", encoding="utf-8") as f:
    for idx, page in enumerate(reader.pages):
        f.write(f"\n========================================\n")
        f.write(f"PAGE {idx+1}\n")
        f.write(f"========================================\n")
        text = page.extract_text() or ""
        f.write(text)
        
        # Write individual files
        with open(f"extracted_pages/page_{idx+1}.txt", "w", encoding="utf-8") as pf:
            pf.write(text)

print("Individual text files updated successfully in extracted_pages/.")
