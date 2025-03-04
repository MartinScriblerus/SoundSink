import { readdirSync } from "fs";
import { join } from "path";
import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    // Path to the subfolder inside the `public` directory
    const directoryPath = join(process.cwd(), "public/static/musicalNotes");

    try {
        // Read files in the directory
        const files = readdirSync(directoryPath);

        // Return file list as JSON
        res.status(200).json(files);
    } catch (error) {
        console.error("Error reading directory:", error);
        res.status(500).json({ error: "Unable to read directory" });
    }
}