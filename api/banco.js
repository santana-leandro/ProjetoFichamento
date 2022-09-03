import conf from './dados.js';
import mysql from 'mysql2';

const iniciar_conexao = () => { 
    console.log(conf);
    const dados = {
        host: conf.banco.host,
        user: conf.banco.user,
        password: conf.banco.password,
        database: conf.banco.database
    };

    return mysql.createConnection(dados);
};

export default iniciar_conexao;