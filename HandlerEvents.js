// Settings File
require('./config')

// NodeModules
const { default: WaConnect,
    useMultiFileAuthState,
    DisconnectReason,
    makeInMemoryStore,
    jidDecode,
    downloadContentFromMessage,
    getAggregateVotesInPollMessage
} = require("@whiskeysockets/baileys")
const pino = require('pino')
const { Boom } = require('@hapi/boom')
const fs = require('fs')
const PhoneNumber = require('awesome-phonenumber')
const chalk = require('chalk')

// LocalModules
const { smsg, getBuffer, color } = require('./lib/YourS4ntyFuncts')
const { imageToWebp, videoToWebp, writeExifImg, writeExifVid } = require('./lib/exif')


// GeneralSettings & Functions 
const store = makeInMemoryStore({ logger: pino().child({ level: 'silent', stream: 'store' }) })

// Creating The Main Function
async function startMoon() {

    // Starting/Restoring Conection
    const { state, saveCreds } = await useMultiFileAuthState(`./${sessionName}`)
    const Moon = WaConnect({
        logger: pino({ level: 'fatal' }),
        printQRInTerminal: true,
        browser: ['Moon Multi Device', 'Kali', '3.0.0'],
        auth: state,
        getMessage: async (key) => {
            if (store) {
                const msg = await store.loadMessage(key.remoteJid, key.id)
                return msg.message || undefined
            }
            return {
                conversation: "Testing."
            }
        }
    })

    // Restoring
    Moon.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect } = update
        if (connection === 'close') {
            let reason = new Boom(lastDisconnect?.error)?.output.statusCode
            if (reason === DisconnectReason.badSession) { console.log(`Bad Session File, Please Delete Session and Scan Again`); Moon.logout(); }
            else if (reason === DisconnectReason.connectionClosed) { console.log("Connection closed, reconnecting...."); startMoon(); }
            else if (reason === DisconnectReason.connectionLost) { console.log("Connection Lost from Server, reconnecting..."); startMoon(); }
            else if (reason === DisconnectReason.connectionReplaced) { console.log("Connection Replaced, Another New Session Opened, Please Close Current Session First"); Moon.logout(); }
            else if (reason === DisconnectReason.loggedOut) { console.log(`Device Logged Out, Please Scan Again And Run.`); Moon.logout(); }
            else if (reason === DisconnectReason.restartRequired) { console.log("Restart Required, Restarting..."); startMoon(); }
            else if (reason === DisconnectReason.timedOut) { console.log("Connection TimedOut, Reconnecting..."); startMoon(); }
            else if (reason === DisconnectReason.Multidevicemismatch) { console.log("Multi device mismatch, please scan again"); Moon.logout(); }
            else Moon.end(`Unknown DisconnectReason: ${reason}|${connection}`)
        } else if (connection == 'open') {
            console.log(color('Project Created And Developed By YourS4nty :)', 'cyan'))
            console.log(color('The Server Is Now Online!', 'lightgreen'));
        }
        // console.log('State:', update) Only For Development
    })

    // Serving The Credentials
    Moon.ev.on('creds.update', saveCreds)

    // Serving The StoreMessage
    store.bind(Moon.ev)

    // Handling The MessageEvents
    Moon.public = true
    Moon.ev.on('messages.upsert', async chatUpdate => {
        try {
            mek = chatUpdate.messages[0]
            if (!mek.message) return
            mek.message = (Object.keys(mek.message)[0] === 'ephemeralMessage') ? mek.message.ephemeralMessage.message : mek.message
            if (mek.key && mek.key.remoteJid === 'status@broadcast') return
            if (!Moon.public && !mek.key.fromMe && chatUpdate.type === 'notify') return
            m = smsg(Moon, mek, store)
            require("./Core")(Moon, m, chatUpdate, store)
        } catch (err) {
            console.log(err)
        }
    })
    Moon.ev.on('messages.update', async chatUpdate => {
        for (const { key, update } of chatUpdate) {
            if (update.pollUpdates && key.fromMe) {
                const pollCreation = await getMessage(key)
                if (pollCreation) {
                    const pollUpdate = await getAggregateVotesInPollMessage({
                        message: pollCreation,
                        pollUpdates: update.pollUpdates,
                    })
                    var toCmd = pollUpdate.filter(v => v.voters.length !== 0)[0]?.name
                    if (toCmd == undefined) return
                    var prefCmd = prefix + toCmd
                    Moon.appenTextMessage(prefCmd, chatUpdate)
                }
            }
        }
    })

    // Specific Config For PollUpdate(GET)
    async function getMessage(key) {
        if (store) {
            const msg = await store.loadMessage(key.remoteJid, key.id)
            return msg?.message
        }
        return {
            conversation: "Im A Bot :)"
        }
    }

    // Handling The SendMessage-Type
    Moon.getName = (jid, withoutContact = false) => {
        id = Moon.decodeJid(jid)
        withoutContact = Moon.withoutContact || withoutContact
        let v
        if (id.endsWith("@g.us")) return new Promise(async (resolve) => {
            v = store.contacts[id] || {}
            if (!(v.name || v.subject)) v = Moon.groupMetadata(id) || {}
            resolve(v.name || v.subject || PhoneNumber('+' + id.replace('@s.whatsapp.net', '')).getNumber('international'))
        })
        else v = id === '0@s.whatsapp.net' ? {
            id,
            name: 'WhatsApp'
        } : id === Moon.decodeJid(Moon.user.id) ?
            Moon.user :
            (store.contacts[id] || {})
        return (withoutContact ? '' : v.name) || v.subject || v.verifiedName || PhoneNumber('+' + jid.replace('@s.whatsapp.net', '')).getNumber('international')
    }

    Moon.decodeJid = (jid) => {
        if (!jid) return jid
        if (/:\d+@/gi.test(jid)) {
            let decode = jidDecode(jid) || {}
            return decode.user && decode.server && decode.user + '@' + decode.server || jid
        } else return jid
    }

    /**
     * 
     * @param {*} jid 
     * @param {*} text 
     * @param {*} quoted 
     * @param {*} options 
     * @returns 
     */
    Moon.sendText = (jid, text, quoted = '', options) => Moon.sendMessage(jid, { text: text, ...options }, { quoted, ...options })

    /**
    * 
    * @param {*} jid 
    * @param {*} name 
    * @param [*] values 
    * @returns 
    */
    Moon.sendPoll = (jid, name = '', values = [], selectableCount = 1) => { return Moon.sendMessage(jid, { poll: { name, values, selectableCount } }) }

    /**
     * 
     * @param {*} jid 
     * @param {*} path 
     * @param {*} quoted 
     * @param {*} options 
     * @returns 
     */
    Moon.sendImageAsSticker = async (jid, path, quoted, options = {}) => {
        let buff = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,`[1], 'base64') : /^https?:\/\//.test(path) ? await (await getBuffer(path)) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0)
        let buffer
        if (options && (options.packname || options.author)) {
            buffer = await writeExifImg(buff, options)
        } else {
            buffer = await imageToWebp(buff)
        }

        await Moon.sendMessage(jid, { sticker: { url: buffer }, ...options }, { quoted })
        return buffer
    }

    /**
     * 
     * @param {*} jid 
     * @param {*} path 
     * @param {*} quoted 
     * @param {*} options 
     * @returns 
     */
    Moon.sendVideoAsSticker = async (jid, path, quoted, options = {}) => {
        let buff = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,`[1], 'base64') : /^https?:\/\//.test(path) ? await (await getBuffer(path)) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0)
        let buffer
        if (options && (options.packname || options.author)) {
            buffer = await writeExifVid(buff, options)
        } else {
            buffer = await videoToWebp(buff)
        }

        await Moon.sendMessage(jid, { sticker: { url: buffer }, ...options }, { quoted })
        return buffer
    }

    Moon.downloadMediaMessage = async (message) => {
        let mime = (message.msg || message).mimetype || ''
        let messageType = message.mtype ? message.mtype.replace(/Message/gi, '') : mime.split('/')[0]
        const stream = await downloadContentFromMessage(message, messageType)
        let buffer = Buffer.from([])
        for await (const chunk of stream) {
            buffer = Buffer.concat([buffer, chunk])
        }

        return buffer
    }

    return Moon
}

// Run Script
startMoon()

// Watching Files While Updating
let file = require.resolve(__filename)
fs.watchFile(file, () => {
    fs.unwatchFile(file)
    console.log(chalk.redBright(`File Updated: ${__filename}`))
    delete require.cache[file]
    require(file)
})
