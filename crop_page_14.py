from PIL import Image

def inspect_and_crop(filename, output_crop):
    img = Image.open(filename)
    width, height = img.size
    print(f"{filename} size: {img.size}")
    
    # We want to crop the main working days table grid.
    # The grid is located in the upper half of the page.
    # Let's crop the header and table from 0.15*height to 0.55*height.
    crop_box = (0, int(0.15 * height), width, int(0.55 * height))
    cropped = img.crop(crop_box)
    cropped.save(output_crop)
    print(f"Saved crop to {output_crop}")

inspect_and_crop("extracted_pages/page_14.png", "public/crop_page_14.png")
inspect_and_crop("extracted_pages/page_4.png", "public/crop_page_4_table.png")
