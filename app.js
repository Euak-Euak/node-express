const express = require('express');
const app = express();

app.get('/', (req, res) => {
    res.send('hello world!');
});

app.get('/ConnectServer', (req, res) => {
    res.send('hello world!');
});

app.post('/UpdatePisition', (req, res) => {
    const { x, y } = req.body;

    let message = 'X: ' + String(x) + ' Y: ' + String(y);

    console.log(message);
    res.send(result);
});

module.exports = app;
