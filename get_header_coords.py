import pypdf

reader = pypdf.PdfReader("official_calendar.pdf")
page = reader.pages[13]

def visitor_header(text, cm, tm, fontDict, fontSize):
    y = tm[5]
    x = tm[4]
    # Look at the y-range of headers (above Mon at 444)
    if text.strip() and 440 <= y <= 500:
        print(f"Header Text: {text.strip():<20} | x={x:.1f}, y={y:.1f}")

page.extract_text(visitor_text=visitor_header)
