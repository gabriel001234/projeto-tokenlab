import React from 'react';

export default function BotaoDeAcao({ tipo, id, lidarComBotaoDeAcao }) {
  const lidarComClique = () => {
    lidarComBotaoDeAcao(tipo, id);
  };
  return (
    <i className="material-icons cursor-pointer" onClick={lidarComClique}>
      {tipo}
    </i>
  );
}
