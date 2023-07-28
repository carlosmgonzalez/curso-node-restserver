const {response, request} = require('express');
const Usuario = require('../models/usuario');
const bcryptjs = require('bcryptjs');
const { generarJWT } = require('../helpers/generar-jwt');
const { googleVerify } = require('../helpers/google-verify');

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

    res.status(200).json({
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

const googleSingIn = async (req = request, res = response) => {

  const {id_token} = req.body;
  
  try {
  
    const {correo, nombre, img} = await googleVerify(id_token);

    let usuario = await Usuario.findOne({correo});

    if(!usuario) {
      const data = {
        nombre, 
        correo,
        password: ':P',
        img,
        google: true,
        // rol: "USER_ROLE"
      };

      usuario = new Usuario(data);

      await usuario.save();
    }

    if (!usuario.estado) {
      return res.status(400).json({
        msg: "Hable con el administrador, usuario bloqueado"
      });
    };

    const token = await generarJWT(usuario.uid);
  
    res.status(200).json({
      usuario,
      token
    });
    
  } catch (error) {
    console.log(error);
    res.status(400).json({
      msg: "No se logro verificar el google token sing-in"
    });
  };
};

module.exports = {
  login,
  googleSingIn
};