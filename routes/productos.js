const {Router} = require('express');
const { obtenerProductos, obtenerProducto, crearProducto, actualizarProducto, eliminarProducto } = require('../controllers/productos');
const { validarJWT } = require("../middlewares/validar-jwt");
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { esAdminRole } = require('../middlewares/validar-roles');
const { existeProductoPorId } = require('../helpers/db-validators');

const router = Router();

// Obtener producto - Cualquiera
router.get("/:id",[
  check("id", "El id debe ser un mongoId").isMongoId(),
  check("id").custom(existeProductoPorId),
  validarCampos
], obtenerProducto);

//Obtener prodcutoS - Cualquiera
router.get("/", obtenerProductos);

// Crear producto - Usuario autenticado
router.post("/", [
  validarJWT,
  check("nombre", "El nombre es requerido").not().isEmpty(),
  check("categoria", "La categoria es requerida").not().isEmpty(),
  validarCampos
],crearProducto);

// Actualizar producto - Usuario autenticado
router.put("/:id",[
  validarJWT,
  check("id", "El id es requerido").not().isEmpty(),
  check("id", "El id debe ser un mongoId").isMongoId(),
  check("usuario", "El usuario es requerido").not().isEmpty(),
  validarCampos
], actualizarProducto);

// Eliminar producto - Usuario autenticado y con rol de administrador
router.delete("/:id",[
  validarJWT,
  esAdminRole,
  check("id", "El id es requerido").not().isEmpty(),
  check("id", "El id debe ser un mongoId").isMongoId(),
  validarCampos
], eliminarProducto);


module.exports = router;