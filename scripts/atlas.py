# generates a font atlas for glyph dither effects
from PIL import Image, ImageDraw, ImageFont

glyphs = "CTOSÃÿ"
glyph_size = 48 # px
atlas_width = glyph_size * len(glyphs)
atlas_height = glyph_size


font_path = "../public/fonts/TX-02-Variable.woff2"
font_size = 50  # adjust when changing fonts for proper fitting
font = ImageFont.truetype(font_path, font_size)

atlas = Image.new("RGBA", (atlas_width, atlas_height), (0, 0, 0, 255))

for i, letter in enumerate(glyphs):
    char_image = Image.new("RGBA", (glyph_size, glyph_size), (0, 0, 0, 255))
    draw = ImageDraw.Draw(char_image)

    bbox = draw.textbbox((0, 0), letter, font=font)
    text_width = bbox[2] - bbox[0]
    text_height = bbox[3] - bbox[1]

    x_offset = (glyph_size - text_width) // 2
    y_offset = (glyph_size - text_height) // 2 - 12

    draw.text((x_offset, y_offset), letter, font=font, fill=(255, 255, 255, 255))
    atlas.paste(char_image, (i * glyph_size, 0))

atlas.save("../public/atlas.png")
print("Atlas saved.")
