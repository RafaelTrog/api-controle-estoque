const express = require('express');
const router = express.Router();
const mysql = require('../../mysql').pool;

// LISTA QUAL DEPOSITO É DE QUAL LOJA E VICE VERSA
router.get('/', (req, res, next) => {

    mysql.getConnection((error, conn) => {

        if (error) {
            return res.status(500).send({ error: error });
        }

        conn.query(
            'SELECT * FROM mov_deposito;',
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
                    mov_depositos: result.map(mov_deposito => {
                        return {
                            id_mov_deposito: mov_deposito.id_mov_deposito,
                            id_loja: mov_deposito.id_loja,
                            id_deposito: mov_deposito.id_deposito
                        }
                    })
                }

                return res.status(200).send( response );

            }
        );

    });

});

// VINCULA DEPOSITO E LOJA
router.post('/', (req, res, next) => {
   
    mysql.getConnection((error, conn) => {

        if (error) {
            return res.status(500).send({ error: error });
        }

        conn.query(
            'INSERT INTO mov_deposito (id_loja, id_deposito) VALUES (?,?)',
            [req.body.id_loja, req.body.id_deposito],
            (error, result, field) => {
                
                conn.release();

                if (error) {
                    return res.status(500).send({ error: error });
                }

                const response = {
                    mensagem: 'Vínculo criado com sucesso!',
                    mov_deposito: {
                        id_mov_deposito: result.id_mov_deposito,
                        id_loja: req.body.id_loja,
                        id_deposito: req.body.id_deposito
                    }
                }

                return res.status(201).send( response );

            }
        );

    });

});

module.exports = router;