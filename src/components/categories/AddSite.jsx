// import React, { useState, useEffect } from "react";

// import Modal from "./GeneralModal";

// import {
//   MapContainer,
//   TileLayer,
//   Marker,
//   useMapEvents,
//   Popup,
// } from "react-leaflet";
// import L from "leaflet";
// import "leaflet/dist/leaflet.css";
// import { HiSearch } from "react-icons/hi";
// import apiClient from "@/helpers/interceptor";
// import { toast } from "react-toastify";

// // Set default marker icon (Leaflet doesn't automatically set it in React)
// delete L.Icon.Default.prototype._getIconUrl;
// L.Icon.Default.mergeOptions({
//   iconRetinaUrl:
//     "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon-2x.png",
//   iconUrl:
//     "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon.png",
//   shadowUrl:
//     "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-shadow.png",
// });

// const AddSite = ({ isOpen, onClose, refreshList, siteId }) => {
//   const [position, setPosition] = useState(null);
//   const [locationName, setLocationName] = useState("");
//   const [searchQuery, setSearchQuery] = useState("");
//   const [searchResult, setSearchResult] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(false);
//   const [name, setName] = useState("");
//   const [site, setSite] = useState({});
//   useEffect(() => {
//     if (siteId) {
//       apiClient
//         .get(`/sites/${siteId}`)
//         .then((response) => {
//           const res = response.data.result;
//           setSite(res);
//           setSearchResult([res.latitude, res.longitude]);
//         })
//         .catch((err) => {
//           console.log(err);
//           setLoading(false);
//         });
//     }
//   }, [siteId]);
//   // Capture click event on the map to get latitude and longitude
//   const LocationMarker = () => {
//     useMapEvents({
//       click(e) {
//         const { lat, lng } = e.latlng;
//         setPosition([lat, lng]);
//         setSearchQuery("");
//         // Reverse geocoding to get location name
//         fetch(
//           `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
//         )
//           .then((response) => response.json())
//           .then((data) => {
//             console.log("data-->", data);
//             const location = data.display_name || "Unknown location";
//             setLocationName(location);
//           });
//       },
//     });

//     return position === null ? null : (
//       <Marker position={position}>
//         {/* You can add popups to show coordinates */}
//         <Popup>{locationName}</Popup>
//       </Marker>
//     );
//   };

//   // Handle place search by name
//   const handleSearch = () => {
//     fetch(
//       `https://nominatim.openstreetmap.org/search?q=${searchQuery}&format=json&limit=1`
//     )
//       .then((response) => response.json())
//       .then((data) => {
//         if (data.length > 0) {
//           console.log("data-->", data);
//           const lat = parseFloat(data[0].lat);
//           const lon = parseFloat(data[0].lon);
//           setSearchResult([lat, lon]);
//           setPosition([lat, lon]);
//           setLocationName(data[0].display_name);
//         } else {
//           alert("Location not found");
//         }
//       });
//   };
//   const handleSubmit = async () => {
//     const body = {
//       longitude: position ? position[0] : "NA",
//       latitude: position ? position[1] : "NA",
//       location: locationName ? locationName : "NA",
//       name: name,
//     };

//     setLoading(true);
//     try {
//       let response;
//       if (siteId) {
//         response = await apiClient.post(`/sub-sites/${siteId}/site`, body);
//       } else {
//         response = await apiClient.post("/sites", body);
//       }
//       if (response) {
//         toast.success("Site added successfully");
//         onClose(false);
//         setLoading(false);
//         await refreshList();
//       }
//     } catch (err) {
//       console.log(err);
//       setLoading(false);
//     }
//   };
//   return (
//     <Modal
//       isOpen={isOpen}
//       onClose={onClose}
//       onSave={handleSubmit}
//       buttonText="Add Site"
//       bg="bg-buttonColorPrimary"
//       title="Add Site"
//       loading={loading}>
//       <div className="flex flex-col w-[100%] space-y-4 overflow-y-auto max-h-[70vh] justify-between">
//         <h1 className="text-gray-950 text-[14px] font-semibold">
//           Select a Place on the Map
//         </h1>

