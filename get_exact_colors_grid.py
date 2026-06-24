from PIL import Image

img = Image.open("extracted_pages/page_14.png")
w, h = img.size

# We know the rows are vertically spaced between y=690 and y=950.
# Let's divide this space into 8 rows.
y_start = 690
y_end = 950
num_rows = 8
row_height = (y_end - y_start) / num_rows

for row_idx in range(num_rows):
    y_center = int(y_start + (row_idx + 0.5) * row_height)
    
    # Sample all pixels along y_center for x from 150 to 700 (description column)
    sampled = []
    for x in range(150, 700):
        px = img.getpixel((x, y_center))[:3]
        sampled.append(px)
    
    # Filter out white/light grey, black/dark text, and blue borders
    filtered = []
    for c in sampled:
        # Not too bright (white), not too dark (black text), and has some color (r,g,b not all equal)
        brightness = sum(c)
        colorfulness = max(c) - min(c)
        if 80 < brightness < 720 and colorfulness > 15:
            # Also exclude the dark blue border color (r,g small, b large)
            if not (c[2] > 120 and c[0] < 80):
                filtered.append(c)
    
    if filtered:
        # Find the most frequent color
        freq = {}
        for c in filtered:
            freq[c] = freq.get(c, 0) + 1
        most_common = max(freq, key=freq.get)
        hex_color = f"#{most_common[0]:02x}{most_common[1]:02x}{most_common[2]:02x}"
        print(f"Row {row_idx + 1} (y={y_center}) -> RGB: {most_common} -> HEX: {hex_color}")
    else:
        print(f"Row {row_idx + 1} (y={y_center}) -> No dominant colored background found!")
