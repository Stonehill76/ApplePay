const axios = require('axios');
const https = require ('https');
const express = require('express');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const cors = require('cors');
const port = process.env.PORT || 3000;

// Configure express to use body parser and cors, and add our API endpoints
const app = express();
app.use(cors({ origin: '*' }));
app.use(express.static('./'));
//app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// viewed at http://localhost:8080
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/index.html'));
});

app.get('/.well-known', (req, res) => {
    res.sendFile(path.join(__dirname + '/apple-developer-merchantid-domain-association.txt'));
});

app.post('/validateSession', async (req, res) => {
    const { appleUrl } = req.body;
    // use set the certificates for the POST request
    const httpsAgent = new https.Agent({
        rejectUnauthorized: false,
        cert: fs.readFileSync(path.join(__dirname, './merchant.app.stonehill.dev.pem')),
        key: fs.readFileSync(path.join(__dirname, './certificate_sandbox.key')),
    });

  response = await axios.post(
        appleUrl,
        {
            merchantIdentifier: 'merchant.app.stonehill.dev',
            domainName: 'aa65532e385e.ngrok.io',
            displayName: 'dev',
        },
        {
            httpsAgent,
        }
    );
    res.send(response.data);
});

//route for pay
app.post('/pay', async (req, res) => {
    const { data } = req.body;

    console.log(data);

    // send payment request based o your payment provider requirements

    res.send({
        approved: true,
    });
});



app.listen(port, () => {
    console.log('Server running on ➡️ ', `http://localhost:${port}`);
});
