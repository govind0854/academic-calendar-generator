import pypdf
from PIL import Image

# PDF coordinates
pdf_w = 792.0
pdf_h = 612.0

img = Image.open("extracted_pages/page_14.png")
w, h = img.size

def get_color_at_pdf(x_pdf, y_pdf):
    x_img = int(x_pdf * (w / pdf_w))
    y_img = int((pdf_h - y_pdf) * (h / pdf_h))
    # Sample a 5x5 region around the point to get the dominant color
    colors = []
    for dx in range(-2, 3):
        for dy in range(-2, 3):
            if 0 <= x_img + dx < w and 0 <= y_img + dy < h:
                colors.append(img.getpixel((x_img + dx, y_img + dy)))
    # Return average color
    r = int(sum(c[0] for c in colors) / len(colors))
    g = int(sum(c[1] for c in colors) / len(colors))
    b = int(sum(c[2] for c in colors) / len(colors))
    return f"rgb({r},{g},{b})", f"#{r:02x}{g:02x}{b:02x}"

# Let's sample some date cells:
# June 28 Mon (no highlight): x=91.9, y=444.0
print("June 28 Mon (normal cell):", get_color_at_pdf(91.9, 444.0))

# Internal Exams: August 18-20, 2027
# Let's check Wed Aug 18 which is Week 8 Wednesday.
# Wed row is at y=413.8.
# Week 8 is at x=293.1.
print("Aug 18 Wed (Internal Exams, expected Magenta):", get_color_at_pdf(293.1, 413.8))

# Finalization of Detentions: Oct 23, 2027 (Saturday of Week 17)
# Sat row is at y=366.3.
# Week 17 is at x=554.0.
print("Oct 23 Sat (Detention Finalization, expected Red):", get_color_at_pdf(554.0, 366.3))

# Makeup Internal Exams: Nov 4-6, 2027 (Thu-Sat of Week 19)
# Week 19 is at x=597.8.
# Let's sample Thu Nov 4 (y=398.4)
print("Nov 4 Thu (Makeup Exams, expected Cyan):", get_color_at_pdf(597.8, 398.4))

# Semester End Lab Exams: Nov 8-13, 2027 (Week 20)
# Let's sample Mon Nov 8 (y=444.0, x=621.2)
print("Nov 8 Mon (Lab Exams, expected Purple):", get_color_at_pdf(621.2, 444.0))

# Semester End Theory Exams: Nov 15-27, 2027 (Week 21, 22)
# Let's sample Mon Nov 15 (y=444.0, x=655.2)
print("Nov 15 Mon (Theory Exams, expected Yellow/Orange):", get_color_at_pdf(655.2, 444.0))

# Let's sample Sri Krishna Ashtami holiday: Aug 25 Wednesday (Week 9 Wednesday)
# Week 9 is at x=314.3, Wed row is at y=413.8
print("Aug 25 Wed (Holiday, expected Sri Krishna Ashtami):", get_color_at_pdf(314.3, 413.8))

# Let's sample Mahatma Gandhi Jayanthi holiday: Oct 2 Saturday (Week 14 Saturday)
# Week 14 is at x=468.9, Sat row is at y=366.3
print("Oct 2 Sat (Holiday, expected Mahatma Gandhi Jayanthi):", get_color_at_pdf(468.9, 366.3))
