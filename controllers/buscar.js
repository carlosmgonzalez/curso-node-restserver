const { request, response } = require("express");
const {isValidObjectId} = require("mongoose");
const {Usuario, Categoria, Producto, Role} = require("../models")

const coleccionesPermitidad = [
  "usuarios",
  "productos",
  "categorias",
  "roles"
];


const buscarUsuario = async (termino = '', res = response) => {
  if (isValidObjectId(termino)) {
    const usuario = await Usuario.findById(termino);

    return res.json({
      results: usuario ? [usuario] : []
    });
  };

  const regex = RegExp(termino, "i");

  const usuario = await Usuario.find({
    $or: [
      {nombre: regex},
      {correo: regex}
    ],
    $and: [{estado: true}]
  });
  console.log(termino);

  return res.json({
    results: usuario
  });
};

const buscarCategoria = async (termino, res = response) => {
  if (isValidObjectId(termino)) {
    const categoria = await Categoria.findById(termino);
    return res.status(200).json({
      results: categoria ? [categoria] : []
    });
  };

  const regex = RegExp(termino, "i");

  const categoria = await Categoria.find({nombre: regex});

  return res.status(200).json({
    results: categoria
  });
};

const buscarProductos = async (termino, res = response) => {
  if (isValidObjectId(termino)) {
    const producto = await Producto.findById(termino);
    
    if (!producto) {
      const producto = await Producto.find({categoria: termino});
      return res.status(200).json({
        results: producto
      });
    }

    return res.status(200).json({
      results: producto ? [producto] : []
    });
  };

  const regex = RegExp(termino, "i");

  const producto = await Producto.find({nombre: regex });

  return res.status(200).json({
    results: producto
  });
};

const buscar = (req = request, res = response) => {
  const {coleccion, termino} = req.params;

  if (!coleccionesPermitidad.includes(coleccion)) {
    return res.status(400).json({
      msg: `La coleccion ${coleccion} no se encuentra en la lista de colecciones permitidas para buscar ${coleccionesPermitidad}`
    })
  }

  switch (coleccion) {
    case "usuarios":
      buscarUsuario(termino, res);
    break;

    case "categorias":
      buscarCategoria(termino, res);
    break;

    case "productos":
      buscarProductos(termino, res);  
    break;
  
    default:
      res.json({msg: ""});
  };
};

module.exports = {
  buscar
};