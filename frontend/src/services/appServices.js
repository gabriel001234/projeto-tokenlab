import axios from 'axios';
import jwt from 'jsonwebtoken';

const URL_BASE = 'http://localhost:3001';
const chave = '2NSseD8PIgHcgkmQ09bJ';

export async function cadastrarUsuario(usuario, senha) {
  try {
    const token = jwt.sign({ usuario, tipo: 'cadastrar' }, chave, {
      expiresIn: 3600,
    });
    const resposta = await axios.post(
      URL_BASE + '/cadastrar',
      {
        usuario,
        senha,
      },
      { headers: { 'jwt-authorization': token } }
    );
    return resposta;
  } catch (erro) {
    if (erro.response) throw new Error(erro.response.data.erro);
    else throw new Error('ERRO');
  }
}

export async function login(usuario, senha) {
  try {
    const token = jwt.sign({ usuario, tipo: 'login' }, chave, {
      expiresIn: 3600,
    });
    const resposta = await axios.post(
      URL_BASE + '/login',
      { usuario, senha },
      { headers: { 'jwt-authorization': token } }
    );
    return resposta;
  } catch (erro) {
    if (erro.response) throw new Error(erro.response.data.erro);
    else throw new Error('ERRO');
  }
}

export async function obterEventos(usuario, token) {
  try {
    const resposta = await axios.get(
      `${URL_BASE}/eventosdousuario/${usuario}`,
      {
        headers: { 'jwt-authorization': token },
      }
    );
    return resposta.data;
  } catch (erro) {
    if (erro.response) throw new Error(erro.response.data.erro);
    else throw new Error('ERRO');
  }
}

export async function adicionarEvento(evento, token) {
  try {
    const resposta = await axios.post(`${URL_BASE}/eventos`, evento, {
      headers: { 'jwt-authorization': token },
    });
    return resposta;
  } catch (erro) {
    if (erro.response) throw new Error(erro.response.data.erro);
    else throw new Error('ERRO');
  }
}

export async function editarEvento(id, dados, token) {
  const novoObjeto = Object.assign({ _id: id }, dados);
  try {
    const resposta = await axios.put(`${URL_BASE}/eventos`, novoObjeto, {
      headers: { 'jwt-authorization': token },
    });
    return resposta;
  } catch (erro) {
    if (erro.response) throw new Error(erro.response.data.erro);
    else throw new Error('ERRO');
  }
}

export async function deletarEvento(id, token) {
  try {
    const resposta = await axios.delete(`${URL_BASE}/eventosdousuario/${id}`, {
      headers: { 'jwt-authorization': token },
    });
    return resposta;
  } catch (erro) {
    if (erro.response) throw new Error(erro.response.data.erro);
    else throw new Error('ERRO');
  }
}

export async function adicionarConvite(convite, token) {
  try {
    const resposta = await axios.post(`${URL_BASE}/convites`, convite, {
      headers: { 'jwt-authorization': token },
    });
    return resposta;
  } catch (erro) {
    if (erro.response) throw new Error(erro.response.data.erro);
    else throw new Error('ERRO');
  }
}

export async function obterConvites(usuario, token) {
  try {
    const resposta = await axios.get(`${URL_BASE}/convites/${usuario}`, {
      headers: { 'jwt-authorization': token },
    });
    return resposta.data;
  } catch (erro) {
    if (erro.response) throw new Error(erro.response.data.erro);
    else throw new Error('ERRO');
  }
}

export async function atualizarConvite(id, dados, token) {
  const novoConvite = Object.assign({ _id: id }, dados);
  try {
    const resposta = await axios.put(`${URL_BASE}/convites`, novoConvite, {
      headers: { 'jwt-authorization': token },
    });
    return resposta.data;
  } catch (erro) {
    if (erro.response) throw new Error(erro.response.data.erro);
    else throw new Error('ERRO');
  }
}
