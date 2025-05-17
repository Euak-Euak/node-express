const express = require('express');
const app = express();
const http = require('http');
const WebSocket = require('ws');

app.use(express.json());

let rooms = [];

let userData = [];

// 매치를 대기 중인 유저 리스트
let matchList = [];

const server = http.createServer(app);  // Express 앱을 HTTP 서버로 감쌈
const wss = new WebSocket.Server({ server });  // WebSocket 서버 생성

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`HTTP + WebSocket 서버가 포트 ${PORT}에서 실행 중`);
});

let socketUserMap = new Map(); // socket -> userId 매핑
let userSocketMap = new Map(); // userId -> socket 매핑

// ------------------------- WebSocket 처리 -------------------------
wss.on('connection', (ws) => {
    console.log('WebSocket 클라이언트 연결됨');

    ws.on('message', (message) => {
        try {
            const data = JSON.parse(message);
            const { type, ID, payload } = data;

            switch(type) {
                case 'init':
                    socketUserMap.set(ws, ID);
                    userSocketMap.set(ID, ws);
                    console.log(`WebSocket 연결된 유저: ${ID}`);
                    break;

                case 'move':
                    broadcastToRoom(ID, {
                        type: 'move',
                        ID,
                        position: payload.position
                    });
                    break;

                case 'attack':
                    broadcastToRoom(ID, {
                        type: 'attack',
                        ID,
                        damage: payload.damage
                    });
                    break;
            }
        } catch (err) {
            console.log('WebSocket 메시지 파싱 에러:', err.message);
        }
    });

    ws.on('close', () => {
        const userId = socketUserMap.get(ws);
        if (userId) {
            console.log(`WebSocket 연결 종료됨: ${userId}`);
            userSocketMap.delete(userId);
            socketUserMap.delete(ws);
        }
    });
});


wss.on('close', () => {
    const userId = socketUserMap.get(ws);
    if (userId) {
        console.log(`WebSocket 연결 종료됨: ${userId}`);
        userSocketMap.delete(userId);
        socketUserMap.delete(wss);
    }
});

function broadcastToRoom(senderId, message) {
    // 보낸 사람의 방을 찾아야 함
    const room = rooms.find(r => r.users.some(u => u.ID === senderId));
    if (!room) return;

    for (const user of room.users) {
        if (user.ID !== senderId) {
            const socket = userSocketMap.get(user.ID);
            if (socket && socket.readyState === WebSocket.OPEN) {
                socket.send(JSON.stringify(message));
            }
        }
    }
}

app.get('/', (req, res) => {
    res.send('hello world!');
});

// 서버 연결 확인
app.get('/ConnectServer', (req, res) => {
    res.send('hello world!');
});

// 로그인 시도
app.post('/Login', (req, res) => {
    // 아이디와 패스워드를 받아옴 (현재는 랜덤 생성된 아이디와 지정된 이름을 넘김)
    const { ID, Name } = req.body;
    // 입장 시 로그 기록 출력
    console.log('Login success ID: ' + String(ID) + 'User: ' + String(Name));
    
    let user = userData.find(x=>x.ID == ID);

    if(user === undefined)
    {
        let Coin = 10000;
        let Gem = 10;
        userData.push( { ID, Coin, Gem } );
        user = { ID, Coin, Gem };
    }

    // 로그인 완료 반환 값
    res.send(user);
});

// 플레이어 위치 업데이트
app.post('/AddMatchList', (req, res) => {
    const { ID, Name, CharacterIndex } = req.body;
    matchList.push({ ID, name: Name, response: res, CharacterIndex });
    
    if(matchList.length >= 2)
    {
        const user1 = matchList.shift();
        const user2 = matchList.shift();

        const roomId = rooms.length;
        user1.response.send({ roomId, ID: user2.ID, Name: user2.name, CharacterIndex: user2.CharacterIndex });
        user2.response.send({ roomId, ID: user1.ID, Name: user1.name, CharacterIndex: user1.CharacterIndex });
    }
});
app.post('/Attack', (req, res) => {
        const { ID, Damage } = req.body;
    console.log(String(ID) + 'Attack player Damage: ' + String(Damage));
});
// 플레이어 위치 업데이트
app.post('/UpdatePosition', (req, res) => {
    const { ID, Name, X, Y, RoomNumber } = req.body;

    let message = 'ID' + String(ID) + ' User: ' + String(Name) + '    Move Position    X: ' + String(X) + ' Y: ' + String(Y);

    if (!rooms[RoomNumber]) {
        rooms[RoomNumber] = { users: [] };
    }

    let room = rooms[RoomNumber];
    let user = room.users.find(u => u.ID === ID);

    if (!user) {
        room.users.push({ ID, X, Y });
    } else {
        user.X = X;
        user.Y = Y;
    }

    console.log(message);
    res.send(message);
});

app.post('/UpdateDirection', (req, res) => {
    const { ID, Name, X, Y } = req.body;

    let message = 'ID' + String(ID) + ' User: ' + String(Name) + '    Move Direction    X: ' + String(X) + ' Y: ' + String(Y);

    console.log(message);
    res.send(message);
});

app.post('/UpdateData', (req, res) => {
    const { RoomNumber } = req.body;
    
    res.send(rooms[RoomNumber]);
});

app.post('/UpdateItem', (req, res) => {
    const { ID, Coin, Gem } = req.body;

    let user = userData.find(x=>x.ID == ID);

    if(user === undefined)
    {
        let Coin = 10000;
        let Gem = 10;
        userData.push( { ID, Coin, Gem } );
    }
    
    user.Coin = Coin;
    user.Gem = Gem;
    console.log(String(ID) + 'change item: coin' + String(Coin) + ' gem' + String(Gem));
    res.send('Request CL');
});

module.exports = app;
