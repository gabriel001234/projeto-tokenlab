import express from 'express';
import {
  adicionarUsuario,
  buscarUsuario,
  adicionarEventoDoUsuario,
  obterEventosDoUsuario,
  adicionarEvento,
  editarEvento,
  deletarEvento,
  adicionarConvite,
  obterConvites,
  atualizarConvite,
} from '../services/services.js';
import jwt from 'jsonwebtoken';

const router = express.Router();
const chave = '2NSseD8PIgHcgkmQ09bJ';
const chave2 = 'x6PssKxulb2lFEDmo5Bt';

router.get('/', (req, res) => {
  res.send({ message: 'Página pública' });
});

router.post('/cadastrar', (req, res) => {
  if (
    req.headers.referer !== 'http://localhost:3000/' ||
    typeof req.headers['jwt-authorization'] === 'undefined'
  ) {
    res.status(500).send({ erro: 'Acesso negado!' });
  } else {
    const token = req.headers['jwt-authorization'];
    try {
      const decodificado = jwt.verify(token, chave);
      if (
        typeof req.body.usuario !== 'string' ||
        typeof req.body.senha !== 'string'
      ) {
        res.status(500).send({ erro: 'Dados inválidos ou insuficientes' });
      } else {
        const adicionar = async () => {
          try {
            const dados = { usuario: req.body.usuario, senha: req.body.senha };
            const resposta = await adicionarUsuario(dados);
            if (resposta === 'OK') {
              res.send('Usuário cadastrado com sucesso!');
            }
          } catch (erro) {
            res.status(500).send({ erro: erro.message });
          }
        };
        adicionar();
      }
    } catch (err) {
      res.status(500).send({ erro: 'Acesso negado!' });
    }
  }
});

router.post('/login', (req, res) => {
  if (
    req.headers.referer !== 'http://localhost:3000/' ||
    typeof req.headers['jwt-authorization'] === 'undefined'
  ) {
    res.status(500).send({ erro: 'Acesso negado!' });
  } else {
    const token = req.headers['jwt-authorization'];
    try {
      const decodificado = jwt.verify(token, chave);
      if (
        typeof req.body.usuario !== 'string' ||
        typeof req.body.senha !== 'string'
      ) {
        res.status(500).send({ erro: 'Dados inválidos ou insuficientes' });
      } else {
        const logar = async () => {
          try {
            const dados = { usuario: req.body.usuario, senha: req.body.senha };
            const resposta = await buscarUsuario(dados.usuario);
            if (resposta !== null) {
              if (
                resposta.usuario === dados.usuario &&
                resposta.senha === dados.senha
              ) {
                const token = jwt.sign({ usuario: resposta.usuario }, chave2, {
                  expiresIn: 3600,
                });
                res.send(token);
              } else {
                throw new Error('Combinação de usuário e senha inválida!');
              }
            } else {
              throw new Error('Usuário não encontrado!');
            }
          } catch (erro) {
            res.status(500).send({ erro: erro.message });
          }
        };
        logar();
      }
    } catch (erro) {
      res.status(500).send({ erro: 'Acesso negado!' });
    }
  }
});

router.get('/eventosdousuario/:usuario', (req, res) => {
  if (
    req.headers.referer !== 'http://localhost:3000/' ||
    typeof req.headers['jwt-authorization'] === 'undefined'
  ) {
    res.status(500).send({ erro: 'Acesso negado!' });
  } else {
    const token = req.headers['jwt-authorization'];
    try {
      const decodificado = jwt.verify(token, chave2);
      if (
        typeof req.params.usuario !== 'string' ||
        req.params.usuario.trim() === ''
      ) {
        res.status(500).send({ erro: 'Dados inválidos ou insuficientes' });
      } else {
        const executarObterEventos = async () => {
          try {
            const eventos = await obterEventosDoUsuario(req.params.usuario);
            res.send(eventos);
          } catch (erro) {
            res.status(500).send({ erro: erro.message });
          }
        };
        executarObterEventos();
      }
    } catch (erro) {
      res.status(500).send({ erro: 'Acesso negado!' });
    }
  }
});

