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

    await client.connect();

    const tableName = 'flatads';

    if (!await tableExists(tableName, client)) {
        await client.query(`CREATE TABLE ${tableName} (id SERIAL PRIMARY KEY, locality VARCHAR(255), name VARCHAR(255), price VARCHAR(255), image VARCHAR(255));`);

        const url = "https://www.sreality.cz/api/en/v2/estates?category_main_cb=1&category_type_cb=1&page=1&per_page=500&tms=1679474380583";

        try {
            const response = await axios.get(url)

            for (const estate of response.data._embedded.estates) {
                const insertQuery = {
                    text: 'INSERT INTO flatads (locality, name, price, image) VALUES ($1, $2, $3, $4)',
                    values: [estate.locality, estate.name, estate.price, estate._links.images[0].href]
                };

                await client.query(insertQuery);
            }
        } catch (e) {
            console.error(e)
        }
    }

    const countResult = await client.query(`SELECT COUNT(*) FROM ${tableName};`);

    const result = await client.query(`SELECT * FROM ${tableName} LIMIT 20;`);
    
    await client.end();

    return res
        .status(200)
        .send({
            success: true,
            ads: result.rows,
            maxPages: Math.floor(countResult.rows[0].count / 20)
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