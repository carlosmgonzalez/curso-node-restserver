const {response} = require('express');
const Usuario = require('../models/usuario');
const bcryptjs = require('bcryptjs');
const { generarJWT } = require('../helpers/generar-jwt');

const login = async (req, res = response) => {

  const {correo, password} = req.body;

  try {
    // Verificar si el email existe
    const usuario = await Usuario.findOne({correo});

    if (!usuario) {
      return res.status(400).json({
        ok: false,
        msg: 'El usuario no existe con ese correo'
      });
    };

    // Verificar si el usuario esta activo
    if(!usuario.estado) {
      return res.status(400).json({
        ok: false,
        msg: "El usuario con ese correo fue eliminado"
      });
    };

    // Verificar la contraseña
    const validPassword = bcryptjs.compareSync(password, usuario.password);
    if(!validPassword) {
      return res.status(400).json({
        ok: false,
        msg: "La contraseña es incorrecta"
      });
    };

    // Generar el JWT
    const token = await generarJWT(usuario.id);

    res.json({
      usuario,
      token
    });
    
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador'
    });
  };
};

module.exports = {
  login
};