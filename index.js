const chalk = require('chalk');
const fs = require('fs');
const CFonts = require('cfonts');
const { spawn } = require('child_process');
let path = require('path');
let app = require('express')(); // Reemplaza 'express' con el marco que estés utilizando

CFonts.say('Moon - Wabot', {
  font: 'chrome',
  align: 'center',
  gradient: ['blue', 'cyan']
});

// Starting The Main Script
function start() {
  let args = [path.join(__dirname, 'HandlerEvents.js'), ...process.argv.slice(2)];
  let p = spawn(process.argv[0], args, {
    stdio: ['inherit', 'inherit', 'inherit', 'ipc']
  })
    .on('message', data => {
      if (data == 'reset') {
        console.log('RESET');
        p.kill();
        start();
        delete p;
      }
    });
}

// Configura tu aplicación para escuchar en el puerto proporcionado por Heroku
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  start();
});

let file = require.resolve(__filename);
fs.watchFile(file, () => {
  fs.unwatchFile(file);
  console.log(chalk.redBright(`File Updated : ${__filename}`));
  delete require.cache[file];
  require(file);
});
