const path = require("path");
const fs = require("fs");

const cloudinary = require("cloudinary").v2;
cloudinary.config(process.env.CLOUDINARY_URL);

const { response, request } = require("express");
const {subirArchivo} = require("../helpers");
const { Usuario, Producto } = require("../models");

const cargarArchivo = async (req = request, res = response) => {

  if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo) {
    res.status(400).json({
      msg: "No hay archivo que subir"
    });
  };

  try {
    const nombre = await subirArchivo(req.files, undefined, "heroes-Marvel");
    res.json({msg: nombre});
    
  } catch (error) {
    res.status(400).json({msg: error});
  };
};


const actualizarImagen = async (req = request , res = response) => {
  const {coleccion, id} = req.params;
  let model;

  switch (coleccion) {
    case "usuarios":
      try {
        model = await Usuario.findById(id);
        if (!model) {
          return res.status(400).json({msg: "No se encontro un usuario con ese id"});
        };
      } catch (error) {
        return res.status(500).json({msg: error});
      };
    break;

    case "productos":
      try {
        model = await Producto.findById(id);
        if (!model) {
          return res.status(400).json({msg: "No se encontro un producto con ese id"});
        };
      } catch (error) {
        return res.status(500).json({msg: error});
      };
    break;
  
    default:
      return res.status(500).json({msg: "Se me olvido validar esta opción"});
  };

  if (model.img) {
    const pathImg = path.join(__dirname, "../uploads/", coleccion, model.img);
    if ( fs.existsSync(pathImg) ) {
      fs.unlinkSync(pathImg);
    };
  };

  try {
    const imgNombre = await subirArchivo(req.files, undefined, coleccion);
    model.img = imgNombre;
    await model.save();

    return res.status(200).json({
      model
    });

  } catch (error) {
    return res.status(500).json({msg: error})
  };
};


const actualizarImagenCloudinary = async (req = request , res = response) => {
  const {coleccion, id} = req.params;
  let model;

  switch (coleccion) {
    case "usuarios":
      try {
        model = await Usuario.findById(id);
        if (!model) {
          return res.status(400).json({msg: "No se encontro un usuario con ese id"});
        };
      } catch (error) {
        return res.status(500).json({msg: error});
      };
    break;

    case "productos":
      try {
        model = await Producto.findById(id);
        if (!model) {
          return res.status(400).json({msg: "No se encontro un producto con ese id"});
        };
      } catch (error) {
        return res.status(500).json({msg: error});
      };
    break;
  
    default:
      return res.status(500).json({msg: "Se me olvido validar esta opción"});
  };

  // Limpiar imagenes previas
  if (model.img) {
    const nombreArr = model.img.split(/[./]/);
    const public_id = nombreArr[nombreArr.length - 2];
    await cloudinary.uploader.destroy(public_id);
  };

  const {tempFilePath} = req.files.archivo;

  try {
    const {secure_url} = await cloudinary.uploader.upload(tempFilePath);
    model.img = secure_url;
    await model.save();

    return res.status(200).json({ 
      model
    });

  } catch (error) {
    return res.status(500).json({msg: error})
  };
};


const mostrarImagen = async (req = request, res = response) => {
  const {coleccion, id} = req.params;
  let model;

  switch (coleccion) {
    case "usuarios":
      try {
        model = await Usuario.findById(id);
        if (!model) {
          return res.status(400).json({msg: "No se encontro un usuario con ese id"});
        };
      } catch (error) {
        return res.status(500).json({msg: error});
      };
    break;

    case "productos":
      try {
        model = await Producto.findById(id);
        if (!model) {
          return res.status(400).json({msg: "No se encontro un producto con ese id"});
        };
      } catch (error) {
        return res.status(500).json({msg: error});
      };
    break;
  
    default:
      return res.status(500).json({msg: "Se me olvido validar esta opción"});
  };

  if (model.img) {
    const pathImg = path.join(__dirname, "../uploads/", coleccion, model.img);
    if ( fs.existsSync(pathImg) ) {
      return res.sendFile(pathImg);
    };
  };

  const pathNoImagen = path.join(__dirname, "../assets/no-image.jpg");

  res.sendFile(pathNoImagen);
};

module.exports = {
  cargarArchivo,
  actualizarImagen,
  mostrarImagen,
  actualizarImagenCloudinary
};

// if (coleccion === "usuarios") {
//   try {
//     const imgNombre = await subirArchivo(req.files, undefined, coleccion);
//     const usuario = await Usuario.findByIdAndUpdate(id, {img: imgNombre}, {new: true});
//     await usuario.save();

//     return res.status(200).json({
//       usuario
//     });

//   } catch (error) {
//     console.log(error);
//     res.status(400).json({msg: error});
//   };
// };