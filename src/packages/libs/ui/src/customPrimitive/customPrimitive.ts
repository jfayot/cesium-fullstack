import * as Cesium from "cesium";

export class CustomPrimitive {
  private commandType;
  private geometry;
  private attributeLocations;
  private primitiveType;
  private uniformMap;
  private vertexShaderSource;
  private fragmentShaderSource;
  private rawRenderState;
  private framebuffer;
  private outputTexture;
  private autoClear;
  private preExecute;
  private show;
  private commandToExecute: any;
  private clearCommand;

  constructor(options: any) {
    this.commandType = options.commandType;

    this.geometry = options.geometry;
    this.attributeLocations = options.attributeLocations;
    this.primitiveType = options.primitiveType;

    this.uniformMap = options.uniformMap;

    this.vertexShaderSource = options.vertexShaderSource;
    this.fragmentShaderSource = options.fragmentShaderSource;

    this.rawRenderState = options.rawRenderState;
    this.framebuffer = options.framebuffer;

    this.outputTexture = options.outputTexture;

    this.autoClear = Cesium.defaultValue(options.autoClear, false);
    this.preExecute = options.preExecute;

    this.show = true;
    this.commandToExecute = undefined;
    this.clearCommand = undefined;
    if (this.autoClear) {
      this.clearCommand = new (<any>Cesium).ClearCommand({
        color: new Cesium.Color(0.0, 0.0, 0.0, 0.0),
        depth: 1.0,
        framebuffer: this.framebuffer,
        pass: (<any>Cesium).Pass.OPAQUE,
      });
    }
  }

  createCommand(context: any) {
    switch (this.commandType) {
      case "Draw": {
        const vertexArray = (<any>Cesium).VertexArray.fromGeometry({
          context: context,
          geometry: this.geometry,
          attributeLocations: this.attributeLocations,
          bufferUsage: (<any>Cesium).BufferUsage.STATIC_DRAW,
        });

        const shaderProgram = (<any>Cesium).ShaderProgram.fromCache({
          context: context,
          attributeLocations: this.attributeLocations,
          vertexShaderSource: this.vertexShaderSource,
          fragmentShaderSource: this.fragmentShaderSource,
        });

        const renderState = (<any>Cesium).RenderState.fromCache(
          this.rawRenderState
        );
        return new (<any>Cesium).DrawCommand({
          owner: this,
          vertexArray: vertexArray,
          primitiveType: this.primitiveType,
          uniformMap: this.uniformMap,
          modelMatrix: Cesium.Matrix4.IDENTITY,
          shaderProgram: shaderProgram,
          framebuffer: this.framebuffer,
          renderState: renderState,
          pass: (<any>Cesium).Pass.OPAQUE,
        });
      }
      case "Compute": {
        return new (<any>Cesium).ComputeCommand({
          owner: this,
          fragmentShaderSource: this.fragmentShaderSource,
          uniformMap: this.uniformMap,
          outputTexture: this.outputTexture,
          persists: true,
        });
      }
    }
  }

  setGeometry(context: any, geometry: any) {
    this.geometry = geometry;
    const vertexArray = (<any>Cesium).VertexArray.fromGeometry({
      context: context,
      geometry: this.geometry,
      attributeLocations: this.attributeLocations,
      bufferUsage: (<any>Cesium).BufferUsage.STATIC_DRAW,
    });
    this.commandToExecute.vertexArray = vertexArray;
  }

  update(frameState: any) {
    if (!this.show) {
      return;
    }

    if (!Cesium.defined(this.commandToExecute)) {
      this.commandToExecute = this.createCommand(frameState.context);
    }

    if (Cesium.defined(this.preExecute)) {
      this.preExecute();
    }

    if (Cesium.defined(this.clearCommand)) {
      frameState.commandList.push(this.clearCommand);
    }
    frameState.commandList.push(this.commandToExecute);
  }

  isDestroyed() {
    return false;
  }

  destroy() {
    if (Cesium.defined(this.commandToExecute)) {
      this.commandToExecute.shaderProgram =
        this.commandToExecute.shaderProgram &&
        this.commandToExecute.shaderProgram.destroy();
    }
    return Cesium.destroyObject(this);
  }
}
