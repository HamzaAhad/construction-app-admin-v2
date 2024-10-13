import React, { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  Tooltip,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import apiClient from "@/helpers/interceptor";

const center = [51.505, -0.09]; // Default center position for the map
const locations = [
  {
    latitude: 24.4539,
    longitude: 54.3773,
    label: "Abu Dhabi City",
    color: getRandomColor(),
  },
  {
    latitude: 24.4539,
    longitude: 54.3773,
    label: "Abu Dhabi Mall",
    color: getRandomColor(),
  },
  {
    latitude: 24.4687,
    longitude: 54.3569,
    label: "Sheikh Zayed Mosque",
    color: getRandomColor(),
  },
  {
    latitude: 24.4402,
    longitude: 54.39,
    label: "Corniche Beach",
    color: getRandomColor(),
  },
  {
    latitude: 24.467,
    longitude: 54.322,
    label: "Yas Marina Circuit",
    color: getRandomColor(),
  },
  {
    latitude: 24.4304,
    longitude: 54.5254,
    label: "Ferrari World Abu Dhabi",
    color: getRandomColor(),
  },
  {
    latitude: 24.4667,
    longitude: 54.3667,
    label: "Emirates Palace",
    color: getRandomColor(),
  },
  {
    latitude: 24.4824,
    longitude: 54.3654,
    label: "Louvre Abu Dhabi",
    color: getRandomColor(),
  },
  {
    latitude: 24.4678,
    longitude: 54.3682,
    label: "Abu Dhabi National Exhibition Centre",
    color: getRandomColor(),
  },
  {
    latitude: 24.455,
    longitude: 54.3533,
    label: "Al Ain Zoo",
    color: getRandomColor(),
  },
  {
    latitude: 24.4996,
    longitude: 54.3822,
    label: "Qasr Al Watan",
    color: getRandomColor(),
  },
  {
    latitude: 24.4538,
    longitude: 54.3774,
    label: "Central Market",
    color: getRandomColor(),
  },
];

// Helper function to get a random color
function getRandomColor() {
  const colors = ["red", "yellow", "green", "blue"];
  return colors[Math.floor(Math.random() * colors.length)];
}

function MapImplementation({ activeCategory }) {
  const [isClient, setIsClient] = useState(false);
  const [sites, setSites] = useState([]);
  const [allSites, setAllSites] = useState([]);
  const [eventSites, setEventSites] = useState([]);
  const [issueSites, setIssueSites] = useState([]);

  const fetchData = async () => {
    try {
      const events = await apiClient("/events");
      const issues = await apiClient("/issues");
      console.log("event", events);
      console.log("issue", issues);
      const response = await apiClient("/sites");
      const allSitesData = response.data.map((area) => {
        const { name, longitude, latitude } = area;
        let label = name;
        let color = area.status === "active" ? "blue" : "gray";
        return { label, longitude, latitude, color, id: area.id };
      });

      setAllSites(allSitesData);

      // Filter for event sites and issue sites based on siteId in events and issues
      const siteIdsFromEvents = new Set(
        events.data.map((event) => event.siteId)
      );
      const siteIdsFromIssues = new Set(
        issues.data.map((issue) => issue.siteId)
      );

      const filteredEventSites = allSitesData
        .filter((site) => siteIdsFromEvents.has(site.id))
        .map((site) => ({
          ...site,
          color: "red", // Set the color for events to red
        }));

      // Assign green color for issue (inspection) sites
      const filteredIssueSites = allSitesData
        .filter((site) => siteIdsFromIssues.has(site.id))
        .map((site) => ({
          ...site,
          color: "green", // Set the color for issues (inspections) to green
        }));

      setEventSites(filteredEventSites);
      setIssueSites(filteredIssueSites);
    } catch (error) {
      console.log("err", error);
    }
  };

  useEffect(() => {
    setIsClient(true);
    fetchData();
  }, []);

  useEffect(() => {
    if (activeCategory === "event") {
      setSites(eventSites);
    } else if (activeCategory === "inspection") {
      setSites(issueSites);
    } else {
      setSites(allSites);
    }
  }, [activeCategory, eventSites, issueSites, allSites]);

  if (!isClient) return null;

  function MapBounds() {
    const map = useMap();

    useEffect(() => {
      if (locations.length) {
        const bounds = new L.LatLngBounds(
          locations.map((loc) => [loc.latitude, loc.longitude])
        );
        map.fitBounds(bounds);
      }
    }, [map]);

    return null;
  }

  const createCustomIcon = (color) => {
    return new L.Icon({
      iconUrl: `https://www.google.com/intl/en_us/mapfiles/ms/micons/${color}-dot.png`,
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32],
    });
  };

  console.log(sites);
  return (
    <MapContainer
      center={center}
      zoom={0}
      style={{ height: "350px", width: "100%" }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {sites?.map((location, index) => (
        <Marker
          key={index}
          position={[location.latitude, location.longitude]}
          icon={createCustomIcon(location.color)}>
          <Tooltip>{location.label || "No label"}</Tooltip>
        </Marker>
      ))}
      <MapBounds />
    </MapContainer>
  );
}

export default MapImplementation;
