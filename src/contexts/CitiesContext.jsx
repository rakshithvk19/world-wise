/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
import {
  createContext,
  useEffect,
  useContext,
  useReducer,
  useCallback,
} from "react";

const CitiesContext = createContext();

// Initial state for useReducer function.
const initialState = {
  cities: JSON.parse(localStorage.getItem("cities")) || [],
  isLoading: false,
  currentCity: {},
  error: "",
};

// Reducer function
function Reducer(state, action) {
  switch (action.type) {
    case "loading":
      return { ...state, isLoading: true };

    case "cities/loaded":
      return { ...state, isLoading: false, cities: action.payload };

    case "city/loaded":
      return { ...state, isLoading: false, currentCity: action.payload };

    case "cities/created":
      return {
        ...state,
        isLoading: false,
        cities: [...state.cities, action.payload],
        currentCity: action.payload,
      };

    case "city/deleted":
      return {
        ...state,
        isLoading: false,
        cities: state.cities.filter((city) => city.id !== action.payload),
        currentCity: {},
      };

    case "rejected":
      return { ...state, isLoading: false, error: action.payload };

    default:
      throw new Error("Unknown action performed.");
  }
}

function CitiesProvider({ children }) {
  const [{ cities, isLoading, currentCity, error }, dispatch] = useReducer(
    Reducer,
    initialState
  );

  //To synchronize data from local storage and react states.
  //Check if the reducer function dispatch methods are working properly.
  useEffect(() => {
    localStorage.setItem("cities", JSON.stringify(cities));
  }, [cities]);

  // Function to fetch the current city from local storage using the ID.
  const getCity = useCallback(
    function getCity(id) {
      // Check if city is already saved in state.
      const city = cities.find((city) => city.id === id);

      if (city) {
        dispatch({ type: "city/loaded", payload: city });
      } else {
        dispatch({ type: "rejected", payload: "City not found" });
      }
    },
    [cities]
  );

  // Function to set the city data to local storage.
  function createCity(newCity) {
    dispatch({ type: "cities/created", payload: newCity });
  }

  // Function to delete the city data from local storage.
  function deleteCity(id) {
    dispatch({ type: "city/deleted", payload: id });
  }

  return (
    <CitiesContext.Provider
      value={{
        cities,
        isLoading,
        currentCity,
        error,
        getCity,
        createCity,
        deleteCity,
      }}
    >
      {children}
    </CitiesContext.Provider>
  );
}

function useCities() {
  const context = useContext(CitiesContext);

  if (context == undefined)
    throw new Error("Cities context was used outside the cities provider.");
  return context;
}

export { CitiesProvider, useCities };
