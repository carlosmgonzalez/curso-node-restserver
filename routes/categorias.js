const {Router, response} = require("express");
const {check} = require('express-validator');

const { crearCategoria, obtenerCategorias, obtenerCategoria, actualizarCategoria, borrarCategorias } = require("../controllers/categorias");
const { validarCampos, validarJWT, esAdminRole } = require("../middlewares");
const {existeCategoria, yaExisteCatogoriaConEseNombre} = require('../helpers/db-validators')

const router = Router();

// Obtener todas las categorias - Publico
router.get('/', [
  validarCampos
], obtenerCategorias);

// Obtener categoria por id - Publico
router.get('/:id', [
  check("id", "Debe ser un mongo id").isMongoId(),
  check("id").custom(existeCategoria),
  validarCampos
], obtenerCategoria);

// Crear nueva categoria - Privado - Cualquier persona que tenga un token valido 
router.post('/', [
  validarJWT,
  check("nombre", "El nombre de la categoria es obligatorio").not().isEmpty(),
  validarCampos
], crearCategoria);

// Actualizar categoria - Privado - Cualquier persona que tenga un tokan valido
router.put('/:id', [
  validarJWT,
  check("id", "Debe ser un mongo id").isMongoId(),
  check("id").custom(existeCategoria),
  check("nombre", "Debe venir el nuevo nombre de la categoria").not().isEmpty(),
  check("nombre").custom(yaExisteCatogoriaConEseNombre),
  validarCampos
], actualizarCategoria);

// Eliminar categoria (cambiar el estado a false) - Admin
router.delete('/:id', [
  validarJWT,
  esAdminRole,
  check("id", "Debe ser un mongo id").isMongoId(),
  check("id").custom(existeCategoria),
  validarCampos
], borrarCategorias);

module.exports = router