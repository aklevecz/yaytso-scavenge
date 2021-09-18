import {
  createContext,
  RefObject,
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react";
import { CanvasTexture, RepeatWrapping } from "three";
import {
  createCanvas,
  createCanvasCropped,
  createEggMask,
  createTexture,
  drawToPreview,
} from "./utils";

type Action =
  | {
    type: "SET_PATTERN";
    pattern: CanvasTexture;
    canvas: HTMLCanvasElement;
    canvasPreview: HTMLCanvasElement;
  }
  | { type: "CLEAR_PATTERN" };

type Dispatch = (action: Action) => void;

type State = {
  pattern: CanvasTexture | null;
  canvas: HTMLCanvasElement | null;
  canvasPreview: HTMLCanvasElement | null
};

const initialState = {
  pattern: null,
  canvas: null,
  canvasPreview: null,
};

const PatternContext = createContext<
  { state: State; dispatch: Dispatch } | undefined
>(undefined);

const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case "SET_PATTERN":
      return { ...state, pattern: action.pattern, canvas: action.canvas, canvasPreview: action.canvasPreview };
    case "CLEAR_PATTERN":
      return { ...state, pattern: null, canvas: null };
    default:
      return state;
  }
};

const PatternProvider = ({
  children,
}: {
  children: JSX.Element | JSX.Element[];
}) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    if (!state.pattern && !state.canvas && state.canvasPreview) {
      // const previewCanvas = document.getElementById(
      //   PREVIEW_CANVAS_ID
      // )! as HTMLCanvasElement;
      const previewCanvas = state.canvasPreview;
      const ctx = previewCanvas.getContext("2d")!;

      const w = previewCanvas.width;
      const h = previewCanvas.height;

      ctx.rect(0, 0, w, h);
      ctx.fillStyle = "white";
      ctx.fill();
    }
  }, [state.pattern, state.canvas]);

  const value = { state, dispatch };
  return (
    <PatternContext.Provider value={value}>{children}</PatternContext.Provider>
  );
};

export { PatternContext, PatternProvider };

export const useUpdatePattern = (canvasPreview: HTMLCanvasElement | null) => {
  const [updating, setUpdating] = useState(false);
  const context = useContext(PatternContext);

  if (context === undefined) {
    throw new Error("must be within its provider: Pattern");
  }

  const { dispatch, state } = context;

  const uploadPattern = (e: React.FormEvent<HTMLInputElement>) => {
    const files = (e.target as HTMLInputElement).files;
    if (files === null || files.length === 0) {
      return;
    }
    const file = files[0];
    setUpdating(true);
    const reader = new FileReader();
    reader.onload = async (e: ProgressEvent<FileReader>) => {
      if (!e.target) {
        return console.error("nothing here");
      }
      if (typeof e.target.result !== "string") {
        return console.error("expecting a single file");
      }
      if (!canvasPreview) {
        return console.error("canvas preview is missing");
      }
      // const canvas = await createCanvas(e.target.result);
      const canvas = await createCanvasCropped(e.target.result, 200, 200)
      drawToPreview(e.target.result, canvasPreview)

      const eggMask = document.getElementById("egg-mask") as HTMLImageElement;
      createEggMask(eggMask, canvas, 200, 200);
      const pattern = createTexture(canvas, 7);
      dispatch({ type: "SET_PATTERN", canvas, pattern, canvasPreview });
      setUpdating(false);
    };
    reader.readAsDataURL(file);
  };

  const clearPattern = () => dispatch({ type: "CLEAR_PATTERN" });

  return { clearPattern, uploadPattern, pattern: state.pattern, updating, canvas: state.canvas };
};

export const usePattern = () => {
  const context = useContext(PatternContext);

  if (context === undefined) {
    throw new Error("must be within its provider: Pattern");
  }

  const { state } = context;

  return state.pattern;
};

export const useDraw = (canvas: HTMLCanvasElement | null) => {
  const context = useContext(PatternContext);

  if (context === undefined) {
    throw new Error("must be within its provider: Pattern");
  }

  const { dispatch, state } = context;

  useEffect(() => {
    if (!canvas) {
      return;
    }
    const mousePos = { x: 0, y: 0 };
    const prevMouse = { x: 0, y: 0 };

    let mouseDown = false;
    let mouseMoved = false;

    const ctx = canvas.getContext("2d")!;

    const w = canvas.width;
    const h = canvas.height;

    ctx.rect(0, 0, w, h);
    ctx.fillStyle = "white";
    ctx.fill();

    const setMouse = (e: any) => {
      mousePos.x = e.touches ? e.touches[0].clientX : e.clientX;
      mousePos.y = e.touches ? e.touches[0].clientY : e.clientY;
    };

    const normalizedPos = () => {
      const rect = canvas.getBoundingClientRect();
      const nX = (mousePos.x - rect.left) * (w / rect.width);
      const nY = (mousePos.y - rect.top) * (h / rect.height);
      return { x: nX, y: nY };
    };

    const onMove = (e: any) => {
      mouseMoved = true;
      setMouse(e);
      const { x: nX, y: nY } = normalizedPos();
      if (mouseDown && prevMouse.x !== 0 && prevMouse.y !== 0) {
        ctx.beginPath();
        // ctx.strokeStyle = colorRef.current;
        ctx.strokeStyle = "black";
        ctx.lineWidth = 3;
        ctx.moveTo(prevMouse.x, prevMouse.y);
        ctx.lineTo(nX, nY);
        ctx.closePath();
        ctx.stroke();

        const pattern = createTexture(canvas, 7)
        dispatch({ type: "SET_PATTERN", canvas, pattern, canvasPreview: canvas })
      }
      prevMouse.x = nX;
      prevMouse.y = nY;
    };

    // clean this up
    const onDown = (e: any) => {
      setMouse(e);
      mouseDown = true;
      mouseMoved = false;
    };

    const onUp = (e: any) => {
      if (!mouseMoved) {
        const { x, y } = normalizedPos();
        // ctx.fillStyle = colorRef.current;
        ctx.fillStyle = "black";
        ctx.fillRect(x, y, 5, 5);
        const pattern = createTexture(canvas, 7);
        // TOD: Refactor?
        dispatch({ type: "SET_PATTERN", canvas, pattern, canvasPreview: canvas });
      }
      mousePos.x = 0;
      mousePos.y = 0;
      prevMouse.x = 0;
      prevMouse.y = 0;
      mouseDown = false;
    };

    canvas.addEventListener("mousemove", onMove);
    canvas.addEventListener("touchmove", onMove);

    canvas.addEventListener("mousedown", onDown);
    canvas.addEventListener("mouseup", onUp);

    canvas.addEventListener("touchstart", onDown);
    canvas.addEventListener("touchend", onUp);

    return () => {
      canvas.removeEventListener("mousemove", onMove);
      canvas.removeEventListener("touchmove", onMove);

      canvas.removeEventListener("mousedown", onDown);
      canvas.removeEventListener("mouseup", onUp);

      canvas.removeEventListener("touchstart", onDown);
      canvas.removeEventListener("touchend", onUp);
    };
  }, [canvas]);
};
