const express  = require('express');
const app = express();
const port = 443;
const {puppeteerSession} = require('./utilis/puppeteer.js');
const cors = require('cors');

app.use(cors({}));

// puppeteerSession();

app.get('/', (req, res) => {
    res.send('request accepted')
})

app.get('/api/v1/requestaccepted', async (req, res) => {
    await puppeteerSession();
    res.send('accepted');
})


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})



