const express = require('express');
const app = express();
app.use(express.json());

let users1 = [];

let users2 = [];

app.get('/', (req, res) => {
    res.send('hello world!');
});

app.get('/ConnectServer', (req, res) => {
    res.send('hello world!');
});

app.post('/Login', (req, res) => {
    const { ID, Name } = req.body;
    console.log('Login success ID: ' + String(ID) + 'User: ' + String(Name));
    res.send('hello world!');
});

app.post('/UpdatePosition', (req, res) => {
    const { ID, Name, X, Y, RoomNumber } = req.body;

    let message = 'ID' + String(ID) + ' User: ' + String(Name) + '    Move Position    X: ' + String(X) + ' Y: ' + String(Y);
    // 로그로 users1, users2 타입을 확인
    console.log('users1 type:', typeof users1);
    console.log('users2 type:', typeof users2);
    console.log('users1 is array:', Array.isArray(users1));  // 배열 여부 확인
    console.log('users2 is array:', Array.isArray(users2));  // 배열 여부 확인
    if(RoomNumber == 1)
    {
        let user = users1.find(x=>x.ID == ID);

        if( user === undefined){
        users1.push( { ID, X, Y } );
        }
        else
        {
            user.X = X;
            user.Y = Y;
        }
    }
    else
    {
        let user = users2.find(x=>x.ID == ID);

        if( user === undefined){
        users2.push( { ID, X, Y } );
        }
        else
        {
            user.X = X;
            user.Y = Y;
        }
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

    if(RoomNumber == 1)
    {
        res.send(users1);
    }
    else
    {
        res.send(users2);
    }
});

module.exports = app;
