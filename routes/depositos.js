const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;

// RETORNA TODOS OS DEPOSITOS
router.get('/', (req, res, next) => {

    mysql.getConnection((error, conn) => {

        if (error) {
            return res.status(500).send({ error: error });
        }

        conn.query(
            'SELECT * FROM cad_depositos;',
            (error, result, fields) => {

                conn.release();

                if (error) {
                    return res.status(500).send({ error: error });
                }

                if (result.length == 0) {
                    return res.status(500).send({ mensagem: 'Não existem depositos cadastrados.' });
                }

                const response = {
                    quantidade: result.length,
                    depositos: result.map(deposito => {
                        return {
                            id_deposito: deposito.id_deposito,
                            nome: deposito.nome,
                            endereco: deposito.endereco,
                            telefone: deposito.telefone
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
            'INSERT INTO cad_depositos (nome, endereco, telefone) VALUES (?,?,?)',
            [req.body.nome, req.body.endereco, req.body.telefone],
            (error, result, field) => {
                
                conn.release();

                if (error) {
                    return res.status(500).send({ error: error });
                }

                const response = {
                    mensagem: 'Deposito inserido com sucesso!',
                    deposito: {
                        id_deposito: result.id_deposito,
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

// BUSCA DADOS DE UM DEPOSITO
router.get('/:id_deposito', (req, res, next) => {

    mysql.getConnection((error, conn) => {

        if (error) {
            return res.status(500).send({ error: error });
        }

        conn.query(
            'SELECT * FROM cad_depositos WHERE id_deposito = ?;',
            [req.params.id_deposito],
            (error, result, fields) => {

                conn.release();

                if (error) {
                    return res.status(500).send({ error: error });
                }

                if (result.length == 0) {
                    return res.status(404).send({ mensagem: 'Não foram encontrados depositos com o ID informado.' });
                }

                return res.status(200).send({ response: result });

            }
        );

    });

});

module.exports = router;