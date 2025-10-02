import { DeferredPromise } from "webchuck";

/*
 * Types:
 *   Filename
 *   File
 *
 * Functions:
 *   asyncLoadFile
 *   preloadFiles
 *   defer
 */
  export interface Filename {
      serverFilename: string;
      virtualFilename: string;
  }
  export interface File {
    filename: string;
    data?: ArrayBuffer;
  }

  export const disposeBabylonResources = (scene: any) => {
      // Dispose of all meshes
      scene.meshes.forEach((mesh: any) => {
          mesh.dispose();
      });
  
      // Dispose of all materials
      scene.materials.forEach((material: any) => {
          material.dispose();
      });
  
      // Dispose of all textures
      scene.textures.forEach((texture: any) => {
          texture.dispose();
      });
  
      // Dispose of cameras
      scene.cameras.forEach((camera: any) => {
          camera.dispose();
      });
  
      // Dispose of lights
      scene.lights.forEach((light: any) => {
          light.dispose();
      });
  };
  
  
  function readAsync(
    url: string,
    onload: (buffer: ArrayBuffer) => void,
    onerror: () => void
  ): void {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.responseType = "arraybuffer";
    xhr.onload = () => {
      if (xhr.status == 200 || (xhr.status == 0 && xhr.response)) {
        onload(xhr.response);
      } else {
        onerror();
      }
    };
    xhr.onerror = onerror;
    xhr.send(null);
  }
  
  export function asyncLoadFile(
    url: string,
    onload: (buffer: ArrayBuffer) => void,
    onerror: () => void
  ): void {
    readAsync(
      url,
      (arrayBuffer: ArrayBuffer) => {
        // TODO: do we need Uint8Array here?
        onload(new Uint8Array(arrayBuffer));
      },
      () => {
        if (onerror) {
          onerror();
        } else {
          throw new Error(`Loading data file ${url} failed.`);
        }
      }
    );
  }
  
  export async function preloadFiles(
    filenamesToPreload: Filename[]
  ): Promise<File[]> {
    console.log("is this a thing??? ", filenamesToPreload); 
    const promises = filenamesToPreload.map(
      (filenameToPreload) =>
        new Promise<File>((resolve, _reject) => {
          asyncLoadFile(
            filenameToPreload.serverFilename,
            (byteArray) => {
              resolve({
                filename: filenameToPreload.virtualFilename,
                data: byteArray,
              });
            },
            () => {
              console.error(
                `Error fetching file: ${filenameToPreload.serverFilename}`
              );
            }
          );
        })
    );
    return await Promise.all(promises);
  }
  
  export async function loadWasm(): Promise<ArrayBuffer> {
    return await new Promise((resolve, reject) => {
      asyncLoadFile(
        // "https://chuck.stanford.edu/webchuck/src/webchuck.wasm",
        `../../src/webchuck.wasm`,
        resolve,
        reject
      );
    });
  }
  
  export const defer = () => new DeferredPromise();

  export const getConvertedRadio = (fxRadioValue: string) => fxRadioValue === "STK" ? "stk1" : fxRadioValue === "audioin" ? "audioin" : fxRadioValue ? fxRadioValue.toLowerCase() : "";