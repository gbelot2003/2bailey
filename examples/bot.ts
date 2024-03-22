import axios from 'axios';

import { BaileysClass } from '../lib/baileys.js';
import { BotEvents, Postman, MessageType } from './constants';
import { BOTMAN_URL } from './environments';

const botBaileys = new BaileysClass({});

botBaileys.on(BotEvents.AUTH, (error) => console.log("ERROR BOT: ", error));
botBaileys.on(BotEvents.QR, (qr) => console.log("NEW QR CODE: ", qr));
botBaileys.on(BotEvents.READY, () => console.log('READY BOT'))
botBaileys.on(BotEvents.MESSAGE, async (message) => {
    /**
     * 1. Send message to botman:
     */
    const botmanResponse = await axios.post(BOTMAN_URL, {
        "driver": Postman.WEB,
        "userId": message.from,
        "message": message.body
    }, {
        headers: {
            'Content-Type': Postman.CONTENT_TYPE
        }
    });

    /**
     * 2. Filter text only messages from botman:
     */
    const messages = botmanResponse.data.messages
        .filter(message => message.type === MessageType.TEXT);

    /**
     * 3. Send message to WS using the messages coming from botman:
     */
    for (const botMessage of messages) {
        if (!botMessage.attachment) {
            await botBaileys.sendText(message.from, botMessage.text);
        } else {
            await botBaileys.sendMedia(
                message.from, 
                botMessage.attachment.url, 
                botMessage.text
            );
        }
    }
    


    // if (!awaitingResponse) {
    //     await botBaileys.sendPoll(message.from, 'Select an option', {
    //         options: ['text', 'media', 'file', 'sticker'],
    //         multiselect: false
    //     });
    //     awaitingResponse = true;
    // } else {
    //     const command = message.body.toLowerCase().trim();
    //     switch (command) {
    //         case 'text':
    //             axios.post('https://webhook.site/0a41159c-c849-4afd-bc6e-d4e6bafe9221', {
    //                 'data': message.body,
    //             }).then(res => {
    //                 botBaileys.sendText(message.from, 'Hello world');
    //             })
    //             break;
    //         case 'media':
    //             await botBaileys.sendMedia(message.from, 'https://www.w3schools.com/w3css/img_lights.jpg', 'Hello world');
    //             break;
    //         case 'file':
    //             await botBaileys.sendFile(message.from, 'https://github.com/pedrazadixon/sample-files/raw/main/sample_pdf.pdf');
    //             break;
    //         case 'sticker':
    //             await botBaileys.sendSticker(message.from, 'https://gifimgs.com/animations/anime/dragon-ball-z/Goku/goku_34.gif', { pack: 'User', author: 'Me' });
    //             break;
    //         default:
    //             await botBaileys.sendText(message.from, 'Sorry, I did not understand that command. Please select an option from the poll.');
    //             break;
    //     }
    //     awaitingResponse = false;
    // }
});



