from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_CELL_VERTICAL_ALIGNMENT
from docx.oxml import OxmlElement
from docx.oxml.ns import qn

OUT = "Heart of England Website Improvement Report.docx"
GREEN = "123D37"
LIME = "D9EC66"
PALE = "EFF4F0"
LINE = "D9D9D9"

def shade(cell, fill):
    tcPr = cell._tc.get_or_add_tcPr(); shd = OxmlElement("w:shd"); shd.set(qn("w:fill"), fill); tcPr.append(shd)

def border(cell):
    tcPr = cell._tc.get_or_add_tcPr(); borders = OxmlElement("w:tcBorders")
    for side in ("top", "left", "bottom", "right"):
        el = OxmlElement(f"w:{side}"); el.set(qn("w:val"), "single"); el.set(qn("w:sz"), "4"); el.set(qn("w:color"), LINE); borders.append(el)
    tcPr.append(borders)

def set_cell_text(cell, text, bold=False, color=None, size=9.5):
    cell.text = ""; p = cell.paragraphs[0]; p.paragraph_format.space_after = Pt(4); p.paragraph_format.space_before = Pt(4)
    r = p.add_run(text); r.bold = bold; r.font.name = "Aptos"; r.font.size = Pt(size)
    if color: r.font.color.rgb = RGBColor.from_string(color)
    cell.vertical_alignment = WD_CELL_VERTICAL_ALIGNMENT.CENTER
    border(cell)

def heading(doc, text, level=1):
    p = doc.add_paragraph(style=f"Heading {level}"); p.paragraph_format.space_before = Pt(18); p.paragraph_format.space_after = Pt(8)
    r = p.add_run(text); r.font.color.rgb = RGBColor(0,0,0)
    return p

def para(doc, text, bold_lead=None):
    p = doc.add_paragraph(); p.paragraph_format.space_after = Pt(8); p.paragraph_format.line_spacing = 1.15
    if bold_lead:
        r=p.add_run(bold_lead); r.bold=True; r.font.name="Aptos"; r.font.size=Pt(11)
    r=p.add_run(text); r.font.name="Aptos"; r.font.size=Pt(11)
    return p

def bullet(doc, text):
    p=doc.add_paragraph(style="List Bullet"); p.paragraph_format.space_after=Pt(4); r=p.add_run(text); r.font.name="Aptos"; r.font.size=Pt(10.5)

doc = Document()
sec = doc.sections[0]; sec.top_margin=Inches(.72); sec.bottom_margin=Inches(.72); sec.left_margin=Inches(.78); sec.right_margin=Inches(.78)
styles=doc.styles
styles["Normal"].font.name="Aptos"; styles["Normal"].font.size=Pt(11)
for s in ("Title", "Heading 1", "Heading 2", "Heading 3"):
    styles[s].font.name="Aptos Display"; styles[s].font.color.rgb=RGBColor(0,0,0)
title_style_pr = styles["Title"].element.get_or_add_pPr()
for child in list(title_style_pr):
    if child.tag == qn("w:pBdr"):
        title_style_pr.remove(child)

p=doc.add_paragraph(style="Title"); p.alignment=WD_ALIGN_PARAGRAPH.LEFT; p.paragraph_format.space_after=Pt(6); r=p.add_run("Heart of England Website Improvement Report"); r.font.color.rgb=RGBColor(0,0,0)
pPr = p._p.get_or_add_pPr()
for child in list(pPr):
    if child.tag == qn("w:pBdr"):
        pPr.remove(child)
p=doc.add_paragraph(); p.paragraph_format.space_after=Pt(18); r=p.add_run("Owner update on the proposed Next.js rebuild"); r.italic=True; r.font.size=Pt(13); r.font.color.rgb=RGBColor.from_string(GREEN)
para(doc, "This report explains why the replacement website is the stronger long-term option. It compares the legacy WordPress and Elementor experience with the rebuilt Next.js implementation, identifies the issues addressed, and sets out the remaining decisions required before launch.")

heading(doc, "Recommendation")
para(doc, "Proceed with the Next.js rebuild as the future website platform. The work has already moved the site away from a heavily layered WordPress and Elementor implementation, copied the available source content and media locally, and created a cleaner foundation for search, accessibility and future changes. The remaining work is focused on final editorial review and selecting services for forms and consent management.")

heading(doc, "What the legacy site made difficult")
rows = [
    ("Content and layout", "Important venue information was spread across template-specific Elementor blocks. Pages mixed editorial copy, decorative assets, sliders and downloads, which made consistency and maintenance difficult."),
    ("Media management", "Images, PDF menus, room specifications and campaign files depended on remote WordPress upload paths. Some legacy URLs already returned 404 responses."),
    ("Navigation", "The site exposed a large number of services and campaign routes, but the hierarchy was difficult to scan and key actions were distributed across menus and page modules."),
    ("Accessibility", "Legacy visual components relied on layered scripts and image-based interactions. This made keyboard behaviour, focus order, readable text and meaningful content structure harder to control."),
    ("Search and sharing", "Search metadata, canonical URLs, sitemap coverage and social-share previews were inconsistent across the content estate."),
    ("Conversion", "Forms, ticketing, restaurant bookings, virtual tours, vouchers and seasonal campaigns were implemented through multiple third-party embeds and outgoing links."),
]
t=doc.add_table(rows=1, cols=2); t.alignment=WD_TABLE_ALIGNMENT.CENTER; t.autofit=False; t.columns[0].width=Inches(1.55); t.columns[1].width=Inches(5.85)
set_cell_text(t.rows[0].cells[0], "Area", True, "FFFFFF"); shade(t.rows[0].cells[0], GREEN)
set_cell_text(t.rows[0].cells[1], "Finding from the original site review", True, "FFFFFF"); shade(t.rows[0].cells[1], GREEN)
for i,(a,b) in enumerate(rows):
    cells=t.add_row().cells; set_cell_text(cells[0],a,True); set_cell_text(cells[1],b)
    if i%2==1: shade(cells[0],PALE); shade(cells[1],PALE)

