const express = require('express');
const cors = require('cors');
const { dbConnection } = require('../database/config');
const fileUpload = require('express-fileupload');
require('dotenv').config();

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;

    this.paths = {
      usuarios: '/api/usuarios',
      buscar: '/api/buscar',
      auth: '/api/auth',
      categorias: '/api/categorias',
      productos: '/api/productos',
      uploads: '/api/uploads'
    };

    // Conectar a base de datos
    this.conectarDB();

    // Middlewares
    this.middlewares();

    // Rutas de mi aplicación
    this.routes();
  };

  async conectarDB() {
    try {
      await dbConnection();
    } catch (error) {
      console.log(error);
      throw new Error('Error a la hora de inicializar la base de datos');
    }
  };

  middlewares() {
    // cors
    this.app.use(cors());

    // Lectura y parseo del body
    // Cual es la funcion del siguiente codigo?
    // El siguiente codigo es para que el servidor pueda recibir y enviar informacion en formato JSON
    this.app.use(express.json());

    // Directorio público
    this.app.use(express.static('public'));

    // Fileupload - Carga de archivos
    this.app.use(fileUpload({
      useTempFiles: true,
      tempFileDir: '/tmp/',
      createParentPath: true
    }));
  };

  routes() { 
    this.app.use(this.paths.auth, require('../routes/auth'));
    this.app.use(this.paths.usuarios, require('../routes/usuarios'));
    this.app.use(this.paths.buscar, require('../routes/buscar'));
    this.app.use(this.paths.categorias, require('../routes/categorias'));
    this.app.use(this.paths.productos, require('../routes/productos'));
    this.app.use(this.paths.uploads, require('../routes/uploads'));
  };

  listen() {
    this.app.listen(this.port, () => {
      console.log(`Server listening on port ${ this.port }.`);
    });
  };
};

module.exports = Server;