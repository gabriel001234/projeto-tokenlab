import mongoose from 'mongoose';

const schema = mongoose.Schema({
  criador: {
    type: String,
    required: true,
  },
  descricao: {
    type: String,
    required: true,
  },
  milissegundosInicio: {
    type: Number,
    required: true,
  },
  dataInicio: {
    type: Date,
    required: true,
  },
  dataInicialInputString: {
    type: String,
    required: true,
  },
  dataInicialString: {
    type: String,
    required: true,
  },
  horaInicial: {
    type: String,
    required: true,
  },
  minutoInicial: {
    type: String,
    required: true,
  },
  milissegundosFim: {
    type: Number,
    required: true,
  },
  dataFim: {
    type: Date,
    required: true,
  },
  dataFinalInputString: {
    type: String,
    required: true,
  },
  dataFinalString: {
    type: String,
    required: true,
  },
  horaFinal: {
    type: String,
    required: true,
  },
  minutoFinal: {
    type: String,
    required: true,
  },
  offset: {
    type: Number,
    required: true,
  },
});

const modeloEvento = mongoose.model('eventos', schema, 'eventos');
export { modeloEvento };