//         {/* Search input for place name */}
//         <div className="flex justify-between relative">
//           <input
//             type="text"
//             className="border rounded p-2 pl-10 w-full text-black focus:border-buttonColorPrimary focus:outline-none"
//             placeholder="Search place by name"
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//           />
//           <div onClick={handleSearch}>
//             <HiSearch className="absolute cursor-pointer top-1/2 left-3 transform -translate-y-1/2 text-gray-500" />
//           </div>
//         </div>

//         <div style={{ height: "400px", marginTop: "20px" }}>
//           {/* Leaflet map container */}
//           <MapContainer
//             center={searchResult || [51.505, -0.09]} // Default center
//             zoom={13}
//             style={{ height: "100%", width: "100%" }}>
//             <TileLayer
//               url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//               attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//             />
//             {/* Location marker component to handle clicks */}
//             <LocationMarker />
//           </MapContainer>
//         </div>

//         {/* Display selected coordinates and location name */}
//         <div style={{ marginTop: "20px" }}>
//           <p className="text-gray-600">
//             <span className="font-medium">Selected Latitude:</span>{" "}
//             {position ? position[0] : "N/A"}
//           </p>
//           <p className="text-gray-600">
//             <span className="font-medium">Selected Longitude:</span>{" "}
//             {position ? position[1] : "N/A"}
//           </p>
//           <p className="text-gray-600">
//             <span className="font-medium">Location Name:</span>{" "}
//             {locationName || "N/A"}
//           </p>
//           <div className="flex justify-start">
//             <label className={`text-gray-600 py-1 font-medium mr-2`}>
//               Site Name
//             </label>
//             <input
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//               placeholder="Enter site name"
//               className={` block px-2 py-1 border text-black ${
//                 error
//                   ? "border-red-500 focus:border-buttonColorPrimary focus:outline-none"
//                   : "border-gray-300 focus:border-buttonColorPrimary focus:outline-none"
//               } rounded`}
//             />
//             {error && <div className="text-red-500 text-xs mt-1">{error}</div>}
//           </div>
//         </div>
//       </div>
//     </Modal>
//   );
// };

// export default AddSite;

import React, { useState, useEffect } from "react";
import Modal from "./GeneralModal";
import {
  GoogleMap,
  LoadScript,
  Marker,
  useJsApiLoader,
} from "@react-google-maps/api";
import { HiSearch } from "react-icons/hi";
import apiClient from "@/helpers/interceptor";
import { toast } from "react-toastify";

const libraries = ["places"]; // Load the Places library

