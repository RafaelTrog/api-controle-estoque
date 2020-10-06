const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const rotaProduto = require('./routes/produto');
const rotaLojas = require('./routes/lojas');
const rotaDepositos = require('./routes/depositos');
const rotaFornecedores = require('./routes/fornecedores');

const rotaMovEstoque = require('./routes/mov/estoque');
const rotaMovFornecimento = require('./routes/mov/fornecimento');
const rotaMovDeposito = require('./routes/mov/deposito');
const rotaMovEntrada = require('./routes/mov/entrada');
const rotaMovSaida = require('./routes/mov/saida');

app.use(bodyParser.urlencoded({ extended: false })); // APENAS DADOS SIMPLES
app.use(bodyParser.json()); // APENAS JSON DE ENTRADA NO BODY

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
        'Access-Control-Allow-Header',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );

    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).send({});
    }

    next();
});

app.use('/produto', rotaProduto);
app.use('/lojas', rotaLojas);
app.use('/depositos', rotaDepositos);
app.use('/fornecedores', rotaFornecedores);

app.use('/mov/estoque', rotaMovEstoque);
app.use('/mov/fornecimento', rotaMovFornecimento);
app.use('/mov/deposito', rotaMovDeposito);
app.use('/mov/entrada', rotaMovEntrada);
app.use('/mov/saida', rotaMovSaida);

// QUANDO NÃO ENCONTRA ROTA, ENTRA AQUI
app.use((req, res, next) => {
    const erro = new Error('Não encontrado!');
    erro.status = 404;
    next(erro);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    return res.send({
        erro: {
            mensagem: error.message
        }
    });
});

module.exports = app;