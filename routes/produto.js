const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;

// RETORNAR TODOS OS PRODUTOS
router.get('/', (req, res, next) => {

    mysql.getConnection((error, conn) => {
        
        if (error) {
            return res.status(500).send({ error: error });
        }

        conn.query(
            'SELECT * FROM cad_produtos;',
            (error, result, fields) => {

                conn.release();

                if (error) {
                    return res.status(500).send({ error: error });
                }

                if (result.length == 0) {
                    return res.status(500).send({ mensagem: 'Não existem produtos cadastrados.'});
                }

                const response = {
                    quantidade: result.length,
                    produtos: result.map(produto => {
                        return {
                            id_produto: produto.id_produto,
                            nome: produto.nome,
                            un_medida: produto.un_medida,
                            preco: produto.preco
                        }
                    })
                }
                
                return res.status(200).send( response );

            }
        );

    });

});

// INSERIR UM PRODUTO
router.post('/', (req, res, next) => {

    mysql.getConnection((error, conn) => {

        if (error) {
            return res.status(500).send({error: error});
        }

        conn.query(

            'INSERT INTO cad_produtos (nome, un_medida, preco) VALUES (?,?,?)',
            [req.body.nome, req.body.un_medida, req.body.preco],
            (error, result, fields) => {

                conn.release();

                if (error) {
                    return res.status(500).send({ error: error });
                }

                const response = {
                    mensagem: 'Produto inserido com sucesso!',
                    produto: {
                        id_produto: result.id_produto,
                        nome: req.body.nome,
                        un_medida: req.body.un_medida,
                        preco: req.body.preco
                    }
                }

                return res.status(201).send( response );

            }
        );

    });

});

// BUSCA DADOS DE UM PRODUTO
router.get('/:id_produto', (req, res, next) => {

    mysql.getConnection((error, conn) => {

        if (error) {
            return res.status(500).send({ error: error });
        }

        conn.query(
            'SELECT * FROM cad_produtos WHERE id_produto = ?;',
            [req.params.id_produto],
            (error, result, fields) => {

                conn.release();

                if (error) {
                    return res.status(500).send({ error: error });
                }

                if (result.length == 0) {
                    return res.status(404).send({ mensagem: 'Não foram encontrados produtos com o ID informado.' });
                }

                return res.status(200).send({ response: result });

            }
        );

    });

});

module.exports = router;