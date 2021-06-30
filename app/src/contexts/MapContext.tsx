import { createContext, useContext, useReducer } from 'react'

type Action = {type: 'createMarker'}

type Dispatch = (action: Action) = void

const initialState = {
 markers: []
}

const MapContext = createContext<{state: State, dispatch: Dispatch} | undefined>(undefined)

const reducer = (state: State, action: Action) => {
 switch (action.type) {
   case 'createMarker':
     return {...state, markers: []}
   default:
     return state
}

const MapProvider = ({
   children
 }: {
   children: JSX.Element | JSX.Element[]
}) => {
 const [state, dispatch] = useReducer(reducer, initialState)

const value = { state, dispatch}
return (
   <MapContext.Provider value={value}>{children}</MapContext.Provider>
)
}
}
export { MapContext, MapProvider }


  "Create React Context": {
    "prefix": "ctx",
    "body": [
      "import { createContext, useContext, useReducer } from 'react'",
      "",
      "type Action = {type: '$2'}",
      "",
      "type Dispatch = (action: Action) => void",
      "",
      "const initialState = {",
      " $3: $4",
      "}",
      "",
      "const $1Context = createContext<{state: State, dispatch: Dispatch} | undefined>(undefined)",
      "",
      "const reducer = (state: State, action: Action) => {",
      " switch (action.type) {",
      "   case '$2':",
      "     return {...state, $3: $4}",
      "   default:",
      "     return state",
      "}",
      "",
      "const $1Provider = ({",
      "   children",
      " }: {",
      "   children: JSX.Element | JSX.Element[]",
      "}) => {",
      " const [state, dispatch] = useReducer(reducer, initialState)",
      "",
      "const value = { state, dispatch}",
      "return (",
      "   <$1Context.Provider value={value}>{children}</$1Context.Provider>",
      ")",
      "}",
      "",
      "export { $1Context, $1Context }"
    ]
  }