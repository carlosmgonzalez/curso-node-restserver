const { response, request } = require("express");
const Producto = require("../models/producto");
const Categoria = require("../models/categoria");

const obtenerProductos = async (req = request, res = response) => {

  const {limite = 10, categoria = null} = req.query;

  try {
    const [productos, productosPorCategoria, total] = await Promise.all([
      Producto.find({estado: true}).populate("usuario", "nombre").populate("categoria", "nombre").limit(limite),
      // Producto.find({estado: true, [categoria.nombre] : categoria }).populate("usuario", "nombre").populate("categoria", "nombre"),
      Producto.countDocuments({estado: true})
    ]);

    if (!productos) {
      return res.status(400).json({
        msg: "No hay productos disponibles"
      });
    };

    res.status(200).json({
      total,
      productos
    });

  } catch (error) {
    console.log(error);
    res.status(400).json({
      msg: "Hubo un problema buscando los productos"
    });
  };
};

const obtenerProducto = async (req = request, res = response) => {

  const {id} = req.params;

  try {
    const producto = await Producto.findById(id).populate("usuario", "nombre").populate("categoria", "nombre");

    res.status(200).json(producto);

  } catch (error) {
    console.log(error);
    res.status(400).json({
      msg: "Hubo un error al obtener el producto por el id"
    });
  };
};

const crearProducto = async (req = request, res = response) => {

  let {categoria, ...data} = req.body; //nombre, estado, precio, descripcion, disponible, categoria y usuario
  const usuario = req.usuario;

  try {
    categoria = await Categoria.find({nombre: categoria.toUpperCase()});

    if (!categoria) {
      return res.status(400).json({
        msg: "No existe la categoria del producto que quiere ingresar"
      });
    };

    const informacion = {
      ...data,
      usuario,
      categoria: categoria[0]._id
    };

    const producto = await new Producto(informacion);

    await producto.save();

    res.status(200).json(producto);

  } catch (error) {
    console.log(error);
    res.status(400).json({
      msg: "Hubo un problema creando el producto"
    });
  };
};

const actualizarProducto = async (req = request, res = response) => {

  const {id} = req.params;
  let {categoria, ...data} = req.body; // precio, estado, descripcion, disponidle
  const usuario = req.usuario;

  try {
    let informacion = {
      ...data,
      usuario
    };

    if (categoria) {
      categoria = await Categoria.find({nombre: categoria.toUpperCase()});
      informacion = {
        ...data,
        categoria: categoria[0]._id,
        usuario
      };
    };

    let producto = await Producto.findById(id);

    if (!producto) {
      return res.status(400).json({
        msg: `No se encontro una categoria con el id: ${id}`
      });
    };

    producto = await Producto.findByIdAndUpdate(id, informacion, {new: true});

    res.status(200).json(producto);

  } catch (error) {
    console.log(error);
    res.status(400).json({
      msg: "Hubo un problama al actualizar el producto"
    });
  };
};

const eliminarProducto = async (req = request, res = response) => {
  const {id} = req.params;

  try {
    const producto = await Producto.findByIdAndUpdate(id, {estado: false}, {new: true});
    res.status(200).json(producto);
    
  } catch (error) {
    console.log(error);
    res.status(400).json({
      msg: "Hubo un problama al elimiar el producto"
    });
  };
};

module.exports = {
  obtenerProductos,
  obtenerProducto,
  crearProducto,
  actualizarProducto,
  eliminarProducto
};