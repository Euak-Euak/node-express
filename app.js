const express = require('express');
const app = express();
app.use(express.json());

let users1 = {};

let users2 = {};

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

    let message = 'ID' + String(ID) + ' User: ' + String(Name) + '    Move Position    X: ' + String(x) + ' Y: ' + String(y);

    if(RoomNumber == 1)
    {
        users1[id].X = X;
        users1[id].Y = Y;
    }
    else(RoomNumber == 2)
    {
        users2[id].X = X;
        users2[id].Y = Y;
    }
    console.log(message);
    res.send(message);
});

app.post('/UpdateDirection', (req, res) => {
    const { ID, Name, X, Y } = req.body;

    let message = 'ID' + String(ID) + ' User: ' + String(Name) + '    Move Direction    X: ' + String(x) + ' Y: ' + String(y);

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
