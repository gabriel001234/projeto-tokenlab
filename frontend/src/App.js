import React, { useState } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from 'react-router-dom';
import { Dimmer } from 'semantic-ui-react';
import Cookies from 'js-cookie';
import jwt from 'jsonwebtoken';

import Home from './components/Home';
import Cadastrar from './components/Cadastrar';
import PrivateRoute from './components/PrivateRoute';
import Painel from './components/Painel';

function App() {
  // Cookies.remove('login_token');
  const cookieAceito = Cookies.get('calendario-cookies-ativos');
  const [dimmerAtivo, setDimmerAtivo] = useState(!cookieAceito);
  const [usuario, setUsuario] = useState('');
  const [primeiroRender, setPrimeiroRender] = useState(true);

  const ativarCookies = () => {
    Cookies.set('calendario-cookies-ativos', 'cookiesAceitos', {
      expires: 3650,
    });
    setDimmerAtivo(false);
  };

  const sair = () => {
    Cookies.remove('login_token');
    setUsuario('');
  };

  if (primeiroRender) {
    try {
      setPrimeiroRender(false);
      const chave2 = 'x6PssKxulb2lFEDmo5Bt';
      const loginToken = Cookies.get('login_token');
      const decodificado = jwt.verify(loginToken, chave2);
      setPrimeiroRender(false);
      setUsuario(decodificado.usuario);
    } catch (erro) {
      Cookies.remove('login_token');
      if (usuario !== '') {
        setUsuario('');
      }
    }
  }

  return (
    <div className="App">
      <Router>
        <Dimmer active={dimmerAtivo}>
          <p>Você deve aceitar os cookies antes de prosseguir</p>
          <button
            type="button"
            className="btn btn-primary"
            onClick={ativarCookies}
          >
            OK
          </button>
        </Dimmer>
        <nav className="navbar navbar-expand-sm navbar-dark bg-dark">
          <span className="navbar-brand">Calendário de eventos</span>
          {usuario !== '' && (
            <ul className="navbar-nav ml-auto">
              <li className="nav-item">
                <span className="text-primary nav-link">{usuario}</span>
              </li>
              <li className="nav-item">
                <span
                  className="text-white nav-link cursor-pointer"
                  onClick={sair}
                >
                  Sair
                </span>
              </li>
            </ul>
          )}
        </nav>
        <div className="container">
          <Switch>
            <Route
              exact
              path="/"
              render={(props) =>
                usuario !== '' ? (
                  <Redirect to="/painel"></Redirect>
                ) : (
                  <Home setUsuario={setUsuario} />
                )
              }
            ></Route>
            <Route
              exact
              path="/cadastrar"
              render={(props) =>
                usuario !== '' ? (
                  <Redirect to="/painel"></Redirect>
                ) : (
                  <Cadastrar setUsuario={setUsuario} />
                )
              }
            ></Route>
            <PrivateRoute
              path="/painel"
              component={Painel}
              usuario={usuario}
              setUsuario={setUsuario}
            />
            <Route path="*">
              <Redirect to="/"></Redirect>
            </Route>
          </Switch>
        </div>
      </Router>
    </div>
  );
}

export default App;
