import path from 'path'
import crypto from 'crypto';
import multer, { StorageEngine } from 'multer';

const tmpFolder = path.resolve(__dirname, '..', '..', 'tmp');

interface IUploadConfig {
  driver: 'disk',
  tmpFolder: string;
  uploadsFolder: string,
  multer: {
    storage: StorageEngine,
  },
  config: {
    disk: {}
  }
}

export default {
  driver: 'disk',
  tmpFolder: tmpFolder,
  uploadsFolder: path.resolve(tmpFolder, 'uploads'),
  multer: {
    storage: multer.diskStorage({
      destination: tmpFolder,
      filename(request, file, callback) {
        const fileHash = crypto.randomBytes(10).toString('hex');
        const fileName = `${fileHash}-${file.originalname}`;

        return callback(null, fileName);
      }
    })
  },
  config: {
    disk: {}
  }
} as IUploadConfig;