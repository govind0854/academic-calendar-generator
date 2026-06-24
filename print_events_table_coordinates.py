from PIL import Image

img = Image.open("extracted_pages/page_14.png")
w, h = img.size

print("Image size:", w, "x", h)

# Let's sample a grid of pixels in the bottom half (y > h/2) and print colors that are not white (255, 255, 255)
# to find the boundaries of the colored boxes.
for y in range(int(h * 0.5), h, 10):
    row_colors = []
    for x in range(0, w, 20):
        px = img.getpixel((x, y))[:3]
        if sum(px) < 700: # not white/light grey
            row_colors.append((x, px))
    if len(row_colors) > 10:
        print(f"y={y}: found {len(row_colors)} non-white pixels. x ranges from {row_colors[0][0]} to {row_colors[-1][0]}")
