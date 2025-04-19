const express = require('express');
const app = express();
app.use(express.json());
app.get('/', (req, res) => {
    res.send('hello world!');
});

app.get('/ConnectServer', (req, res) => {
    console.log('Login success');
    res.send('hello world!');
});

app.post('/Login', (req, res) => {
    const { ID, Name } = req.body;
    console.log('Login success ID: ' + String(ID) + 'User: ' + String(Name));
    res.send('hello world!');
});

app.post('/UpdatePosition', (req, res) => {
    const { ID, Name, x, y } = req.body;

    let message = 'ID' + String(ID) + ' User: ' + String(Name) + '    Move Position    X: ' + String(x) + ' Y: ' + String(y);

    console.log(message);
    res.send(message);
});

app.post('/UpdateDirection', (req, res) => {
    const { ID, Name, x, y } = req.body;

    let message = 'ID' + String(ID) + ' User: ' + String(Name) + '    Move Direction    X: ' + String(x) + ' Y: ' + String(y);

    console.log(message);
    res.send(message);
});

module.exports = app;
