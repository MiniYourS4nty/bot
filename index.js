// Config File
require('./config')

// Console Decoration
const fs = require('fs')
const CFonts = require ('cfonts');
const {spawn} = require ('child_process');
let path = require('path')

CFonts.say('Moon - Wabot', {
  font: 'chrome',
  align: 'center',  
  gradient: ['blue', 'cyan']
})

// Starting The Main Script
function start() {
  let args = [path.join(__dirname, 'HandlerEvents.js'), ...process.argv.slice(2)]
  let p = spawn(process.argv[0], args, {
    stdio: ['inherit', 'inherit', 'inherit', 'ipc']
  })
  .on('message', data => {
    if (data == 'reset') {
      console.log('RESET')
      p.kill()
      start()
      delete p
    }
  })
}

start()

let file = require.resolve(__filename)
fs.watchFile(file, () => {
    fs.unwatchFile(file)
    console.log(chalk.redBright(`File Updated : ${__filename}`))
    delete require.cache[file]
    require(file)
})