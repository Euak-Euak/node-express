const express = require('express');
const app = express();

app.get('/message', (req, res) => {
    return "hello world!";
});
app.listen(3030, () => {
    console.log('server is running at 3030 port.');
})
