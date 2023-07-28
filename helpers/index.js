const subirArchivo = require("./subir-archivo");
const generarJWT = require("./generar-jwt");
const googleVerify = require("./google-verify");
const dbValidators = require("./db-validators");

module.exports = {
  ...subirArchivo,
  ...generarJWT,
  ...googleVerify,
  ...dbValidators,
};