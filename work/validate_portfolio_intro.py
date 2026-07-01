from pathlib import Path
import zipfile


ROOT = Path(r"D:\ProductSenseAI")
MD_PATH = ROOT / "docs" / "ProductSenseAI_Portfolio_Introduction.md"
DOCX_PATH = ROOT / "docs" / "ProductSenseAI_Portfolio_Introduction.docx"
OLD_MD_PATH = ROOT / "docs" / "ProductSenseAI_\u4e2d\u6587\u4f5c\u54c1\u96c6\u4ecb\u7ecd.md"

REQUIRED = [
    "\u9879\u76ee\u6982\u89c8",
    "\u9879\u76ee\u80cc\u666f",
    "\u4ea7\u54c1\u76ee\u6807",
    "\u6838\u5fc3\u6d41\u7a0b",
    "AI \u4ea7\u54c1\u8bbe\u8ba1\u4eae\u70b9",
    "\u9879\u76ee\u9650\u5236",
    "https://productsense-ai.vercel.app",
    "https://github.com/fy8618/productsense-ai",
]

FORBIDDEN = [
    "HR \u5feb\u901f\u4ecb\u7ecd\u8bdd\u672f",
    "????",
    "??????",
    "\ufffd",
]


def read_docx_xml(path):
    with zipfile.ZipFile(path) as archive:
        return archive.read("word/document.xml").decode("utf-8")


def main():
    markdown = MD_PATH.read_text(encoding="utf-8", errors="replace")
    xml = read_docx_xml(DOCX_PATH)

    old_info = {"exists": OLD_MD_PATH.exists()}
    if OLD_MD_PATH.exists():
        old = OLD_MD_PATH.read_text(encoding="utf-8", errors="replace")
        old_info.update({
            "has_garbled_patterns": any(pattern in old for pattern in FORBIDDEN[1:]),
            "has_required_anchors": all(anchor in old for anchor in REQUIRED[:3]),
            "length": len(old),
        })

    results = {
        "md_exists": MD_PATH.exists(),
        "docx_exists": DOCX_PATH.exists(),
        "md_name_ok": MD_PATH.name == "ProductSenseAI_Portfolio_Introduction.md",
        "docx_name_ok": DOCX_PATH.name == "ProductSenseAI_Portfolio_Introduction.docx",
        "md_forbidden": {pattern: pattern in markdown for pattern in FORBIDDEN},
        "md_required": {pattern: pattern in markdown for pattern in REQUIRED},
        "docx_forbidden": {pattern: pattern in xml for pattern in FORBIDDEN},
        "docx_required": {pattern: pattern in xml for pattern in REQUIRED},
        "docx_size": DOCX_PATH.stat().st_size,
        "md_size": MD_PATH.stat().st_size,
        "old_markdown": old_info,
    }

    failures = []
    if not results["md_name_ok"] or not results["docx_name_ok"]:
        failures.append("filename")
    if any(results["md_forbidden"].values()):
        failures.append("md_forbidden")
    if not all(results["md_required"].values()):
        failures.append("md_required")
    if any(results["docx_forbidden"].values()):
        failures.append("docx_forbidden")
    if not all(results["docx_required"].values()):
        failures.append("docx_required")

    for key, value in results.items():
        print(f"{key}: {ascii(value)}")
    print(f"failures: {failures}")

    if failures:
        raise SystemExit(1)


if __name__ == "__main__":
    main()
