import fastify from "fastify";
import pkg from "pg";
import cors from "@fastify/cors";

const { Pool } = pkg;

const pool = new Pool({
    user: 'local',
    host: 'localhost',
    database: 'DropThree',
    password: '123',
    port: '5432'
})

const server = fastify()

server.post('/usuario', async (req, reply) => {
    const { nome, email, telefone, senha_hash} = req.body;

    try {
        const response = await pool.query(
            'INSERT INTO USUARIO ( nome, email, telefone, senha_hash) VALUES ($1, $2, $3, $4) RETURNING *',
            [nome, email, telefone, senha_hash]
        )
        reply.status(200).send(response.rows)
    } catch (e) {
        reply.status(500).send({ error: e.message })
    }
})
server.listen({
    port: 3000,
    host: '0.0.0.0'
})