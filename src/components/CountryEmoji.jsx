/* eslint-disable react/prop-types */
import CountryFlag from "react-country-flag";
import styles from "./CountryEmoji.module.css";

export default function CountryEmoji({ countryCode }) {
  return (
    <CountryFlag
      countryCode={countryCode} // Specify the 2-letter country code (ISO 3166-1 alpha-2)
      svg
      className={styles.emoji}
    />
  );
}
