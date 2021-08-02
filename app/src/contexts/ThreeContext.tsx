import { useEffect, useRef } from "react";
import { createContext, useContext, useReducer } from "react";
import { GLTF, GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as THREE from "three";
import { useCallback } from "react";

import yaytso from "../assets/yaytso.gltf";
import { usePattern } from "./PatternContext";

type LoadedObject = THREE.Mesh | THREE.Group | GLTF;

type Entity = {
  object: LoadedObject;
  name: string;
};

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
      const newEntities = action.entities.map((entity: Entity) => entity.name);
      const entityState = state.entities.filter(
        (entity: Entity) => !newEntities.includes(entity.name)
      );
      return {
        ...state,
        entities: [...entityState, ...action.entities],
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

  const loadGLTF = useCallback(
    (path: string) => {
      const loader = new GLTFLoader();
      loader.load(path, (object: GLTF) => {
        if (state.scene === undefined) {
          return console.log("no scene");
        }
        object.scene.scale.set(0.1, 0.1, 0.1);
        // This could be removed and they could just be loaded first
        state.scene.add(object.scene);
        dispatch({
          type: "ADD_ENITITIES",
          entities: [{ object, name: "egg" }],
        });
      });
    },
    [dispatch, state.scene]
  );

  useEffect(() => {
    loadGLTF(yaytso);
  }, [state.scene, loadGLTF]);

  const value = { state, dispatch };
  return (
    <ThreeContext.Provider value={value}>{children}</ThreeContext.Provider>
  );
};

export { ThreeContext, ThreeProvider };

export const useThreeScene = () => {
  // const [previousRAF, setPreviousRAF] = useState(0);
  const pattern = usePattern();
  let previousRAF = useRef(0).current;
  const context = useContext(ThreeContext);
  if (context === undefined) {
    throw new Error("Three Context error in ThreeScene hook");
  }

  const { dispatch, state } = context;

  useEffect(() => {
    if (pattern) {
      const object = state.entities.find(
        (entity: Entity) => entity.name === "egg"
      );
      if (!object) {
        return console.error("Could not find egg");
      }

      const egg = (object.object as GLTF).scene.children[0] as THREE.Mesh;
      const eggMaterial = egg.material as THREE.MeshBasicMaterial;
      eggMaterial.map = pattern;
      eggMaterial.color = new THREE.Color(1, 1, 1);
      eggMaterial.needsUpdate = true;
    }
  }, [pattern, state.entities]);

  const initScene = useCallback(
    (container: HTMLDivElement) => {
      const renderer = new THREE.WebGLRenderer();
      const { width, height } = container.getBoundingClientRect();
      const windowAspect = width / height;
      renderer.setSize(width, height);
      renderer.setClearColor(0xffffff);
      renderer.setPixelRatio(window.devicePixelRatio);
      // renderer.physicallyCorrectLights = true;
      renderer.outputEncoding = THREE.sRGBEncoding;
      const domElement = renderer.domElement;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(65, windowAspect, 0.1, 1000);
      camera.position.z = 0.3;

      const controls = new OrbitControls(camera, domElement);
      controls.autoRotate = true;
      controls.update();

      const hemi = new THREE.HemisphereLight(0xffffff, 0x080820, 0.6);
      scene.add(hemi);

      const ambient = new THREE.AmbientLight(0xffffff, 0.7);
      scene.add(ambient);

      dispatch({ type: "INIT", renderer, scene, camera, domElement, controls });

      container.appendChild(domElement);

      return () => {
        domElement.remove();
      };
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
        previousRAF = _previousRAF;
        // setPreviousRAF(_previousRAF);
      }
      setTimeout(() => RAF(), 1);
    });
  };

  useEffect(() => {
    if (state.renderer) {
      RAF();
    }

    return () => cancelAnimationFrame(previousRAF ? previousRAF : 0);
    //eslint-disable-next-line
  }, [state.renderer]);

  return { initScene, RAF };
};
