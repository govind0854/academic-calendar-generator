from PIL import Image

img = Image.open("extracted_pages/page_14.png")
w, h = img.size

# Safe x coordinate inside the events table description cells (avoiding text on left and right)
# Let's sample x at multiple points to be sure we get the background, not the text (black) or border (blue).
x_points = [int(w * 0.15), int(w * 0.20), int(w * 0.25)]

row_centers_y = {
    "Commencement of Class Work (Green)": 690,
    "Internal Examinations - I (Pink)": 718,
    "Finalization of Detentions (Red)": 747,
    "Last Date to Pay SEE Fee (Tan)": 776,
    "Internal Examinations - II (Pink)": 805,
    "Makeup Internal Examinations (Cyan)": 834,
    "Semester End Examinations - Lab (Purple)": 863,
    "Semester End Examinations - Theory (Yellow)": 892
}

for label, y in row_centers_y.items():
    # Sample background color (find most frequent non-black, non-blue color around y)
    sampled_colors = []
    for x in range(int(w * 0.1), int(w * 0.3)):
        px = img.getpixel((x, y))
        sampled_colors.append(px)
    
    # Filter out text (dark colors) and borders
    bg_colors = [c for c in sampled_colors if sum(c[:3]) > 100 and not (c[2] > 100 and c[0] < 50)] # filter out black and blue borders
    
    # Get the most common color
    if bg_colors:
        freq = {}
        for c in bg_colors:
            freq[c] = freq.get(c, 0) + 1
        most_common = max(freq, key=freq.get)
        hex_color = f"#{most_common[0]:02x}{most_common[1]:02x}{most_common[2]:02x}"
        print(f"{label} -> y={y} -> RGB: {most_common} -> HEX: {hex_color}")
    else:
        print(f"{label} -> No background color found!")
