import fitz

def extract_pdf_text(pdf_path):

    # Open PDF
    doc = fitz.open(pdf_path)

    text = ""

    # Loop through all pages
    for page in doc:
        text += page.get_text()

    return text