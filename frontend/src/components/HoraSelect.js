import React from 'react';

export default function HoraSelect({ value, onValueChange }) {
  const options = [];
  for (var i = 0; i < 24; i++) {
    options.push(i < 10 ? '0' + i.toString() : i.toString());
  }

  const lidarComMudanca = (event) => {
    onValueChange(event.target.value);
  };

  return (
    <div>
      <select value={value} onChange={lidarComMudanca}>
        {options.map((option, index) => {
          return (
            <option key={index} value={option}>
              {option}
            </option>
          );
        })}
      </select>
    </div>
  );
}
