console.log('Script main.js foi carregado.');

document.addEventListener('DOMContentLoaded', () => {
    const btn = document.querySelector('#btn-prin')

    btn.addEventListener('click', () => {
        location.reload();
    });
});

import Login from './modules/Login';

const cadastro = new Login('.form-cadastro');
const login = new Login('.form-login');

login.init();
cadastro.init();