import React from 'react';
import { Route, Redirect } from 'react-router-dom';

export default function PrivateRoute({
  component: Component,
  path,
  usuario,
  setUsuario,
}) {
  return (
    <Route
      path={path}
      render={(props) =>
        usuario !== '' ? (
          <Component usuario={usuario} setUsuario={setUsuario} />
        ) : (
          <Redirect to="/" />
        )
      }
    />
  );
}
