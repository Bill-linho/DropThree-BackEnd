import fastify from "fastify";
import pkg from "pg";
import cors from "@fastify/cors";
import bcrypt from "bcrypt";

const { Pool } = pkg;

const pool = new Pool({
    user: 'local',
    host: 'localhost',
    database: 'DropThree',
    password: '12345',
    port: '5432'
})

const server = fastify()

await server.register(cors, {
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE']
})

server.get('/usuario', async (req, reply) => {
    try {
        const result = await pool.query('SELECT * FROM usuario');

        return reply.status(200).send({
            mensagem: 'Sucesso',
            dados: result.rows
        });

    } catch (error) {
        console.error(error);
        return reply.status(500).send({
            mensagem: 'Deu ruim'
        });
    }
});

server.post('/usuario', async (req, reply) => {
    const { nome, email, telefone, senha } = req.body;

    try {
        // 🔐 Gerar hash da senha
        const senha_hash = await bcrypt.hash(senha, 10);

        const result = await pool.query(
            'INSERT INTO USUARIO (nome, email, telefone, senha_hash) VALUES ($1, $2, $3, $4) RETURNING *',
            [nome, email, telefone, senha_hash]
        );

        return reply.status(200).send({
            mensagem: 'Sucesso',
            dados: result.rows
        });
    } catch (error) {
        console.error(error);
        return reply.status(500).send({
            mensagem: 'Deu ruim'
        });
    }
});

server.listen({
    port: 3000,
    host: '0.0.0.0'
})