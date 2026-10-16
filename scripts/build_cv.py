"""Compile the bilingual one-page A4 academic CVs with pdfLaTeX.

Usage: python scripts/build_cv.py
Requires pdfLaTeX with Latin Modern, geometry and hyperref, plus pypdf for validation.
Edit cv/cv-fr.tex and cv/cv-en.tex; keep their factual content aligned with content/cv/.
Compilation files stay in a temporary directory. Only verified PDFs are published.
"""
from __future__ import annotations

import argparse
from pathlib import Path
import re
import shutil
import subprocess
import tempfile

from pypdf import PdfReader

ROOT = Path(__file__).resolve().parents[1]
DEFAULT_OUTPUT = ROOT / "static" / "uploads"
ALIASES = {
    "fr": ("Marouane-Daoudi-CV-fr.pdf", "CV.pdf"),
    "en": ("Marouane-Daoudi-CV-en.pdf",),
}


def resolve_engine(requested: str | None) -> str:
    if requested:
        found = shutil.which(requested) or (requested if Path(requested).is_file() else None)
    else:
        found = shutil.which("pdflatex")
        if not found:
            tinytex = Path(r"C:\ProgramData\TinyTeX\bin\windows\pdflatex.exe")
            found = str(tinytex) if tinytex.is_file() else None
    if not found:
        raise SystemExit("pdfLaTeX was not found. Install TeX Live/TinyTeX, or pass --engine PATH.")
    return found


def validate_pdf(pdf: Path, language: str) -> None:
    reader = PdfReader(pdf)
    if len(reader.pages) != 1:
        raise RuntimeError(f"{pdf.name}: expected one page, found {len(reader.pages)}")
    page = reader.pages[0]
    width, height = float(page.mediabox.width), float(page.mediabox.height)
    if abs(width - 595.276) > 1 or abs(height - 841.89) > 1:
        raise RuntimeError(f"{pdf.name}: expected A4, found {width:.2f} × {height:.2f} pt")
    text = page.extract_text() or ""
    for required in ("Marouane", "Daoudi", "Montpellier", "2026", "2027", "L1BallPGD", "Slitherlink", "Recip", "Python"):
        if required not in text:
            raise RuntimeError(f"{pdf.name}: expected extractable text missing: {required}")
    for forbidden in ("ReportLab", "[PLACEHOLDER]", "TODO", "Biostats", "biostatistique"):
        if forbidden in text:
            raise RuntimeError(f"{pdf.name}: unexpected text: {forbidden}")
    fonts = page["/Resources"].get("/Font", {})
    if not fonts:
        raise RuntimeError(f"{pdf.name}: no text fonts found")
    for font_reference in fonts.values():
        font = font_reference.get_object()
        descendants = font.get("/DescendantFonts")
        descriptor_font = descendants[0].get_object() if descendants else font
        descriptor = descriptor_font.get("/FontDescriptor")
        descriptor = descriptor.get_object() if descriptor else {}
        if not any(key in descriptor for key in ("/FontFile", "/FontFile2", "/FontFile3")):
            raise RuntimeError(f"{pdf.name}: unembedded font: {font.get('/BaseFont')}")
        if "/ToUnicode" not in font:
            raise RuntimeError(f"{pdf.name}: text mapping missing for {font.get('/BaseFont')}")
    metadata = reader.metadata
    if not metadata or metadata.author != "Marouane Daoudi":
        raise RuntimeError(f"{pdf.name}: author metadata missing")


def compile_pdf(engine: str, language: str, work: Path) -> Path:
    source = ROOT / "cv" / f"cv-{language}.tex"
    if not source.is_file():
        raise RuntimeError(f"LaTeX source missing: {source}")
    target = work / language
    target.mkdir()
    command = [engine, "-no-shell-escape", "-interaction=nonstopmode", "-halt-on-error", "-file-line-error", f"-output-directory={target}", str(source)]
    for _ in range(2):
        result = subprocess.run(command, cwd=source.parent, capture_output=True, text=True, encoding="utf-8", errors="replace", timeout=90)
        if result.returncode:
            detail = "\n".join(result.stdout.splitlines()[-18:])
            raise RuntimeError(f"pdfLaTeX failed for {source.name}:\n{detail}")
    log = (target / f"cv-{language}.log").read_text(encoding="utf-8", errors="replace")
    if re.search(r"Overfull \\[hv]box|Missing character:|LaTeX Font Warning", log):
        issues = [line for line in log.splitlines() if re.search(r"Overfull|Missing character:|LaTeX Font Warning", line)]
        raise RuntimeError(f"{source.name}: typography warnings: {'; '.join(issues)}")
    pdf = target / f"cv-{language}.pdf"
    validate_pdf(pdf, language)
    return pdf


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--engine", help="Path to pdflatex (otherwise detected automatically)")
    parser.add_argument("--output-dir", type=Path, default=DEFAULT_OUTPUT, help="Destination of the two PDFs and historical aliases")
    args = parser.parse_args()
    engine = resolve_engine(args.engine)
    # Validate both languages before replacing either published file.
    with tempfile.TemporaryDirectory(prefix="marouane-cv-") as directory:
        work = Path(directory)
        compiled = {language: compile_pdf(engine, language, work) for language in ("fr", "en")}
        args.output_dir.mkdir(parents=True, exist_ok=True)
        for language, source in compiled.items():
            output = args.output_dir / f"cv-{language}.pdf"
            shutil.copyfile(source, output)
            for alias in ALIASES[language]:
                shutil.copyfile(source, args.output_dir / alias)
            print(f"{output} — 1 page A4, embedded Latin Modern fonts, extractable text")


if __name__ == "__main__":
    main()
