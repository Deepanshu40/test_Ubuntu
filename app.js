const express  = require('express');
const app = express();
const port = 8080;
const {puppeteerSession} = require('./utilis/puppeteer.js');
const cors = require('cors');

app.use(cors({}));


app.get('/api/v1/requestaccepted', async (req, res) => {
    await puppeteerSession();
    res.send('accepted');
})


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})


