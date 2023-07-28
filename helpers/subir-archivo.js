const {v4: uuidv4} = require("uuid");
const path = require("path");

const extensionesPordefecto = ["jpg", "png", "jpeg", "gif"];

const subirArchivo = (files, extensionesValidas = extensionesPordefecto, carpeta = "") => {

  return new Promise((resolve, reject) => {

    const {archivo} = files;
    const nombreCortado = archivo.name.split(".");
    const extension = nombreCortado[nombreCortado.length - 1];

    if (!extensionesValidas.includes(extension)) {
      return reject(`La extension ${extension} del archivo que quiere subir no es permitida, solo se permiten ${extensionesValidas}`);
    };

    const nombreTemp = `${uuidv4()}.${extension}`;
    const uploadPath = path.join(__dirname, "../uploads/", carpeta, nombreTemp );

    archivo.mv(uploadPath, (error) => {
      if (error) {
        reject(error)
      };

      resolve(nombreTemp);
    });

  });
};

module.exports = {
  subirArchivo
};