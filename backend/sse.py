import asyncio
from fastapi import WebSocket
from typing import List
import logging
class ChatManager:
    
    def __init__(self):
        self.active_connections: List[WebSocket] = []
        self.message_queue: asyncio.Queue = asyncio.Queue()
        self._lock = asyncio.Lock()

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        async with self._lock:
            self.active_connections.append(websocket)

    async def disconnect(self, websocket: WebSocket):
        async with self._lock:
            if websocket in self.active_connections:
                self.active_connections.remove(websocket)
                
    async def reconnect(self, websocket: WebSocket):
        try:
            # Try reconnecting the WebSocket (this is just an example and depends on your use case)
            await websocket.accept()
            async with self._lock:
                self.active_connections.append(websocket)
        except Exception as e:
            print(f"Reconnection failed: {e}")


    async def broadcast(self, message: str):
        async with self._lock:
            # Create a copy of active connections to avoid runtime modification
            connections_copy = self.active_connections.copy()
        
        for connection in connections_copy:
            try:
                await connection.send_text(message)
            except asyncio.QueueFull:
                print("Queue is full for one of the clients, skipping message.")
                pass
            except Exception as e:
                # Log the error and potentially remove the problematic connection
                print(f"Error broadcasting to a WebSocket: {e}")
                try:
                    await self.disconnect(connection)
                except Exception:
                    await self.disconnect(connection)
            
            
class SSEManager:
    def __init__(self):
        self.clients = set()
        self._lock = asyncio.Lock()

    async def add_client(self, queue: asyncio.Queue):
        async with self._lock:
            self.clients.add(queue)

    async def remove_client(self, queue: asyncio.Queue):
        async with self._lock:
            self.clients.discard(queue)  # Using discard instead of remove to prevent KeyError

    async def broadcast(self, message: str):
        async with self._lock:
            # Create a copy of clients to avoid runtime modification during iteration
            clients_copy = self.clients.copy()
            logging.info(f"boraodcase message {message}")
        # Perform queue puts outside the lock to prevent blocking
        for queue in clients_copy:
            try:
                await queue.put(message)
            except Exception as e:
                # Optional: log or handle queue put errors
                print(f"Error broadcasting to a client: {e}")
                self.remove_client(queue)