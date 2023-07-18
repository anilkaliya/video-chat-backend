// server.ts

import express, { Application} from 'express';
import http from 'http';
import { Server, Socket } from 'socket.io';
import cors from 'cors';
import groupRoutes from './routes/groupRoutes';

const app: Application = express();
const server: http.Server = http.createServer(app);
const io: Server = new Server(server,{cors: {
  origin: 'https://d1g4q894ebfo9f.cloudfront.net',
  methods: ['GET', 'POST'], // You can specify the allowed methods
  allowedHeaders: ['Authorization',"Content-type"], // You can specify the allowed headers
}},);
app.use(cors());
const groupToSocket=new Map<string,string>()
const socketToGroupId=new Map<string,string>()

app.use(express.json());

app.use('/api', groupRoutes);
io.on('connection', (socket) => {
  console.log('A user connected.',socket.id);

  // Handle 'join' event when a new user joins a room
  socket.on('room:join', (data) => {
    const {roomId}=data
    socket.join(roomId);
    groupToSocket.set(roomId,socket.id)
    socketToGroupId.set(socket.id,roomId)
    io.to(roomId).emit("user:joined",{roomId,socketId:socket.id})
    socket.join(roomId)
    io.to(socket.id).emit("room:join",data)
    
    console.log(`User joined room: ${roomId}`);
  });
  socket.on("user:call",(data:any)=>{
    const {offer,to}=data
    io.to(to).emit("incoming:call",{from:socket.id,offer})
  })
   
  socket.on("call:accepted",(data:any)=>{
    console.log("call accepted")
    const {to,answer}=data
    io.to(to).emit("call:accepted",{from:socket.id,answer})
  })
  socket.on("peer:nego:needed",(data:any)=>{
    const {offer,to}=data
    io.to(to).emit("peer:nego:needed",{from:socket.id,offer})
  })
 socket.on("peer:nego:done",(data:any)=>{
  const {to,answer}=data
  io.to(to).emit("peer:nego:final",{to:socket.id,answer})
 })
  socket.on('disconnect', () => {
    console.log('A user disconnected.');
  });
});

const port: number = 3001;
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
