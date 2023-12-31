import app from './app';
import socket from 'socket.io';
import http from 'http'; // node.js 기본 내장 모듈

const server = http.createServer(app);
const io = socket(server);

io.sockets.on('connection', (socket) => {
  socket.on('joinRoom', (roomId) => {
    // console.log('roomId: ', roomId);
    socket.join(roomId);
  });

  socket.on('sendMsg', (roomId, msg, senderId) => {
    // console.log(roomId, msg, senderId);
    io.to(roomId).emit('sendMsg', msg, senderId);

    // time 데이터도 추가해서 chat db에 메시지 추가
  });
});

server.listen(app.get('port'), () => {
  console.log(app.get('port'), '번 포트에서 대기 중');
});
