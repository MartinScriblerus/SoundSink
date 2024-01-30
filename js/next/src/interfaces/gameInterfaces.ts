export interface BabylonGame {
    canvas: any;
    engine: BABYLON.Engine | undefined;
    scene: BABYLON.Scene | undefined;
    camera: BABYLON.ArcRotateCamera[];
    light: BABYLON.HemisphericLight[];
    gui: any;
    advancedTexture: any;
    panel: any; //GUI.StackPanel[] | undefined;
    header: any; // GUI.TextBlock[];
    slider: any; // GUI.Slider[] | undefined;
    knob: any;
    meshes: any;
}
