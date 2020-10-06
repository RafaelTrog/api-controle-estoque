const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;

// RETORNAR TODOS OS FORNECEDORES
router.get('/', (req, res, next) => {

    mysql.getConnection((error, conn) => {
        
        if (error) {
            return res.status(500).send({ error: error });
        }

        conn.query(
            'SELECT * FROM cad_fornecedores;',
            (error, result, fields) => {

                conn.release();

                if (error) {
                    return res.status(500).send({ error: error });
                }

                if (result.length == 0) {
                    return res.status(500).send({ mensagem: 'Não existem fornecedores cadastrados.'});
                }

                const response = {
                    quantidade: result.length,
                    fornecedores: result.map(fornecedor => {
                        return {
                            id_fornecedor: fornecedor.id_fornecedor,
                            nome: fornecedor.nome,
                            contrato: fornecedor.contrato,
                            telefone: fornecedor.telefone
                        }
                    })
                }
                
                return res.status(200).send( response );

            }
        );

    });

});

// INSERIR UM FORNECEDOR
router.post('/', (req, res, next) => {

    mysql.getConnection((error, conn) => {

        if (error) {
            return res.status(500).send({error: error});
        }

        conn.query(

            'INSERT INTO cad_fornecedores (nome, contrato, telefone) VALUES (?,?,?)',
            [req.body.nome, req.body.contrato, req.body.telefone],
            (error, result, fields) => {

                conn.release();

                if (error) {
                    return res.status(500).send({ error: error });
                }

                const response = {
                    mensagem: 'Fornecedor inserido com sucesso!',
                    fornecedor: {
                        id_fornecedor: result.id_fornecedor,
                        nome: req.body.nome,
                        contrato: req.body.contrato,
                        telefone: req.body.telefone
                    }
                }

                return res.status(201).send( response );

            }
        );

    });

});

// BUSCA DADOS DE UM FORNECEDOR
router.get('/:id_fornecedor', (req, res, next) => {

    mysql.getConnection((error, conn) => {

        if (error) {
            return res.status(500).send({ error: error });
        }

        conn.query(
            'SELECT * FROM cad_fornecedores WHERE id_fornecedor = ?;',
            [req.params.id_fornecedor],
            (error, result, fields) => {

                conn.release();

                if (error) {
                    return res.status(500).send({ error: error });
                }

                if (result.length == 0) {
                    return res.status(404).send({ mensagem: 'Não foram encontrados fornecedores com o ID informado.' });
                }

                return res.status(200).send({ response: result });

            }
        );

    });

});

module.exports = router;