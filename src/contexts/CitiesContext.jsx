/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
import { createContext, useState, useEffect, useContext } from "react";

const CitiesContext = createContext();

const BASE_URL = "http://localhost:8000";

function CitiesProvider({ children }) {
  const [cities, setCities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentCity, setCurrentCity] = useState({});

  useEffect(function () {
    //Function to fetch cities array from the API.
    async function fetchCities() {
      try {
        setIsLoading(true);

        const res = await fetch(`${BASE_URL}/cities`);
        if (!res.ok) {
          throw new Error("Somthing went wrong. Please try after sometime!");
        }

        const data = await res.json();
        if (!data) {
          throw new Error("Alert loading the data. Please try again!");
        }

        setCities(data);
      } catch (e) {
        alert(e.message);
      } finally {
        setIsLoading(false);
      }
    }
    fetchCities();
  }, []);

  //Function to fetch the current city from the API using the ID.
  async function getCity(id) {
    try {
      setIsLoading(true);
      const res = await fetch(`${BASE_URL}/cities/${id}`);
      if (!res.ok) {
        throw new Error("Something went wrong, Please try after sometime!");
      }

      const data = await res.json();
      if (!data) {
        throw new Error("Alert loading the data. Please try again!");
      }

      setCurrentCity(data);
    } catch (e) {
      alert(e.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <CitiesContext.Provider value={{ cities, isLoading, currentCity, getCity }}>
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
