import * as Cesium from "cesium";
import { SitacElement } from "./sitacElement";
import frontlineFragment from "../../shaders/frontline.frag?raw";

export class Frontline extends SitacElement {
  private readonly _heightPx = 15;
  private readonly _patternWidthPx = 32;
  private readonly _baseRatio = 0.6;
  private readonly _heightRatio = 0.7;
  private readonly _nearFarScalar = new Cesium.NearFarScalar(
    1000000.0,
    1.0,
    5000000.0,
    0.0
  );
  private readonly _fragmentSource = "Frontline.frag";

  constructor(positions: Array<Cesium.Cartographic>) {
    super(positions);
  }

  public createPrimitives(): Array<any> {
    const primitives = new Array<any>();
    if (!Array.isArray(this._positions)) return primitives;

    if (this._positions.length > 1) {
      for (let i = 0; i < this._positions.length - 1; ++i) {
        const startPos = Cesium.Cartesian3.fromRadians(
          this._positions[i].longitude,
          this._positions[i].latitude,
          this._positions[i].height
        );
        const endPos = Cesium.Cartesian3.fromRadians(
          this._positions[i + 1].longitude,
          this._positions[i + 1].latitude,
          this._positions[i + 1].height
        );
        const primitive = new Cesium.GroundPolylinePrimitive({
          geometryInstances: new Cesium.GeometryInstance({
            geometry: new Cesium.GroundPolylineGeometry({
              positions: [startPos, endPos],
              width: this._heightPx * (1.0 + this._heightRatio),
              //granularity: 0,
            }),
          }),
          appearance: this.getAppearance(startPos, endPos),
          //debugShowBoundingVolume: true,
          //debugShowShadowVolume: true,
        });

        primitives.push(primitive);
      }
    }

    return primitives;
  }

  private getAppearance(
    startPos: Cesium.Cartesian3,
    endPos: Cesium.Cartesian3
  ): Cesium.Appearance {
    return new Cesium.PolylineMaterialAppearance({
      material: new Cesium.Material({
        fabric: {
          materials: {
            frontlineMaterial: {
              uniforms: {
                u_patternWidth: this._patternWidthPx,
                u_baseRatio: this._baseRatio,
                u_heightRatio: this._heightRatio,
                u_nearFarScalar: {
                  x: this._nearFarScalar.near,
                  y: this._nearFarScalar.nearValue,
                  z: this._nearFarScalar.far,
                  w: this._nearFarScalar.farValue,
                },
                u_color: Cesium.Color.RED,
                u_startPos: startPos,
                u_endPos: endPos,
              },
              source: frontlineFragment,
              // Utils.loadText(
              //   this._fragmentSourceDir + this._fragmentSource
              // ),
            },
          },
          components: {
            alpha: "frontlineMaterial.alpha",
            emission: "frontlineMaterial.emission",
          },
        },
      }),
    });
  }
}
