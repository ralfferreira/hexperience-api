import fs from 'fs';
import path from 'path';
import mime from 'mime';
import aws, { S3 } from 'aws-sdk';
import storageConfig from "@config/storage";
import { inject, injectable } from 'tsyringe';

import IStorageProvider from "../models/IStorageProvider";
import IImageProcessingProvider from '../../ImageProcessingProvider/models/IImageProcessingProvider';

class S3StorageProvider implements IStorageProvider {
  private client: S3;

  constructor (
    @inject('ImageProcessingProvider')
    private imageProcessingProvider: IImageProcessingProvider
  ) {
    this.client = new aws.S3();
  }

  public async saveFile(file: string): Promise<string> {
    const originalPath = path.resolve(storageConfig.tmpFolder, file);

    const compressed = await this.imageProcessingProvider.compress(originalPath);

    const newPath = path.resolve(storageConfig.uploadsFolder, compressed);

    const contentType = mime.lookup(newPath);

    if (!contentType) {
      throw new Error('ContentType does not exists');
    }

    const fileContent = await fs.promises.readFile(newPath);

    await this.client.putObject({
      Bucket: storageConfig.config.s3.bucket,
      Key: file,
      ACL: 'public-read',
      Body: fileContent,
      ContentType: contentType,
    }).promise();

    await fs.promises.unlink(newPath);

    return compressed;
  }

  public async deleteFile(file: string): Promise<void> {
    await this.client.deleteObject({
      Bucket: storageConfig.config.s3.bucket,
      Key: file,
    }).promise();
  }
}

export default S3StorageProvider;
