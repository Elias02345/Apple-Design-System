"""Encode frames from capture.cjs. Usage: python tools/encode-motion.py <frames>"""
import sys
from pathlib import Path
from PIL import Image
root=Path(__file__).resolve().parents[1]
for name in ("selection", "sheet"):
    frames=[]
    for file in sorted((Path(sys.argv[1])/name).glob("*.png")):
        with Image.open(file) as image:
            image.thumbnail((700,560),Image.Resampling.LANCZOS)
            frames.append(image.convert("RGB"))
    if not frames:
        raise SystemExit("Missing captured frames for " + name)
    # A shared palette avoids color flicker in photographic content.
    palette=frames[-1].quantize(256)
    colored=[f.quantize(palette=palette,dither=Image.Dither.NONE) for f in frames]
    colored[0].save(root/"showcase"/(name+".gif"),save_all=True,append_images=colored[1:],
                    duration=[800]+[40]*(len(colored)-2)+[1200],loop=0,optimize=True,disposal=1)
