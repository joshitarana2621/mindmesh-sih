from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
from typing import Optional, List, Any
import hashlib
import json
from datetime import datetime

app = FastAPI(title="EduAdapt AI Service", version="0.1.0")

class RemediationRequest(BaseModel):
    kcCode: str
    misconception: Optional[str] = None
    language: str = "en"
    contentVersion: Optional[str] = None
    gradeBand: Optional[str] = None

class RemediationResponse(BaseModel):
    content: str
    type: str
    language: str
    promptVersion: str
    schemaVersion: int
    isAiGenerated: bool
    fallbackUsed: bool
    cacheKey: Optional[str] = None

class QuizGenRequest(BaseModel):
    kcCode: str
    topicName: str
    difficulty: float = Field(0.5, ge=0, le=1)
    questionCount: int = Field(3, ge=1, le=10)
    language: str = "en"
    gradeBand: str

FALLBACKS = {
    "KC-001": "Arrays are ordered collections. Declare one with square brackets: let arr = [1, 2, 3].",
    "KC-002": "Array indexing starts at 0. arr[0] is the first element, arr[1] is the second.",
    "KC-003": "Traverse arrays with a for loop: for (let i = 0; i < arr.length; i++) { ... }",
    "KC-004": "Insert with push() (end), unshift() (start), or splice() (any position).",
}

@app.get("/health")
def health():
    return {"status": "ok", "service": "ai-service", "time": datetime.utcnow().isoformat()}

def make_cache_key(req: RemediationRequest) -> str:
    raw = json.dumps({
        "contentVersion": req.contentVersion or "v1",
        "kc": req.kcCode,
        "misconception": req.misconception,
        "gradeBand": req.gradeBand,
        "language": req.language,
        "outputType": "explanation",
        "promptVersion": "prompt-v1",
    }, sort_keys=True)
    return hashlib.sha256(raw.encode()).hexdigest()

@app.post("/remediation", response_model=RemediationResponse)
def remediation(req: RemediationRequest):
    cache_key = make_cache_key(req)
    if "GEMINI_API_KEY" not in __import__("os").environ:
        content = FALLBACKS.get(req.kcCode, f"Review the concept {req.kcCode}. Ask your teacher for a quick explanation, then recheck with a practice quiz.")
        return RemediationResponse(
            content=content,
            type="explanation",
            language=req.language,
            promptVersion="fallback-v1",
            schemaVersion=1,
            isAiGenerated=False,
            fallbackUsed=True,
            cacheKey=cache_key,
        )
    raise HTTPException(status_code=501, detail="Gemini integration pending - using curated fallback")

@app.post("/quiz-generator", response_model=dict)
def quiz_generator(req: QuizGenRequest):
    return {
        "draft": {
            "kcCode": req.kcCode,
            "topicName": req.topicName,
            "questions": [
                {"text": f"What is {req.topicName}?", "type": "MULTIPLE_CHOICE", "difficulty": req.difficulty},
                {"text": f"Which statement about {req.topicName} is true?", "type": "MULTIPLE_CHOICE", "difficulty": req.difficulty},
            ][:req.questionCount],
            "language": req.language,
            "gradeBand": req.gradeBand,
        },
        "requiresTeacherReview": True,
    }
