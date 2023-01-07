#ifdef GL_OES_standard_derivatives
#extension GL_OES_standard_derivatives : enable
#endif

uniform float u_patternWidth;
uniform float u_baseRatio;
uniform float u_heightRatio;
uniform vec4 u_nearFarScalar;
uniform vec4 u_color;
uniform vec3 u_startPos;
uniform vec3 u_endPos;

varying vec2 v_st;
varying float v_polylineAngle;

float transparent = 0.0;
float slope = 2.0 * u_heightRatio / (u_baseRatio * (1.0 + u_heightRatio));

mat2 rotate(float rad) {
  float c = cos(rad);
  float s = sin(rad);
  return mat2(
    c, s,
    -s, c
  );
}

czm_material czm_getMaterial(czm_materialInput materialInput) {

  czm_material material = czm_getDefaultMaterial(materialInput);

  vec2 st = materialInput.st;

  float alpha = 1.0;
  vec4 color = u_color;

  vec4 startEC = czm_view3D * vec4(u_startPos.xyz, 1.0);
  vec4 endEC = czm_view3D * vec4(u_endPos.xyz, 1.0);
  vec4 startWC = czm_eyeToWindowCoordinates(startEC);
  vec4 endWC = czm_eyeToWindowCoordinates(endEC);
  vec2 start = rotate(v_polylineAngle) * startWC.xy;
  vec2 end = rotate(v_polylineAngle) * endWC.xy;

  vec2 pos = rotate(v_polylineAngle) * gl_FragCoord.xy;
  vec4 posEC = czm_windowToEyeCoordinates(gl_FragCoord);

  float scale = czm_nearFarScalar(u_nearFarScalar, dot(posEC, posEC));

  float sh = scale * (1.0 - u_heightRatio) / (1.0 + u_heightRatio);
  float sx = 0.5 * (1.0 - sh);

  float shr = scale * u_heightRatio / (1.0 + u_heightRatio);
  float sbr = scale * u_baseRatio;

  float p = (pos.x - start.x) / (u_patternWidth * czm_pixelRatio);
  float x = fract(p);
  float c = floor((end.x - start.x) / (u_patternWidth * czm_pixelRatio));

  float baseStart = abs(fwidth(st.s)) * u_patternWidth * (1.0 - u_baseRatio) * czm_pixelRatio;
  float baseEnd = 1.0 - abs(fwidth(st.s)) * u_patternWidth * czm_pixelRatio;

  float y = st.t - sx - sh;

  if (st.t < sx || st.t > sx + scale) {
    alpha = transparent;
  } else {
    if (((st.s > baseEnd && abs(p) > abs(c)) ||
         (/*st.s < baseStart &&*/ abs(p) < 1.0)) &&
        y > 0.0) {
      alpha = 0.0;
    } else {
      if (y > 0.0) {
        if (x < 0.5 * sbr) {
          if (y > slope * x) {
            alpha = transparent;
          }
        } else if (x < sbr) {
          if (y > shr - slope * (x - 0.5 * sbr)) {
            alpha = transparent;
          }
        } else {
          alpha = transparent;
        }
      }
    }
  }

  vec4 fragColor = vec4(color.rgb, alpha);
  fragColor = czm_gammaCorrect(fragColor);
  material.emission = fragColor.rgb;
  material.alpha = fragColor.a;

  return material;
}
