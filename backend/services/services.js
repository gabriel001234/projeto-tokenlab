import mongoose from 'mongoose';
import { modeloUsuario } from '../models/modeloUsuario.js';
import { modeloEvento } from '../models/modeloEvento.js';
import { modeloEventoDoUsuario } from '../models/modeloEventoDoUsuario.js';
import { modeloConvite } from '../models/modeloConvite.js';

const ObjectId = mongoose.Types.ObjectId;

async function adicionarUsuario(dados) {
  try {
    const usuarioBuscado = await buscarUsuario(dados.usuario);
    if (usuarioBuscado !== null) {
      throw new Error('O usuário informado já existe!');
    } else {
      await new modeloUsuario(dados).save();
      return 'OK';
    }
  } catch (erro) {
    throw new Error(erro.message);
  }
}

async function buscarUsuario(nomeUsuario) {
  try {
    const usuario = await modeloUsuario.findOne({ usuario: nomeUsuario });
    return usuario;
  } catch (erro) {
    throw new Error(erro.message);
  }
}

async function obterEventosDoUsuario(nomeUsuario) {
  try {
    const usuarioBuscado = await buscarUsuario(nomeUsuario);
    if (usuarioBuscado === null) {
      await modeloEvento.deleteMany({ criador: nomeUsuario });
      await modeloEventoDoUsuario.deleteMany({ usuario: nomeUsuario });
      await modeloConvite.deleteMany({ remetente: nomeUsuario });
      await modeloConvite.deleteMany({ destinatario: nomeUsuario });
      throw new Error('Erro crítico');
    }
    const eventosDoUsuario = await modeloEventoDoUsuario.find({
      usuario: nomeUsuario,
    });
    const eventos = [];
    for (var i = 0; i < eventosDoUsuario.length; i++) {
      const evento = await modeloEvento.findOne({
        _id: ObjectId(eventosDoUsuario[i].eventoId),
      });
      const {
        criador,
        descricao,
        milissegundosInicio,
        dataInicio,
        dataInicialString,
        dataInicialInputString,
        horaInicial,
        minutoInicial,
        milissegundosFim,
        dataFim,
        dataFinalString,
        dataFinalInputString,
        horaFinal,
        minutoFinal,
        offset,
      } = evento;
      const dadosEvento = {
        criador,
        descricao,
        milissegundosInicio,
        dataInicio,
        dataInicialString,
        dataInicialInputString,
        horaInicial,
        minutoInicial,
        milissegundosFim,
        dataFim,
        dataFinalString,
        dataFinalInputString,
        horaFinal,
        minutoFinal,
        offset,
      };
      eventos.push(
        Object.assign({}, { ...dadosEvento, ...eventosDoUsuario[i]['_doc'] })
      );
    }
    eventos.sort((a, b) => {
      if (a.milissegundosInicio < b.milissegundosInicio) return -1;
      if (a.milissegundosInicio > b.milissegundosInicio) return 1;
      if (a.milissegundosFim < b.milissegundosFim) return -1;
      if (a.milissegundosFim > b.milissegundosFim) return 1;
    });
    return eventos;
  } catch (erro) {
    throw new Error(erro.message);
  }
}

async function adicionarEventoDoUsuario(dados) {
  const { usuario } = dados;
  const usuarioBuscado = await buscarUsuario(usuario);
  if (usuarioBuscado === null) {
    await modeloEvento.deleteMany({ criador: usuario });
    await modeloEventoDoUsuario.deleteMany({ usuario: usuario });
    await modeloConvite.deleteMany({ remetente: usuario });
    await modeloConvite.deleteMany({ destinatario: usuario });
    throw new Error('Erro crítico');
  }
  try {
    const novoEvento = await new modeloEventoDoUsuario(dados).save();
    return novoEvento;
  } catch (erro) {
    throw new Error(erro.message);
  }
}

