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
    console.log('req.body: ', req.body)
    const dirRelativeToPublicFolder = './';
    const dirRelativeToFauck = './src/fauck';
    const dirRelativeToUploadedFiles = './src/fauck/uploadedFiles';
    console.log('wtf is path? ', path.dirname(`${dirRelativeToFauck}`));
    const dir = path.resolve('./public', dirRelativeToPublicFolder);
    const faustDir = path.resolve('./public', dirRelativeToFauck);
    const uploadsDir = path.resolve('./public', dirRelativeToUploadedFiles);
    const chuckDir = fs.readdirSync(dir);
    const faustDirRead = fs.readdirSync('./src/fauck');
    const uploadsDirRead = fs.readdirSync('./src/fauck/examples');
    console.log('chuckDir: ', chuckDir);
    console.log('faustDir: ', faustDir);
    console.log('faustDirRead: ', faustDirRead);
    console.log('uploadsDirRead: ', uploadsDirRead);
    const filenames: string[] = fs.readdirSync(dir);
    console.log('filenames: ', filenames); // 'http://localhost:3000'
  
    const chuckFiles: ResponseData = {message: filenames.map(name => path.join('/', dirRelativeToPublicFolder, name))};
    const faustFiles: ResponseData = {message: filenames.map(name => path.join('/', dirRelativeToFauck, name))};
    const uploadedFiles: ResponseData = {message: filenames.map(name => path.join('/', dirRelativeToUploadedFiles, name))};
    const files: ResponseData = {message: [...Object.values(chuckFiles), ...Object.values(faustFiles), ...Object.values(uploadedFiles)].flat()};
    console.log('files: ', files);
    res.statusCode = 200;
    res.json(files);
    res.status(200).json(files);
}