import React from 'react';

export default function RecusarBotao({
  recusarConvite,
  id,
  carregando,
  desabilitado,
}) {
  const recusar = () => {
    recusarConvite(id);
  };
  return (
    <button
      className="btn btn-danger botaoPequeno"
      onClick={recusar}
      disabled={desabilitado}
    >
      {carregando ? (
        <span
          className="spinner-border spinner-border-sm"
          role="status"
          aria-hidden="true"
        ></span>
      ) : (
        <span>Não</span>
      )}
    </button>
  );
}