router.delete('/eventosdousuario/:id', (req, res) => {
  if (
    req.headers.referer !== 'http://localhost:3000/' ||
    typeof req.headers['jwt-authorization'] === 'undefined'
  ) {
    res.status(500).send({ erro: 'Acesso negado!' });
  } else {
    const token = req.headers['jwt-authorization'];
    try {
      const decodificado = jwt.verify(token, chave2);
      if (typeof req.params.id !== 'string' || req.params.id.trim() === '') {
        res.status(500).send({ erro: 'Dados inválidos ou insuficientes' });
      } else {
        const executarDeletarEvento = async () => {
          try {
            const evento = await deletarEvento(req.params.id);
            res.send(evento);
          } catch (erro) {
            res.status(500).send({ erro: erro.message });
          }
        };
        executarDeletarEvento();
      }
    } catch (erro) {
      res.status(500).send({ erro: 'Acesso negado!' });
    }
  }
});

router.post('/eventos', (req, res) => {
  if (
    req.headers.referer !== 'http://localhost:3000/' ||
    typeof req.headers['jwt-authorization'] === 'undefined'
  ) {
    res.status(500).send({ erro: 'Acesso negado!' });
  } else {
    const token = req.headers['jwt-authorization'];
    try {
      const decodificado = jwt.verify(token, chave2);
      if (
        typeof req.body.criador !== 'string' ||
        typeof req.body.descricao !== 'string' ||
        isNaN(Date.parse(req.body.dataInicio)) ||
        isNaN(Date.parse(req.body.dataFim)) ||
        typeof req.body.milissegundosInicio !== 'number' ||
        typeof req.body.milissegundosFim !== 'number' ||
        typeof req.body.dataInicialInputString !== 'string' ||
        typeof req.body.dataInicialString !== 'string' ||
        typeof req.body.horaInicial !== 'string' ||
        typeof req.body.minutoInicial !== 'string' ||
        typeof req.body.dataFinalInputString !== 'string' ||
        typeof req.body.dataFinalString !== 'string' ||
        typeof req.body.horaFinal !== 'string' ||
        typeof req.body.minutoFinal !== 'string' ||
        typeof req.body.offset !== 'number'
      ) {
        res.status(500).send({ erro: 'Dados inválidos ou insuficientes' });
      } else {
        const executarAdicionarEvento = async () => {
          try {
            const evento = await adicionarEvento(req.body);
            const dados = {
              usuario: req.body.criador,
              eventoId: evento['_id'].toString(),
              usuarioCriou: true,
            };
            const resposta = await adicionarEventoDoUsuario(dados);
            res.send(resposta);
          } catch (erro) {
            res.status(500).send({ erro: erro.message });
          }
        };
        executarAdicionarEvento();
      }
    } catch (erro) {
      res.status(500).send({ erro: 'Acesso negado!' });
    }
  }
});

router.put('/eventos', (req, res) => {
  if (
    req.headers.referer !== 'http://localhost:3000/' ||
    typeof req.headers['jwt-authorization'] === 'undefined'
  ) {
    res.status(500).send({ erro: 'Acesso negado!' });
  } else {
    const token = req.headers['jwt-authorization'];
    try {
      const decodificado = jwt.verify(token, chave2);
      if (
        typeof req.body['_id'] !== 'string' ||
        typeof req.body.criador !== 'string' ||
        typeof req.body.descricao !== 'string' ||
        isNaN(Date.parse(req.body.dataInicio)) ||
        isNaN(Date.parse(req.body.dataFim)) ||
        typeof req.body.milissegundosInicio !== 'number' ||
        typeof req.body.milissegundosFim !== 'number' ||
        typeof req.body.dataInicialInputString !== 'string' ||
        typeof req.body.dataInicialString !== 'string' ||
        typeof req.body.horaInicial !== 'string' ||
        typeof req.body.minutoInicial !== 'string' ||
        typeof req.body.dataFinalInputString !== 'string' ||
        typeof req.body.dataFinalString !== 'string' ||
        typeof req.body.horaFinal !== 'string' ||
        typeof req.body.minutoFinal !== 'string' ||
        typeof req.body.offset !== 'number'
      ) {
        res.status(500).send({ erro: 'Dados inválidos ou insuficientes' });
      } else {
        const executarEditarEvento = async () => {
          try {
            const evento = await editarEvento(req.body);
            res.send(evento);
          } catch (erro) {
            res.status(500).send({ erro: erro.message });
          }
        };
        executarEditarEvento();
      }
    } catch (erro) {
      res.status(500).send({ erro: 'Acesso negado!' });
    }
  }
});

