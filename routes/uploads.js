const {Router} = require("express");
const { cargarArchivo, actualizarImagen, mostrarImagen, actualizarImagenCloudinary } = require("../controllers/uploads");
const { check } = require("express-validator");
const { esColeccionValida } = require("../helpers");
const { validarCampos, validarArchivo } = require("../middlewares");

const router = Router();

router.post("/", cargarArchivo);

router.put("/:coleccion/:id",[
  validarArchivo,
  check("id", "El id debe ser un mongoID").isMongoId(),
  check("coleccion").custom(c => esColeccionValida(c, ["usuarios", "productos"])),
  validarCampos
], actualizarImagenCloudinary);
// ], actualizarImagen);

router.get("/:coleccion/:id", [
  check("id", "El id debe ser un mongoID").isMongoId(),
  check("coleccion").custom(c => esColeccionValida(c, ["usuarios", "productos"])),
  validarCampos
], mostrarImagen);

module.exports = router;