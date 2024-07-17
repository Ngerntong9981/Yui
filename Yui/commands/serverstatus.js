const { EmbedBuilder, AttachmentBuilder } = require('discord.js');
const { ChartJSNodeCanvas } = require('chartjs-node-canvas');
const moment = require('moment-timezone');
const Chart = require('chart.js');
const ChartAdapter = require('chartjs-adapter-moment');
const sqlite3 = require('sqlite3').verbose();

Chart.register(ChartAdapter);

const width = 800;
const height = 600;
const chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height, chartCallback: (ChartJS) => {
    ChartJS.register(ChartAdapter);
}});

let db;

async function setupDatabase() {
    return new Promise((resolve, reject) => {
        db = new sqlite3.Database('./server_activity.db');
        db.run(`CREATE TABLE IF NOT EXISTS server_activity (
            server_id TEXT,
            date TEXT,
            message_count INTEGER,
            voice_count INTEGER,
            PRIMARY KEY (server_id, date)
        )`, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}

async function updateServerActivity(serverId, messagePoints, voicePoints) {
    const date = moment().tz('Asia/Bangkok').format('YYYY-MM-DD');
    return new Promise((resolve, reject) => {
        db.run(`INSERT INTO server_activity (server_id, date, message_count, voice_count)
                VALUES (?, ?, ?, ?)
                ON CONFLICT(server_id, date) DO UPDATE SET
                message_count = message_count + ?,
                voice_count = voice_count + ?`,
            [serverId, date, messagePoints, voicePoints, messagePoints, voicePoints],
            (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            }
        );
    });
}

function getCurrentWeekDates() {
    const today = moment().tz('Asia/Bangkok');
    const startOfWeek = today.clone().startOf('week').add(2, 'days');
    
    const dates = [];
    for (let i = 0; i < 7; i++) {
        dates.push(startOfWeek.clone().add(i, 'days').format('DD'));
    }
    return dates;
}

async function getServerActivityData(serverId) {
    return new Promise((resolve, reject) => {
        const dates = getCurrentWeekDates();
        const startDate = moment().tz('Asia/Bangkok').startOf('week').add(2, 'days').format('YYYY-MM-DD');
        const endDate = moment().tz('Asia/Bangkok').startOf('week').add(8, 'days').format('YYYY-MM-DD');

        const query = `
            SELECT date, message_count, voice_count
            FROM server_activity
            WHERE server_id = ? AND date BETWEEN ? AND ?
            ORDER BY date ASC
        `;

        db.all(query, [serverId, startDate, endDate], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }

            const messageActivity = dates.map(date => {
                const row = rows.find(r => moment(r.date).format('DD') === date);
                return row ? row.message_count : 0;
            });

            const voiceActivity = dates.map(date => {
                const row = rows.find(r => moment(r.date).format('DD') === date);
                return row ? row.voice_count : 0;
            });

            resolve({
                dates: dates,
                messageActivity: messageActivity,
                voiceActivity: voiceActivity
            });
        });
    });
}

async function cleanupOldData() {
    const startOfWeek = moment().tz('Asia/Bangkok').startOf('week').add(2, 'days').format('YYYY-MM-DD');
    return new Promise((resolve, reject) => {
        db.run(`DELETE FROM server_activity WHERE date < ?`, [startOfWeek], (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}

module.exports = {
    name: 'serverstatus',
    description: '📊 Display server activity status',
    category: 'Information',
    usage: {
        format: "y!serverstatus",
        examples: [
            { command: "y!serverstatus", functionality: "Display server activity status in graph form" }
        ]
    },
    async execute(message, args) {
        try {
            const serverId = message.guild.id;
            const data = await getServerActivityData(serverId);

            const barChartConfig = {
                type: 'bar',
                data: {
                    labels: data.dates,
                    datasets: [
                        {
                            label: 'Message Activity',
                            data: data.messageActivity,
                            backgroundColor: 'rgba(255, 99, 132, 0.2)',
                            borderColor: 'rgba(255, 99, 132, 1)',
                            borderWidth: 2
                        },
                        {
                            label: 'Voice Activity',
                            data: data.voiceActivity,
                            backgroundColor: 'rgba(75, 192, 192, 0.2)',
                            borderColor: 'rgba(75, 192, 192, 1)',
                            borderWidth: 2
                        }
                    ]
                },
                options: {
                    responsive: true,
                    scales: {
                        x: {
                            title: {
                                display: true,
                                text: 'Date'
                            }
                        },
                        y: {
                            title: {
                                display: true,
                                text: 'Activity Level'
                            },
                            min: 0,
                            max: 1000,
                            ticks: {
                                stepSize: 200
                            }
                        }
                    },
                    plugins: {
                        legend: {
                            display: true
                        },
                        title: {
                            display: true,
                            text: `Server Activity (${moment().tz('Asia/Bangkok').format('MMMM YYYY')})`
                        }
                    }
                }
            };

            const image = await chartJSNodeCanvas.renderToBuffer(barChartConfig);
            const attachment = new AttachmentBuilder(image, { name: 'server-activity.png' });

            const embed = new EmbedBuilder()
                .setColor('#FFA500')
                .setTitle('Server Activity Status')
                .setDescription('Server activity for the last 7 days')
                .setImage('attachment://server-activity.png');

            await message.channel.send({ embeds: [embed], files: [attachment] });
        } catch (error) {
            console.error(error);
            await message.reply('An error occurred while generating the server activity chart');
        }
    },

    async init(client) {
        await setupDatabase();

        client.on('messageCreate', async (message) => {
            if (!message.guild) return;
            await updateServerActivity(message.guild.id, 0.2, 0);
        });

        client.on('voiceStateUpdate', async (oldState, newState) => {
            if (!oldState.channelId && newState.channelId) {
                await updateServerActivity(newState.guild.id, 0, 0.2);
            }
        });

        setInterval(async () => {
            await cleanupOldData();
            const serverIds = await new Promise((resolve, reject) => {
                db.all('SELECT DISTINCT server_id FROM server_activity', (err, rows) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(rows.map(row => row.server_id));
                    }
                });
            });

            const date = moment().tz('Asia/Bangkok').format('YYYY-MM-DD');
            serverIds.forEach(async (serverId) => {
                await updateServerActivity(serverId, 0, 0);
            });
        }, 86400000);
    }
};
