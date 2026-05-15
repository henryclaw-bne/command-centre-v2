from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from sqlmodel import Session

from ..db import get_session
from ..schemas import UploadResponse
from ..services.ingest import process_ticket_csv

router = APIRouter()


@router.post("/upload-csv", response_model=UploadResponse)
def upload_csv(
    file: UploadFile = File(...),
    session: Session = Depends(get_session),
):
    if file.content_type not in {"text/csv", "application/vnd.ms-excel"}:
        raise HTTPException(status_code=400, detail="CSV file required")

    try:
        result = process_ticket_csv(session, file.filename, file.file)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc))
    except Exception as exc:
        raise HTTPException(status_code=500, detail="Failed to process CSV")

    return result
