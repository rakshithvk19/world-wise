/* eslint-disable react/prop-types */
import styles from "./CountryItem.module.css";

//IMPORTING COMPONENTS.
import CountryEmoji from "./CountryEmoji";

export default function CountryItem({ country }) {
  return (
    <li className={styles.countryItem}>
      <span>
        <CountryEmoji countryCode={country.countryCode} />
      </span>
      <span>{country.country}</span>
    </li>
  );
}
