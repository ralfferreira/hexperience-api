import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import storageConfig from '@config/storage';

import IImageProcessingProvider from "../models/IImageProcessingProvider";

class SharpImageProcessingProvider implements IImageProcessingProvider {
  public async compress(filePath: string): Promise<string> {
    const fileContent = await fs.promises.readFile(filePath);
    const fileName = path.basename(filePath);

    const newFileName = `${fileName}.webp`;

    const newPath = path.resolve(storageConfig.uploadsFolder, newFileName);

    await sharp(fileContent).webp({ quality: 40 }).toFile(newPath);

    return newFileName;
  }
}

export default SharpImageProcessingProvider;
