import { Request, Response } from "express";
import axios from "axios";
import { Client } from 'pg';

export default async (req: Request, res: Response) => {
    const client = new Client({
        host: process.env.PGHOST,
        port: Number(process.env.PGPORT),
        user: process.env.PGUSER,
        password: process.env.PGPASSWORD,
        database: process.env.PGDATABASE
    });

    let {
        page
    } = req.body as { page: string };

    const start = Number(page) * 20;

    await client.connect();

    const tableName = 'flatads';

    if (!await tableExists(tableName, client)) {
        return res.status(404).send({ success: false, message: "Table does not exist" });
    }

    const result = await client.query(`SELECT * FROM ${tableName} LIMIT 20 OFFSET ${start};`);
    
    await client.end();

    return res
        .status(200)
        .send({
            success: true,
            ads: result.rows
        })
}

async function tableExists(tableName: string, client: Client): Promise<boolean> {
    try {
        const result = await client.query(`SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = '${tableName}');`);
        return result.rows[0].exists;
    } catch (error) {
        console.error(error);
        return false;
    }
}