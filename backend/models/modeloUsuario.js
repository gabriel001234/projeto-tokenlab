import mongoose from 'mongoose';

const schema = mongoose.Schema({
  usuario: {
    type: String,
    required: true,
  },
  senha: {
    type: String,
    required: true,
  },
});

const modeloUsuario = mongoose.model('usuarios', schema, 'usuarios');
export { modeloUsuario };
