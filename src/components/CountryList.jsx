/* eslint-disable react/prop-types */
// import React from 'react'

import styles from "./CountryList.module.css";
import Spinner from "./Spinner";
import CountryItem from "./CountryItem";
import Message from "./Message.jsx";

//IMPORTING CONTEXT.
import { useCities } from "../contexts/CitiesContext";

export default function CountryList() {
  const { cities, isLoading } = useCities();
  if (isLoading) {
    return <Spinner />;
  }

  //Fetching an array of countries from the cities array.
  const countries = cities.reduce((array, city) => {
    if (!array.map((el) => el.country).includes(city.country)) {
      return [
        ...array,
        { country: city.country, countryCode: city.countryCode },
      ];
    } else return array;
  }, []);

  if (!countries.length) {
    return <Message message={"Add cities by clicking on the map!!"} />;
  }

  return (
    <ul className={styles.CountryList}>
      {countries.map((country) => {
        return <CountryItem country={country} key={country.country} />;
      })}
    </ul>
  );
}
