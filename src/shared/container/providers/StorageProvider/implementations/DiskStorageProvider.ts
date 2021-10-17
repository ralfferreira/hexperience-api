import { injectable, inject } from 'tsyringe';
import storageConfig from '@config/storage';
import fs from 'fs';
import path from 'path';

import IStorageProvider from "../models/IStorageProvider";
import IImageProcessingProvider from '../../ImageProcessingProvider/models/IImageProcessingProvider';

@injectable()
class DiskStorageProvider implements IStorageProvider {
  constructor (
    @inject('ImageProcessingProvider')
    private imageProcessingProvider: IImageProcessingProvider
  ) {}

  public async saveFile(file: string): Promise<string> {
    const filePath = path.resolve(storageConfig.tmpFolder, file);

    const fileName = await this.imageProcessingProvider.compress(filePath)

    return fileName;
  }

  public async deleteFile(file: string): Promise<void> {
    const filePath = path.resolve(storageConfig.uploadsFolder, file);

    try {
      await fs.promises.stat(filePath);
    } catch {
      return;
    }

    await fs.promises.unlink(filePath);
  }
}

export default DiskStorageProvider;
