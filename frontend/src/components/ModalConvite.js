import React, { useState } from 'react';
import Modal from 'react-modal';

export default function ModalConvite({
  fecharModal,
  enviarConvite,
  id,
  usuario,
}) {
  const [inputUsuario, setInputUsuario] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');

  const mudarInputUsuario = (event) => {
    setInputUsuario(event.target.value);
    if (erro !== '') {
      setErro('');
    }
  };

  const fechar = () => {
    fecharModal();
  };

  const enviar = () => {
    if (inputUsuario.trim() === '' || inputUsuario.indexOf(' ') !== -1) {
      setErro('Nome inválido!');
    } else if (inputUsuario === usuario) {
      setErro('Não é possível convidar a si mesmo');
    } else {
      const convite = {
        eventoId: id,
        destinatario: inputUsuario,
        remetente: usuario,
        descartado: false,
        aceito: false,
      };
      setCarregando(true);
      enviarConvite(convite);
    }
  };
  return (
    <div>
      <Modal
        className={'ReactModal__Content modal2'}
        overlayClassName={'ReactModal__Overlay'}
        isOpen={true}
      >
        <div className="container px-4 py-2 courier">
          <div className="row align-items-center">
            <h5 className="mr-auto courier fonteMedia">Enviar convite</h5>
            <button
              className="btn btn-danger fontePequena ml-1"
              onClick={fechar}
            >
              X
            </button>
          </div>
          <div className="row mt-2">
            <span style={{ marginRight: '38px' }}>Usuário:</span>
            <input
              type="text"
              value={inputUsuario}
              onChange={mudarInputUsuario}
              className="borda"
            />
          </div>
          {erro !== '' && (
            <div className="row mt-2">
              <span className="erro">{erro}</span>
            </div>
          )}
          <div className="row mt-2">
            <button
              className="btn btn-primary"
              onClick={enviar}
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
