import IPointDTO from "@modules/experiences/dtos/IPointDTO";

export default interface IGeolocationProvider {
  distanceTo(pointA: IPointDTO, pointB: IPointDTO): number;
}
