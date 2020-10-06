const express = require('express');
const router = express.Router();
const mysql = require('../../mysql').pool;

// LISTA FORNECEDORES E SEUS PRODUTOS
router.get('/', (req, res, next) => {

    mysql.getConnection((error, conn) => {

        if (error) {
            return res.status(500).send({ error: error });
        }

        conn.query(
            'SELECT * FROM mov_fornecimento;',
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
                    fornecimentos: result.map(fornecimento => {
                        return {
                            id_fornecimento: fornecimento.id_fornecimento,
                            id_fornecedor: fornecimento.id_fornecedor,
                            id_produto: fornecimento.id_produto
                        }
                    })
                }

                return res.status(200).send( response );

            }
        );

    });

});

// VINCULA PRODUTO A FORNECEDOR
router.post('/', (req, res, next) => {
   
    mysql.getConnection((error, conn) => {

        if (error) {
            return res.status(500).send({ error: error });
        }

        conn.query(
            'INSERT INTO mov_fornecimento (id_fornecedor, id_produto) VALUES (?,?)',
            [req.body.id_fornecedor, req.body.id_produto],
            (error, result, field) => {
                
                conn.release();

                if (error) {
                    return res.status(500).send({ error: error });
                }

                const response = {
                    mensagem: 'Vínculo criado com sucesso!',
                    fornecimentos: {
                        id_fornecimento: result.id_fornecimento,
                        id_fornecedor: req.body.id_fornecedor,
                        id_produto: req.body.id_produto
                    }
                }

                return res.status(201).send( response );

            }
        );

    });

});

module.exports = router;