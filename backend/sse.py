import asyncio
from fastapi import WebSocket
from typing import List
class ChatManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []
        self.message_queue: asyncio.Queue = asyncio.Queue()

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def broadcast(self, message: str):
        for connection in self.active_connections:
            await connection.send_text(message)
            
            
class SSEManager:
    def __init__(self):
        self.clients = set()

    async def add_client(self, queue: asyncio.Queue):
        self.clients.add(queue)

    async def remove_client(self, queue: asyncio.Queue):
        self.clients.remove(queue)

    async def broadcast(self, message: str):
        for queue in self.clients:
            await queue.put(message)
            