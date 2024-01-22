const axios = require('axios');
const cheerio = require('cheerio');

// URL del sitio web
const downloaderUrl = 'https://ttdownloader.com/';

// URL de TikTok que deseas descargar
const tiktokUrl = 'https://vm.tiktok.com/ZM69r6SLN/';

// Realiza la solicitud POST para enviar el formulario con la URL
axios.post(downloaderUrl, new URLSearchParams({ url: tiktokUrl }), {
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
})
  .then(response => {
    // Imprime el HTML de la respuesta en la consola
    console.log(response.data);
  })
  .catch(error => {
    console.error('Error al realizar la solicitud:', error);
  });
