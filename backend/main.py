from fastapi.staticfiles import StaticFiles
from excel_processor import process_excel
from pydantic import BaseModel
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

import os
import shutil

from pdf_processor import extract_pdf_text
from ai_engine import generate_summary, chat_with_ai

app = FastAPI()

# =========================================
# STATIC FILES FOR CHARTS
# =========================================

app.mount(
    "/charts",
    StaticFiles(directory="charts"),
    name="charts"
)

# =========================================
# ENABLE CORS
# =========================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =========================================
# FOLDERS
# =========================================

UPLOAD_FOLDER = "uploads"

CHARTS_FOLDER = "charts"

# =========================================
# CREATE FOLDERS
# =========================================

os.makedirs(
    UPLOAD_FOLDER,
    exist_ok=True
)

os.makedirs(
    CHARTS_FOLDER,
    exist_ok=True
)

# =========================================
# STATIC CHART ACCESS
# =========================================

app.mount(
    "/charts",
    StaticFiles(directory="charts"),
    name="charts"
)

# =========================================
# HOME ROUTE
# =========================================

@app.get("/")
def home():

    return {
        "message": "InsightIQ Backend Running"
    }

# =========================================
# FILE UPLOAD ROUTE
# =========================================

@app.post("/upload")
async def upload_file(
    file: UploadFile = File(...)
):

    # =========================================
    # SAVE FILE
    # =========================================

    file_path = os.path.join(
        UPLOAD_FOLDER,
        file.filename
    )

    with open(file_path, "wb") as buffer:

        shutil.copyfileobj(
            file.file,
            buffer
        )

    print("File uploaded:", file.filename)

    # =========================================
    # DEFAULT VALUES
    # =========================================

    extracted_text = ""

    chart_paths = []

    stats = {}

    # =========================================
    # PDF
    # =========================================

    if file.filename.endswith(".pdf"):

        extracted_text = extract_pdf_text(
            file_path
        )

        print("PDF text extracted")

    # =========================================
    # TXT
    # =========================================

    elif file.filename.endswith(".txt"):

        with open(
            file_path,
            "r",
            encoding="utf-8"
        ) as f:

            extracted_text = f.read()

        print("TXT text extracted")

    # =========================================
    # EXCEL
    # =========================================

    elif (
        file.filename.endswith(".xlsx")
        or file.filename.endswith(".xls")
    ):

        excel_data = process_excel(
            file_path
        )

        # =========================================
        # SUMMARY
        # =========================================

        extracted_text = excel_data[
            "summary"
        ]

        # =========================================
        # CHARTS
        # =========================================

        chart_paths = excel_data[
            "charts"
        ]

        # =========================================
        # STATS
        # =========================================

        stats = excel_data[
            "stats"
        ]

        print("Excel data extracted")

        print(
            "Charts Generated:",
            chart_paths
        )

        print(
            "Stats:",
            stats
        )

    # =========================================
    # UNSUPPORTED FILES
    # =========================================

    else:

        print(
            "Unsupported file type"
        )

    # =========================================
    # GENERATE AI SUMMARY
    # =========================================

    summary = ""

    if extracted_text:

        print(
            "Extracted text length:",
            len(extracted_text)
        )

        print(
            "Generating AI summary..."
        )

        summary = generate_summary(
            extracted_text[:2500]
        )

    else:

        summary = (
            "No readable content found."
        )

    # =========================================
    # RESPONSE
    # =========================================

    return {

        "filename": file.filename,

        "message":
        "File uploaded successfully",

        "summary": summary,

        "charts": chart_paths,

        "stats": stats
    }

# =========================================
# AI CHAT MODEL
# =========================================

class ChatRequest(BaseModel):

    message: str

# =========================================
# GENERAL AI CHAT ENDPOINT
# =========================================

@app.post("/ai-chat")
async def ai_chat(
    data: ChatRequest
):

    user_message = data.message

    print(
        "AI Chat Message:",
        user_message
    )

    ai_response = chat_with_ai(
        user_message
    )

    return {
        "reply": ai_response
    }