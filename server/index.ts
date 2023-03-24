import express, { Request, Response } from "express";
import path from "path";

import scrape from "./scrape/scrape";
import ads from "./ads/ads";

const PORT = 4000;

const app = express();

app.use(express.json());

app.get("/scrape", (req: Request, res: Response) => { scrape(req, res) });
app.post("/ads", (req: Request, res: Response) => { ads(req, res) });

app.use(express.static(path.join(__dirname, "../public")));

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});