const AddSite = ({ isOpen, onClose, refreshList, siteId }) => {
  const [position, setPosition] = useState(null);
  const [locationName, setLocationName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [name, setName] = useState("");
  const [site, setSite] = useState({});

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyAuxgcHQ7znSe03vNW6Y-AswK8MfRPuv_Q", // Replace with your API key
    libraries,
  });

  useEffect(() => {
    if (siteId) {
      apiClient
        .get(`/sites/${siteId}`)
        .then((response) => {
          const res = response.data.result;
          setSite(res);
          setPosition({ lat: res.latitude, lng: res.longitude });
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    } else {
      // Set the initial position to Oman if no siteId is provided
      setPosition({ lat: 20.448, lng: 56.177 });
    }
  }, [siteId]);

  const handleSearchChange = async (e) => {
    setSearchQuery(e.target.value);

    if (e.target.value) {
      const service = new window.google.maps.places.AutocompleteService();
      service.getPlacePredictions(
        { input: e.target.value, types: ["geocode"] },
        (predictions, status) => {
          if (status === window.google.maps.places.PlacesServiceStatus.OK) {
            setSearchResults(predictions);
          }
        }
      );
    } else {
      setSearchResults([]);
    }
  };

  const handleSelectSearchResult = async (place) => {
    setSearchQuery(place.description);
    setSearchResults([]);

    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ address: place.description }, (results, status) => {
      if (status === "OK" && results[0]) {
        const { lat, lng } = results[0].geometry.location;
        setPosition({ lat: lat(), lng: lng() });
        setLocationName(results[0].formatted_address);
      }
    });
  };

  const handleSubmit = async () => {
    const body = {
      longitude: position ? position.lng : "NA",
      latitude: position ? position.lat : "NA",
      location: locationName ? locationName : "NA",
      name: name,
    };

    setLoading(true);
    try {
      let response;
      if (siteId) {
        response = await apiClient.post(`/sub-sites/${siteId}/site`, body);
      } else {
        response = await apiClient.post("/sites", body);
      }
      console.log("response in site", response);
      if (response) {
        toast.success("Site added successfully");
        setName("");
        setLocationName("");
        setPosition({ lat: 20.448, lng: 56.177 });
        setSearchQuery("");
        onClose(false);
        setLoading(false);
        await refreshList();
      }
    } catch (err) {
      toast.error(err.response.data.message);
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        setPosition({ lat: 20.448, lng: 56.177 });
        onClose(false);
      }}
      onSave={handleSubmit}
      buttonText="Add Site"
      bg="bg-buttonColorPrimary"
      title="Add Site"
      loading={loading}>
      <div className="flex flex-col w-full space-y-4 overflow-y-auto max-h-[70vh]">
        <h1 className="text-gray-950 text-[14px] font-semibold">
          Select a Place on the Map
        </h1>

        {/* Search input with dropdown for place name */}
        <div className="relative">
          <input
            type="text"
            className="border rounded p-2 pl-10 w-full text-black focus:border-buttonColorPrimary focus:outline-none"
            placeholder="Search place by name"
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <HiSearch className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-500" />
          {searchResults.length > 0 && (
            <ul className="absolute bg-white text-black border rounded w-full mt-1 max-h-40 overflow-y-auto z-10">
              {searchResults.map((result) => (
                <li
                  key={result.place_id}
                  onClick={() => handleSelectSearchResult(result)}
                  className="cursor-pointer text-black p-2 hover:bg-gray-200">
                  {result.description}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div style={{ height: "400px", marginTop: "20px" }}>
          {isLoaded ? (
            <GoogleMap
              center={position || { lat: 20.448, lng: 56.177 }}
              zoom={5}
              mapContainerStyle={{ height: "100%", width: "100%" }}
              onClick={(e) => {
                const lat = e.latLng.lat();
                const lng = e.latLng.lng();
                setPosition({ lat, lng });

                const geocoder = new window.google.maps.Geocoder();
                geocoder.geocode(
                  { location: { lat, lng } },
                  (results, status) => {
                    if (status === "OK" && results[0]) {
                      setLocationName(results[0].formatted_address);
                    }
                  }
                );
              }}>
              {position && <Marker position={position} />}
            </GoogleMap>
          ) : (
            <p>Loading Map...</p>
          )}
        </div>

        {/* Display selected coordinates and location name */}
        <div style={{ marginTop: "20px" }}>
          <p className="text-gray-600">
            <span className="font-medium">Selected Latitude:</span>{" "}
            {position ? position.lat : "N/A"}
          </p>
          <p className="text-gray-600">
            <span className="font-medium">Selected Longitude:</span>{" "}
            {position ? position.lng : "N/A"}
          </p>
          <p className="text-gray-600">
            <span className="font-medium">Location Name:</span>{" "}
            {locationName || "N/A"}
          </p>
          <div className="flex justify-start">
            <label className="text-gray-600 py-1 font-medium mr-2">
              Site Name
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter site name"
              className={`block px-2 py-1 border text-black ${
                error
                  ? "border-red-500 focus:border-buttonColorPrimary"
                  : "border-gray-300 focus:border-buttonColorPrimary"
              } rounded`}
            />
            {error && <div className="text-red-500 text-xs mt-1">{error}</div>}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default AddSite;
