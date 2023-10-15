/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */

//IMPORTING REACT HOOKS.
import { createContext, useReducer, useContext } from "react";

const AuthContext = createContext();

const initialState = {
  user: null,
  isAuthenticated: false,
  message: "Enter username and password",
};

function reducer(state, action) {
  switch (action.type) {
    case "login":
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload,
        message: "Login successful.",
      };

    case "logout":
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        message: "Enter username and password.",
      };

    case "wrongCredentials":
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        message: "The username and password combination entered is incorrect!",
      };
    default:
      throw new Error("Unexpected Error");
  }
}

//Fake user used to authenticate.
const FAKE_USER = {
  name: "Jack",
  email: "test@test.com",
  password: "test",
  avatar: "https://i.pravatar.cc/100?u=zz",
};

//Function that returns the context provider.
function AuthProvider({ children }) {
  const [{ user, isAuthenticated, message }, dispatch] = useReducer(
    reducer,
    initialState
  );

  //Function to validate the user email and password.
  function login(email, password) {
    if (email === FAKE_USER.email && password == FAKE_USER.password) {
      dispatch({ type: "login", payload: FAKE_USER });
    }

    if (email !== FAKE_USER.email || password != FAKE_USER.password) {
      dispatch({ type: "wrongCredentials" });
    }
  }

  //Function to logout.
  function logout() {
    dispatch({ type: "logout" });
  }

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, message, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

//Function to use the context as a custom hook.
function useAuth() {
  const context = useContext(AuthContext);

  if (context == undefined)
    throw new Error("Auth context was used outside its context provider.");

  return context;
}

export { AuthProvider, useAuth };
