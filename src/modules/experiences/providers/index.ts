import { container } from "tsyringe";

import IGeolocationProvider from "./GeolocationProvider/models/IGeolocationProvider";
import UtilsGeolocationProvider from "./GeolocationProvider/implementations/UtilsGeolocationProvider";

const providers = {
  Utils: UtilsGeolocationProvider,
};

container.registerSingleton<IGeolocationProvider>(
  'GeolocationProvider',
  providers.Utils
);
