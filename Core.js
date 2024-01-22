// Settings File
require('./config')

// NodeModules
const fs = require('fs')
const util = require('util')
const chalk = require('chalk')
const os = require('os')
const speed = require('performance-now')
const moment = require('moment-timezone');
const { performance } = require('perf_hooks')

// LocalModules
const { formatp, runtime, color, tiktokdl, getBuffer, facebookdl } = require('./lib/YourS4ntyFuncts')
const { WA_DEFAULT_EPHEMERAL } = require('@whiskeysockets/baileys')

// Continue The Message Events (Handler-Upsert)
module.exports = Moon = async (Moon, m) => {
    try {
        // Message And Commands Body
        var body = (m.mtype === 'conversation') ? m.message.conversation : (m.mtype == 'imageMessage') ? m.message.imageMessage.caption : (m.mtype == 'videoMessage') ? m.message.videoMessage.caption : (m.mtype == 'extendedTextMessage') ? m.message.extendedTextMessage.text : (m.mtype == 'buttonsResponseMessage') ? m.message.buttonsResponseMessage.selectedButtonId : (m.mtype == 'listResponseMessage') ? m.message.listResponseMessage.singleSelectReply.selectedRowId : (m.mtype == 'templateButtonReplyMessage') ? m.message.templateButtonReplyMessage.selectedId : (m.mtype === 'messageContextInfo') ? (m.message.buttonsResponseMessage?.selectedButtonId || m.message.listResponseMessage?.singleSelectReply.selectedRowId || m.text) : ''
        var budy = (typeof m.text == 'string' ? m.text : '')

        // Setting The Prefix For Commands
        var prefix = prefa ? new RegExp('^[' + global.prefa.join('') + ']').test(body) ? body[0] : "" : prefa ?? global.prefix;
        global.prefix = prefix

        // Setting And Verifying Commands
        const command = body.slice(1).trim().split(/ +/).shift().toLowerCase() // Define One Message As A Command
        const args = body.trim().split(/ +/).slice(1) // Get The Arguments (Next To The Command)
        const isCmd = body.startsWith(prefix)

        // For Users And Messages
        const botNumber = await Moon.decodeJid(Moon.user.id)
        const itsMe = m.sender == botNumber ? true : false
        const from = m.chat // Define From As The Sender
        const pushname = m.pushName || "No Name" // Get The UserName Of The Sender
        const sender = m.sender

        // For Groups 
        const isGroup = m.isGroup
        const groupMetadata = m.isGroup ? await Moon.groupMetadata(from).catch(e => { }) : ''
        const groupName = isGroup ? groupMetadata.subject : ''

        // Extra Settings
        const fatkuns = (m.quoted || m)
        const quoted = (fatkuns.mtype == 'buttonsMessage') ? fatkuns[Object.keys(fatkuns)[1]] : (fatkuns.mtype == 'templateMessage') ? fatkuns.hydratedTemplate[Object.keys(fatkuns.hydratedTemplate)[1]] : (fatkuns.mtype == 'product') ? fatkuns[Object.keys(fatkuns)[0]] : m.quoted ? m.quoted : m
        const mime = (quoted.msg || quoted).mimetype || ''
        /* Date/Time */
        let d = new Date
        let locale = 'mx'
        const time = moment.tz('America/Mexico_City').format('DD/MM HH:mm:ss')
        const week = d.toLocaleDateString(locale, { weekday: 'long' })
        const calender = d.toLocaleDateString(locale, {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        })
        // Public & Self Config
        if (!Moon.public) {
            if (!m.key.chatMe) return
        }

        // Example For Develop
        if (budy.match('testingxd')) {
            let buffer = await fs.readFileSync('./temp/audio/bernyanyi.mp3')
            Moon.sendMessage(from, { audio: buffer, mimetype: 'audio/mp4', quoted: m, ptt: true })
        }
        //  Config (Illegal)
        const fstatus = {
            key: {
                fromMe: false,
                participant: `0@s.whatsapp.net`,
                ...(from ? { remoteJid: "status@broadcast" } : {}),
            },
            message: {
                imageMessage: {
                    url: "https://mmg.whatsapp.net/d/f/At0x7ZdIvuicfjlf9oWS6A3AR9XPh0P-hZIVPLsI70nM.enc",
                    mimetype: "image/png",
                    caption: 'ekisde',
                    fileSha256: "+Ia+Dwib70Y1CWRMAP9QLJKjIJt54fKycOfB2OEZbTU=",
                    fileLength: "28777",
                    height: 1080,
                    width: 1079,
                    mediaKey: "vXmRR7ZUeDWjXy5iQk17TrowBzuwRya0errAFnXxbGc=",
                    fileEncSha256: "sR9D2RS5JSifw49HeBADguI23fWDz1aZu4faWG/CyRY=",
                    directPath:
                        "/v/t62.7118-24/21427642_840952686474581_572788076332761430_n.enc?oh=3f57c1ba2fcab95f2c0bb475d72720ba&oe=602F3D69",
                    mediaKeyTimestamp: "1610993486",
                    jpegThumbnail: fs.readFileSync('./Dark.jpg'),
                    scansSidecar:
                        "1W0XhfaAcDwc7xh1R8lca6Qg/1bB4naFCSngM2LKO2NoP5RI7K+zLw==",
                },
            },
        }


        // Console Register & AutoReading
        if (m.message && !itsMe && command) {
            Moon.readMessages([m.key])

            // Private Chat
            if (!isGroup && isCmd) console.log(color('~> [ Private ]', 'green'), color(time, 'cyan'), 'Cmd :', color(command, 'green'), 'From', color(sender, 'yellow'), 'Args :', color(args.length))
            // if (!isGroup && !isCmd) console.log(color('~> [ Private ]', 'red'), color(time, 'cyan'), 'Msg :', color(budy, 'red'), 'From', color(sender), 'Args :', color(args.length))

            // Group Chat
            if (isCmd && isGroup) console.log(color('~> [ GrupChat ]', 'green'), color(time, 'cyan'), 'Cmd :', color(command, 'green'), 'From', color(sender, 'yellow'), 'In', color(groupName, 'blue'), 'Args :', color(args.length))
            // if (!isCmd && isGroup) console.log(color('~> [ GrupChat ]', 'red'), color(time, 'cyan'), 'Msg :', color(budy, 'red'), 'From', color(sender), 'In', color(groupName, 'blue'), 'Args :', color(args.length))

            // Only For Development
            // if(isCmd && isGroup && !command){
            //     console.log(m.mtype)
            // }
        }

        // Herre Define The List Of Comands
        const CmdList = ["Test", "Sticker", "a", "b"]

        // Here Works All The Command Sistem
        switch (command) {
            case 'help':
            case 'menu':
                let text = `┌──⭓ *Principal Menu*
│
${CmdList.sort((a, b) => a.localeCompare(b)).map((v, i) => `│⭔ ${prefix}` + v).join('\n')}
│
└───────⭓`
                Moon.sendPoll(from, text, [`${prefix}Owner`, `${prefix}Ping`])
                // valuesxd = [`${prefix}Owner`, `${prefix}Ping`]
                // Moon.sendMessage(from, { poll: text, valuesxd })
                break
            case 'sticker':
            case 's':
                if (!quoted) throw `Reply or send an image or video with the caption\n/sticker`
                if (/image/.test(mime)) {
                    m.reply(mess.wait)
                    let media = await quoted.download()
                    let encmedia = await Moon.sendImageAsSticker(from, media, m, { packname: global.packname, author: global.author })
                    fs.unlinkSync(encmedia)
                } else if (/video/.test(mime)) {
                    m.reply(mess.wait)
                    if ((quoted.msg || quoted).seconds > 11) return m.reply('The duration should be < 10seconds!')
                    let media = await quoted.download()
                    let encmedia = await Moon.sendVideoAsSticker(from, media, m, { packname: global.packname, author: global.author })
                    fs.unlinkSync(encmedia)
                } else {
                    throw `Reply or send an image or video with the caption\n/sticker`
                }
                break
            case 'ai':
                const url = `https://hercai.onrender.com/v3/hercai?question=${args}`;
                m.reply(mess.AiWait)
                fetch(url)
                    .then(response => response.json())
                    .then(data => {
                        const respuesta = data.reply;
                        Moon.sendMessage(from, { text: respuesta })
                    })
                    .catch(error => console.error("Error:", error));
                break
            case 'tiktok':
                m.reply(mess.wait)
                dataxd = await tiktokdl(args[0])
                restik = await getBuffer(dataxd)
                Moon.sendMessage(from, { video: restik, caption: mess.successTik })
                break
            case 'facebook':
                m.reply(mess.wait)
                dataxd = await facebookdl(args[0])
                restik = await getBuffer(dataxd)
                Moon.sendMessage(from, { video: restik, caption: mess.success })
                break
            case 'owner':
                Ownerinfo = `
⚠ [ YourS4nty ] ⚠
      
Developer of the Moon source code!
                
Here are his social media accounts for you to check out,
and we also hope for your follow. :3
                
-❥ Instagram
-> instagram.com/YourS4nty
                
-❥ Twiter
-> Twitter.com/YourS4nty

-❥ Github
-> github.com/YourS4nty
                
-❥ WhatsApp Contact
-> Right here 👇🏼xD
_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-`
                Moon.sendMessage(from, { image: { url: './media/owner.jpeg' }, caption: Ownerinfo }, { quoted: m, ephemeralExpiration: WA_DEFAULT_EPHEMERAL }).then(() => {
                    Moon.sendMessage(from,
                        {
                            contacts: {
                                displayName: 'Jeff',
                                contacts: [{ vcard }]
                            }
                        }, { quoted: m, ephemeralExpiration: WA_DEFAULT_EPHEMERAL })
                })
                break
            case 'ping':
                const used = process.memoryUsage()
                const cpus = os.cpus().map(cpu => {
                    cpu.total = Object.keys(cpu.times).reduce((last, type) => last + cpu.times[type], 0)
                    return cpu
                })
                const cpu = cpus.reduce((last, cpu, _, { length }) => {
                    last.total += cpu.total
                    last.speed += cpu.speed / length
                    last.times.user += cpu.times.user
                    last.times.nice += cpu.times.nice
                    last.times.sys += cpu.times.sys
                    last.times.idle += cpu.times.idle
                    last.times.irq += cpu.times.irq
                    return last
                }, {
                    speed: 0,
                    total: 0,
                    times: {
                        user: 0,
                        nice: 0,
                        sys: 0,
                        idle: 0,
                        irq: 0
                    }
                })
                let timestamp = speed()
                let latensi = speed() - timestamp
                neww = performance.now()
                oldd = performance.now()
                respon = `♡₊˚ *About The System*・₊✧

Response Time: ${latensi.toFixed(4)} _Seconds_
${oldd - neww} _milliseconds_

Runtime: ${runtime(process.uptime())}

💻 *Server Info*

-> RAM: ${formatp(os.totalmem() - os.freemem())} / ${formatp(os.totalmem())}

📗 *_NodeJS Memory Usage_*

${Object.keys(used).map((key, _, arr) => `${key.padEnd(Math.max(...arr.map(v => v.length)), ' ')}: ${formatp(used[key])}`).join('\n')}

${cpus[0] ? `🖥 _Total CPU Usage_

${cpus[0].model.trim()} (${cpu.speed} MHZ)\n${Object.keys(cpu.times).map(type => `- *${(type + '*').padEnd(6)}: ${(100 * cpu.times[type] / cpu.total).toFixed(2)}%`).join('\n')}

☢️ *_CPU Core(s) Usage (${cpus.length} Core CPU)_*

${cpus.map((cpu, i) => `${i + 1}. ${cpu.model.trim()} (${cpu.speed} MHZ)\n${Object.keys(cpu.times).map(type => `- *${(type + '*').padEnd(6)}: ${(100 * cpu.times[type] / cpu.total).toFixed(2)}%`).join('\n')}`).join('\n\n')}` : ''}
`
                // m.reply(respon)
                Moon.sendMessage(from, { text: respon }, { quoted: m, ephemeralExpiration: WA_DEFAULT_EPHEMERAL })
                break
            case 'test':
                // Moon.sendMessage(from, {
                //     text: 'teks',
                //     contextInfo: {
                //         "externalAdReply":
                //         {
                //             showAdAttribution: false, // Message From Ad
                //             title: 'judul',
                //             body: 'isi',
                //             mediaType: 1,
                //             renderLargerThumbnail: true, // False For Normal Thumb
                //             thumbnail: fs.readFileSync('./Dark.jpg'),
                //             sourceUrl: 'https://github.com/YourS4nty'
                //         }
                //     }
                // }, { quoted: fstatus })
                break

            default:
            // Close The Try 
        }
    } catch (err) {
        m.reply(util.format(err))
    }
}


// Watching Files While Updating
let file = require.resolve(__filename)
fs.watchFile(file, () => {
    fs.unwatchFile(file)
    console.log(chalk.redBright(`File Updated: ${__filename}`))
    delete require.cache[file]
    require(file)
})