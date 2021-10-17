import { container } from 'tsyringe';

import IImageProcessingProvider from './models/IImageProcessingProvider';
import SharpImageProcessingProvider from './implementations/SharpImageProcessingProvider';

const providers = {
  sharp: SharpImageProcessingProvider
}

container.registerSingleton<IImageProcessingProvider>(
  'ImageProcessingProvider',
  providers.sharp
)
