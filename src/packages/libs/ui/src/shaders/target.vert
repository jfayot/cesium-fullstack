attribute vec3 position;
attribute vec2 st;
attribute vec2 offset;

varying vec2 v_st;

void main() {
  v_st = st;
  vec4 centerWC = czm_eyeToWindowCoordinates(czm_view3D * vec4(position, 1.0));
  gl_Position = czm_viewportOrthographic * vec4(centerWC.xy + offset * czm_pixelRatio, 0.0, 1.0);
}
