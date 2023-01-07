import * as Cesium from "cesium";

export type Positions = Cesium.Cartographic | Array<Cesium.Cartographic>;

export abstract class SitacElement {
  protected _positions: Positions;
  protected _fragmentSourceDir = "./src/Components/Viewer3D/Sitac/";

  public constructor(positions: Positions) {
    this._positions = positions;
  }

  abstract createPrimitives(): Array<any>;

  public getBoundingRectangle(): Cesium.Rectangle {
    const longitudes = Array.isArray(this._positions)
      ? this._positions.map((position) => position.longitude)
      : [this._positions.longitude];
    const latitudes = Array.isArray(this._positions)
      ? this._positions.map((position) => position.latitude)
      : [this._positions.latitude];
    return new Cesium.Rectangle(
      Math.min(...longitudes),
      Math.min(...latitudes) - 0.01,
      Math.max(...longitudes),
      Math.max(...latitudes) + 0.01
    );
  }

  public addTo(map: Cesium.Viewer) {
    this.createPrimitives().forEach((primitive) => {
      map?.scene.groundPrimitives.add(primitive);
    });
  }
}
