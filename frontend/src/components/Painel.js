import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';

import {
  obterEventos,
  adicionarEvento,
  editarEvento,
  deletarEvento,
  adicionarConvite,
  obterConvites,
  atualizarConvite,
} from '../services/appServices.js';
import ModalEvento from './ModalEvento.js';
import BotaoDeAcao from './BotaoDeAcao.js';
import ModalConvite from './ModalConvite.js';
import AceitarBotao from './AceitarBotao.js';
import RecusarBotao from './RecusarBotao.js';

export default function Painel({ usuario, setUsuario }) {
  const loginToken = Cookies.get('login_token');
  const [eventos, setEventos] = useState([]);
  const [convites, setConvites] = useState([]);
  const [eventoAtual, setEventoAtual] = useState({});
  const [conviteAtual, setConviteAtual] = useState('');
  const [spinnerAtivo, setSpinnerAtivo] = useState(true);
  const [modalEventoAberto, setModalEventoAberto] = useState(false);
  const [modalConviteAberto, setModalConviteAberto] = useState(false);
  const [modo, setModo] = useState('add');
  const [aceitarCarregando, setAceitarCarregando] = useState(false);
  const [recusarCarregando, setRecusarCarregando] = useState(false);
  const [desabilitados, setDesabilitados] = useState(false);

  const aceitarConvite = async (id) => {
    try {
      setAceitarCarregando(true);
      setDesabilitados(true);
      const convite = convites.find((convite) => {
        return convite['_id'].toString() === id;
      });
      for (var i = 0; i < eventos.length; i++) {
        if (convite.descricao === eventos[i].descricao) {
          setAceitarCarregando(false);
          setDesabilitados(false);
          window.alert('Você já possui um evento com essa descrição!');
          return;
        } else if (
          (eventos[i].milissegundosInicio <= convite.milissegundosInicio &&
            convite.milissegundosInicio < eventos[i].milissegundosFim) ||
          (eventos[i].milissegundosInicio < convite.milissegundosFim &&
            convite.milissegundosFim <= eventos[i].milissegundosFim) ||
          (convite.milissegundosInicio <= eventos[i].milissegundosInicio &&
            eventos[i].milissegundosInicio < convite.milissegundosFim) ||
          (convite.milissegundosInicio < eventos[i].milissegundosFim &&
            eventos[i].milissegundosFim <= convite.milissegundosFim)
        ) {
          setAceitarCarregando(false);
          setDesabilitados(false);
          window.alert('Conflito de eventos!');
          return;
        }
      }
      const conviteAtualizado = {
        eventoId: convite.eventoId,
        remetente: convite.remetente,
        destinatario: convite.destinatario,
        descartado: true,
        aceito: true,
      };
      await atualizarConvite(
        convite['_id'].toString(),
        conviteAtualizado,
        loginToken
      );
      setAceitarCarregando(false);
      setDesabilitados(false);
      obterTodosOsEventosEConvites();
    } catch (erro) {
      setAceitarCarregando(false);
      setDesabilitados(false);
      window.alert(erro.message);
      if (
        erro.message === 'Acesso negado!' ||
        erro.message === 'Erro crítico'
      ) {
        Cookies.remove('login_token');
        setUsuario('');
      }
    }
  };

  const recusarConvite = async (id) => {
    try {
      setRecusarCarregando(true);
      setDesabilitados(true);
      const convite = convites.find((convite) => {
        return convite['_id'].toString() === id;
      });
      const conviteAtualizado = {
        eventoId: convite.eventoId,
        remetente: convite.remetente,
        destinatario: convite.destinatario,
        descartado: true,
        aceito: false,
      };
      await atualizarConvite(
        convite['_id'].toString(),
        conviteAtualizado,
        loginToken
      );
      setAceitarCarregando(false);
      setDesabilitados(false);
      obterTodosOsEventosEConvites();
    } catch (erro) {
      setAceitarCarregando(false);
      setDesabilitados(false);
      window.alert(erro.message);
      if (
        erro.message === 'Acesso negado!' ||
        erro.message === 'Erro crítico'
      ) {
        Cookies.remove('login_token');
        setUsuario('');
      }
    }
  };

  const adicionarNovoEvento = () => {
    setModo('add');
    setModalEventoAberto(true);
  };

  const enviarConvite = async (convite) => {
    try {
      await adicionarConvite(convite, loginToken);
      setModalConviteAberto(false);
      window.alert('Convite enviado com sucesso!');
    } catch (erro) {
      setModalConviteAberto(false);
      window.alert(erro.message);
      if (
        erro.message === 'Acesso negado!' ||
        erro.message === 'Erro crítico'
      ) {
        Cookies.remove('login_token');
        setUsuario('');
      }
    }
  };

  const lidarComBotaoDeAcao = (tipo, id) => {
    const eventoEncontrado = eventos.find(
      (evento) => evento['eventoId'] === id
    );
    if (tipo === 'insert_invitation') {
      setConviteAtual(id);
      setModalConviteAberto(true);
    } else if (tipo === 'edit') {
      setModo('edit');
      setEventoAtual(eventoEncontrado);
      setModalEventoAberto(true);
    } else {
      const deletar = async () => {
        try {
          await deletarEvento(eventoEncontrado['_id'].toString(), loginToken);
          setSpinnerAtivo(true);
          obterTodosOsEventosEConvites();
        } catch (erro) {
          window.alert(erro.message);
          if (
            erro.message === 'Acesso negado!' ||
            erro.message === 'Erro crítico'
          ) {
            Cookies.remove('login_token');
            setUsuario('');
          }
        }
      };
      if (window.confirm('Deseja deletar o evento?')) {
        deletar();
      }
    }
  };

  const salvarEvento = async (tipo, evento) => {
    if (tipo === 'add') {
      try {
        await adicionarEvento(evento, loginToken);
        setModalEventoAberto(false);
        setSpinnerAtivo(true);
        obterTodosOsEventosEConvites();
      } catch (erro) {
        setModalEventoAberto(false);
        window.alert(erro.message);
        if (
          erro.message === 'Acesso negado!' ||
          erro.message === 'Erro crítico'
        ) {
          Cookies.remove('login_token');
          setUsuario('');
        }
      }
    } else {
      try {
        const idEvento = eventoAtual['eventoId'];
        await editarEvento(idEvento, evento, loginToken);
        setEventoAtual({});
        setModalEventoAberto(false);
        setSpinnerAtivo(true);
        obterTodosOsEventosEConvites();
      } catch (erro) {
        setModalEventoAberto(false);
        window.alert(erro.message);
        if (
          erro.message === 'Acesso negado!' ||
          erro.message === 'Erro crítico'
        ) {
          Cookies.remove('login_token');
          setUsuario('');
        }
      }
    }
  };

  const fecharModalEvento = () => {
    setModalEventoAberto(false);
  };

  const fecharModalConvite = () => {
    setModalConviteAberto(false);
  };

  const obterTodosOsEventosEConvites = async () => {
    try {
      let conflito = false;
      const eventosDoUsuario = await obterEventos(usuario, loginToken);
      const convites = await obterConvites(usuario, loginToken);
      const eventosNãoCriados = eventosDoUsuario.filter((evento) => {
        return evento.usuarioCriou === false;
      });
      for (var i = 0; i < eventosDoUsuario.length; i++) {
        if (conflito) {
          break;
        }
        if (!eventosDoUsuario[i].usuarioCriou) {
          continue;
        }
        for (var j = 0; j < eventosNãoCriados.length; j++) {
          if (
            (eventosDoUsuario[i].milissegundosInicio <=
              eventosNãoCriados[j].milissegundosInicio &&
              eventosNãoCriados[j].milissegundosInicio <
                eventosDoUsuario[i].milissegundosFim) ||
            (eventosDoUsuario[i].milissegundosInicio <
              eventosNãoCriados[j].milissegundosFim &&
              eventosNãoCriados[j].milissegundosFim <=
                eventosDoUsuario[i].milissegundosFim) ||
            (eventosNãoCriados[j].milissegundosInicio <=
              eventosDoUsuario[i].milissegundosInicio &&
              eventosDoUsuario[i].milissegundosInicio <
                eventosNãoCriados[j].milissegundosFim) ||
            (eventosNãoCriados[j].milissegundosInicio <
              eventosDoUsuario[i].milissegundosFim &&
              eventosDoUsuario[i].milissegundosFim <=
                eventosNãoCriados[j].milissegundosFim)
          ) {
            conflito = true;
            break;
          }
        }
      }
      setEventos(eventosDoUsuario);
      setConvites(convites);
      setSpinnerAtivo(false);
      if (conflito) {
        window.alert(
          'Há conflito entre eventos. Algum evento para o qual você foi convidado pode ter sido alterado. É recomendável eliminar o conflito.'
        );
      }
    } catch (erro) {
      Cookies.remove('login_token');
      setUsuario('');
      window.alert('Erro ao obter os eventos e convites. Você será deslogado.');
    }
  };

  useEffect(() => {
    obterTodosOsEventosEConvites();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="row">
      {spinnerAtivo ? (
        <div className="mx-auto mt-5">
          <div className="spinner-border" role="status"></div>
          <span className="ml-2">Carregando...</span>
        </div>
      ) : (
        <div className="container">
          <div className="row">
            <div className="col-sm-12 col-md-12 col-lg-12 mx-auto">
              <div className="card my-5">
                <div className="card-body">
                  <h5 className="card-title">Eventos</h5>
                  <div className="container">
                    <div className="row mt-4">
                      <button
                        className="btn btn-primary"
                        onClick={adicionarNovoEvento}
                      >
                        Novo evento
                      </button>
                      <div className="container">
                        {eventos.map((evento) => {
                          return (
                            <div
                              key={evento.descricao}
                              className="row mt-3 py-3 borda justify-content-between"
                            >
                              <div className="col-sm-12 col-md-12 col-lg-5 mt-2 mb-2">
                                Descrição:
                                <span className="negrito ml-1">
                                  {evento.descricao}
                                </span>
                              </div>
                              <div className="col-sm-12 col-md-12 col-lg-6 mt-2 mb-2">
                                <div className="container">
                                  <div className="row">
                                    <div>
                                      <div>Inicio:</div>
                                      <div>Fim:</div>
                                    </div>
                                    <div>
                                      <div>
                                        <span className="negrito ml-1">
                                          {evento.dataInicialString +
                                            ' - ' +
                                            evento.horaInicial +
                                            ':' +
                                            evento.minutoInicial}
                                        </span>
                                      </div>
                                      <div>
                                        <span className="negrito ml-1">
                                          {evento.dataFinalString +
                                            ' - ' +
                                            evento.horaFinal +
                                            ':' +
                                            evento.minutoFinal}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="col-sm-12 col-md-12 col-lg-1 mt-2 mb-2">
                                <BotaoDeAcao
                                  lidarComBotaoDeAcao={lidarComBotaoDeAcao}
                                  id={evento['eventoId']}
                                  tipo={'insert_invitation'}
                                ></BotaoDeAcao>
                                {evento.usuarioCriou && (
                                  <BotaoDeAcao
                                    lidarComBotaoDeAcao={lidarComBotaoDeAcao}
                                    id={evento['eventoId']}
                                    tipo={'edit'}
                                  ></BotaoDeAcao>
                                )}
                                <BotaoDeAcao
                                  lidarComBotaoDeAcao={lidarComBotaoDeAcao}
                                  id={evento['eventoId']}
                                  tipo={'delete'}
                                ></BotaoDeAcao>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-sm-12 col-md-12 col-lg-12 mx-auto">
              <div className="card my-5">
                <div className="card-body">
                  <h5 className="card-title">Convites recebidos</h5>
                  <div className="container">
                    {convites.map((convite) => {
                      return (
                        <div
                          key={convite.descricao}
                          className="row mt-3 py-3 borda"
                        >
                          <div className="col-sm-12 col-md-12 col-lg-3 mt-2 mb-2">
                            Remetente:
                            <span className="negrito ml-1">
                              {convite.remetente}
                            </span>
                          </div>
                          <div className="col-sm-12 col-md-12 col-lg-4 mt-2 mb-2">
                            Descrição:
                            <span className="negrito ml-1">
                              {convite.descricao}
                            </span>
                          </div>
                          <div className="col-sm-12 col-md-12 col-lg-4 mt-2 mb-2">
                            <div className="container">
                              <div className="row">
                                <div>
                                  <div>Inicio:</div>
                                  <div>Fim:</div>
                                </div>
                                <div>
                                  <div>
                                    <span className="negrito ml-1">
                                      {convite.dataInicialString +
                                        ' - ' +
                                        convite.horaInicial +
                                        ':' +
                                        convite.minutoInicial}
                                    </span>
                                  </div>
                                  <div>
                                    <span className="negrito ml-1">
                                      {convite.dataFinalString +
                                        ' - ' +
                                        convite.horaFinal +
                                        ':' +
                                        convite.minutoFinal}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="col-sm-12 col-md-12 col-lg-1 mt-2 mb-2">
                            <div>
                              <AceitarBotao
                                id={convite['_id'].toString()}
                                aceitarConvite={aceitarConvite}
                                carregando={aceitarCarregando}
                                desabilitado={desabilitados}
                              ></AceitarBotao>
                            </div>

                            <div className="mt-2">
                              <RecusarBotao
                                id={convite['_id'].toString()}
                                recusarConvite={recusarConvite}
                                carregando={recusarCarregando}
                                desabilitado={desabilitados}
                              ></RecusarBotao>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {modalEventoAberto && (
        <ModalEvento
          eventos={eventos}
          usuario={usuario}
          modo={modo}
          eventoAtual={eventoAtual}
          fecharModal={fecharModalEvento}
          lidarComSalvamento={salvarEvento}
        ></ModalEvento>
      )}
      {modalConviteAberto && (
        <ModalConvite
          usuario={usuario}
          id={conviteAtual}
          fecharModal={fecharModalConvite}
          enviarConvite={enviarConvite}
        ></ModalConvite>
      )}
    </div>
  );
}
