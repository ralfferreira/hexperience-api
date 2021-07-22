import fs from 'fs';

import IStorageProvider from "../models/IStorageProvider";

class DiskStorageProvider {
  public async saveFile(file: string): Promise<string> {
    return '';
  }
}

export default DiskStorageProvider;
