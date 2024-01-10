import type { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs';
import path from 'path';


type ResponseData = {
  message?: string[]
}
 
export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
    const dirRelativeToPublicFolder = './';
    const dir = path.resolve('./public', dirRelativeToPublicFolder);
    const filenames: string[] = fs.readdirSync(dir);
    console.log('filenames: ', filenames); // 'http://localhost:3000'
  
    const files: ResponseData = {message: filenames.map(name => path.join('/', dirRelativeToPublicFolder, name))};
    if (!files) {
      return res.status(404);
    }
    console.log('files: ', files);
    res.statusCode = 200;
    res.json(files);
    res.status(200).json(files);
}