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

server.delete('/usuario/:id', async (req, reply) => {
    const id = req.params.id;
    try {
        await pool.query(
            'DELETE FROM USUARIO WHERE ID_USUARIO = $1',
            [id]
        )
        return reply.status(200).send({
            mensagem: 'Sucesso',
        });
    } catch (error) {
        console.error(error);
        return reply.status(500).send({
            mensagem: 'Deu ruim'
        });
    }

})
server.get('/produto', async (req, reply) => {
    try {
        const result = await pool.query('SELECT * FROM produto');

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
server.post('/produto', async (req, reply) => {
    const { nome_pedido, url, descricao, direcionamento } = req.body;

    try {
        const result = await pool.query(
            'INSERT INTO produto (nome_pedido, url, descricao, direcionamento) VALUES ($1, $2, $3, $4) RETURNING *',
            [ nome_pedido, url, descricao, direcionamento]
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

server.post('/login', async (req, reply) => {
    const { email, senha } = req.body;

    try {
        const result = await pool.query(
            'SELECT * FROM usuario WHERE email = $1',
            [email]
        );

        if (result.rows.length === 0) {
            return reply.status(401).send({ mensagem: "Email ou senha inválidos." });
        }

        const user = result.rows[0];

        const senhaCorreta = await bcrypt.compare(senha, user.senha_hash);

        if (!senhaCorreta) {
            return reply.status(401).send({ mensagem: "Email ou senha inválidos." });
        }

        return reply.status(200).send({
            mensagem: "Login realizado com sucesso",
            dados: {
                id: user.id_usuario,
                nome: user.nome,
                email: user.email
            }
        });

    } catch (error) {
        console.error(error);
        return reply.status(500).send({ mensagem: "Erro no servidor." });
    }
});



server.listen({
    port: 3000,
    host: '0.0.0.0'
})