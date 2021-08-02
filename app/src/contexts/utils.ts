import { CanvasTexture, RepeatWrapping } from "three";

export const ipfsToHttps = (uri: string) => uri.replace("ipfs", "https");

export const getMarker = (selector: string): any => {
  const MAX_TRIES = 500;
  let tries = 0;
  return new Promise((resolve, __) => {
    const pollMarker = (): any => {
      console.log("polling");
      const markerDom = document.querySelector(selector) as HTMLImageElement;
      if (!markerDom && tries < MAX_TRIES) {
        tries++;
        return setTimeout(pollMarker, 50);
      }
      return resolve(markerDom);
    };
    pollMarker();
  });
};

export const fadeIn = (el: HTMLElement) => {
  let o = 0;
  let frame = 0;
  const animate = () => {
    el.style.transform = `scale(${o})`;
    if (o < 1) {
      o += 0.05;
      frame = requestAnimationFrame(animate);
    } else {
      cancelAnimationFrame(frame);
    }
  };
  animate();
};

export const delay = (ms: number, callback: Function) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      callback();
      resolve(true);
    }, ms);
  });
};

export const createCanvas = (
  imgDataURL: string
): Promise<HTMLCanvasElement> => {
  return new Promise((resolve, __) => {
    const img = new Image();
    img.src = imgDataURL;
    img.onload = (e) => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        return null;
      }
      const { width, height } = img;
      ctx.canvas.width = width;
      ctx.canvas.height = height;
      ctx.drawImage(img, 0, 0);
      resolve(canvas);
    };
  });
};

export const createTexture = (
  canvas: HTMLCanvasElement,
  repetitions: number
) => {
  const texture = new CanvasTexture(canvas);
  texture.wrapS = RepeatWrapping;
  texture.wrapT = RepeatWrapping;
  texture.flipY = false;
  texture.repeat.set(repetitions, repetitions);
  return texture;
};
