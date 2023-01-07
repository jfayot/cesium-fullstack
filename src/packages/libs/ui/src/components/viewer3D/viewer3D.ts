import * as Cesium from "cesium";
import { SitacElement } from "../sitac/sitacElement";

import classes from "./viewer3D.module.css";

export class Viewer3D {
  private _map!: Cesium.Viewer;
  private _scene!: Cesium.Scene;
  private _camera!: Cesium.Camera;

  private readonly _imageryProvider = new Cesium.ArcGisMapServerImageryProvider(
    {
      url: "https://services.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer",
    }
  );

  private readonly _terrainProvider = Cesium.createWorldTerrain();

  public getViewer(): Cesium.Viewer {
    return this._map;
  }
  public getScene(): Cesium.Scene {
    return this._scene;
  }
  public getTerrain(): Cesium.TerrainProvider {
    return this._terrainProvider;
  }
  public getCamera(): Cesium.Camera {
    return this._camera;
  }

  public constructor(rootNodeId: string) {
    this._map = new Cesium.Viewer(rootNodeId, {
      imageryProvider: this._imageryProvider,
      //terrainProvider: this._terrainProvider,
      timeline: false, // Bottom timeline
      animation: false, // Bottom left Play/pause controls
      //baseLayerPicker: false, // Top right layer picker button
      homeButton: false, // Top right home button
      navigationHelpButton: false, // Top right help button
      //fullscreenButton: false, // Bottom right full screen button
      //sceneModePicker: false, // Top right 3D/2D button
      projectionPicker: false, // Top right projection button
      //geocoder: false, // Top right search button
      //infoBox: false,
      scene3DOnly: true,
    });

    if (this._map) {
      this._camera = this._map.camera;
      this._scene = this._map.scene;
      this._map.container?.classList.add(classes["cesium-root"]);
      this._map.bottomContainer.classList.add(classes["cesium-bottom"]);
      this._scene.postProcessStages.fxaa.enabled = true; // Improves antialiasing
      //this._scene.postProcessStages.bloom.enabled = true;
      // this._scene.imageryLayers.addImageryProvider(
      //   new Cesium.ArcGisMapServerImageryProvider({
      //     url: "https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer",
      //   })
      // ).alpha = 0.5;
    }
  }

  public addSitac(sitacElements: Array<SitacElement>) {
    sitacElements.forEach((element) => {
      element.createPrimitives().forEach((primitive) => {
        this._scene.groundPrimitives.add(primitive);
      });
    });
  }
}
