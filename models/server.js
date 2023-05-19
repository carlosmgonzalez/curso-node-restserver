const express = require('express');
const cors = require('cors');
const { dbConnection } = require('../database/config');
require('dotenv').config();

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;
    this.usuariosPath = '/api/usuarios';

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
  };

  routes() { 
    this.app.use(this.usuariosPath, require('../routes/usuarios'));
  };

  listen() {
    this.app.listen(this.port, () => {
      console.log(`Server listening on port ${ this.port }.`);
    });
  };
};

module.exports = Server;