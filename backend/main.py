import asyncio
import json
import uuid
from schema import ChatRequest
from sse import ChatManager, SSEManager
from fastapi import FastAPI, File, UploadFile,Request,WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse,StreamingResponse
import os
import aiofiles
import uvicorn
from typing import List
import logging
from sse_starlette.sse import EventSourceResponse

# Logging Configuration
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('app.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)


app = FastAPI()

print("starting backend application..")
# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["GET","POST","PUT"],
    allow_headers=["*"],
)

@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    logger.error(f"Unhandled exception: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"message": "Internal Server Error"}
    )
    
# Create upload directory
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# SSE Manager for chat
# Initialize managers
chat_manager = ChatManager()
sse_manager = SSEManager()

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await chat_manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            await chat_manager.broadcast(data)
    except WebSocketDisconnect:
        await chat_manager.disconnect(websocket)
        

@app.post("/achat")
async def process_chat(message: ChatRequest):
    """
    Process incoming chat message and generate AI response
    """
    logger.info(f"achat message {message.question}")
    # Simulate AI processing
    ai_response = f"AI processed: {message.question}"
    
    # Broadcast to SSE clients
    await sse_manager.broadcast(ai_response)
    
    return {"status": "message processed"}

@app.websocket("/achat")
async def chat(websocket: WebSocket):
    await chat_manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            p= f"data: {json.dumps({'message': data})}\n\n"
            # Process incoming message (e.g., generate AI response)
            await chat_manager.broadcast(f"AI Response: {data}")
    except WebSocketDisconnect:
        chat_manager.disconnect(websocket)
        
        
@app.get("/achat/events")
async def sse_events(request: Request):
    """
    Server-Sent Events endpoint for real-time chat updates
    """
    queue = asyncio.Queue()
    await sse_manager.add_client(queue)
    logger.info("client added to queue")
    #await queue.put(f"data: {json.dumps({'message': 'Hello Neighbour'})}\n\n")
    async def event_generator(request: Request):
        try:
            while True:
                if await request.is_disconnected():
                    logger.info("Client disconnected.")
                    break
                try:
                    logger.info("checking messages for client")
                    # Correct way to get a message from the queue
                    message = await asyncio.wait_for(queue.get(), timeout=1.0)
                    logger.info(f"message = {message}")
                    yield f"data: {json.dumps({'message': message})}\n\n"
                except asyncio.TimeoutError:
                    logger.debug("No message in queue, continuing...")
                    await asyncio.sleep(0.5)
                    continue
        except GeneratorExit:
            logger.info("Client disconnected")
            raise            
        except Exception as e:
            # Log any other unexpected exceptions
            logger.error(f"Error in event generator: {e}")
        finally:
            await sse_manager.remove_client(queue)
    return EventSourceResponse(event_generator(request),media_type="text/event-stream")

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
        4
        uploaded_files.append({
            "filename": filename,
            "original_name": file.filename,
            "size": len(content)
        })
    
    return {"files": uploaded_files}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000,timeout_keep_alive=1200)
    
