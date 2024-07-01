import fs from "fs/promises";
import { Buffer } from 'node:buffer';
import path from 'path';
import multer from 'multer';
import { getBaseUrl } from "@/utils/siteHelpers";

const storageConfig = multer.memoryStorage();

const storage = multer.diskStorage({
  filename: function (req, file, cb) {
    console.log('what is req!!!???? ', req)
    cb(null, file.originalname)
  },
  destination: function (req, file, cb) {
    cb(null, './src/tmp')
    // cb(null, './uploads')
  },
});
const upload = multer({ storage });

export const config = {
  api: {
      bodyParser: false,
      // {
      //     sizeLimit: '100mb' // Set desired value here
      // }
  }
}


export default async function handler(req: any, res: any) {
    // if (req.method !== 'POST') {
    //   res.status(405).send({ message: 'Only POST requests allowed' })
    //   return
    // }
    let newFile: any;
    upload.single('file')(req, res, async (err) => {
      console.log('ummmm req file>???? ', Object.keys(req))

      const data: any = (Object.values(req.body));
    //   const dirRelativeToPublicFolder = './';
    //   const dir = path.resolve('./public/uploads', dirRelativeToPublicFolder);
    // const baseUrl = getBaseUrl();

    const tmpDir = "./src"

    fs.mkdir(`${tmpDir}/tmp`, {recursive: true});
    // .then(()=>{

    // })
    (async () => {
      await fs.appendFile(
        `./src/tmp/${Object.keys(req.body)}`, 
        Buffer.from(new Uint8Array(data))
      )
      console.log('here 2');
    })();
});



    return res.status(200).send({ 'data': newFile });
    // the rest of your code
  }