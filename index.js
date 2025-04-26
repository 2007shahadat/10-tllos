const { Telegraf } = require('telegraf');
const axios = require('axios');
const fs = require('fs');
const sharp = require('sharp');
const QRCode = require('qrcode');
const { createReadStream } = require('fs');
require('dotenv').config();

const bot = new Telegraf(process.env.BOT_TOKEN);

const express = require('express');
const app = express();

// Set the port to the value provided by the environment (Render will assign a dynamic port)
const PORT = process.env.PORT || 3000;

// Handle basic request to root endpoint
app.get('/', (req, res) => {
    res.send('Hello World!');
});

// Start the server and listen on the port
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

bot.start((ctx) => ctx.reply('Welcome to the All-in-One Tools Bot!'));

bot.command('removebg', async (ctx) => {
    // Example for removebg
    const fileId = ctx.message.photo[ctx.message.photo.length - 1].file_id;
    const file = await bot.telegram.getFile(fileId);
    const filePath = file.file_path;
    const response = await axios({
        method: 'POST',
        url: 'https://api.remove.bg/v1.0/removebg',
        headers: {
            'X-Api-Key': process.env.REMOVE_BG_API_KEY,
        },
        data: {
            image_url: `https://api.telegram.org/file/bot${process.env.BOT_TOKEN}/${filePath}`
        },
        responseType: 'arraybuffer',
    });
    const buffer = Buffer.from(response.data);
    ctx.replyWithPhoto({ source: buffer });
});

bot.command('pdf', async (ctx) => {
    // PDF creation logic here
    ctx.reply('Send two images to create a PDF.');
});

bot.command('texttoimage', async (ctx) => {
    // Text to image generation
    ctx.reply('Send your text for image generation.');
});

bot.command('compress', async (ctx) => {
    // Compress image
    ctx.reply('Send image for compression.');
});

bot.command('qr', async (ctx) => {
    const text = ctx.message.text.split(' ').slice(1).join(' ');
    const qrImage = await QRCode.toBuffer(text);
    ctx.replyWithPhoto({ source: qrImage });
});

bot.command('translate', async (ctx) => {
    const text = ctx.message.text.split(' ').slice(1).join(' ');
    // Add translation API code
    ctx.reply(`Translated text: ${text}`);
});

bot.command('convert', async (ctx) => {
    // Currency converter logic
    ctx.reply('Convert currency by providing the amount and currencies.');
});

bot.command('upscale', async (ctx) => {
    // Image upscale logic
    ctx.reply('Send image for upscaling.');
});

bot.command('summarize', async (ctx) => {
    const text = ctx.message.text.split(' ').slice(1).join(' ');
    // Add text summarizer API here
    ctx.reply('Summary of your text: ' + text);
});

bot.command('joke', async (ctx) => {
    // Add joke generator logic here
    ctx.reply('Here is a joke!');
});

bot.command('weather', async (ctx) => {
    // Weather info logic
    ctx.reply('Weather info here.');
});

bot.launch();
