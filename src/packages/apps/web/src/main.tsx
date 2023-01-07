import React from "react";
import ReactDOM from "react-dom";
import { Viewer3D, Frontline, Target } from "@monorepo/ui";
import * as Cesium from "cesium";
import App from "./App";
import { dmsToDd } from "@monorepo/geo";

const viewer3D = new Viewer3D("cesium-root");

const _positions = new Array<Cesium.Cartographic>(
  // Cesium.Cartographic.fromDegrees(dmsToDd(-2.5), dmsToDd(45), 0),
  Cesium.Cartographic.fromDegrees(dmsToDd(-0, -20), dmsToDd(46, 49), 0),
  Cesium.Cartographic.fromDegrees(dmsToDd(-3), dmsToDd(46, 46), 0),
  Cesium.Cartographic.fromDegrees(dmsToDd(-3), dmsToDd(44, 44), 0),
  Cesium.Cartographic.fromDegrees(dmsToDd(-1, -47), dmsToDd(44, 29), 0),
  Cesium.Cartographic.fromDegrees(dmsToDd(-1, -48.353), dmsToDd(43, 40.921), 0),
  Cesium.Cartographic.fromDegrees(dmsToDd(-2, -17.794), dmsToDd(43, 15.245), 0)
);

const elevatedPositions = await Cesium.sampleTerrainMostDetailed(
  viewer3D.getTerrain(),
  _positions
);

const frontline = new Frontline(elevatedPositions);
viewer3D.addSitac([frontline]);

viewer3D.getCamera().flyTo({
  destination: frontline.getBoundingRectangle(),
  duration: 0,
});

const _LEOPARD01 = new Target(
  Cesium.Cartographic.fromDegrees(dmsToDd(0, -53.128), dmsToDd(44, 57.741))
);
viewer3D.addSitac([_LEOPARD01]);

const _05FRXQ001 = new Target(
  Cesium.Cartographic.fromDegrees(dmsToDd(0, -34.19), dmsToDd(44, 19.602))
);
viewer3D.addSitac([_05FRXQ001]);

const _05FRYQ52 = new Target(
  Cesium.Cartographic.fromDegrees(dmsToDd(0, -16.345), dmsToDd(44, 18.043))
);
viewer3D.addSitac([_05FRYQ52]);

// new Frontline(
//   new Array<Cesium.Cartographic>(
//     Cesium.Cartographic.fromDegrees(dmsToDd(0), dmsToDd(46)),
//     Cesium.Cartographic.fromDegrees(dmsToDd(0), dmsToDd(30))
//   )
// ).addTo(viewer3D.getViewer());

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("app-root")
);
