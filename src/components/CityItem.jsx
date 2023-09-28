/* eslint-disable react/prop-types */
// import React from 'react'
import { Link } from "react-router-dom";
import styles from "./CityItem.module.css";

//IMPORTING CONTEXT DATA.
import { useCities } from "../contexts/CitiesContext";

//Function to format the date received.
const formatDate = (date) =>
  new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long",
    year: "numeric",
    weekday: "long",
  }).format(new Date(date));

export default function CityItem({ city }) {
  //Fetching methods from context.
  const { currentCity, deleteCity } = useCities();

  const { cityName, emoji, date, id, position } = city;

  //Function to handle onClick event of delete button.
  function handleDelete(e) {
    e.preventDefault();
    deleteCity(id);
  }

  return (
    <li>
      <Link
        className={`${styles.cityItem} ${
          currentCity.id === id ? styles["cityItem--active"] : ""
        }`}
        to={`${id}?lat=${position.lat}&lng=${position.lng}`}
      >
        <span className={styles.emoji}>{emoji}</span>
        <h3 className={styles.name}>{cityName}</h3>
        <time className={styles.date}>{formatDate(date)}</time>
        <button className={styles.deleteBtn} onClick={handleDelete}>
          &times;
        </button>
      </Link>
    </li>
  );
}
