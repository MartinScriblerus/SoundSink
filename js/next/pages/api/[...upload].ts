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
      // console.log(Object.values(req.body));
      console.log('WHAT IS REQ BODY KEYS>? ', Object.keys(req.body));
      console.log('WHAT IS REQ>? ', Object.values(req));

      const data: any = (Object.values(req.body));
    //   const dirRelativeToPublicFolder = './';
    //   const dir = path.resolve('./public/uploads', dirRelativeToPublicFolder);
    // const baseUrl = getBaseUrl();

    const tmpDir = "./src"

    fs.mkdir(`${tmpDir}/tmp`, {recursive: true});
    // .then(()=>{

    // })
    (async () => {
      // newFile = await fs.writeFile(
      //   `./src/tmp/${Object.keys(req.body)}`, 
      //   Buffer.from(new Uint8Array(data)),
      //   'utf8',
      //   // (data: any, err: any) => console.log('errrrr is ', err)
      // );
      console.log('here 1 ');

      await fs.appendFile(
        `./src/tmp/${Object.keys(req.body)}`, 
        Buffer.from(new Uint8Array(data))
      )
      console.log('here 2');
    })();
});



      
    // });

    // fs.appendFile(`/tmp/${Object.keys(req.body)}`, data, () => {})
      // if (newFile) {
      //   console.log('WTF NEWFILE? ', newFile);
      //   await fs.appendFile(newFile.path, data, (err: any) => {
      //     if (err) {
      //       throw(err);
      //     }
      // })
      // }
        //
      // console.log('YAY1 ', req.body.get(0))
      // console.log('YAY2 ', req.body.get(1))
    // })
    // console.log('in H A N D L E R => ', req.body);

    // console.log('am i sane? ', req.body.get(0), req.body.get(1));
  // console.log('SANITY???? ', dir + '/' + Object.keys(req.body));
  // console.log('SANITY222 ???? ', dir + '/' + Object.keys(req));
  // console.log('SANITYTHIS SUX NAME ', req.body.fileData.name);



    // console.log('filenames: ', filenames); // 'http://localhost:3000'
  // const dataString = new TextDecoder().decode(req.body.fileData);
  // const buffer = req.body.fileData;
  // const arrayBuffer = new ArrayBuffer(buffer.length);
  // const view = new Uint8Array(arrayBuffer);
  // for (let i = 0; i < buffer.length; ++i) {
  //   view[i] = buffer[i];
  // }
  // 4. Write the file!

  
  // await fs.createReadStream(`${Object.keys(req.body)}`);
  // const data: any = Object.values(req.body).toString();
  // await fs.writeFileSync(`${Object.keys(req.body)}`, data, {encoding: 'utf-8'}).then((x: any) => console.log('WTF?!?!? ', x))

  //   // not needed in NextJS v12+
    // const body = req.body;
    // console.log('WHAT THE FUCK IS BODY ', body);
    // return body;
    return res.status(200).send({ 'data': newFile });
    // the rest of your code
  }