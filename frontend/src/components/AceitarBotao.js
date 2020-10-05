import React from 'react';

export default function AceitarBotao({
  aceitarConvite,
  id,
  carregando,
  desabilitado,
}) {
  const aceitar = () => {
    aceitarConvite(id);
  };
  return (
    <button
      className="btn btn-primary botaoPequeno"
      onClick={aceitar}
      disabled={desabilitado}
    >
      {carregando ? (
        <span
          className="spinner-border spinner-border-sm"
          role="status"
          aria-hidden="true"
        ></span>
      ) : (
        <span>Sim</span>
      )}
    </button>
  );
}
