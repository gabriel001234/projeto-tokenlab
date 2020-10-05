import React, { useState } from 'react';
import Cookies from 'js-cookie';
import { cadastrarUsuario, login } from '../services/appServices';

export default function Cadastrar(props) {
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [erroUsuario, setErroUsuario] = useState(false);
  const [erroSenha, setErroSenha] = useState(false);
  const [erroSenha2, setErroSenha2] = useState(false);
  const [inputUsuario, setInputUsuario] = useState('');
  const [inputSenha, setInputSenha] = useState('');
  const [inputSenha2, setInputSenha2] = useState('');
  const [erroRequisicao, setErroRequisicao] = useState('');

  const impedirCopiaColagem = (event) => {
    event.preventDefault();
  };

  const lidarComSubmissao = (event) => {
    event.preventDefault();

    const erroInicioUsuario =
      !erroUsuario && (inputUsuario === '' || inputUsuario.trim() === '');

    const erroInicioSenha =
      !erroSenha && (inputSenha === '' || inputSenha.trim() === '');

    const erro =
      erroInicioUsuario ||
      erroInicioSenha ||
      erroUsuario ||
      erroSenha ||
      erroSenha2;

    if (erroInicioUsuario) {
      setErroUsuario(true);
    }

    if (erroInicioSenha) {
      setErroSenha(true);
    }

    if (!erro) {
      const cadastrar = async () => {
        try {
          await cadastrarUsuario(inputUsuario, inputSenha);
          const fazerLogin = await login(inputUsuario, inputSenha);
          Cookies.set('login_token', fazerLogin.data, { expires: 1 / 24 });
          if (erroRequisicao !== '') {
            setErroRequisicao('');
          }
          props.setUsuario(inputUsuario);
        } catch (erro) {
          setErroRequisicao(erro.message);
        }
      };
      cadastrar();
    }
  };

  const lidarComInputUsuario = (event) => {
    setInputUsuario(event.target.value);
    if (
      event.target.value === '' ||
      event.target.value.trim() === '' ||
      event.target.value.indexOf(' ') !== -1
    ) {
      setErroUsuario(true);
    } else if (erroUsuario) {
      setErroUsuario(false);
    }
  };

  const lidarComInputSenha = (event) => {
    setInputSenha(event.target.value);
    if (
      event.target.value === '' ||
      event.target.value.trim() === '' ||
      event.target.value.indexOf(' ') !== -1
    ) {
      setErroSenha(true);
      if (event.target.value === inputSenha2 && erroSenha2) {
        setErroSenha2(false);
      }
    } else {
      if (erroSenha) {
        setErroSenha(false);
      }
      if (event.target.value !== inputSenha2) {
        setErroSenha2(true);
      } else {
        if (erroSenha2) {
          setErroSenha2(false);
        }
      }
    }
  };

  const lidarComInputSenha2 = (event) => {
    setInputSenha2(event.target.value);

    if (event.target.value !== inputSenha) {
      setErroSenha2(true);
    } else {
      if (erroSenha2) {
        setErroSenha2(false);
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
            <h5 className="card-title text-center">Cadastro</h5>
            <form className="form-login" onSubmit={lidarComSubmissao}>
              <div className="container">
                <div className="row justify-content-center mt-2">
                  <input
                    type="text"
                    placeholder="Insira o seu nome de usuário"
                    value={inputUsuario}
                    onChange={lidarComInputUsuario}
                    onPaste={impedirCopiaColagem}
                    onCopy={impedirCopiaColagem}
                    className={
                      'tamanhoInput ' +
                      (erroUsuario ? 'erroInput' : 'caixaInput')
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
                    onPaste={impedirCopiaColagem}
                    onCopy={impedirCopiaColagem}
                    className={
                      'tamanhoInput ' + (erroSenha ? 'erroInput' : 'caixaInput')
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
                <div className="row justify-content-center mt-1">
                  <input
                    type={mostrarSenha ? 'text' : 'password'}
                    placeholder="Insira novamente a sua senha"
                    value={inputSenha2}
                    onChange={lidarComInputSenha2}
                    onPaste={impedirCopiaColagem}
                    onCopy={impedirCopiaColagem}
                    className={
                      'tamanhoInput ' +
                      (erroSenha2 ? 'erroInput' : 'caixaInput')
                    }
                  />
                </div>
                {erroSenha2 && (
                  <div className="row justify-content-center">
                    <span className="tamanhoInput erro">
                      As senhas não coincidem
                    </span>
                  </div>
                )}
                {erroRequisicao && (
                  <div className="row justify-content-center">
                    <span className="tamanhoInput erro">{erroRequisicao}</span>
                  </div>
                )}
                <div className="row justify-content-center">
                  <div className="form-check tamanhoInput">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      checked={mostrarSenha}
                      onChange={lidarComCheckbox}
                      id="checkboxMostrarSenha2"
                    />
                    <label
                      className="form-check-label"
                      htmlFor="checkboxMostrarSenha2"
                    >
                      Mostrar senha
                    </label>
                  </div>
                </div>
                <div className="row justify-content-center mt-4">
                  <button className="btn btn-primary">Cadastrar</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
