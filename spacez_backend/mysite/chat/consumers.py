# chat/consumers.py
import json
import threading
from channels.generic.websocket import AsyncWebsocketConsumer

class ChatConsumer(AsyncWebsocketConsumer):

    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = 'chat_%s' % self.room_name

        # Join room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        # Leave room group
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    # Receive message from WebSocket
    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json['message']
        command = text_data_json['command']

        # Send message to room group
        await self.channel_layer.group_send(self.room_group_name,
        {
            'type': 'chat_message',
            'command': command,
            'message': message
        })        

    # Receive message from room group
    async def chat_message(self, event):
        message = event['message']
        command = event['command']

        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'command': command,
            'message': message
        }))