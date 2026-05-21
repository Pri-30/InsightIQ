import os
import re
import requests
import google.generativeai as genai

from groq import Groq
from dotenv import load_dotenv

load_dotenv()

# =========================
# API KEYS
# =========================

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

# =========================
# GEMINI CONFIG
# =========================

if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)

# =========================
# GROQ CLIENT
# =========================

groq_client = None

if GROQ_API_KEY:
    groq_client = Groq(api_key=GROQ_API_KEY)

# =========================
# CLEAN AI RESPONSE
# =========================

def clean_ai_response(text):

    # Remove markdown headings
    text = re.sub(r"#{1,6}\s*", "", text)

    # Remove bold markdown
    text = text.replace("**", "")

    # Remove separators
    text = text.replace("---", "")

    # Remove extra stars
    text = text.replace("***", "")

    # Remove multiple blank lines
    text = re.sub(r"\n\s*\n", "\n\n", text)

    return text.strip()

# =========================
# MAIN AI FUNCTION
# =========================

def generate_summary(text):

    prompt = f"""
Analyze this document and provide:

1. Short Summary
2. Key Insights
3. Important Topics
4. Conclusion

Keep the response clean, professional, and easy to read.

Document:
{text}
"""

    # ===================================
    # 1. TRY GEMINI
    # ===================================

    try:

        model = genai.GenerativeModel("gemini-2.0-flash")

        response = model.generate_content(prompt)

        print("Using Gemini AI")

        return clean_ai_response(response.text)

    except Exception as gemini_error:

        print("Gemini Failed:")
        print(gemini_error)

    # ===================================
    # 2. TRY OPENROUTER
    # ===================================

    try:

        headers = {
            "Authorization": f"Bearer {OPENROUTER_API_KEY}",
            "Content-Type": "application/json"
        }

        data = {
            "model": "deepseek/deepseek-chat-v3",
            "messages": [
                {
                    "role": "user",
                    "content": prompt
                }
            ]
        }

        response = requests.post(
            "https://openrouter.ai/api/v1/chat/completions",
            headers=headers,
            json=data
        )

        result = response.json()

        print("OpenRouter Response:")
        print(result)

        print("Using OpenRouter AI")

        return clean_ai_response(
            result["choices"][0]["message"]["content"]
        )

    except Exception as openrouter_error:

        print("OpenRouter Failed:")
        print(openrouter_error)

    # ===================================
    # 3. TRY GROQ
    # ===================================

    try:

        completion = groq_client.chat.completions.create(
            model="llama3-70b-8192",
            messages=[
                {
                    "role": "user",
                    "content": prompt
                }
            ]
        )

        print("Using Groq AI")

        return clean_ai_response(
            completion.choices[0].message.content
        )

    except Exception as groq_error:

        print("Groq Failed:")
        print(groq_error)

    # ===================================
    # FINAL FALLBACK
    # ===================================

    return """
AI services are temporarily unavailable.

Possible reasons:
• API quota exceeded
• Invalid API keys
• Provider temporarily down

Please try again later.
"""

# =====================================================
# NORMAL AI CHATBOT
# =====================================================

def chat_with_ai(user_message):

    prompt = f"""
    You are InsightIQ AI Assistant.

    Respond naturally like ChatGPT.

    Rules:
    - Give direct answers
    - Be conversational
    - No document analysis format
    - No "Summary", "Conclusion", or "Key Insights"
    - Clean and modern responses

    User Question:
    {user_message}
    """

    # ===================================
    # 1. TRY GEMINI
    # ===================================

    try:

        model = genai.GenerativeModel("gemini-2.0-flash")

        response = model.generate_content(prompt)

        print("Using Gemini AI")

        return response.text

    except Exception as gemini_error:

        print("Gemini Failed:")
        print(gemini_error)

    # ===================================
    # 2. TRY OPENROUTER
    # ===================================

    try:

        headers = {
            "Authorization": f"Bearer {OPENROUTER_API_KEY}",
            "Content-Type": "application/json"
        }

        data = {
            "model": "deepseek/deepseek-chat",
            "messages": [
                {
                    "role": "user",
                    "content": prompt
                }
            ]
        }

        response = requests.post(
            "https://openrouter.ai/api/v1/chat/completions",
            headers=headers,
            json=data
        )

        result = response.json()

        print("Using OpenRouter AI")

        return result["choices"][0]["message"]["content"]

    except Exception as openrouter_error:

        print("OpenRouter Failed:")
        print(openrouter_error)

    # ===================================
    # 3. TRY GROQ
    # ===================================

    try:

        completion = groq_client.chat.completions.create(
            model="llama3-70b-8192",
            messages=[
                {
                    "role": "user",
                    "content": prompt
                }
            ]
        )

        print("Using Groq AI")

        return completion.choices[0].message.content

    except Exception as groq_error:

        print("Groq Failed:")
        print(groq_error)

    return "AI services are temporarily unavailable."