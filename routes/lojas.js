const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;

// RETORNA TODAS AS LOJAS
router.get('/', (req, res, next) => {

    mysql.getConnection((error, conn) => {

        if (error) {
            return res.status(500).send({ error: error });
        }

        conn.query(
            'SELECT * FROM cad_lojas;',
            (error, result, fields) => {

                conn.release();

                if (error) {
                    return res.status(500).send({ error: error });
                }

                if (result.length == 0) {
                    return res.status(500).send({ mensagem: 'Não existem lojas cadastradas.' });
                }

                const response = {
                    quantidade: result.length,
                    lojas: result.map(loja => {
                        return {
                            id_lojas: loja.id_lojas,
                            nome: loja.nome,
                            endereco: loja.endereco,
                            telefone: loja.telefone
                        }
                    })
                }

                return res.status(200).send( response );

            }
        );

    });

});

// INSERE UMA LOJA
router.post('/', (req, res, next) => {
   
    mysql.getConnection((error, conn) => {

        if (error) {
            return res.status(500).send({ error: error });
        }

        conn.query(
            'INSERT INTO cad_lojas (nome, endereco, telefone) VALUES (?,?,?)',
            [req.body.nome, req.body.endereco, req.body.telefone],
            (error, result, field) => {
                
                conn.release();

                if (error) {
                    return res.status(500).send({ error: error });
                }

                const response = {
                    mensagem: 'Loja inserida com sucesso!',
                    loja: {
                        id_lojas: result.id_lojas,
                        nome: req.body.nome,
                        endereco: req.body.endereco,
                        telefone: req.body.telefone
                    }
                }

                return res.status(201).send( response );

            }
        );

    });

});

// BUSCA DADOS DE UMA LOJA
router.get('/:id_lojas', (req, res, next) => {

    mysql.getConnection((error, conn) => {

        if (error) {
            return res.status(500).send({ error: error });
        }

        conn.query(
            'SELECT * FROM cad_lojas WHERE id_lojas = ?;',
            [req.params.id_lojas],
            (error, result, fields) => {

                conn.release();

                if (error) {
                    return res.status(500).send({ error: error });
                }

                if (result.length == 0) {
                    return res.status(404).send({ mensagem: 'Não foram encontradas lojas com o ID informado.' });
                }

                return res.status(200).send({ response: result });

            }
        );

    });

});

module.exports = router;