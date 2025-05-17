const express = require('express');
const app = express();
const http = require('http');

app.use(express.json());

let rooms = [];
let userData = [];
let matchList = [];

// Bullet data - to track bullets in each room
let bullets = [];

app.get('/', (req, res) => {
    res.send('hello world!');
});

// 서버 연결 확인
app.get('/ConnectServer', (req, res) => {
    res.send('hello world!');
});

// 로그인 시도
app.post('/Login', (req, res) => {
    const { ID, Name } = req.body;
    console.log('Login success ID: ' + String(ID) + ' User: ' + String(Name));
    
    let user = userData.find(x => x.ID == ID);

    if (user === undefined) {
        let Coin = 10000;
        let Gem = 10;
        userData.push({ ID, Coin, Gem });
        user = { ID, Coin, Gem };
    }

    res.send(user);
});

// 플레이어 위치 업데이트
app.post('/AddMatchList', (req, res) => {
    const { ID, Name, CharacterIndex } = req.body;
    matchList.push({ ID, name: Name, response: res, CharacterIndex });
    
    if (matchList.length >= 2) {
        const user1 = matchList.shift();
        const user2 = matchList.shift();

        const roomId = rooms.length;
        user1.response.send({ roomId, ID: user2.ID, Name: user2.name, CharacterIndex: user2.CharacterIndex });
        user2.response.send({ roomId, ID: user1.ID, Name: user1.name, CharacterIndex: user1.CharacterIndex });
    }
});

// 총알 발사 기능
app.post('/FireBullet', (req, res) => {
    const { RoomNumber, ID, X, Y, Direction, Damage } = req.body;

    // 각 방에 총알 정보를 기록
    bullets.push({ RoomNumber, ID, X, Y, Direction, Damage });

    console.log(`Bullet fired by ID: ${ID} at position (${X}, ${Y}) with direction ${Direction}`);

    // 총알 정보를 모든 유저에게 브로드캐스트
    rooms[RoomNumber].users.forEach(user => {
        if (user.ID !== ID) {
            user.response.send({
                type: 'bullet',
                RoomNumber,
                ID,
                X,
                Y,
                Direction,
                Damage
            });
        }
    });

    res.send('Bullet fired');
});

// 충돌 처리 및 데미지 전달
app.post('/HandleCollision', (req, res) => {
    const { RoomNumber, BulletID, TargetID } = req.body;

    const bullet = bullets.find(b => b.ID === BulletID);
    const targetUser = rooms[RoomNumber].users.find(u => u.ID === TargetID);

    if (!bullet || !targetUser) {
        return res.status(400).send('Invalid bullet or target');
    }

    // 충돌 발생 시 데미지 처리
    let damage = bullet.Damage;
    console.log(`Bullet from ID ${bullet.ID} hit ID ${targetUser.ID}. Dealt ${damage} damage`);

    // 타겟 유저의 HP나 상태 변경 (예시로 Coin을 감소시키는 방식)
    let user = userData.find(u => u.ID === targetUser.ID);
    if (user) {
        user.Coin -= damage;
        console.log(`User ID ${targetUser.ID} lost ${damage} coin.`);
    }

    // 데미지를 받은 유저에게 충돌 정보를 전달
    targetUser.response.send({
        type: 'collision',
        BulletID,
        Damage: damage,
        RemainingCoin: user.Coin
    });

    // 총알이 충돌 후 삭제
    bullets = bullets.filter(b => b.ID !== BulletID);

    res.send('Collision handled');
});

// 플레이어 위치 업데이트
app.post('/UpdatePosition', (req, res) => {
    const { ID, Name, X, Y, RoomNumber } = req.body;

    let message = `ID: ${ID} User: ${Name}    Move Position    X: ${X} Y: ${Y}`;

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

// 플레이어 방향 업데이트
app.post('/UpdateDirection', (req, res) => {
    const { ID, Name, X, Y } = req.body;

    let message = `ID: ${ID} User: ${Name}    Move Direction    X: ${X} Y: ${Y}`;

    console.log(message);
    res.send(message);
});

// 아이템 업데이트
app.post('/UpdateItem', (req, res) => {
    const { ID, Coin, Gem } = req.body;

    let user = userData.find(x => x.ID == ID);

    if (user === undefined) {
        let Coin = 10000;
        let Gem = 10;
        userData.push({ ID, Coin, Gem });
    }

    user.Coin = Coin;
    user.Gem = Gem;
    console.log(`ID ${ID} changed item: coin ${Coin} gem ${Gem}`);
    res.send('Request CL');
});

module.exports = app;
