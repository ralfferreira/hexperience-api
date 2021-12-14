import path from 'path'
import crypto from 'crypto';
import multer, { StorageEngine } from 'multer';

const tmpFolder = path.resolve(__dirname, '..', '..', 'tmp');

interface IStorageConfig {
  driver: 'disk' | 's3',
  tmpFolder: string;
  uploadsFolder: string,
  multer: {
    storage: StorageEngine,
  },
  config: {
    disk: {},
    s3: {
      bucket: string;
    }
  }
}

export default {
  driver: global.env.STORAGE_DRIVER,
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
    disk: {},
    s3: {
      bucket: 'bucket'
    }
  }
} as IStorageConfig;
