const {Schema, model} = require('mongoose');

const CategoriaSchema = new Schema({
  estado: {
    type: Boolean,
    default: true
  },
  nombre: {
    type: String,
    required: [true, "El nombre de la categoria es obligatorio"],
    unique: true
  },
  usuario: {
    type: Schema.Types.ObjectId,
    ref: "Usuario",
    required: true
  }
});

CategoriaSchema.methods.toJSON = function() {
  const {__v, estado, ...categoria} = this.toObject();
  return categoria;
};

module.exports = model("Categoria", CategoriaSchema);
