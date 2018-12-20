const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const Chatkit = require('pusher-chatkit-server')

const app = express();

const chatkit = new Chatkit.default({
    instanceLocator: 'v1:us1:b1b0fcb5-edbe-433b-bf7e-f9ab0bcff323',
    key: '6111f28b-ba21-4f8d-a907-002391bc1ab8:a8hxCrfqyXv7Ss9hUiIpJUtPY8K9TjduKOIjZBEFA0U='
})

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.post('/users', (req, res) => {
    const { userName } = req.body;

    chatkit.createUser({
        name: userName,
        id: userName
    }).then(() => res.sendStatus(201))
        .catch(error => {
            console.log(error);
            if (error.error === 'services/chatkit/user_already_exists') {
                res.sendStatus(200);
            } else {
                res.status(error.statusCode).json(error)
            }
        })
})

app.post('/authenticate', (req, res) => {
    
    const authData = chatkit.authenticate({ userId: req.query.user_id })
    res.status(authData.status).send(authData.body)
})



const port = 3001
app.listen(port, err => {
    if (err) {
        console.log(err);
    }
    else {
        console.log(`Running on Port ${port}`);
    }
})
