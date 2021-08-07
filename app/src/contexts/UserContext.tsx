import { createContext, useContext, useReducer } from "react";

type EggParams = {
  name?: string;
  description?: string;
  recipient?: string;
};

type Action = { type: "UPDATE_EGG"; params: EggParams };

type Dispatch = (action: Action) => void;

type Egg = {
  name: string | undefined;
  description: string | undefined;
  recipient: string | undefined;
};

type State = {
  egg: Egg;
};

const initialState = {
  egg: { name: "", description: "", recipient: "" },
};

const UserContext = createContext<
  { state: State; dispatch: Dispatch } | undefined
>(undefined);

const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case "UPDATE_EGG":
      return { ...state, egg: { ...state.egg, ...action.params } };
    default:
      return state;
  }
};

const UserProvider = ({
  children,
}: {
  children: JSX.Element | JSX.Element[];
}) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const value = { state, dispatch };
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export { UserContext, UserProvider };

export const useUpdateEgg = () => {
  const context = useContext(UserContext);

  if (context === undefined) {
    throw new Error("User Context error in UpdateEgg hook");
  }

  const { dispatch, state } = context;

  const updateEgg = (params: EggParams) =>
    dispatch({ type: "UPDATE_EGG", params });

  return { updateEgg };
};

export const useCustomEgg = () => {
  const context = useContext(UserContext);

  if (context === undefined) {
    throw new Error("User Context error in CustomEgg hook");
  }

  const { dispatch, state } = context;
  return state.egg;
};