async function adicionarEvento(evento) {
  try {
    const { criador } = evento;
    const usuarioBuscado = await buscarUsuario(criador);
    if (usuarioBuscado === null) {
      await modeloEvento.deleteMany({ criador: criador });
      await modeloEventoDoUsuario.deleteMany({ usuario: criador });
      await modeloConvite.deleteMany({ remetente: criador });
      await modeloConvite.deleteMany({ destinatario: criador });
      throw new Error('Erro crítico');
    }
    const eventoEncontrado = await modeloEvento.findOne({ evento });
    if (eventoEncontrado !== null) {
      throw new Error('O evento informado já existe!');
    }
    const novoEvento = await new modeloEvento(evento).save();
    return novoEvento;
  } catch (erro) {
    throw new Error(erro.message);
  }
}

async function editarEvento(evento) {
  try {
    const {
      _id,
      criador,
      descricao,
      milissegundosInicio,
      dataInicio,
      dataInicialString,
      dataInicialInputString,
      horaInicial,
      minutoInicial,
      milissegundosFim,
      dataFim,
      dataFinalString,
      dataFinalInputString,
      horaFinal,
      minutoFinal,
      offset,
    } = evento;
    const usuarioBuscado = await buscarUsuario(criador);
    if (usuarioBuscado === null) {
      await modeloEvento.deleteMany({ criador: criador });
      await modeloEventoDoUsuario.deleteMany({ usuario: criador });
      await modeloConvite.deleteMany({ remetente: criador });
      await modeloConvite.deleteMany({ destinatario: criador });
      throw new Error('Erro crítico');
    }
    const dados = {
      criador,
      descricao,
      milissegundosInicio,
      dataInicio,
      dataInicialString,
      dataInicialInputString,
      horaInicial,
      minutoInicial,
      milissegundosFim,
      dataFim,
      dataFinalString,
      dataFinalInputString,
      horaFinal,
      minutoFinal,
      offset,
    };

    const novoEvento = await modeloEvento.findOneAndUpdate(
      {
        _id: ObjectId(_id),
      },
      dados,
      { new: true, useFindAndModify: false }
    );
    return novoEvento;
  } catch (erro) {
    throw new Error(erro.message);
  }
}

async function deletarEvento(id) {
  try {
    const eventoADeletar = await modeloEventoDoUsuario.findOne({
      _id: ObjectId(id),
    });
    const { usuario } = eventoADeletar;
    const usuarioBuscado = await buscarUsuario(usuario);
    if (usuarioBuscado === null) {
      await modeloEvento.deleteMany({ criador: usuario });
      await modeloEventoDoUsuario.deleteMany({ usuario: usuario });
      await modeloConvite.deleteMany({ remetente: usuario });
      await modeloConvite.deleteMany({ destinatario: usuario });
      throw new Error('Erro crítico');
    }
    const eventoDeletado = await modeloEventoDoUsuario.findOneAndDelete({
      _id: ObjectId(id),
    });
    if (eventoDeletado.usuarioCriou) {
      await modeloEvento.findOneAndDelete({
        _id: ObjectId(eventoDeletado['eventoId']),
      });
      await modeloEventoDoUsuario.deleteMany({
        eventoId: eventoDeletado['eventoId'].toString(),
      });
      await modeloConvite.deleteMany({
        eventoId: eventoDeletado['eventoId'].toString(),
      });
    }
    return eventoDeletado;
  } catch (erro) {
    throw new Error(erro.message);
  }
}

async function adicionarConvite(dados) {
  const { eventoId, remetente, destinatario } = dados;
  try {
    const usuarioAChecar = await buscarUsuario(remetente);
    if (usuarioAChecar === null) {
      await modeloEvento.deleteMany({ criador: remetente });
      await modeloEventoDoUsuario.deleteMany({ usuario: remetente });
      await modeloConvite.deleteMany({ remetente: remetente });
      await modeloConvite.deleteMany({ destinatario: remetente });
      throw new Error('Erro crítico');
    }
    const usuarioBuscado = await buscarUsuario(destinatario);
    if (usuarioBuscado === null) {
      throw new Error('O usuário informado não existe!');
    }
    const convite = await modeloConvite.findOne({
      eventoId: eventoId,
      destinatario: destinatario,
    });
    if (convite !== null) {
      throw new Error(
        'O usuário informado já foi convidado para este evento. Ele pode ter aceitado ou recusado o convite.'
      );
    }
    const evento = await modeloEvento.findOne({ _id: ObjectId(eventoId) });
    if (evento === null) {
      throw new Error('O evento não existe');
    }
    if (evento.criador === destinatario) {
      throw new Error('Não é possível convidar o criador do evento');
    }
    if (destinatario === remetente) {
      throw new Error('Não é possível convidar a si mesmo');
    }
    const novoConvite = await new modeloConvite(dados).save();
    return convite;
  } catch (erro) {
    throw new Error(erro.message);
  }
}

