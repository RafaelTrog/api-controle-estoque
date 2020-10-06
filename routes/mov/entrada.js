const express = require('express');
const router = express.Router();
const mysql = require('../../mysql').pool;

// LISTA ENTRADAS
router.get('/', (req, res, next) => {

    mysql.getConnection((error, conn) => {

        if (error) {
            return res.status(500).send({ error: error });
        }

        conn.query(
            'SELECT * FROM mov_entrada_saida WHERE tipo = 0;',
            (error, result, fields) => {

                conn.release();

                if (error) {
                    return res.status(500).send({ error: error });
                }

                if (result.length == 0) {
                    return res.status(500).send({ mensagem: 'Não existem registros de entrada.' });
                }

                const response = {
                    quantidade: result.length,
                    entradas: result.map(entrada => {
                        return {
                            id_es: entrada.id_es,
                            numero_nota: entrada.numero_nota,
                            id_produto: entrada.id_produto,
                            preco: entrada.preco,
                            quantidade: entrada.quantidade,
                            data: entrada.data,
                            tipo: entrada.tipo
                        }
                    })
                }

                return res.status(200).send( response );

            }
        );

    });

});

// CRIA NOTA DE ENTRADA
router.post('/', (req, res, next) => {
   
    mysql.getConnection((error, conn) => {

        if (error) {
            return res.status(500).send({ error: error });
        }

        conn.query(
            'INSERT INTO mov_entrada_saida (numero_nota, id_produto, preco, quantidade, tipo) VALUES (?,?,?,?,?)',
            [req.body.numero_nota, req.body.id_produto, req.body.preco, req.body.quantidade, 0],
            (error, result, field) => {
                
                conn.release();

                if (error) {
                    return res.status(500).send({ error: error });
                }

                const response = {
                    mensagem: 'Nota de ENTRADA criada com sucesso!',
                    mov_deposito: {
                        id_es: result.id_es,
                        numero_nota: req.body.numero_nota,
                        id_produto: req.body.id_produto,
                        preco: req.body.preco,
                        quantidade: req.body.quantidade
                    }
                }

                return res.status(201).send( response );

            }
        );

    });

});

module.exports = router;