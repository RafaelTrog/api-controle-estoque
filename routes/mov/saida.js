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
            'SELECT * FROM mov_entrada_saida WHERE tipo = 1;',
            (error, result, fields) => {

                conn.release();

                if (error) {
                    return res.status(500).send({ error: error });
                }

                if (result.length == 0) {
                    return res.status(500).send({ mensagem: 'Não existem registros de saida.' });
                }

                const response = {
                    quantidade: result.length,
                    saidas: result.map(saida => {
                        return {
                            id_es: saida.id_es,
                            numero_nota: saida.numero_nota,
                            id_produto: saida.id_produto,
                            preco: saida.preco,
                            quantidade: saida.quantidade,
                            data: saida.data,
                            tipo: saida.tipo
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
            [req.body.numero_nota, req.body.id_produto, req.body.preco, req.body.quantidade, 1],
            (error, result, field) => {
                
                conn.release();

                if (error) {
                    return res.status(500).send({ error: error });
                }

                const response = {
                    mensagem: 'Nota de SAIDA criada com sucesso!',
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