const validarCampos = require('../middlewares/validar-campos');
const validarJWT = require('../middlewares/validar-jwt');
const tieneRol = require('../middlewares/validar-roles');

module.exports = {
  ...validarCampos,
  ...validarJWT,
  ...tieneRol
};