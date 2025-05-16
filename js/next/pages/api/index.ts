import { Http2ServerRequest } from "http2"

const express = require('express')
const cors = require('cors')

const app = express()
const port = 3000

app.use(cors())
const path = require('path');
const fs = require('fs');

// console.log('dirname: ', __dirname);
// console.log('path: ', path.join(__dirname, '/react/public/uploads'));
  // app.use('/uploads', express.static(__dirname + '/react/public/uploads'));
  // app.use(express.static(path.resolve('./react/public/uploads')));
  // app.use(express.static(__dirname + '/react/public'));

const multer = require('multer')

const storage = multer.diskStorage({
  filename: function (request: Request, file: any, cb: any) {
    cb(null, file.originalname)
  },
  destination: function (request: Request, file: any, cb: any) {
    cb(null, '/uploads')
    // cb(null, './uploads')
  },
})

const upload = multer({ storage })

function readAllFiles(dir: any) {
  const files = fs.readdirSync(dir, { withFileTypes: true });
  const getFilesArr: File[] = [];
  for (const file of files) {
    // if (file.isDirectory()) {
    //   yield* readAllFiles(path.join(dir, file.name));
    // } else {
    //   yield path.join(dir, file.name);
    // }
    if (!getFilesArr.includes(files)) {
      getFilesArr.push(files)
    }
  }
  return getFilesArr;
}

app.get('/', (request: Request, response: any) => {
    alert('hey yooooooooo');
    const allAlreadyUploaded = readAllFiles('/uploads');
    console.log('ALL ALLREADY ', allAlreadyUploaded[0]);
    response.json({'data': allAlreadyUploaded[0]});
});



// app.get('/uploads', (request: any, response: any) => {
//   // return path;
// });

// app.get('/uploads/*', (request: any, response: any) => {
//   console.log(path);
//   // return path;
//   response.send({'data': request.files[0].filename})
// });

app.post('/upload_files', upload.any('file'), (request: any, response: any) => {
    console.log('hey req: ', request);
    response.send({ message: 'Successfully uploaded files', fileName: request.files[0].filename })
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})