async function obterConvites(usuario) {
  try {
    const usuarioAChecar = await buscarUsuario(usuario);
    if (usuarioAChecar === null) {
      await modeloEvento.deleteMany({ criador: usuario });
      await modeloEventoDoUsuario.deleteMany({ usuario: usuario });
      await modeloConvite.deleteMany({ remetente: usuario });
      await modeloConvite.deleteMany({ destinatario: usuario });
      throw new Error('Erro crítico');
    }
    const convitesDoUsuario = await modeloConvite.find({
      destinatario: usuario,
      descartado: false,
    });
    const eventos = [];
    for (var i = 0; i < convitesDoUsuario.length; i++) {
      const evento = await modeloEvento.findOne({
        _id: ObjectId(convitesDoUsuario[i].eventoId),
      });
      const {
        criador,
        descricao,
        milissegundosInicio,
        dataInicio,
        dataInicialString,
        dataInicialInputString,
        horaInicial,
        minutoInicial,
        milissegundosFim,
        dataFim,
        dataFinalString,
        dataFinalInputString,
        horaFinal,
        minutoFinal,
        offset,
      } = evento;
      const dadosEvento = {
        criador,
        descricao,
        milissegundosInicio,
        dataInicio,
        dataInicialString,
        dataInicialInputString,
        horaInicial,
        minutoInicial,
        milissegundosFim,
        dataFim,
        dataFinalString,
        dataFinalInputString,
        horaFinal,
        minutoFinal,
        offset,
      };
      eventos.push(
        Object.assign({}, { ...dadosEvento, ...convitesDoUsuario[i]['_doc'] })
      );
    }
    eventos.sort((a, b) => {
      if (a.milissegundosInicio < b.milissegundosInicio) return -1;
      if (a.milissegundosInicio > b.milissegundosInicio) return 1;
      if (a.milissegundosFim < b.milissegundosFim) return -1;
      if (a.milissegundosFim > b.milissegundosFim) return 1;
    });
    return eventos;
  } catch (erro) {
    throw new Error(erro.message);
  }
}

async function atualizarConvite(dados) {
  const { _id, eventoId, destinatario, remetente, descartado, aceito } = dados;
  const novoConvite = { eventoId, destinatario, remetente, descartado, aceito };
  try {
    const usuarioAChecar = await buscarUsuario(remetente);
    const usuarioAChecar2 = await buscarUsuario(destinatario);
    if (usuarioAChecar === null) {
      await modeloEvento.deleteMany({ criador: remetente });
      await modeloEventoDoUsuario.deleteMany({ usuario: remetente });
      await modeloConvite.deleteMany({ remetente: remetente });
      await modeloConvite.deleteMany({ destinatario: remetente });
      throw new Error('Erro crítico');
    }
    if (usuarioAChecar2 === null) {
      await modeloEvento.deleteMany({ criador: destinatario });
      await modeloEventoDoUsuario.deleteMany({ usuario: destinatario });
      await modeloConvite.deleteMany({ remetente: destinatario });
      await modeloConvite.deleteMany({ destinatario: destinatario });
      throw new Error('Erro crítico');
    }
    const conviteAtualizado = await modeloConvite.findOneAndUpdate(
      { _id: ObjectId(_id) },
      novoConvite,
      { new: true, useFindAndModify: false }
    );
    if (aceito) {
      const novoEvento = {
        usuario: destinatario,
        eventoId,
        usuarioCriou: false,
      };
      await new modeloEventoDoUsuario(novoEvento).save();
    }
    return conviteAtualizado;
  } catch (erro) {
    throw new Error(erro.message);
  }
}

export {
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
};
