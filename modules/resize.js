'use strict';
const sharp = require('sharp');

const resizeImage = (kuva, koko, uusiKuva) => {
  sharp(kuva)
  .resize(koko)
  .toFile(uusiKuva)
  .then((data) => {
    console.log(data);
    return true;
  }).catch((err) => {
    console.log(err);
  });
};

module.exports = {
  resizeImage: resizeImage,
};