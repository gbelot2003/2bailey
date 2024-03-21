import { BaileysClass } from '../lib/baileys.js';
import axios from 'axios';

const botBaileys = new BaileysClass({});

botBaileys.on('auth_failure', async (error) => console.log("ERROR BOT: ", error));
botBaileys.on('qr', (qr) => console.log("NEW QR CODE: ", qr));
botBaileys.on('ready', async () => console.log('READY BOT'))

let awaitingResponse = false;

botBaileys.on('message', async (message) => {
    if(!awaitingResponse) {

        let data = {
            "driver": "web",
            "userId": message.from,
            "message": message.body
        }

        axios.defaults.headers.post['Content-Type'] = 'multipart/form-data';
        const res = await axios.post('http://app.localhost/botman', data);

        let messages = res.data.messages;

        messages.forEach(element => {    
            console.log(element);

            if(element.type == "text"){
                if(element.attachment == null) {
                    botBaileys.sendText(message.from, element?.text); 
                } else {
                    botBaileys.sendMedia(message.from, element.attachment.url, element.text);   
                }
            }
        });
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



