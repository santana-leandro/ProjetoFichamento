import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import conf from '../dados.js';
import iniciar_conexao from '../banco.js';
import rota_usuario  from './rotas/usuario.js';



//configuração
const app = express();
app.use(express.json());

//verificação do token
const verifyJTW = (req, res, next) => {
    const token = req.headers['x-access-token'];
    if (!token) return res.status(401).send("Sem token");
    jwt.verify(token, conf.cripto.secret, (error, decoded) => {
        if (error) return res.status(500).send("falha na autenticação");
        req.userId = decoded.id;
        next();
    });
}

//login e criação do token
app.post('/login', (req, res) => {
    const conexao = iniciar_conexao();
    let logado = false;
    let token = null;

    conexao.connect((error) => {
        if (error) {
            console.log('Não conectado ao banco');
            console.log(error);
            conexao.end();
            return res.status(500).send('Erro interno');
        }
        console.log('Conectado no banco');
        conexao.query(`SELECT * FROM usuario WHERE usuario = '${req.body.usuario}'`, async (error, results) => {
            if (error) {
                console.log('Erro ao localizar dados');
                conexao.end();

                return res.status(500).json({auth: logado, token: token});
            }
            if (results) {

                if (results.length > 0) {

                    console.log('Usuario encontrado');
                    logado = await bcrypt.compare(req.body.senha, results[0].senha);
                    if(logado){
                        console.log("usuario logado");
                        token = req.headers['x-access-token'];
                        if (!token) {

                            console.log("gerar token");
                            const id = results[0].id_usuario;
                            token = jwt.sign({ id },conf.cripto.secret, {
                                expiresIn: 300
                            });
                        }
                    }
                    if (!logado) {
                        console.log('Usuario não encontrado');
                    } 
                    conexao.end();
                    return res.status(200).json({auth: logado, token: token});
   
                }

                console.log('Dados vazio');
                conexao.end();

                return res.status(404).json({auth: logado, token: token});
            }

        });
    });
});

//logout
app.post('/logout', (req, res) => {
    res.json({auth: false, token: null});
});

//rotas protegidas pelo token
app.use('/usuario', verifyJTW, rota_usuario);



export default app;

