const fs = require('fs')
const chalk = require('chalk')

// Other
global.owner = ['573108103500']
global.vcard = 'BEGIN:VCARD\n'
  + 'VERSION:3.0\n'
  + 'FN:YourS4nty ♥️ \n'
  + 'ORG:Moon ♡-♡;\n'
  + 'TEL;type=CELL;type=VOICE;waid=573108103500:+573108103500\n'
  + 'END:VCARD'
global.premium = ['6283803489747']
global.packname = 'FollowMe On IG And Github'
global.author = '@YourS4nty'
global.sessionName = 'Session'
global.prefa = ['.','/','!']
global.sp = '⭔'
global.mess = {
    success: '✓ Success',
    successTik: '✓ Success\nTiktok Video No Watermark\nServed By: @YourS4nty',
    admin: 'Only Admin Group!',
    botAdmin: 'Just YourS4nty Can use!',
    owner: 'Just YourS4nty Can use!',
    group: 'Only Group!',
    private: 'Only Private Chat!',
    bot: 'Just YourS4nty Can Use',
    wait: 'Wait, Loading...',
    AiWait: 'Wait, Generating...',
}

let file = require.resolve(__filename)
fs.watchFile(file, () => {
	fs.unwatchFile(file)
	console.log(chalk.redBright(`Update'${__filename}'`))
	delete require.cache[file]
	require(file)
})
