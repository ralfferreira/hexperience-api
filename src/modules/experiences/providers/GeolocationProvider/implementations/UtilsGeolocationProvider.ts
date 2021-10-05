import { createLocation, distanceTo } from "geolocation-utils";

import IPointDTO from "@modules/experiences/dtos/IPointDTO";
import IGeolocationProvider from "../models/IGeolocationProvider";

class UtilsGeolocationProvider implements IGeolocationProvider {
  public distanceTo(pointA: IPointDTO, pointB: IPointDTO): number {
    const A = createLocation(pointA.lat, pointA.lon, 'LatLon');
    const B = createLocation(pointB.lat, pointB.lon, 'LatLon');

    const distanceInMeters = distanceTo(A, B);

    return distanceInMeters;
  }
}

export default UtilsGeolocationProvider;
