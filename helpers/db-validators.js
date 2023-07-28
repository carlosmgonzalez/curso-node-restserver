const Role = require('../models/role');
const { Categoria, Usuario, Producto } = require('../models');

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
};

const existeCategoria = async (id) => {

  const categoria = await Categoria.findById(id);
  if(!categoria) {
    throw new Error(`No existe una categoria con el id: ${id}`);
  };
};

const yaExisteCatogoriaConEseNombre = async (nombre) => {
  const categoria = await Categoria.findOne({nombre: nombre.toUpperCase()});
  if(categoria) {
    throw new Error(`Ya existe una categoria con el nombre: ${nombre.toUpperCase()}, no puede actualizar el nombre de la categoria a ese nombre`)
  };
};

const existeProductoPorId = async (id) => {
  const producto = await Producto.findById(id);

  if (!producto) {
    throw new Error(`No existe un producto con el id: ${id}`);
  };
};

const esColeccionValida = (coleccion, cValida) => {

  if (!cValida.includes(coleccion)) {
    throw new Error(`La coleccion ${coleccion} no es valida`);
  };

  return true;
};

module.exports = {
  esRoleValido,
  emailExiste,
  existeUsuarioPorId,
  existeCategoria,
  yaExisteCatogoriaConEseNombre,
  existeProductoPorId,
  esColeccionValida
};