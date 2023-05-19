const Role = require('../models/role');
const Usuario = require('../models/usuario');

const esRoleValido = async (rol = "") => {
  const existeRol = await Role.findOne({rol});
  if (!existeRol) {
    throw new Error(`El rol ${rol} no está registrado en la base de datos`);
  };
}

const emailExiste = async (correo = "") => {
  const existeEmail = await Usuario.findOne({correo});
  if (existeEmail) {
    throw new Error(`El correo ${correo} ya está registrado en la base de datos`);
  };
}

const existeUsuarioPorId = async (id = "") => {
  const existeId = await Usuario.findById(id);
  if (!existeId) {
    throw new Error(`El usuario con el id: ${id} no existe`);
  };
}

module.exports = {
  esRoleValido,
  emailExiste,
  existeUsuarioPorId
};