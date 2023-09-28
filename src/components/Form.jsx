/* eslint-disable react-refresh/only-export-components */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

//IMPORTING COMPONENTS FROM NPM LIBRARIES.
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import styles from "./Form.module.css";

//IMPORTING CUSTOM HOOKS.
import { useUrlPosition } from "../customHooks/useUrlPosition";

//IMPORTING PROVIDER FROM CONTEXT API.
import { useCities } from "../contexts/CitiesContext";

//IMPORTING COMPONENTS.
import Button from "./Button";
import BackButton from "./BackButton";
import Message from "./Message";
import Spinner from "./Spinner";

export function convertToEmoji(countryCode) {
  // Function to convert a country code to an emoji flag.
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
}

const BASE_URL = `https://api.bigdatacloud.net/data/reverse-geocode-client`;

export default function Form() {
  const [cityName, setCityName] = useState("");
  const [country, setCountry] = useState("");
  const [date, setDate] = useState(new Date());
  const [notes, setNotes] = useState("");
  const [emoji, setEmoji] = useState("");
  const [geoCodingError, setIsGeoCodingError] = useState("");

  const [isLoadingGeocoding, setIsLoadingGeocoding] = useState(false);
  // State to track if geocoding data is currently being fetched from the API.

  //Fetching data from customHooks.
  //Fetching mapLat and mapLng from useUrlPosition.
  const [lat, lng] = useUrlPosition();

  //Fetching methods from Context API.
  const { createCity, isLoading } = useCities();

  //Fetching navigate API from useNavigate Hook;
  const navigate = useNavigate();

  // To synchronise cities and countries data from the URL search parameters.
  useEffect(
    function () {
      //If no lat or lng present in the URL return immediately.
      if (!lat && !lng) return;

      //Fetching cities data from the API.
      async function fetchCitiesData() {
        try {
          setIsLoadingGeocoding(true);
          setIsGeoCodingError("");
          const res = await fetch(
            `${BASE_URL}?latitude=${lat}&longitude=${lng}`
          );
          if (!res.ok) {
            throw new Error(
              "Something went wrong. Please try again after sometime."
            );
          }

          const data = await res.json();

          if (!data.countryCode)
            throw new Error(
              "That doesn't seem to be a city. Click somewhere else !"
            );

          setCityName(data.city || data.locality || "");
          setCountry(data.country || "");
          setEmoji(convertToEmoji(data.countryCode));
        } catch (err) {
          setIsGeoCodingError(err.message);
        } finally {
          setIsLoadingGeocoding(false);
        }
      }
      fetchCitiesData();
    },
    [lat, lng]
  );

  //Handling the submit button on saving the form.
  async function handleSubmit(e) {
    e.preventDefault();

    //If no city-name or date input to the form return immediately.
    if (!cityName || !date) return;

    //Create a new random ID if you are saving the city data using LocalStorage API
    const newCity = {
      cityName,
      country,
      emoji,
      date,
      notes,
      position: { lat, lng },
    };

    //Calling the method from Context API.
    await createCity(newCity, isLoading);
    navigate("/app/cities");
  }

  if (isLoadingGeocoding) return <Spinner />; // Render a loading spinner component while geocoding data is being fetched.

  if (geoCodingError) return <Message message={geoCodingError} />; // Render a message component if there's a geocoding error.

  if (!lat && !lng) return <Message message={"Start by clicking on the map"} />; //Rendering message if you navigate to the form directly.

  return (
    <form
      className={`${styles.form} ${isLoading ? styles.loading : ""}`}
      onSubmit={handleSubmit}
    >
      <div className={styles.row}>
        <label htmlFor="cityName">City name</label>
        <input
          id="cityName"
          onChange={(e) => setCityName(e.target.value)}
          value={cityName}
        />
        <span className={styles.flag}>{emoji}</span>
      </div>

      <div className={styles.row}>
        <label htmlFor="date">When did you go to {cityName}?</label>

        {/* <input
          id="date"
          onChange={(e) => setDate(e.target.value)}
          value={date}
        /> */}

        <DatePicker
          id="date"
          onChange={(date) => setDate(date)}
          selected={date}
          dateFormat="dd/MM/yyyy"
        />
      </div>

      <div className={styles.row}>
        <label htmlFor="notes">Notes about your trip to {cityName}</label>
        <textarea
          id="notes"
          onChange={(e) => setNotes(e.target.value)}
          value={notes}
        />
      </div>

      <div className={styles.buttons}>
        <Button type="primary">Add</Button>
        <BackButton />
      </div>
    </form>
  );
}
