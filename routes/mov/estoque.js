const express = require('express');
const router = express.Router();
const mysql = require('../../mysql').pool;

// LISTA DEPOSITOS E PRODUTOS COM QUANTIDADE
router.get('/', (req, res, next) => {

    mysql.getConnection((error, conn) => {

        if (error) {
            return res.status(500).send({ error: error });
        }

        conn.query(
            'SELECT * FROM mov_estoque;',
            (error, result, fields) => {

                conn.release();

                if (error) {
                    return res.status(500).send({ error: error });
                }

                if (result.length == 0) {
                    return res.status(500).send({ mensagem: 'Não existem registros.' });
                }

                const response = {
                    quantidade: result.length,
                    estoques: result.map(estoque => {
                        return {
                            id_estoque: estoque.id_estoque,
                            id_deposito: estoque.id_deposito,
                            id_produto: estoque.id_produto,
                            quantidade: estoque.quantidade
                        }
                    })
                }

                return res.status(200).send( response );

            }
        );

    });

});

// VINCULA PRODUTO E QTD AO ESTOQUE E LOJA
router.post('/', (req, res, next) => {
   
    mysql.getConnection((error, conn) => {

        if (error) {
            return res.status(500).send({ error: error });
        }

        conn.query(
            'INSERT INTO mov_estoque (id_deposito, id_produto, quantidade) VALUES (?,?,?)',
            [req.body.id_deposito, req.body.id_produto, req.body.quantidade],
            (error, result, field) => {
                
                conn.release();

                if (error) {
                    return res.status(500).send({ error: error });
                }

                const response = {
                    mensagem: 'Vínculo criado com sucesso!',
                    estoque: {
                        id_estoque: result.id_estoque,
                        id_deposito: req.body.id_deposito,
                        id_produto: req.body.id_produto,
                        quantidade: req.body.quantidade
                    }
                }

                return res.status(201).send( response );

            }
        );

    });

});

module.exports = router;