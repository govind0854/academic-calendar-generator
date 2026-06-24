import pypdf

reader = pypdf.PdfReader("official_calendar.pdf")
page = reader.pages[13] # page 14 is index 13

# We can define a callback to get coordinates
def visitor_body(text, cm, tm, fontDict, fontSize):
    y = tm[5]
    x = tm[4]
    if text.strip():
        print(f"Text: {text.strip():<20} | x={x:.1f}, y={y:.1f}")

page.extract_text(visitor_text=visitor_body)
