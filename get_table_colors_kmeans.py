from PIL import Image

# Load the page 14 image
img = Image.open("extracted_pages/page_14.png")
w, h = img.size

# Crop the bottom-left events table
# The events table in a Landscape Letter PDF (792x612 pt) converted to PNG (say 1500x1200 pixels)
# Let's crop x: w*0.05 to w*0.48, and y: h*0.53 to h*0.77
cropped = img.crop((int(w * 0.05), int(h * 0.53), int(w * 0.48), int(h * 0.77)))
cropped.save("crop_events_table.png")

# Now let's scan a single vertical column inside the description column (say at x = int(w * 0.08))
# We will step y from h*0.53 to h*0.77, and print colors that are uniform (i.e. where color is constant for at least 15 pixels)
x = int(w * 0.08)
y_start = int(h * 0.53)
y_end = int(h * 0.77)

print("Scanning column at x =", x, "from y =", y_start, "to", y_end)
uniform_runs = []
current_color = None
run_length = 0
run_start_y = 0

for y in range(y_start, y_end):
    px = img.getpixel((x, y))[:3]
    if current_color is None:
        current_color = px
        run_length = 1
        run_start_y = y
    else:
        # Check if color is similar
        dist = sum(abs(px[i] - current_color[i]) for i in range(3))
        if dist < 10:
            run_length += 1
        else:
            if run_length >= 10:
                uniform_runs.append((run_start_y, y - 1, current_color))
            current_color = px
            run_length = 1
            run_start_y = y

if run_length >= 10:
    uniform_runs.append((run_start_y, y_end - 1, current_color))

print("\nDetected uniform color bands:")
for sy, ey, col in uniform_runs:
    hex_color = f"#{col[0]:02x}{col[1]:02x}{col[2]:02x}"
    # Filter out white/light grey and black/very dark colors
    is_colored = sum(col) > 150 and sum(col) < 700 and max(col) - min(col) > 20
    print(f"y: {sy} to {ey} (len={ey-sy+1}) -> RGB: {col} -> HEX: {hex_color} {'[COLORED]' if is_colored else ''}")
