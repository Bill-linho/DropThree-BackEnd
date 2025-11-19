import Fastify from "fastify";
import pg from "pg";
import cors from "@fastify/cors";

const { Pool } = pkg;

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'DropThree',
    port: '5432'
})

const server = Fastify()

server.get('/usuario')