import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import { login } from '../services/appServices';

export default function Home(props) {
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [incorreto, setIncorreto] = useState(false);
  const [erroUsuario, setErroUsuario] = useState(false);
  const [erroSenha, setErroSenha] = useState(false);
  const [inputUsuario, setInputUsuario] = useState('');
  const [inputSenha, setInputSenha] = useState('');

  const lidarComSubmissao = (event) => {
    event.preventDefault();

    const erroInicioUsuario =
      !erroUsuario &&
      (inputUsuario === '' ||
        inputUsuario.trim() === '' ||
        inputUsuario.indexOf(' ') !== -1);

    const erroInicioSenha =
      !erroSenha &&
      (inputSenha === '' ||
        inputSenha.trim() === '' ||
        inputSenha.indexOf(' ') !== -1);

    const erro =
      erroInicioUsuario || erroInicioSenha || erroUsuario || erroSenha;

    if (erroInicioUsuario) {
      setErroUsuario(true);
    }

    if (erroInicioSenha) {
      setErroSenha(true);
    }

    if (!erro) {
      const fazerLogin = async () => {
        try {
          const loginFeito = await login(inputUsuario, inputSenha);
          Cookies.set('login_token', loginFeito.data, { expires: 1 / 24 });
          if (incorreto !== '') {
            setIncorreto('');
          }
          props.setUsuario(inputUsuario);
        } catch (erro) {
          setIncorreto(erro.message);
        }
      };
      fazerLogin();
    }
  };

  const lidarComInputUsuario = (event) => {
    setInputUsuario(event.target.value);

    if (incorreto) {
      setIncorreto(false);
    }

    if (
      event.target.value === '' ||
      event.target.value.trim === '' ||
      event.target.value.indexOf(' ') !== -1
    ) {
      setErroUsuario(true);
    } else {
      if (setErroUsuario) {
        setErroUsuario(false);
      }
    }
  };

  const lidarComInputSenha = (event) => {
    setInputSenha(event.target.value);

    if (incorreto) {
      setIncorreto(false);
    }

    if (
      event.target.value === '' ||
      event.target.value.trim === '' ||
      event.target.value.indexOf(' ') !== -1
    ) {
      setErroSenha(true);
    } else {
      if (setErroSenha) {
        setErroSenha(false);
      }
    }
  };

  const lidarComCheckbox = (event) => {
    setMostrarSenha(event.target.checked);
  };

  return (
    <div className="row">
      <div className="col-sm-9 col-md-7 col-lg-5 mx-auto">
        <div className="card my-5">
          <div className="card-body">
            <h5 className="card-title text-center">
              Faça login para continuar
            </h5>
            <form className="form-login" onSubmit={lidarComSubmissao}>
              <div className="container">
                <div className="row justify-content-center mt-2">
                  <input
                    type="text"
                    placeholder="Insira o seu nome de usuário"
                    value={inputUsuario}
                    onChange={lidarComInputUsuario}
                    className={
                      'tamanhoInput ' +
                      (erroUsuario || incorreto ? 'erroInput' : 'caixaInput')
                    }
                  />
                </div>
                {erroUsuario && (
                  <div className="row justify-content-center">
                    <span className="tamanhoInput erro">
                      Preencha o campo corretamente
                    </span>
                  </div>
                )}
                <div className="row justify-content-center mt-1">
                  <input
                    type={mostrarSenha ? 'text' : 'password'}
                    placeholder="Insira a sua senha"
                    value={inputSenha}
                    onChange={lidarComInputSenha}
                    className={
                      'tamanhoInput ' +
                      (erroSenha || incorreto ? 'erroInput' : 'caixaInput')
                    }
                  />
                </div>
                {erroSenha && (
                  <div className="row justify-content-center">
                    <span className="tamanhoInput erro">
                      Preencha o campo corretamente
                    </span>
                  </div>
                )}
                {incorreto && (
                  <div className="row justify-content-center">
                    <span className="tamanhoInput erro">{incorreto}</span>
                  </div>
                )}
                <div className="row justify-content-center">
                  <div className="form-check tamanhoInput">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      checked={mostrarSenha}
                      onChange={lidarComCheckbox}
                      id="checkboxMostrarSenha"
                    />
                    <label
                      className="form-check-label"
                      htmlFor="checkboxMostrarSenha"
                    >
                      Mostrar senha
                    </label>
                  </div>
                </div>
                <div className="row justify-content-center mt-4">
                  <button className="btn btn-primary">Login</button>
                </div>
                <div className="row justify-content-center mt-4">
                  <Link to="/cadastrar">Novo usuário</Link>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
