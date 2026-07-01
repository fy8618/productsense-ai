from pathlib import Path
import zipfile


ROOT = Path(r"D:\ProductSenseAI")
MD_PATH = ROOT / "docs" / "ProductSenseAI_Demo_Guide_CN.md"
DOCX_PATH = ROOT / "docs" / "ProductSenseAI_Demo_Guide_CN.docx"

MD_REQUIRED = [
    "Demo \u7ad9\u70b9\u56fe",
    "\u6bcf\u4e2a\u9875\u9762\u529f\u80fd\u8bf4\u660e",
    "\u63a8\u8350\u6f14\u793a\u8def\u5f84",
    "\u9762\u5411 HR \u7684 2 \u5206\u949f\u6f14\u793a\u8bdd\u672f",
    "\u9762\u5411\u9762\u8bd5\u5b98\u7684 5 \u5206\u949f\u6f14\u793a\u8bdd\u672f",
    "\u5e38\u89c1\u95ee\u9898\u4e0e\u56de\u7b54",
    "\u6700\u7ec8\u6f14\u793a\u68c0\u67e5\u6e05\u5355",
]

DOCX_REQUIRED = [
    "\u6587\u6863\u7528\u9014",
    "Demo \u7ad9\u70b9\u56fe",
    "\u6bcf\u4e2a\u9875\u9762\u529f\u80fd\u8bf4\u660e",
    "\u63a8\u8350\u6f14\u793a\u8def\u5f84",
    "\u9762\u5411 HR \u7684 2 \u5206\u949f\u6f14\u793a\u8bdd\u672f",
    "\u5e38\u89c1\u95ee\u9898\u4e0e\u56de\u7b54",
]

FORBIDDEN = [
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

    results = {
        "md_exists": MD_PATH.exists(),
        "docx_exists": DOCX_PATH.exists(),
        "md_name_ok": MD_PATH.name == "ProductSenseAI_Demo_Guide_CN.md",
        "docx_name_ok": DOCX_PATH.name == "ProductSenseAI_Demo_Guide_CN.docx",
        "md_required": {pattern: pattern in markdown for pattern in MD_REQUIRED},
        "docx_required": {pattern: pattern in xml for pattern in DOCX_REQUIRED},
        "md_forbidden": {pattern: pattern in markdown for pattern in FORBIDDEN},
        "docx_forbidden": {pattern: pattern in xml for pattern in FORBIDDEN},
        "md_size": MD_PATH.stat().st_size,
        "docx_size": DOCX_PATH.stat().st_size,
    }

    failures = []
    if not results["md_name_ok"] or not results["docx_name_ok"]:
        failures.append("filename")
    if not all(results["md_required"].values()):
        failures.append("md_required")
    if not all(results["docx_required"].values()):
        failures.append("docx_required")
    if any(results["md_forbidden"].values()):
        failures.append("md_forbidden")
    if any(results["docx_forbidden"].values()):
        failures.append("docx_forbidden")

    for key, value in results.items():
        print(f"{key}: {ascii(value)}")
    print(f"failures: {failures}")

    if failures:
        raise SystemExit(1)


if __name__ == "__main__":
    main()
