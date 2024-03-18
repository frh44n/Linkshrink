const https = require('https');

// Replace this with your actual bot token
const BOT_TOKEN = '7152220440:AAESlDbvvBKbFrQy9o8HKTrfQNS2N2GzRbI';

// Function to shorten URL using ShrinkEarn API
function shortenURL(longUrl) {
    const apiToken = '9f4b825b6e36a61aed50ae524b0d0b096145e23d';
    const apiUrl = `https://shrinkearn.com/api?api=${apiToken}&url=${encodeURIComponent(longUrl)}`;
    
    return new Promise((resolve, reject) => {
        https.get(apiUrl, (res) => {
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });
            res.on('end', () => {
                try {
                    const result = JSON.parse(data);
                    if (result && result.status === 'success') {
                        resolve(result.shortenedUrl);
                    } else {
                        reject('Error occurred while shortening URL.');
                    }
                } catch (error) {
                    reject(error.message);
                }
            });
        }).on('error', (error) => {
            reject(error.message);
        });
    });
}

// Function to send message to Telegram API
function sendMessage(chatId, message) {
    const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
    const data = JSON.stringify({
        chat_id: chatId,
        text: message
    });

    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    };

    return new Promise((resolve, reject) => {
        const req = https.request(url, options, (res) => {
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });
            res.on('end', () => {
                resolve(data);
            });
        });

        req.on('error', (error) => {
            reject(error);
        });

        req.write(data);
        req.end();
    });
}

// Handle incoming messages
exports.handler = async (event) => {
    const body = JSON.parse(event.body);

    if (body.message && body.message.text) {
        const chatId = body.message.chat.id;
        const text = body.message.text;

        if (text.match(/^https?:\/\/\S+/)) {
            try {
                const shortenedUrl = await shortenURL(text);
                await sendMessage(chatId, shortenedUrl);
            } catch (error) {
                await sendMessage(chatId, 'Error occurred while shortening URL.');
            }
        } else {
            await sendMessage(chatId, 'Please send a valid URL.');
        }
    }

    return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Message processed' })
    };
};
