/* eslint-disable react/prop-types */
import styles from "./Map.module.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

//IMPORTING FROM LEAFLET.
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvent,
} from "react-leaflet";

//IMPORTING CONTEXT DATA.
import { useCities } from "../contexts/CitiesContext";

//IMPORTING CUSTOM HOOKS.
import { useGeoLocation } from "../customHooks/useGeoLocation";
import { useUrlPosition } from "../customHooks/useUrlPosition";

//IMPORTING COMPONENTS.
import Button from "./Button";

export default function Map() {
  //Fetching data from customHooks.
  //Fetching GeoLocation data from useGeoLocation CustomHook.
  const {
    isLoading: isLoadingPosition,
    position: geolocationPosition,
    getPosition,
  } = useGeoLocation();

  //Fetching Positions from useUrlPosition CustomHook.
  const [mapLat, mapLng] = useUrlPosition();

  //Fetching data from contextAPI.
  const { cities } = useCities();
  const [mapPosition, setMapPosition] = useState([40, 0]);

  //To update map position each time Map renders.
  useEffect(
    function () {
      if (mapLat && mapLng) setMapPosition([mapLat, mapLng]);
    },
    [mapLat, mapLng]
  );

  //Updating the mapPosition to GeoLocation API data.
  useEffect(
    function () {
      if (geolocationPosition)
        setMapPosition([geolocationPosition.lat, geolocationPosition.lng]);
    },
    [geolocationPosition]
  );

  return (
    <div className={styles.mapContainer}>
      {!geolocationPosition && (
        <Button type="position" onClick={getPosition}>
          {isLoadingPosition ? "Loading..." : "Use your Position"}
        </Button>
      )}
      <MapContainer
        // center={[mapLat || 40, mapLng || 0]}
        center={mapPosition}
        zoom={6}
        scrollWheelZoom={true}
        className={styles.map}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
        />
        {cities.map((city) => (
          <Marker
            position={[city.position.lat, city.position.lng]}
            key={city.id}
          >
            <Popup>
              <span>{city.emoji}</span>
              <span>{city.cityName}</span> <br />
            </Popup>
          </Marker>
        ))}

        <ChangeCenter position={mapPosition} />
        <DetectClick />
      </MapContainer>
    </div>
  );
}

//Custom component to center towards the coordinates in the map.
function ChangeCenter({ position }) {
  const map = useMap();
  map.setView(position);
  return null;
}

//Custom component to show the form on clicking on the map.
function DetectClick() {
  const navigate = useNavigate();

  useMapEvent({
    click: (e) => navigate(`form?lat=${e.latlng.lat}&lng=${e.latlng.lng}`),
  });
}
