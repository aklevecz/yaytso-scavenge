import { createContext, useContext, useEffect, useReducer } from "react";
import { ModalTypes } from "./types";

type Action =
  | { type: "OPEN_MODAL"; modalType: ModalTypes; data?: any }
  | { type: "CLOSE_MODAL" }
  | { type: "TOGGLE_MODAL" }
  | { type: "CLEAR_DATA" };

type Dispatch = (action: Action) => void;

export type State = {
  open: boolean;
  modalType: ModalTypes | undefined;
  data: any;
};

const initialState = {
  open: false,
  modalType: undefined,
  data: undefined,
};

const ModalContext = createContext<
  { state: State; dispatch: Dispatch } | undefined
>(undefined);

const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case "OPEN_MODAL":
      return {
        ...state,
        open: true,
        modalType: action.modalType,
        data: action.data,
      };
    case "CLOSE_MODAL":
      return { ...state, open: false };
    case "TOGGLE_MODAL":
      return { ...state, open: !state.open };
    case "CLEAR_DATA":
      return { ...state, data: undefined };
    default:
      return state;
  }
};

const ModalProvider = ({
  children,
}: {
  children: JSX.Element | JSX.Element[];
}) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const value = { state, dispatch };
  return (
    <ModalContext.Provider value={value}>{children}</ModalContext.Provider>
  );
};

export { ModalContext, ModalProvider };

export const useModalOpen = () => {
  const context = useContext(ModalContext);

  if (context === undefined) {
    throw new Error("must be within its provider: User");
  }

  const { state } = context;

  return state.open;
};

export const useModalToggle = () => {
  const context = useContext(ModalContext);

  if (context === undefined) {
    throw new Error("must be within its provider: User");
  }

  const { dispatch } = context;

  const toggleModal = () => dispatch({ type: "TOGGLE_MODAL" });

  return toggleModal;
};

export const useOpenModal = () => {
  const context = useContext(ModalContext);

  if (context === undefined) {
    throw new Error("must be within its provider: User");
  }

  const { dispatch } = context;

  const openModal = (modalType: ModalTypes, data?: any) =>
    dispatch({ type: "OPEN_MODAL", modalType, data });

  return openModal;
};

export const useModalType = () => {
  const context = useContext(ModalContext);

  if (context === undefined) {
    throw new Error("must be within its provider: User");
  }

  const { state } = context;

  return state.modalType;
};

export const useModalData = () => {
  const context = useContext(ModalContext);

  if (context === undefined) {
    throw new Error("Modal Context error in ModalData hook");
  }

  const { dispatch, state } = context;

  const clearModalData = () => dispatch({ type: "CLEAR_DATA" });

  return { data: state.data, clearModalData };
};
