from PIL import Image, ImageDraw, ImageFont
import os

SRC = r"C:\Users\jyoti\.gemini\antigravity\brain\ab250d1d-5942-42f4-bbdc-47300bb5397e\media__1779103063992.jpg"
OUT_DIR = r"public\products"

_img = Image.open(SRC); W, H = _img.size
SCALE = W / 1086.0

CX        = round(543 * SCALE)
MAX_W     = round(500 * SCALE)
DIVIDER_Y = round(698 * SCALE)
DIV_HALF  = round(130 * SCALE)
DIAMOND   = round(5   * SCALE)
NAME_Y_1L = round(730 * SCALE)
NAME_Y_W1 = round(704 * SCALE)
DESC_Y_1L = round(815 * SCALE)
DESC_Y_W  = round(808 * SCALE)
STROKE    = max(2, round(2 * SCALE))
NAME_SINGLE = [max(20, round(s * SCALE)) for s in (64, 60, 56)]
NAME_WRAP   = [max(18, round(s * SCALE)) for s in (54, 50, 46, 42)]
DESC_SIZE   = max(14, round(26 * SCALE))

GOLD      = (140, 117, 78)
GOLD_DARK = (110, 90, 55)
REG = r"C:\Windows\Fonts\times.ttf"
ITA = r"C:\Windows\Fonts\timesi.ttf"

def tw(d, t, f):
    bb = d.textbbox((0, 0), t, font=f)
    return bb[2] - bb[0]

def split2(n):
    w = n.split()
    if len(w) < 2:
        return [n]
    best, diff = None, 10**9
    for i in range(1, len(w)):
        a, b = " ".join(w[:i]), " ".join(w[i:])
        if abs(len(a) - len(b)) < diff:
            diff, best = abs(len(a) - len(b)), (a, b)
    return list(best)

def fit_one(d, t):
    for s in NAME_SINGLE:
        f = ImageFont.truetype(REG, s)
        if tw(d, t, f) <= MAX_W:
            return f, s
    return None, None

def cen(d, t, y, f, c):
    bb = d.textbbox((0, 0), t, font=f)
    d.text((CX - (bb[2] - bb[0]) // 2 - bb[0], y), t, font=f, fill=c)

def make(slug, name, desc):
    img = Image.open(SRC).convert('RGB')
    d = ImageDraw.Draw(img)
    d.line([(CX - DIV_HALF, DIVIDER_Y), (CX + DIV_HALF, DIVIDER_Y)], fill=GOLD, width=STROKE)
    d.polygon([(CX, DIVIDER_Y - DIAMOND), (CX + DIAMOND, DIVIDER_Y),
               (CX, DIVIDER_Y + DIAMOND), (CX - DIAMOND, DIVIDER_Y)], fill=GOLD)
    f, sz = fit_one(d, name)
    if f is not None:
        cen(d, name, NAME_Y_1L, f, GOLD_DARK)
        dy = DESC_Y_1L
    else:
        lines = split2(name)
        f = sz = None
        for s in NAME_WRAP:
            tf = ImageFont.truetype(REG, s)
            if all(tw(d, l, tf) <= MAX_W for l in lines):
                f, sz = tf, s
                break
        if f is None:
            f, sz = ImageFont.truetype(REG, NAME_WRAP[-1]), NAME_WRAP[-1]
        y1 = NAME_Y_W1
        y2 = y1 + sz + round(4 * SCALE)
        cen(d, lines[0], y1, f, GOLD_DARK)
        cen(d, lines[1], y2, f, GOLD_DARK)
        dy = DESC_Y_W
    cen(d, desc, dy, ImageFont.truetype(ITA, DESC_SIZE), GOLD)
    out = os.path.join(OUT_DIR, slug + ".png")
    img.save(out, 'PNG', optimize=True)
    return out

# 11 active slugs missing PNGs
MISSING = [
    ("black-tila-taila-200ml",          "Black Tila Taila",                 "Ayurvedic Taila  ~  200 ml"),
    ("gandhi-hair-oil-200ml",           "Gandhi Hair Oil",                  "Ayurvedic Hair Oil  ~  200 ml"),
    ("gandhi-hair-shampoo-200ml",       "Gandhi Hair Shampoo",              "Ayurvedic Shampoo  ~  200 ml"),
    ("gandhi-sishuraksha-powder",       "Gandhi Sishuraksha\nPowder",       "Ayurvedic Powder"),
    ("gulabi-malham",                   "Gulabi Malham",                    "Ayurvedic Balm"),
    ("gunja-taila-200ml",              "Gunja Taila",                      "Ayurvedic Taila  ~  200 ml"),
    ("kalonji-taila-200ml",            "Kalonji Taila",                    "Ayurvedic Taila  ~  200 ml"),
    ("karanj-taila-200ml",             "Karanj Taila",                     "Ayurvedic Taila  ~  200 ml"),
    ("neem-taila-200ml",               "Neem Taila",                       "Ayurvedic Taila  ~  200 ml"),
    ("sarson-taila-200ml",             "Sarson Taila",                     "Ayurvedic Taila  ~  200 ml"),
    ("tila-taila-200ml",               "Tila Taila",                       "Ayurvedic Taila  ~  200 ml"),
]

for slug, name, desc in MISSING:
    # For gandhi-sishuraksha-powder, use split name
    display_name = name.replace("\n", " ")
    path = make(slug, display_name, desc)
    print("OK", path)

print(f"\nDone! Generated {len(MISSING)} pouch images.")