heading(doc, "What the replacement has addressed")
items=[
    ("Clean platform", "The project is a focused Next.js application with a small dependency set. It no longer carries the previous database or Drizzle scaffolding."),
    ("Content and media migration", "The migration includes 34 Heart of England pages, 16 Quicken Tree pages, blog content, local room photography, menus, PDF downloads and 671 copied source assets. The asset map covers 777 source URL variants, and source files that now return 404 are recorded rather than silently ignored."),
    ("Venue structure", "The new Rooms and Spaces directory presents the primary event rooms, capacities and routes to individual room detail pages. The Quicken Tree menu page provides six local PDF downloads and a clear restaurant booking action."),
    ("Accessibility baseline", "The rebuild includes semantic page structure, a skip link, keyboard-visible focus styles, responsive navigation, text alternatives for meaningful imagery, readable contrast and a published accessibility statement aligned to WCAG 2.2 AA goals."),
    ("Search foundation", "The build generates a sitemap covering 81 routes, robots metadata, canonical URLs, page titles and descriptions. It also includes Open Graph and X card metadata for social sharing."),
    ("Reliability", "Images are served from the local project rather than relying on the old site. A controlled fallback prevents an empty image frame if a source file is unavailable."),
]
for title, body in items:
    para(doc, body, title + "  ")

heading(doc, "Why this is better for the owner")
bullet(doc, "The site can be maintained as a single codebase instead of relying on page-builder modules, old upload paths and embedded scripts.")
bullet(doc, "The venue, rooms, events and restaurant content can be developed as clear user journeys rather than as copied blocks from older campaigns.")
bullet(doc, "Search engines and social platforms receive consistent technical signals, including canonical pages, an XML sitemap and share-preview metadata.")
bullet(doc, "The interface is responsive by default and gives the team a stronger base for WCAG review, content governance and performance optimisation.")
bullet(doc, "Future content changes such as new events, menus, rooms, campaigns and downloads can be made without rebuilding unrelated page layouts.")

heading(doc, "Evidence from the completed build")
t=doc.add_table(rows=1, cols=2); t.alignment=WD_TABLE_ALIGNMENT.CENTER; t.autofit=False; t.columns[0].width=Inches(3.1); t.columns[1].width=Inches(4.3)
set_cell_text(t.rows[0].cells[0], "Measure", True, "FFFFFF"); shade(t.rows[0].cells[0], GREEN)
set_cell_text(t.rows[0].cells[1], "Current position", True, "FFFFFF"); shade(t.rows[0].cells[1], GREEN)
facts=[("Generated routes", "81 static Next.js routes generated successfully"),("Source content", "50 primary pages across Heart of England and Quicken Tree, plus imported blog posts"),("Local assets", "671 copied assets and 777 mapped source URL variants"),("Known unavailable files", "8 source files return 404 from the original websites"),("Quality checks", "Production build passes; lint has no errors")]
for i,(a,b) in enumerate(facts):
    cells=t.add_row().cells; set_cell_text(cells[0],a,True); set_cell_text(cells[1],b)
    if i%2==1: shade(cells[0],PALE); shade(cells[1],PALE)

doc.add_page_break()
heading(doc, "Final launch work")
para(doc, "The remaining work does not require another platform change. It is the normal launch phase for a content-rich venue website.")
for item in [
    "Owner review of each priority page to approve copy, imagery, room capacities and calls to action.",
    "Selection and configuration of an enquiry form provider and newsletter service so form data can be delivered securely.",
    "Confirmation of ticketing, restaurant reservation, virtual-tour, voucher and seasonal campaign destinations.",
    "Final production-domain setup, analytics and cookie-consent choice, followed by validation with Google Search Console and Facebook Sharing Debugger.",
    "Desktop and mobile content QA before launch, including keyboard and screen-reader testing of priority journeys.",
]: bullet(doc,item)

heading(doc, "Decision requested")
para(doc, "Approve the Next.js rebuild as the preferred delivery platform and authorise the final launch phase. This allows the team to complete page approvals, connect the selected form and marketing services, validate external conversion links and publish the replacement site.")

for section in doc.sections:
    footer=section.footer.paragraphs[0]; footer.alignment=WD_ALIGN_PARAGRAPH.CENTER; rr=footer.add_run("Heart of England website rebuild   |   Owner update"); rr.font.name="Aptos"; rr.font.size=Pt(8); rr.font.color.rgb=RGBColor.from_string("526168")

doc.save(OUT)
