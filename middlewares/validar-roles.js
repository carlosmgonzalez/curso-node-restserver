const { response, request } = require("express");

const esAdminRole = (req = request, res = response, next) => {

  if(!req.usuario) {
    return res.status(500).json({
      msg: "Se quiere verificar el rol sin validar el token primero"
    });
  };
  
  const {rol, nombre} = req.usuario;

  if(rol !== "ADMIN_ROLE") {
    return res.status(401).json({
      msg: `El usuario ${nombre} no es administrados - No esta autorizado para hacer esto`
    });
  };

  next();
};


const tieneRol = (...roles) => {
  return (req = request, res = response, next) => {
    if(!req.usuario) {
      return res.status(500).json({
        msg: "Se quiere verificar el rol sin validar el token primero"
      });
    };

    if(!roles.includes(req.usuario.rol)) {
      return res.status(400).json({
        msg: `El rol ${req.usuario.rol} no se encuentra autorizado`
      });
    };

    next();
  };
};

module.exports = {
  esAdminRole,
  tieneRol
};