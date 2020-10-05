import React, { useState } from 'react';
import Modal from 'react-modal';
import HoraSelect from './HoraSelect';
import MinutoSelect from './MinutoSelect';

Modal.setAppElement('#root');

export default function ModalEvento({
  eventos,
  usuario,
  modo,
  fecharModal,
  eventoAtual,
  lidarComSalvamento,
}) {
  const hoje = new Date();
  const ano = hoje.getFullYear().toString();
  let mes = hoje.getMonth() + 1;
  mes = mes < 10 ? '0' + mes.toString() : mes;
  let dia = hoje.getDate();
  dia = dia < 10 ? '0' + dia.toString() : dia;
  const data = ano + '-' + mes + '-' + dia;

  const [inputDescricao, setInputDescricao] = useState(
    modo === 'edit' ? eventoAtual.descricao : ''
  );
  const [inputDataInicial, setInputDataInicial] = useState(
    modo === 'edit' ? eventoAtual.dataInicialInputString : data
  );
  const [inputDataFinal, setInputDataFinal] = useState(
    modo === 'edit' ? eventoAtual.dataFinalInputString : data
  );
  const [inputHoraInicial, setInputHoraInicial] = useState(
    modo === 'edit' ? eventoAtual.horaInicial : '00'
  );
  const [inputHoraFinal, setInputHoraFinal] = useState(
    modo === 'edit' ? eventoAtual.horaFinal : '00'
  );
  const [inputMinutoInicial, setInputMinutoInicial] = useState(
    modo === 'edit' ? eventoAtual.minutoInicial : '00'
  );
  const [inputMinutoFinal, setInputMinutoFinal] = useState(
    modo === 'edit' ? eventoAtual.minutoFinal : '00'
  );
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  const mudarDescricao = (event) => {
    if (erro !== '') {
      setErro('');
    }
    setInputDescricao(event.target.value);
  };

  const mudarDataInicial = (event) => {
    if (erro !== '') {
      setErro('');
    }
    setInputDataInicial(event.target.value);
  };

  const mudarDataFinal = (event) => {
    if (erro !== '') {
      setErro('');
    }
    setInputDataFinal(event.target.value);
  };

  const mudarHoraInicial = (value) => {
    if (erro !== '') {
      setErro('');
    }
    setInputHoraInicial(value);
  };

  const mudarHoraFinal = (value) => {
    if (erro !== '') {
      setErro('');
    }
    setInputHoraFinal(value);
  };

  const mudarMinutoInicial = (value) => {
    if (erro !== '') {
      setErro('');
    }
    setInputMinutoInicial(value);
  };

  const mudarMinutoFinal = (value) => {
    if (erro !== '') {
      setErro('');
    }
    setInputMinutoFinal(value);
  };

  const salvar = () => {
    const dataHoje = new Date();
    const milissegundosHoje = dataHoje.getTime();
    const offset = dataHoje.getTimezoneOffset();
    const arrayDataInicial = inputDataInicial.split('-');
    const arrayDataFinal = inputDataFinal.split('-');
    const dataInputInicial = new Date(
      parseInt(arrayDataInicial[0]),
      parseInt(arrayDataInicial[1] - 1),
      parseInt(arrayDataInicial[2]),
      parseInt(inputHoraInicial),
      parseInt(inputMinutoInicial)
    );
    const milissegundosInicio = dataInputInicial.getTime();
    const dataInputFinal = new Date(
      parseInt(arrayDataFinal[0]),
      parseInt(arrayDataFinal[1] - 1),
      parseInt(arrayDataFinal[2]),
      parseInt(inputHoraFinal),
      parseInt(inputMinutoFinal)
    );
    const milissegundosFim = dataInputFinal.getTime();
    if (inputDescricao.trim() === '') {
      setErro('Descrição inválida');
    } else if (
      milissegundosInicio < milissegundosHoje ||
      inputDataInicial === ''
    ) {
      setErro('Data/Hora iniciais inválidos!');
    } else if (
      milissegundosFim < milissegundosHoje ||
      milissegundosFim < milissegundosInicio ||
      inputDataFinal === ''
    ) {
      setErro('Data/Hora finais inválidos!');
    } else if (milissegundosInicio === milissegundosFim) {
      setErro('O início e o fim do evento não podem ser iguais!');
    } else {
      setCarregando(true);
      for (var i = 0; i < eventos.length; i++) {
        if (
          typeof eventoAtual['eventoId'] !== 'undefined' &&
          eventoAtual['eventoId'].toString() ===
            eventos[i]['eventoId'].toString()
        ) {
          continue;
        }
        if (inputDescricao === eventos[i].descricao) {
          setCarregando(false);
          setErro('Você já possui um evento com a descrição informada!');
          return;
        } else if (
          (eventos[i].milissegundosInicio <= milissegundosInicio &&
            milissegundosInicio < eventos[i].milissegundosFim) ||
          (eventos[i].milissegundosInicio < milissegundosFim &&
            milissegundosFim <= eventos[i].milissegundosFim) ||
          (milissegundosInicio <= eventos[i].milissegundosInicio &&
            eventos[i].milissegundosInicio < milissegundosFim) ||
          (milissegundosInicio < eventos[i].milissegundosFim &&
            eventos[i].milissegundosFim <= milissegundosFim)
        ) {
          setCarregando(false);
          setErro('Conflito de eventos!');
          return;
        }
      }
      const evento = {
        criador: usuario,
        descricao: inputDescricao,
        milissegundosInicio,
        dataInicio: dataInputInicial,
        dataInicialString:
          arrayDataInicial[2] +
          '/' +
          arrayDataInicial[1] +
          '/' +
          arrayDataInicial[0],
        dataInicialInputString: inputDataInicial,
        horaInicial: inputHoraInicial,
        minutoInicial: inputMinutoInicial,
        milissegundosFim,
        dataFim: dataInputFinal,
        dataFinalString:
          arrayDataFinal[2] + '/' + arrayDataFinal[1] + '/' + arrayDataFinal[0],
        dataFinalInputString: inputDataFinal,
        horaFinal: inputHoraFinal,
        minutoFinal: inputMinutoFinal,
        offset: offset * 60000,
      };
      setCarregando(true);
      lidarComSalvamento(modo, evento);
    }
  };

  const fechar = () => {
    fecharModal();
  };

  return (
    <div>
      <Modal
        className={'ReactModal__Content modal1'}
        overlayClassName={'ReactModal__Overlay'}
        isOpen={true}
      >
        <div className="container px-4 py-2 courier">
          <div className="row align-items-center">
            <h5 className="mr-auto courier fonteMedia">
              {modo === 'add' ? 'Novo evento' : 'Editar evento'}
            </h5>
            <button
              className="btn btn-danger fontePequena ml-1"
              onClick={fechar}
            >
              X
            </button>
          </div>
          <div className="row mt-2">
            <span style={{ marginRight: '38px' }}>Descrição:</span>
            <input
              type="text"
              value={inputDescricao}
              onChange={mudarDescricao}
              className="borda"
            />
          </div>
          <div className="row mt-2">
            <span style={{ marginRight: '19px' }}>Data Inicial:</span>
            <input
              type="date"
              value={inputDataInicial}
              onChange={mudarDataInicial}
              className="borda"
            />
          </div>
          <div className="row mt-2">
            <span style={{ marginRight: '32px' }}>Data Final:</span>
            <input
              type="date"
              value={inputDataFinal}
              onChange={mudarDataFinal}
              className="borda"
            />
          </div>
          <div className="row mt-2">
            <span style={{ marginRight: '19px' }}>Hora Inicial:</span>
            <HoraSelect
              value={inputHoraInicial}
              onValueChange={mudarHoraInicial}
            ></HoraSelect>
          </div>
          <div className="row mt-2">
            <span style={{ marginRight: '32px' }}>Hora Final:</span>
            <HoraSelect
              value={inputHoraFinal}
              onValueChange={mudarHoraFinal}
            ></HoraSelect>
          </div>
          <div className="row mt-2">
            <span style={{ marginRight: '5px' }}>Minuto Inicial:</span>
            <MinutoSelect
              value={inputMinutoInicial}
              onValueChange={mudarMinutoInicial}
            ></MinutoSelect>
          </div>
          <div className="row mt-2">
            <span style={{ marginRight: '18px' }}>Minuto Final:</span>
            <MinutoSelect
              value={inputMinutoFinal}
              onValueChange={mudarMinutoFinal}
            ></MinutoSelect>
          </div>
          {erro !== '' && (
            <div className="row mt-2">
              <span className="erro">{erro}</span>
            </div>
          )}
          <div className="row mt-2">
            <button
              className="btn btn-primary"
              onClick={salvar}
              disabled={carregando}
            >
              {carregando ? <span>Aguarde...</span> : <span>Salvar</span>}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
