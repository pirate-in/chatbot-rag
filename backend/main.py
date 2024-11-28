import asyncio
import uuid
from backend.schema import ChatRequest
from backend.sse import SSEManager
from fastapi import FastAPI, File, UploadFile, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
import os
import aiofiles
import uvicorn
from typing import List, Dict

app = FastAPI()

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create upload directory
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# SSE Manager for chat
sse_manager = SSEManager()

@app.post("/achat")
async def process_chat(message: ChatRequest):
    """
    Process incoming chat message and generate AI response
    """
    # Simulate AI processing
    ai_response = f"AI processed: {message.question}"
    
    # Broadcast to SSE clients
    await sse_manager.broadcast(ai_response)
    
    return {"status": "message processed"}

@app.get("/achat/events")
async def chat_events():
    """
    Server-Sent Events endpoint for real-time chat updates
    """
    queue = asyncio.Queue()
    await sse_manager.add_client(queue)
    
    async def event_generator():
        try:
            while True:
                message = await asyncio.wait_for(queue, timeout=1.0)
                yield f"data: {message}\n\n"
        except asyncio.TimeoutError:
            pass
        finally:
            await sse_manager.remove_client(queue)
    
    return StreamingResponse(event_generator(), media_type="text/event-stream")

@app.post("/upload")
async def upload_files(files: List[UploadFile] = File(...)):
    """
    Handle multiple file uploads
    """
    uploaded_files = []
    
    for file in files:
        # Generate unique filename
        filename = f"{uuid.uuid4()}_{file.filename}"
        file_path = os.path.join(UPLOAD_DIR, filename)
        
        # Save file
        async with aiofiles.open(file_path, 'wb') as out_file:
            content = await file.read()
            await out_file.write(content)
        
        uploaded_files.append({
            "filename": filename,
            "original_name": file.filename,
            "size": len(content)
        })
    
    return {"files": uploaded_files}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
    
