from PIL import Image

# Ganti path_file_gambar dengan path file gambar yang ingin Anda cek
path_file_gambar = "ct-kidney-dataset/Normal/Normal- (2).jpg"

# Buka gambar menggunakan PIL
img = Image.open(path_file_gambar)

# Periksa dimensi gambar
width, height = img.size
print("Lebar gambar:", width)
print("Tinggi gambar:", height)
