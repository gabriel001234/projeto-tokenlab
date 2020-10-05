import mongoose from 'mongoose';

const schema = mongoose.Schema({
  eventoId: {
    type: String,
    required: true,
  },
  remetente: {
    type: String,
    required: true,
  },
  destinatario: {
    type: String,
    required: true,
  },
  descartado: {
    type: Boolean,
    required: true,
  },
  aceito: {
    type: Boolean,
    required: true,
  },
});

const modeloConvite = mongoose.model('convites', schema, 'convites');
export { modeloConvite };
