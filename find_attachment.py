import os

def find_file(name_sub):
    drives = ["C:\\", "D:\\"]
    found = []
    for drive in drives:
        print(f"Searching drive: {drive}...")
        for root, dirs, files in os.walk(drive):
            # Exclude some system dirs to make search faster
            if any(p in root for p in ["Windows", "Program Files", "AppData\\Local\\Packages"]):
                continue
            for f in files:
                if name_sub in f:
                    path = os.path.join(root, f)
                    print("Found:", path)
                    found.append(path)
    return found

find_file("1757140483326")
