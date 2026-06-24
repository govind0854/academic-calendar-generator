from PIL import Image

def inspect_and_crop(filename, output_crop):
    img = Image.open(filename)
    print(f"{filename} size: {img.size}")
    # Let's crop the bottom part of the table where the monthly totals and labels are.
    # Usually it's in the lower-middle part of the page.
    width, height = img.size
    # Crop the bottom row of the table
    # Table seems to be vertically located around 0.2 to 0.5 of height. Let's crop from 0.4*height to 0.5*height.
    crop_box = (0, int(0.4 * height), width, int(0.5 * height))
    cropped = img.crop(crop_box)
    cropped.save(output_crop)
    print(f"Saved crop to {output_crop}")

inspect_and_crop("extracted_pages/page_4.png", "public/crop_page_4.png")
inspect_and_crop("extracted_pages/page_8.png", "public/crop_page_8.png")
