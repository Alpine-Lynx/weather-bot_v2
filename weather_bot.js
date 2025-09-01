


const { Client, GatewayIntentBits, REST, Routes, EmbedBuilder } = require('discord.js');
const weather = require('weather-js');

const BOT_TOKEN = process.env.DISCORD_TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const commands = [
    {
        name: 'weather',
        description: '指定した場所の天気を表示します',
        options: [
            {
                name: '場所',
                type: 3,
                description: '天気を調べたい場所の名前',
                required: true,
            },
        ],
    },
];

const rest = new REST({ version: '10' }).setToken(BOT_TOKEN);

(async () => {
    try {
        console.log('スラッシュコマンドを登録しています...');
        await rest.put(Routes.applicationCommands(CLIENT_ID), { body: commands });
        console.log('スラッシュコマンドの登録が完了しました');
    } catch (error) {
        console.error('スラッシュコマンドの登録中にエラーが発生しました:', error);
    }
})();

client.on('ready', () => {
    console.log(`${client.user.tag} がオンラインになりました`);
});

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return;

    if (interaction.commandName === 'weather') {
        const location = interaction.options.getString('場所');

        weather.find({ search: location, degreeType: 'C' }, (err, result) => {
            if (err) return interaction.reply('天気情報の取得中にエラーが発生しました');

            if (result.length === 0) {
                return interaction.reply('指定された場所の天気情報が見つかりませんでした');
            }

            const weatherInfo = result[0];
            const current = weatherInfo.current;
            const location = weatherInfo.location;

            const embed = new EmbedBuilder()
                .setColor(0x1d82b6)
                .setTitle(`📍 ${location.name} の天気情報`)
                .addFields(
                    { name: '🌡️ 現在の気温', value: `${current.temperature}°C`, inline: true },
                    { name: '🌤️ 状況', value: current.skytext, inline: true },
                    { name: '🌪️ 風速', value: current.winddisplay, inline: true },
                    { name: '💧 湿度', value: `${current.humidity}%`, inline: true }
                )
                .setTimestamp()
                .setFooter({ text: '天気情報は weather-js を使用しています' });

            interaction.reply({ embeds: [embed] });
        });
    }
});

client.login(BOT_TOKEN);

const express = require("express");
const app = express();

app.get("/", (req, res) => res.send("Bot is running!"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`HTTP server running on port ${PORT}`);
});