import { createContext, useContext, useReducer, useState } from "react";
import { CanvasTexture } from "three";
import {
  createCanvas,
  createCanvasCropped,
  createEggMask,
  createTexture,
} from "./utils";

type Action =
  | {
      type: "SET_PATTERN";
      pattern: CanvasTexture;
      canvas: HTMLCanvasElement;
    }
  | { type: "CLEAR_PATTERN" };

type Dispatch = (action: Action) => void;

type State = {
  pattern: CanvasTexture | null;
  canvas: HTMLCanvasElement | null;
};

const initialState = {
  pattern: null,
  canvas: null,
};

const PatternContext = createContext<
  { state: State; dispatch: Dispatch } | undefined
>(undefined);

const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case "SET_PATTERN":
      return { ...state, pattern: action.pattern, canvas: action.canvas };
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

  const value = { state, dispatch };
  return (
    <PatternContext.Provider value={value}>{children}</PatternContext.Provider>
  );
};

export { PatternContext, PatternProvider };

export const useUpdatePattern = () => {
  const [updating, setUpdating] = useState(false);
  const context = useContext(PatternContext);

  if (context === undefined) {
    throw new Error("must be within its provider: User");
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
      const canvas = await createCanvas(e.target.result);
      // const canvasSmall = await createCanvasCropped(e.target.result, 200, 200);

      const eggMask = document.getElementById("egg-mask") as HTMLImageElement;
      createEggMask(eggMask, canvas, 200, 200);
      const pattern = createTexture(canvas, 7);
      dispatch({ type: "SET_PATTERN", canvas, pattern });
      setTimeout(() => setUpdating(false), 2000);
    };
    reader.readAsDataURL(file);
  };

  const clearPattern = () => dispatch({ type: "CLEAR_PATTERN" });

  return { clearPattern, uploadPattern, pattern: state.pattern, updating };
};

export const usePattern = () => {
  const context = useContext(PatternContext);

  if (context === undefined) {
    throw new Error("must be within its provider: User");
  }

  const { state } = context;

  return state.pattern;
};
