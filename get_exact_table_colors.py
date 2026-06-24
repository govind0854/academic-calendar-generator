from PIL import Image

# Load the page 14 image
img = Image.open("extracted_pages/page_14.png")
w, h = img.size

# Let's write a script to sample a column of pixels on the left side of the bottom-left events table.
# The bottom-left events table is located roughly in the lower part of the page, on the left side (x between w*0.05 and w*0.45, y between h*0.55 and h*0.8)
# Let's sample a vertical line at x = int(w * 0.15) from y = int(h * 0.55) to int(h * 0.8)

colors = []
for y in range(int(h * 0.53), int(h * 0.82)):
    # Sample a 3x3 average to filter noise
    rgb_sum = [0, 0, 0]
    count = 0
    for dx in range(-1, 2):
        for dy in range(-1, 2):
            px = img.getpixel((int(w * 0.15) + dx, y + dy))
            rgb_sum[0] += px[0]
            rgb_sum[1] += px[1]
            rgb_sum[2] += px[2]
            count += 1
    avg_rgb = (rgb_sum[0] // count, rgb_sum[1] // count, rgb_sum[2] // count)
    colors.append((y, avg_rgb))

# Let's find contiguous segments of similar colors
threshold = 15
segments = []
current_segment = []

for y, col in colors:
    if not current_segment:
        current_segment.append((y, col))
    else:
        # Check distance to the first color in the current segment
        prev_col = current_segment[0][1]
        dist = sum(abs(col[i] - prev_col[i]) for i in range(3))
        if dist < threshold:
            current_segment.append((y, col))
        else:
            if len(current_segment) > 5:
                # Add segment details
                segment_ys = [item[0] for item in current_segment]
                segment_cols = [item[1] for item in current_segment]
                r_avg = sum(c[0] for c in segment_cols) // len(segment_cols)
                g_avg = sum(c[1] for c in segment_cols) // len(segment_cols)
                b_avg = sum(c[2] for c in segment_cols) // len(segment_cols)
                segments.append((segment_ys[0], segment_ys[-1], (r_avg, g_avg, b_avg)))
            current_segment = [(y, col)]

if len(current_segment) > 5:
    segment_ys = [item[0] for item in current_segment]
    segment_cols = [item[1] for item in current_segment]
    r_avg = sum(c[0] for c in segment_cols) // len(segment_cols)
    g_avg = sum(c[1] for c in segment_cols) // len(segment_cols)
    b_avg = sum(c[2] for c in segment_cols) // len(segment_cols)
    segments.append((segment_ys[0], segment_ys[-1], (r_avg, g_avg, b_avg)))

print("Detected Color Segments in Events Table:")
for start_y, end_y, col in segments:
    hex_color = f"#{col[0]:02x}{col[1]:02x}{col[2]:02x}"
    print(f"y: {start_y} to {end_y} -> RGB: {col} -> HEX: {hex_color}")
