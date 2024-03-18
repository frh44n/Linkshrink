const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/webhook', (req, res) => {
    const { message } = req.body;

    console.log('Received message:', message); // Log the received message for debugging

    if (message && message.text) {
        const chatId = message.chat.id;
        const text = message.text;

        // Echo back the received message
        sendMessage(chatId, text)
            .then(() => res.sendStatus(200))
            .catch(error => {
                console.error('Error sending message:', error);
                res.sendStatus(500);
            });
    } else {
        res.sendStatus(200);
    }
});

function sendMessage(chatId, text) {
    const url = `https://api.telegram.org/bot7152220440:AAESlDbvvBKbFrQy9o8HKTrfQNS2N2GzRbI/sendMessage`;
    const data = {
        chat_id: chatId,
        text: text
    };
    return axios.post(url, data);
}

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
