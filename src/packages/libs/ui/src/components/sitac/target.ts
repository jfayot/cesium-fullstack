import * as Cesium from "cesium";
import { SitacElement } from "./sitacElement";
import { CustomPrimitive } from "../../customPrimitive/customPrimitive";
import targetVertex from "../../shaders/target.vert?raw";
import targetFragment from "../../shaders/target.frag?raw";

export class Target extends SitacElement {
  private readonly _base = 20;

  constructor(position: Cesium.Cartographic) {
    super(position);
  }

  public createPrimitives(): Array<any> {
    const primitives = new Array<any>();
    if (Array.isArray(this._positions)) return primitives;
    const center = Cesium.Cartesian3.fromRadians(
      this._positions.longitude,
      this._positions.latitude,
      this._positions.height
    );

    const primitive = new CustomPrimitive({
      commandType: "Draw",
      attributeLocations: {
        position: 0,
        st: 1,
        offset: 2,
      },
      geometry: this.createGeometry(center),
      primitiveType: Cesium.PrimitiveType.TRIANGLES,
      uniformMap: {},
      vertexShaderSource: new (Cesium as any).ShaderSource({
        sources: [
          targetVertex,
          // Utils.loadText(this._fragmentSourceDir + this._vertexSource)
        ],
      }),
      fragmentShaderSource: new (Cesium as any).ShaderSource({
        sources: [
          targetFragment,
          // Utils.loadText(this._fragmentSourceDir + this._fragmentSource),
        ],
      }),
      rawRenderState: (Cesium.Appearance as any).getDefaultRenderState(
        true,
        false,
        undefined
      ),
      //framebuffer: undefined,
      //autoClear: true,
    });

    primitives.push(primitive);

    return primitives;
  }

  private createAttributes(
    center: Cesium.Cartesian3
  ): Cesium.GeometryAttributes {
    const positions = new Float32Array([
      center.x,
      center.y,
      center.z,
      center.x,
      center.y,
      center.z,
      center.x,
      center.y,
      center.z,
      center.x,
      center.y,
      center.z,
    ]);

    const offsets = new Float32Array([
      -this._base,
      -this._base,
      this._base,
      -this._base,
      this._base,
      this._base,
      -this._base,
      this._base,
    ]);

    const sts = new Float32Array([0, 0, 1, 0, 1, 1, 0, 1]);

    const attributes = new Cesium.GeometryAttributes();
    attributes.position = new Cesium.GeometryAttribute({
      componentDatatype: Cesium.ComponentDatatype.FLOAT,
      componentsPerAttribute: 3,
      values: positions,
    });

    attributes.st = new Cesium.GeometryAttribute({
      componentDatatype: Cesium.ComponentDatatype.FLOAT,
      componentsPerAttribute: 2,
      values: sts,
    });

    (attributes as any).offset = new Cesium.GeometryAttribute({
      componentDatatype: Cesium.ComponentDatatype.FLOAT,
      componentsPerAttribute: 2,
      values: offsets,
    });

    return attributes;
  }

  private createGeometry(center: Cesium.Cartesian3): Cesium.Geometry {
    const indices = new Uint16Array([0, 1, 2, 0, 2, 3]);
    const geometry = new Cesium.Geometry({
      attributes: this.createAttributes(center),
      primitiveType: Cesium.PrimitiveType.TRIANGLES,
      indices: indices,
      //boundingSphere: Cesium.BoundingSphere.fromPoints(positions),
    });
    return geometry;
  }
}
