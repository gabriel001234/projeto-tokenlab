import mongoose from 'mongoose';

const schema = mongoose.Schema({
  usuario: {
    type: String,
    required: true,
  },
  eventoId: {
    type: String,
    required: true,
  },
  usuarioCriou: {
    type: Boolean,
    required: true,
  },
});

const modeloEventoDoUsuario = mongoose.model(
  'usuario_eventos',
  schema,
  'usuario_eventos'
);
export { modeloEventoDoUsuario };
