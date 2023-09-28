/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
import { createContext, useEffect, useContext, useReducer } from "react";

const CitiesContext = createContext();

const BASE_URL = "http://localhost:8000";

//Initial state for useReducer function.
const initialState = {
  cities: [],
  isLoading: false,
  currentCity: {},
  error: "",
};

//Reducer function to
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

  useEffect(function () {
    //Function to fetch cities array from the API.
    async function fetchCities() {
      dispatch({ type: "loading" });
      try {
        //Fetching data from API.
        const res = await fetch(`${BASE_URL}/cities`);
        if (!res.ok) {
          throw new Error("Somthing went wrong. Please try after sometime!");
        }

        const data = await res.json();
        if (!data) {
          throw new Error("Alert loading the data. Please try again!");
        }

        dispatch({ type: "cities/loaded", payload: data });
      } catch (e) {
        dispatch({ type: "rejected", payload: e.message });
      }
    }
    fetchCities();
  }, []);

  //Function to fetch the current city from the API using the ID.
  async function getCity(id) {
    //Check if city is already saved on the server.
    if (Number(id) === currentCity.id) return;

    dispatch({ type: "loading" });
    try {
      const res = await fetch(`${BASE_URL}/cities/${id}`);
      if (!res.ok) {
        throw new Error("Something went wrong, Please try after sometime!");
      }

      const data = await res.json();
      if (!data) {
        throw new Error("Alert loading the data. Please try again!");
      }

      dispatch({ type: "city/loaded", payload: data });
    } catch (e) {
      dispatch({ type: "rejected", payload: e.message });
    }
  }

  //Function to set the city data to the API.
  async function createCity(newCity) {
    dispatch({ type: "loading" });
    try {
      const res = await fetch(`${BASE_URL}/cities`, {
        method: "POST",
        body: JSON.stringify(newCity),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();
      dispatch({ type: "cities/created", payload: data });
    } catch (e) {
      dispatch({ type: "rejected", payload: e.message });
    }
  }

  //Function to delete the city data.
  async function deleteCity(id) {
    dispatch({ type: "loading" });
    try {
      await fetch(`${BASE_URL}/cities/${id}`, {
        method: "DELETE",
      });

      dispatch({ type: "city/deleted", payload: id });

      // setCities((cities) => cities.filter((city) => city.id !== id));
    } catch (e) {
      dispatch({ type: "rejected", payload: e.message });
    }
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
