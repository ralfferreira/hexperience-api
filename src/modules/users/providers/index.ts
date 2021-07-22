import { container } from "tsyringe";

import IHashProvider from "./HashProvider/models/IHashProvider";
import BCryptHashProvider from "./HashProvider/implementations/BCryptHashProvider";

const providers = {
  BCrypt: BCryptHashProvider,
}

container.registerSingleton<IHashProvider>(
  'HashProvider',
  providers.BCrypt
)
