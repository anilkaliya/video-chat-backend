// server.ts

import express, { Application} from 'express';
import http from 'http';
import { Server, Socket } from 'socket.io';
import cors from 'cors';
import groupRoutes from './routes/groupRoutes';

const app: Application = express();
const server: http.Server = http.createServer(app);
const io: Server = new Server(server,{cors: {
  origin: '*',
}
});

const activeRooms: Map<string, Set<Socket>> = new Map();
app.use(cors({origin: '*'}));
app.use(express.json());

app.use('/api', groupRoutes);

io.on('connection', (socket: Socket) => {
  console.log('A user connected.');

  socket.on('disconnect', () => {
    console.log('A user disconnected.');

    activeRooms.forEach((sockets: Set<Socket>) => {
      sockets.delete(socket);
    });
  });

  socket.on('join', (roomName: string) => {
    console.log(`User joined room ${roomName}`);

    if (!activeRooms.has(roomName)) {
      activeRooms.set(roomName, new Set());
    }

    const room: Set<Socket> | undefined = activeRooms.get(roomName);
    room?.add(socket);

    room?.forEach((socketInRoom: Socket) => {
      if (socketInRoom !== socket) {
        socketInRoom.emit('userJoined');
      }
    });

    socket.on('stream', (stream: MediaStream) => {
      room?.forEach((socketInRoom: Socket) => {
        if (socketInRoom !== socket) {
          socketInRoom.emit('stream', stream);
        }
      });
    });
  });
});

const port: number = 3001;
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
