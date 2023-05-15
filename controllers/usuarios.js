const { request, response } = require('express');

const usuariosGet = (req = request, res = response) => {

  const {q, nombre, page = '1', limit} = req.query;

  res.status(200).json({
    msg: 'get API - controlador',
    q, 
    nombre,
    page,
    limit
  });
}

const usuariosPut = (req, res = response) => {

  const { id } = req.params;

  res.status(200).json({
    msg: 'put API - controlador',
    id
  });
}

const usuariosPost = (req, res = response ) => {

  const { nombre, edad } = req.body;
  
  res.status(200).json({
    msg: 'post API - controlador',
    nombre,
    edad
  });
}

const usuariosDelete = (req, res = response) => {
  res.status(200).json({
    msg: 'delete API - controladot'
  });
}

const usuariosPatch = (req, res = response) => {
  res.status(200).json({
    msg: 'patch API - controladot'
  });
}

module.exports = {
  usuariosGet,
  usuariosPut,
  usuariosPost,
  usuariosDelete,
  usuariosPatch
};