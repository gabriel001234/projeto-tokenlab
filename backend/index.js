import express from 'express';
import cors from 'cors';
import router from './routes/routes.js';
import mongoose from 'mongoose';

const db =
  'mongodb+srv://bootcampdb:bootcampdb01@projeto.1xyhn.gcp.mongodb.net/dbProjeto?retryWrites=true&w=majority';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/', router);

console.log('Iniciando conexão ao MongoDB...');
const conectar = async () => {
  try {
    await mongoose.connect(db, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });
    console.log('Conectado com sucesso!');
  } catch (erro) {
    console.log('Erro na conexão: ' + erro);
  }
};

app.listen(3001, async () => {
  conectar();
  console.log('API Funcionando com sucesso!');
});
