const express = require('express');
const app = express();
app.use(express.json());

let rooms = [];

let users1 = [];

let users2 = [];

let userData = [];

// 매치를 대기 중인 유저 리스트
let matchList = [];

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
    }

    // 로그인 완료 반환 값
    res.send(userData[ID]);
});

// 플레이어 위치 업데이트
app.post('/AddMatchList', (req, res) => {
    const { ID, Name } = req.body;
    matchList.push(res);
    
    if(matchList.length >= 2)
    {
        const res1 = matchList.shift();
        const res2 = matchList.shift();

        const roomId = rooms.length + 1;
        res1.send({ roomId });
        res2.send({ roomId });
    }
});

// 플레이어 위치 업데이트
app.post('/UpdatePosition', (req, res) => {
    const { ID, Name, X, Y, RoomNumber } = req.body;

    let message = 'ID' + String(ID) + ' User: ' + String(Name) + '    Move Position    X: ' + String(X) + ' Y: ' + String(Y);

    let room = rooms.find(x=>x.Index == Index);

    if(room === undefined)
    {
        let users = [];
        rooms.push({ users });
    }
    
    let user = users1.find(x=>x.ID == ID);

    if( user === undefined){
        users1.push( { ID, X, Y } );
    }
    else
    {
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

    userData[ID].Coin = Coin;
    userData[ID].Gem = Gem;
    console.log(String(ID) + 'change item: coin' + String(Coin) + ' gem' + String(Gem));
    res.send('Request CL');
});

module.exports = app;
