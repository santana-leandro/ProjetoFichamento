import iniciar_conexao from '../../banco.js';
import express from "express";
const rota = express.Router();


rota.post('/listar', (req, res) => {
    const conexao = iniciar_conexao();
    conexao.connect((error) => {
        if (error) {
            console.log('Não conectado ao banco');
            console.log(error);
            conexao.end();
            return res.status(500).send('Erro interno');
        }

        console.log('Conectado no banco');
        conexao.query("SELECT usuario from usuario", (error, results) => {
            if (error) {
                console.log("Erro ao consultar dados");
                console.log(error);
                conexao.end();
                res.status(400).send("Dados não localizado.");
            }
    
           console.log("Dados localizados.");
           conexao.end();
           return res.status(200).json(results);
        });
    });
    
});

rota.post('/adicionar', (req, res) => {
    const usuario = req.body;
    const conexao = iniciar_conexao();

    conexao.connect( async (error) => {
        if (error) {
            console.log('Não conectado ao banco');
            conexao.end();
            return res.status(500).send('Erro interno.');
        }
        
        console.log('Conectado no banco');
        const senhaHash = await bcrypt.hash(req.body.senha, 10);
        conexao.query(`INSERT INTO usuario (usuario, senha) VALUES ('${req.body.usuario}','${senhaHash}')`, (error, results) => {
            if (error) {
                console.log('Erro ao inserir dados');
                console.log(error);
                conexao.end();
                return res.status(400).send('Usuario não foi criado.');
            }

            console.log('Dados salvo no banco');
            conexao.end();
            return res.status(201).send(`Usuario ${req.body.usuario} criado.`);
        });

    });
});

export default rota;