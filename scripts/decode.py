import sys, cv2
for p in sys.argv[1:]:
    img = cv2.imread(p)
    d = cv2.QRCodeDetector()
    val, pts, _ = d.detectAndDecode(img)
    if not val:
        small = cv2.resize(img, None, fx=0.5, fy=0.5)
        val, pts, _ = d.detectAndDecode(small)
    print(p, '->', repr(val))
