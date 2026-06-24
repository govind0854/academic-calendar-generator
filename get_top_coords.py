import pypdf

reader = pypdf.PdfReader("official_calendar.pdf")
page = reader.pages[13]

def visitor_top(text, cm, tm, fontDict, fontSize):
    y = tm[5]
    x = tm[4]
    if text.strip() and y > 480:
        print(f"Top Text: {text.strip():<35} | x={x:.1f}, y={y:.1f}, size={fontSize:.1f}")

page.extract_text(visitor_text=visitor_top)