router.get('/convites/:usuario', (req, res) => {
  if (
    req.headers.referer !== 'http://localhost:3000/' ||
    typeof req.headers['jwt-authorization'] === 'undefined'
  ) {
    res.status(500).send({ erro: 'Acesso negado!' });
  } else {
    const token = req.headers['jwt-authorization'];
    try {
      const decodificado = jwt.verify(token, chave2);
      if (
        typeof req.params.usuario !== 'string' ||
        req.params.usuario.trim() === ''
      ) {
        res.status(500).send({ erro: 'Dados inválidos ou insuficientes' });
      } else {
        const executarObterConvites = async () => {
          try {
            const convites = await obterConvites(req.params.usuario);
            res.send(convites);
          } catch (erro) {
            res.status(500).send({ erro: erro.message });
          }
        };
        executarObterConvites();
      }
    } catch (erro) {
      res.status(500).send({ erro: 'Acesso negado!' });
    }
  }
});

router.post('/convites', (req, res) => {
  if (
    req.headers.referer !== 'http://localhost:3000/' ||
    typeof req.headers['jwt-authorization'] === 'undefined'
  ) {
    res.status(500).send({ erro: 'Acesso negado!' });
  } else {
    const token = req.headers['jwt-authorization'];
    try {
      const decodificado = jwt.verify(token, chave2);
      if (
        typeof req.body.eventoId !== 'string' ||
        typeof req.body.remetente !== 'string' ||
        typeof req.body.destinatario !== 'string' ||
        typeof req.body.descartado !== 'boolean' ||
        typeof req.body.aceito !== 'boolean'
      ) {
        res.status(500).send({ erro: 'Dados inválidos ou insuficientes' });
      } else {
        const executarAdicionarConvite = async () => {
          try {
            const resposta = await adicionarConvite(req.body);
            res.send(resposta);
          } catch (erro) {
            res.status(500).send({ erro: erro.message });
          }
        };
        executarAdicionarConvite();
      }
    } catch (erro) {
      res.status(500).send({ erro: 'Acesso negado!' });
    }
  }
});

router.put('/convites', (req, res) => {
  if (
    req.headers.referer !== 'http://localhost:3000/' ||
    typeof req.headers['jwt-authorization'] === 'undefined'
  ) {
    res.status(500).send({ erro: 'Acesso negado!' });
  } else {
    const token = req.headers['jwt-authorization'];
    try {
      const decodificado = jwt.verify(token, chave2);
      if (
        typeof req.body['_id'] !== 'string' ||
        typeof req.body.eventoId !== 'string' ||
        typeof req.body.remetente !== 'string' ||
        typeof req.body.destinatario !== 'string' ||
        typeof req.body.descartado !== 'boolean' ||
        typeof req.body.aceito !== 'boolean'
      ) {
        res.status(500).send({ erro: 'Dados inválidos ou insuficientes' });
      } else {
        const executarAtualizarConvite = async () => {
          try {
            const resposta = await atualizarConvite(req.body);
            res.send(resposta);
          } catch (erro) {
            res.status(500).send({ erro: erro.message });
          }
        };
        executarAtualizarConvite();
      }
    } catch (erro) {
      res.status(500).send({ erro: 'Acesso negado!' });
    }
  }
});

export default router;
