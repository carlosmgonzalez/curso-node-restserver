const { request, response } = require('express');
const bcriptjs = require('bcryptjs');
const Usuario = require('../models/usuario');
const { emailExiste } = require('../helpers/db-validators');

const usuariosGet = async (req = request, res = response) => {

  const {limite = 5, desde = 0} = req.query;

  // Antes no funcionaba de esta forma, ya que el argumento de limit(n) solo recibe numeros y le mandamos un string, te todos modos ahora funciona. Si falla es tan facil como colocar: .limit(Number(limite));
  
  // const usuarios = await Usuario.find({estado: true}) // lo que esta dentro del find va a funcionar como filtro en las busqueda de los registros
  //   .skip(desde)
  //   .limit(limite);

  // const total = await Usuario.countDocuments({estado: true});

  const [usuarios, total] = await Promise.all([
    Usuario.find({estado: true}) // lo que esta dentro del find va a funcionar como filtro en las busqueda de los registros
      .skip(desde)
      .limit(limite),
    await Usuario.countDocuments({estado: true})
  ]);

  res.status(200).json({
    total, 
    usuarios
  });
};

const usuariosPut = async (req, res = response) => {

  const { id } = req.params;
  const { password, google, correo, ...resto } = req.body;

  if(password) {
    const salt = bcriptjs.genSaltSync(10);
    resto.password = bcriptjs.hashSync(password, salt);
  };

  const usuario = await Usuario.findByIdAndUpdate(id, resto);

  res.status(200).json(usuario);
};

const usuariosPost = async (req, res = response ) => {

  const {nombre, correo, password, rol} = req.body;
  const usuario = new Usuario({nombre, correo, password, rol});

  // Verificar si el correo existe:
  // const existeEmail = await Usuario.findOne({correo});
  // if (existeEmail) {
  //   return res.status(400).json({
  //     msg: 'El correo ya está registrado'
  //   });
  // };

  // Encriptar la contraseña
  const salt = bcriptjs.genSaltSync(10);
  usuario.password = bcriptjs.hashSync(password, salt);

  // Guardar en DB
  await usuario.save();
  
  res.status(200).json({
    usuario
  });
};

const usuariosDelete = async (req = request, res = response) => {

  const { id } = req.params;

  // Borrar fisicamente el resgistro de la base de datos:
  // const usuario = await Usuario.findByIdAndDelete(id);

  // Cambiarle el estado, asi no lo borramos fisicamente:
  const usuario = await Usuario.findByIdAndUpdate(id, {estado: false});

  // const usuarioD.estado = false

  res.status(200).json({
    usuario
  });
};

const usuariosPatch = (req, res = response) => {
  res.status(200).json({
    msg: 'patch API - controladot'
  });
};

module.exports = {
  usuariosGet,
  usuariosPut,
  usuariosPost,
  usuariosDelete,
  usuariosPatch
};