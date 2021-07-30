import { useEffect } from "react";
import { createContext, useContext, useReducer } from "react";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as THREE from "three";
import { useState } from "react";
import { useCallback } from "react";

import yaytso from "../assets/yaytso.gltf";

type Entity = THREE.Mesh | THREE.Group;

type Action =
  | {
      type: "INIT";
      renderer: THREE.WebGLRenderer;
      scene: THREE.Scene;
      camera: THREE.PerspectiveCamera;
      domElement: HTMLElement;
      controls: OrbitControls;
    }
  | { type: "ADD_ENITITIES"; entities: Entity[] };

type Dispatch = (action: Action) => void;

type State = {
  previousRAF: number | undefined;
  renderer: THREE.WebGLRenderer | undefined;
  scene: THREE.Scene | undefined;
  domElement: HTMLElement | undefined;
  camera: THREE.PerspectiveCamera | undefined;
  controls: OrbitControls | undefined;
  player: any;
  entities: Array<Entity>;
  sceneLoaded: boolean;
  something: Array<any> | undefined;
};

const initialState = {
  previousRAF: undefined,
  renderer: undefined,
  scene: undefined,
  camera: undefined,
  controls: undefined,
  domElement: undefined,
  player: undefined,
  entities: [],
  sceneLoaded: false,
  something: [],
};

const ThreeContext = createContext<
  { state: State; dispatch: Dispatch } | undefined
>(undefined);

const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case "INIT":
      return {
        ...state,
        renderer: action.renderer,
        scene: action.scene,
        camera: action.camera,
        sceneLoaded: true,
        controls: action.controls,
      };
    case "ADD_ENITITIES":
      return {
        ...state,
        entities: [...state.entities, ...action.entities],
      };
    default:
      return state;
  }
};

const ThreeProvider = ({
  children,
}: {
  children: JSX.Element | JSX.Element[];
}) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const loadGLTF = (path: string) => {
    const loader = new GLTFLoader();
    loader.load(path, (object: any) => {
      if (state.scene === undefined) {
        return console.log("no scene");
      }
      console.log(object);
      object.scene.scale.set(0.1, 0.1, 0.1);
      // This could be removed and they could just be loaded first
      state.scene.add(object.scene);
      console.log("adding aegg");
      dispatch({ type: "ADD_ENITITIES", entities: [object] });
    });
  };

  useEffect(() => {
    console.log("loading", state.scene);
    loadGLTF(yaytso);
  }, [state.scene]);

  const value = { state, dispatch };
  return (
    <ThreeContext.Provider value={value}>{children}</ThreeContext.Provider>
  );
};

export { ThreeContext, ThreeProvider };

export const useThreeScene = () => {
  const [previousRAF, setPreviousRAF] = useState(0);
  const context = useContext(ThreeContext);

  if (context === undefined) {
    throw new Error("Three Context error in ThreeScene hook");
  }

  const { dispatch, state } = context;

  const initScene = useCallback(
    (container: HTMLDivElement) => {
      const renderer = new THREE.WebGLRenderer();
      const { width, height } = container.getBoundingClientRect();
      const windowAspect = width / height;
      renderer.setSize(width, height);
      renderer.physicallyCorrectLights = true;
      renderer.outputEncoding = THREE.sRGBEncoding;
      const domElement = renderer.domElement;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(65, windowAspect, 0.1, 1000);
      camera.position.z = 2.2;

      const controls = new OrbitControls(camera, domElement);
      controls.autoRotate = true;
      controls.update();

      const light = new THREE.HemisphereLight(0xffffbb, 0x080820, 0.5);
      scene.add(light);

      const ambient = new THREE.AmbientLight(0xfffff, 1);
      scene.add(ambient);

      const geometry = new THREE.BoxGeometry();
      const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
      const cube = new THREE.Mesh(geometry, material);
      // scene.add(cube);

      dispatch({ type: "INIT", renderer, scene, camera, domElement, controls });

      container.appendChild(domElement);
    },
    [dispatch]
  );

  const step = (timeElapsed: number) => {
    const timeElapsedS = Math.min(1.0, 30, timeElapsed * 0.001);
    if (state.player) {
      state.player.update(timeElapsedS);
    }
  };

  const RAF = () => {
    requestAnimationFrame((t) => {
      if (state.renderer === undefined) {
        return console.log("no renderer");
      }
      if (state.scene === undefined) {
        return console.log("no scene");
      }
      if (state.camera === undefined) {
        return console.log("no camera");
      }
      if (state.sceneLoaded) {
        const _previousRAF = previousRAF ? previousRAF : t;
        step(t - _previousRAF);
        state.renderer.render(state.scene, state.camera);
        state.controls && state.controls.update();
        setPreviousRAF(_previousRAF);
      }
      setTimeout(() => RAF(), 1);
    });
  };

  useEffect(() => {
    if (state.renderer) {
      RAF();
    }

    return () =>
      cancelAnimationFrame(state.previousRAF ? state.previousRAF : 0);
    //eslint-disable-next-line
  }, [state.renderer]);

  return { initScene, RAF };
};
