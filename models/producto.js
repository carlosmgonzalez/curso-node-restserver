const {Schema, model} = require('mongoose');

const productoSchema = new Schema ({
  nombre: {
    type: String,
    required: [true, "El nombre es requerido"],
    unique: true
  },
  estado: {
    type: Boolean,
    default: true
  },
  precio: {
    type: Number,
    // required: [true, "El precio es requerido"],
    default: 0
  },
  descripcion: {
    type: String
  },
  disponible: {
    type: Boolean,
    default: true
  },
  img: {
    type: String
  },
  categoria: {
    type: Schema.Types.ObjectId,
    ref: "Categoria",
    required: true
  },
  usuario: {
    type: Schema.Types.ObjectId,
    ref: "Usuario",
    required: true
  }
});

module.exports = model("Producto", productoSchema);