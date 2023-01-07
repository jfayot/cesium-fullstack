varying vec2 v_st;

float dotPlot(vec2 st, float radius) {
  return 1.0 - step(radius, length(st - vec2(0.5, 0.4)));
}

float trianglePlot(vec2 st, float base, float height, float width) {
  vec2 offset = vec2((1.0 - base) / 2.0, (1.0 - height) / 2.0);
  float slope = 2.0 * height / base;
  float shiftX = width * sqrt(1.0 + pow(slope, 2.0)) / slope;
  
  float left = step(st.y+shiftX+offset.y, slope*(st.x+shiftX/2.0));
  float right = step(st.y+shiftX+offset.y, -slope*(st.x-shiftX/2.0-1.));
  float bottom = step(offset.y, st.y);
  
  float left2 = 1.0 - step(st.y+shiftX+offset.y, slope*(st.x-shiftX/2.0));
  float right2 = 1.0 - step(st.y+shiftX+offset.y, -slope*(st.x+shiftX/2.0-1.));
  float bottom2 = 1.0 - step(offset.y + width, st.y);

  return left*right*bottom*(left2+right2+bottom2);
}

void main() {
  float alpha = clamp(dotPlot(v_st, 0.1) + trianglePlot(v_st, 1.0, 1.0, 0.1), 0.0, 1.0);
  gl_FragColor = czm_gammaCorrect(vec4(1.0, 0.0, 0.0, alpha));
}
