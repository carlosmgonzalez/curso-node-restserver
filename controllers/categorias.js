const { request, response } = require("express");
const Categoria = require("../models/categoria");

// Obtener todas las categorias - paginado - total - populate
const obtenerCategorias = async (req = request, res = response) => {

  const {limite = 10} = req.query;

  // const categorias = await Categoria.find({estado: true}).populate("usuario").limit(limite);
  // const total = await Categoria.countDocuments({estado: true});

  const [total, categorias] = await Promise.all([
    Categoria.countDocuments({estado: true}),
    Categoria.find({estado: true}).populate("usuario", "nombre").limit(limite)
  ]);

  res.status(200).json({
    ok: true,
    total,
    categorias
  });
};

// Obtener una categoria por id - populate
const obtenerCategoria = async (req = request, res = response) => {

  const {id} = req.params;

  const categoria = await Categoria.findById(id).populate("usuario");
  
  res.status(200).json({
    ok: true,
    categoria
  });
};

// Crear una categoria
const crearCategoria = async (req = request, res = response) => {

  const nombre = req.body.nombre.toUpperCase();

  const data = {
    nombre,
    usuario: req.usuario._id
  };

  try {

    let categoria = await Categoria.findOne({nombre});

    if(categoria) {
      return res.status(400).json({
        ok: false,
        msg: `La categoria: ${categoria} ya existe`
      });
    };

    categoria = await new Categoria(data);

    await categoria.save();

    res.status(201).json({
      ok: true,
      categoria
    });

  } catch (error) {
    console.log(error);
    res.status(400).json({
      ok: false,
      msg: "Hubo un problema en crear la categoria en la DB"
    });
  };
};

// Actualizar una categoria
const actualizarCategoria = async (req = request, res = response) => {

  const {id} = req.params;
  let {estado, nombre} = req.body;

  nombre = nombre.toUpperCase();
  const usuario = req.usuario._id;

  const categoria = await Categoria.findByIdAndUpdate(id, {nombre, usuario}, {new: true});

  res.status(200).json({
    ok: true,
    categoria
  });
};

// Borrar una categoria - Estado: false
const borrarCategorias = async (req = request, res = response) => {

  const {id} = req.params;

  const categoria = await Categoria.findByIdAndUpdate(id, {estado: false}, {new: true});

  res.status(200).json({
    ok: true,
    msg: "Se elimino correctamente",
    categoria
  });
};

module.exports = {
  obtenerCategoria,
  obtenerCategorias,
  crearCategoria,
  actualizarCategoria,
  borrarCategorias
};