import React, { useEffect, useState, useMemo } from "react";
import "./VehicleInfo.css";
import "./VehicleInfo1.css";
import { baseUrl } from "../Authentication/BASE_URL";

function VehicleInfo() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const [selectedLocation, setSelectedLocation] = useState("all");
  const [selectedModel, setSelectedModel] = useState("all");
  const [selectedAvailability, setSelectedAvailability] = useState("all");
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [activeImage, setActiveImage] = useState("");
  const [imageLoaded, setImageLoaded] = useState(false);

  //SCROLLED STICKY 
const [isScrolled, setIsScrolled] = useState(false);
// useEffect(() => {
//   const handleScroll = () => {
//     if (window.scrollY > 50) {
//       setIsScrolled(true);
//     } else {
//       setIsScrolled(false);
//     }
//   };

//   window.addEventListener('scroll', handleScroll);
//   return () => window.removeEventListener('scroll', handleScroll);
// }, []);
useEffect(() => {
  const handleScroll = () => {
    // Only track for visual effects, not for positioning
    setIsScrolled(window.scrollY > 50);
  };

  window.addEventListener('scroll', handleScroll);
  return () => window.removeEventListener('scroll', handleScroll);
}, []);

  //SCROLLED STICKY 

  // useEffect(() => {
  //   fetchVehicles();
  // }, []);

  useEffect(() => {
  fetchVehicles();

  const interval = setInterval(() => {
    fetchVehicles();
  }, 300000); // every 5 Minutes

  return () => clearInterval(interval);
}, []);

  const fetchVehicles = async () => {
    try {
      const response = await fetch(`${baseUrl}/getVehiclesAvailability`);
      const data = await response.json();

      if (data.success) {
        setVehicles(data.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Unique Locations
  const locations = [
    "all",
    ...new Set(
      vehicles.map((v) => v.location?.toLowerCase().trim()).filter(Boolean),
    ),
  ];

  // ✅ Unique Models
  const models = [
    "all",
    ...new Set(
      vehicles.map((v) => v.model?.toLowerCase().trim()).filter(Boolean),
    ),
  ];

  // ✅ Format Vehicle Number
  const formatVehicleNumber = (number) => {
    return number.replace(/([A-Za-z]+|\d+)/g, "$1 ").trim();
  };

  // ✅ Filter Logic (CORRECT PLACE)
  const filteredVehicles = vehicles.filter((v) => {
    const rawNumber = v.vehicleNumber?.toLowerCase() || "";
    const formattedNumber =
      formatVehicleNumber(v.vehicleNumber)?.toLowerCase() || "";

    // Remove spaces for flexible matching
    const cleanRawNumber = rawNumber.replace(/\s+/g, "");
    const cleanSearch = searchTerm.toLowerCase().replace(/\s+/g, "");

    const model = v.model?.toLowerCase().trim() || "";
    const location = v.location?.toLowerCase().trim() || "";

    const matchesLocation =
      selectedLocation === "all" ? true : location === selectedLocation;

    const matchesModel =
      selectedModel === "all" ? true : model === selectedModel;

    const matchesAvailability =
      selectedAvailability === "all"
        ? true
        : selectedAvailability === "available"
          ? v.isAvailable === true
          : v.isAvailable === false;

    const matchesSearch =
      cleanRawNumber.includes(cleanSearch) || // TN58AQ1070
      formattedNumber.includes(searchTerm.toLowerCase()) || // TN 58 AQ 1070
      rawNumber.includes(searchTerm.toLowerCase()) || // AQ / 1070
      model.includes(searchTerm.toLowerCase()) ||
      location.includes(searchTerm.toLowerCase()) ||
      v.statusReason?.toLowerCase().includes(searchTerm.toLowerCase());

    return (
      matchesLocation && matchesModel && matchesAvailability && matchesSearch
    );
  });

  // ✅ Availability Counts (Dynamic)
  const availableCount = filteredVehicles.filter(
    (v) => v.isAvailable === true,
  ).length;

  const unavailableCount = filteredVehicles.filter(
    (v) => v.isAvailable === false,
  ).length;
  // ✅ Auto Suggestions
  useEffect(() => {
    if (!searchTerm) {
      setSuggestions([]);
      return;
    }

    const lowerSearch = searchTerm.toLowerCase();

    const allSuggestions = vehicles.flatMap((v) => [
      formatVehicleNumber(v.vehicleNumber),
      v.model,
      v.status,
      v.location,
    ]);

    const filteredSuggestions = allSuggestions.filter((item) =>
      item?.toLowerCase().includes(lowerSearch),
    );

    setSuggestions([...new Set(filteredSuggestions)]);
  }, [searchTerm, vehicles]);

  const handleClearSearch = () => {
    setSearchTerm("");
    setSuggestions([]);
    setSelectedLocation("all");
    setSelectedModel("all");
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setSuggestions([]);
    setSelectedLocation("all");
    setSelectedModel("all");
    setSelectedAvailability("all");
  };

  // ✅ Status Mood
  const statusMood = useMemo(() => {
    const total = vehicles.length;
    const available = vehicles.filter((v) => v.isAvailable === true).length;

    if (available === total && total > 0) return "all-available";
    if (available > total / 2) return "mostly-available";
    if (available === 0 && total > 0) return "none-available";
    return "mixed";
  }, [vehicles]);

  const getImageUrl = (path) => {
    if (!path) return "";

    const cleanPath = path
      .replace(/\\/g, "/") // convert \ to /
      .replace("public/", ""); // remove public/

    return `${baseUrl}/${cleanPath}`;
  };

  useEffect(() => {
    if (!activeImage) return;

    const img = new Image();
    img.src = getImageUrl(activeImage);
  }, [activeImage]);

return (
  <div className={`availability-page ${statusMood}`}>
    <div className="hero-section">
      <h1>Roadshow Vehicle Availability</h1>
      <p>Adinn RoadShows</p>
    </div>
    
    <div className={`liquid-dashboard-header ${isScrolled ? 'scrolled' : ''}`}>
      {/* Count Badges */}
      <div className="header-count-container">
        <div className="header-count-badges">
          <div className="count-badge available-badge">
            <span className="count-icon">🟢</span>
            <span className="count-number">{availableCount}</span>
            <span className="count-label">Available</span>
          </div>
          <div className="count-badge unavailable-badge">
            <span className="count-icon">🔴</span>
            <span className="count-number">{unavailableCount}</span>
            <span className="count-label">Unavailable</span>
          </div>
        </div>
      </div>
      
      <div className="liquid-capsule">
        {/* ===== MOBILE VIEW (≤ 768px) ===== */}
        <div className="mobile-view">
          {/* Mobile Filter Row - 3 column grid */}
          <div className="mobile-filter-row">
            <div className="filter-item">
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="mobile-select location-select"
              >
                {locations.map((loc, index) => (
                  <option key={index} value={loc}>
                    {loc === "all"
                    ? "📍 Location"
                    : `📍 ${loc.charAt(0).toUpperCase() + loc.slice(1)}`}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-item">
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="mobile-select model-select"
              >
                {models.map((mod, index) => (
                  <option key={index} value={mod}>
{mod === "all"
                    ? "🚘 Model"
                    : `🚘 ${mod.charAt(0).toUpperCase() + mod.slice(1)}`}                  </option>
                ))}


                
              </select>
            </div>

            <div className="filter-item">
              <select
                value={selectedAvailability}
                onChange={(e) => setSelectedAvailability(e.target.value)}
                className="mobile-select status-select"
              >
                <option value="all">🔵 Status</option>
                <option value="available">🟢 Available</option>
                <option value="unavailable">🔴 Unavailable</option>
              </select>
            </div>
          </div>

          {/* Mobile Search and Clear Row */}
          <div className="mobile-search-row">
            <div className="mobile-search-wrapper">
              <div className="capsule-search mobile-search">
                <span className="search-icon">🔍</span>
                <input
                  type="text"
                  placeholder="Search vehicles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <button className="clear-btn" onClick={handleClearSearch}>
                    ✖
                  </button>
                )}
              </div>
            </div>
            
            {/* Mobile Clear Filters Button - Only shows when filters are active */}
            {(selectedLocation !== "all" || selectedModel !== "all" || selectedAvailability !== "all") && (
              <button className="mobile-clear-filters" onClick={handleClearFilters}>
               Clear
              </button>
            )}
          </div>

          {/* Mobile Active Filters Tags - Shows current filters */}
          {/* {(selectedLocation !== "all" || selectedModel !== "all" || selectedAvailability !== "all") && (
            <div className="mobile-active-filters">
              {selectedLocation !== "all" && (
                <span className="filter-tag">
                  📍 {selectedLocation}
                  <button onClick={() => setSelectedLocation("all")}>✕</button>
                </span>
              )}
              {selectedModel !== "all" && (
                <span className="filter-tag">
                  🚘 {selectedModel}
                  <button onClick={() => setSelectedModel("all")}>✕</button>
                </span>
              )}
              {selectedAvailability !== "all" && (
                <span className="filter-tag">
                  {selectedAvailability === "available" ? "🟢 Available" : "🔴 Unavailable"}
                  <button onClick={() => setSelectedAvailability("all")}>✕</button>
                </span>
              )}
            </div>
          )} */}
        </div>

        {/* ===== DESKTOP VIEW (> 768px) ===== */}
        <div className="desktop-view">
          {/* Desktop Dropdown Filters */}
          <div className="capsule-dropdowns">
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="dashboard-select"
            >
              {locations.map((loc, index) => (
                <option key={index} value={loc}>
                  {loc === "all"
                    ? "📍 All Locations"
                    : `📍 ${loc.charAt(0).toUpperCase() + loc.slice(1)}`}
                </option>
              ))}
            </select>

            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="dashboard-select"
            >
              {models.map((mod, index) => (
                <option key={index} value={mod}>
                  {mod === "all"
                    ? "🚘 All Models"
                    : `🚘 ${mod.charAt(0).toUpperCase() + mod.slice(1)}`}
                </option>
              ))}
            </select>

            <select
              value={selectedAvailability}
              onChange={(e) => setSelectedAvailability(e.target.value)}
              className="dashboard-select"
            >
              <option value="all">🔵 All Status</option>
              <option value="available">🟢 Available</option>
              <option value="unavailable">🔴 Unavailable</option>
            </select>
             {/* Desktop Clear Filters Button */}
            {(selectedLocation !== "all" || selectedModel !== "all" || selectedAvailability !== "all") && (
              <button className="desktop-clear-filters" onClick={handleClearFilters}>
                Clear Filters
              </button>
            )}
          </div>

          {/* Desktop Search and Clear Section */}
          <div className="desktop-actions">
            <div className="capsule-search desktop-search">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                placeholder="Search by number, model, location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button className="clear-btn" onClick={handleClearSearch}>
                  ✖
                </button>
              )}
            </div>

          </div>
        </div>

        {/* Suggestions Dropdown - Common for both views */}
        {searchTerm && suggestions.length > 0 && (
          <ul className="glass-dropdown">
            {suggestions.slice(0, 5).map((suggestion, index) => (
              <li
                key={index}
                onClick={() => {
                  setSearchTerm(suggestion);
                  setSuggestions([]);
                }}
              >
                {suggestion}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>

    {/* Vehicle List Section */}
    {loading ? (
      <p style={{ textAlign: "center" }}>Loading...</p>
    ) : (
      <div className="vehicle-container">
        {filteredVehicles.length > 0 ? (
          filteredVehicles.map((vehicle) => (
            <div
              key={vehicle._id}
              className="vehicle-card"
              onClick={() => {
                setSelectedVehicle(vehicle);
                setActiveImage(vehicle.images?.[0]);
              }}
            >
              <div className="vehicle-left">
                <h3>🚘 {vehicle.model}</h3>
                <p>🚚 {formatVehicleNumber(vehicle.vehicleNumber)}</p>
                <p>
                  📍{" "}
                  {(() => {
                    const firstWord =
                      vehicle.location?.trim().split(" ")[0] || "";
                    return (
                      firstWord.charAt(0).toUpperCase() +
                      firstWord.slice(1).toLowerCase()
                    );
                  })()}
                </p>
              </div>

              <div className="vehicle-right">
                <div
                  className={`status-badge ${vehicle.isAvailable ? "available" : "unavailable"}`}
                >
                  {vehicle.isAvailable
                    ? "Available"
                    : vehicle.statusReason || "Unavailable"}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="no-results" style={{textAlign:'center'}}>
            <p>No vehicles match your filters</p>
            <button onClick={handleClearFilters} className="clear-all-btn">
              Clear All Filters
            </button>
          </div>
        )}
      </div>
    )}

    {/* Vehicle Modal */}
    {selectedVehicle && (
      <div className="neo-overlay" onClick={() => setSelectedVehicle(null)}>
        <div className="neo-modal" onClick={(e) => e.stopPropagation()}>
          {/* LEFT IMAGE SECTION */}
          <div className="neo-image-section">
            <img
              key={activeImage}
              src={getImageUrl(activeImage)}
              alt="Vehicle"
              className="neo-main-image"
            />

            <div className="neo-thumbnails">
              {selectedVehicle.images?.map((img, index) => (
                <img
                  key={index}
                  src={getImageUrl(img)}
                  alt="thumb"
                  className={`neo-thumb ${activeImage === img ? "neo-active" : ""}`}
                  onClick={() => setActiveImage(img)}
                />
              ))}
            </div>
          </div>

          {/* RIGHT DETAILS SECTION */}
          <div className="neo-details-section">
            <button
              className="neo-close"
              onClick={() => setSelectedVehicle(null)}
            >
              ✕
            </button>
            
            <div className="newContentRightMain">
              <div className="neoHeadingNew">{selectedVehicle.model}</div>

              <table className="neoContentsMain">
                <tbody>
                  <tr>
                    <td className="newContentLeft">Vehicle Number</td>
                    <td className="newContentLeft">
                      🆔 {formatVehicleNumber(selectedVehicle.vehicleNumber)}
                    </td>
                  </tr>

                  <tr>
                    <td className="newContentLeft">Location</td>
                    <td className="newContentLeft">
                      📍 {selectedVehicle.location
                        ? selectedVehicle.location.charAt(0).toUpperCase() +
                        selectedVehicle.location.slice(1).toLowerCase()
                        : ""}
                    </td>
                  </tr>

                  <tr>
                    <td className="newContentLeft">Status</td>
                    <td
                      className={`${selectedVehicle.isAvailable
                        ? "neo-available highlight"
                        : "neo-unavailable"
                      } newContentLeft`}
                    >
                      {selectedVehicle.isAvailable
                        ? "🟢 Available"
                        : `🔴 ${selectedVehicle.statusReason
                          ? selectedVehicle.statusReason.charAt(0).toUpperCase() +
                          selectedVehicle.statusReason.slice(1).toLowerCase()
                          : "Unavailable"
                        }`}
                    </td>
                  </tr>

                  <tr>
                    <td className="newContentLeft">Speaker</td>
                    <td className="newContentLeft">
                      🔊 {selectedVehicle.speaker
                        ? `${selectedVehicle.speaker} (${selectedVehicle.speakerNos || 0} Nos)`
                        : "N/A"}
                    </td>
                  </tr>

                  <tr>
                    <td className="newContentLeft">Generator</td>
                    <td className="newContentLeft">
                      ⚡{selectedVehicle.generator
                        ? `${selectedVehicle.generator} (${selectedVehicle.generatorNos || 0} Nos)`
                        : "N/A"}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    )}
  </div>
);
}

export default VehicleInfo;



// import React, { useEffect, useState, useMemo } from "react";
// import "./VehicleInfo.css";
// import "./VehicleInfo1.css";
// import { baseUrl } from "../Authentication/BASE_URL";

// function VehicleInfo() {
//   const [vehicles, setVehicles] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const [searchTerm, setSearchTerm] = useState("");
//   const [suggestions, setSuggestions] = useState([]);

//   const [selectedLocation, setSelectedLocation] = useState("all");
//   const [selectedModel, setSelectedModel] = useState("all");
//   const [selectedAvailability, setSelectedAvailability] = useState("all");
//   const [selectedVehicle, setSelectedVehicle] = useState(null);
//   const [activeImage, setActiveImage] = useState("");
//   const [imageLoaded, setImageLoaded] = useState(false);

//   //SCROLLED STICKY 
//   const [isScrolled, setIsScrolled] = useState(false);

//   useEffect(() => {
//     const handleScroll = () => {
//       // Only track for visual effects, not for positioning
//       setIsScrolled(window.scrollY > 50);
//     };

//     window.addEventListener('scroll', handleScroll);
//     return () => window.removeEventListener('scroll', handleScroll);
//   }, []);

//   useEffect(() => {
//     fetchVehicles();

//     const interval = setInterval(() => {
//       fetchVehicles();
//     }, 300000); // every 5 Minutes

//     return () => clearInterval(interval);
//   }, []);

//   const fetchVehicles = async () => {
//     try {
//       const response = await fetch(`${baseUrl}/getVehiclesAvailability`);
//       const data = await response.json();

//       if (data.success) {
//         setVehicles(data.data);
//       }
//     } catch (error) {
//       console.error(error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ✅ Unique Locations
//   const locations = [
//     "all",
//     ...new Set(
//       vehicles.map((v) => v.location?.toLowerCase().trim()).filter(Boolean),
//     ),
//   ];

//   // ✅ Unique Models
//   const models = [
//     "all",
//     ...new Set(
//       vehicles.map((v) => v.model?.toLowerCase().trim()).filter(Boolean),
//     ),
//   ];

//   // ✅ Format Vehicle Number
//   const formatVehicleNumber = (number) => {
//     return number.replace(/([A-Za-z]+|\d+)/g, "$1 ").trim();
//   };

//   // ✅ Filter Logic (CORRECT PLACE)
//   const filteredVehicles = vehicles.filter((v) => {
//     const rawNumber = v.vehicleNumber?.toLowerCase() || "";
//     const formattedNumber =
//       formatVehicleNumber(v.vehicleNumber)?.toLowerCase() || "";

//     // Remove spaces for flexible matching
//     const cleanRawNumber = rawNumber.replace(/\s+/g, "");
//     const cleanSearch = searchTerm.toLowerCase().replace(/\s+/g, "");

//     const model = v.model?.toLowerCase().trim() || "";
//     const location = v.location?.toLowerCase().trim() || "";

//     const matchesLocation =
//       selectedLocation === "all" ? true : location === selectedLocation;

//     const matchesModel =
//       selectedModel === "all" ? true : model === selectedModel;

//     const matchesAvailability =
//       selectedAvailability === "all"
//         ? true
//         : selectedAvailability === "available"
//           ? v.isAvailable === true
//           : v.isAvailable === false;

//     const matchesSearch =
//       cleanRawNumber.includes(cleanSearch) || // TN58AQ1070
//       formattedNumber.includes(searchTerm.toLowerCase()) || // TN 58 AQ 1070
//       rawNumber.includes(searchTerm.toLowerCase()) || // AQ / 1070
//       model.includes(searchTerm.toLowerCase()) ||
//       location.includes(searchTerm.toLowerCase()) ||
//       v.statusReason?.toLowerCase().includes(searchTerm.toLowerCase());

//     return (
//       matchesLocation && matchesModel && matchesAvailability && matchesSearch
//     );
//   });

//   // ✅ Availability Counts (Dynamic)
//   const availableCount = filteredVehicles.filter(
//     (v) => v.isAvailable === true,
//   ).length;

//   const unavailableCount = filteredVehicles.filter(
//     (v) => v.isAvailable === false,
//   ).length;

//   // ✅ Total counts (for unfiltered view)
//   const totalAvailable = vehicles.filter((v) => v.isAvailable === true).length;
//   const totalUnavailable = vehicles.filter((v) => v.isAvailable === false).length;

//   // ✅ Auto Suggestions
//   useEffect(() => {
//     if (!searchTerm) {
//       setSuggestions([]);
//       return;
//     }

//     const lowerSearch = searchTerm.toLowerCase();

//     const allSuggestions = vehicles.flatMap((v) => [
//       formatVehicleNumber(v.vehicleNumber),
//       v.model,
//       v.status,
//       v.location,
//     ]);

//     const filteredSuggestions = allSuggestions.filter((item) =>
//       item?.toLowerCase().includes(lowerSearch),
//     );

//     setSuggestions([...new Set(filteredSuggestions)]);
//   }, [searchTerm, vehicles]);

//   const handleClearSearch = () => {
//     setSearchTerm("");
//     setSuggestions([]);
//   };

//   const handleClearFilters = () => {
//     setSearchTerm("");
//     setSuggestions([]);
//     setSelectedLocation("all");
//     setSelectedModel("all");
//     setSelectedAvailability("all");
//   };

//   // ✅ Status Mood
//   const statusMood = useMemo(() => {
//     const total = vehicles.length;
//     const available = vehicles.filter((v) => v.isAvailable === true).length;

//     if (available === total && total > 0) return "all-available";
//     if (available > total / 2) return "mostly-available";
//     if (available === 0 && total > 0) return "none-available";
//     return "mixed";
//   }, [vehicles]);

//   const getImageUrl = (path) => {
//     if (!path) return "";

//     const cleanPath = path
//       .replace(/\\/g, "/") // convert \ to /
//       .replace("public/", ""); // remove public/

//     return `${baseUrl}/${cleanPath}`;
//   };

//   useEffect(() => {
//     if (!activeImage) return;

//     const img = new Image();
//     img.src = getImageUrl(activeImage);
//   }, [activeImage]);

//   return (
//     <div className={`availability-page ${statusMood}`}>
//       <div className="hero-section">
//         <h1>Roadshow Vehicle Availability</h1>
//         <p>Adinn RoadShows</p>
//       </div>

//       <div className={`liquid-dashboard-header ${isScrolled ? 'scrolled' : ''}`}>
//         {/* New beautifully integrated count badges */}
//         <div className="header-count-container">
//           <div className="header-count-badges">
//             <div className="count-badge available-badge">
//               <span className="count-icon">🟢</span>
//               <span className="count-number">{availableCount}</span>
//               <span className="count-label">Available</span>
//               {availableCount !== totalAvailable && (
//                 <span className="count-subtle">(of {totalAvailable})</span>
//               )}
//             </div>
//             <div className="count-badge unavailable-badge">
//               <span className="count-icon">🔴</span>
//               <span className="count-number">{unavailableCount}</span>
//               <span className="count-label">Unavailable</span>
//               {unavailableCount !== totalUnavailable && (
//                 <span className="count-subtle">(of {totalUnavailable})</span>
//               )}
//             </div>
//           </div>
//         </div>

//         <div className="liquid-capsule">
//           {/* Dropdown Filters */}
//           <div className="capsule-dropdowns">
//             {/* Location */}
//             <select
//               value={selectedLocation}
//               onChange={(e) => setSelectedLocation(e.target.value)}
//               className="dashboard-select"
//             >
//               {locations.map((loc, index) => (
//                 <option key={index} value={loc}>
//                   {loc === "all"
//                     ? "All Locations"
//                     : loc.charAt(0).toUpperCase() + loc.slice(1)}
//                 </option>
//               ))}
//             </select>

//             {/* Model */}
//             <select
//               value={selectedModel}
//               onChange={(e) => setSelectedModel(e.target.value)}
//               className="dashboard-select"
//             >
//               {models.map((mod, index) => (
//                 <option key={index} value={mod}>
//                   {mod === "all"
//                     ? "All Models"
//                     : mod.charAt(0).toUpperCase() + mod.slice(1)}
//                 </option>
//               ))}
//             </select>

//             {/* Availability */}
//             <select
//               value={selectedAvailability}
//               onChange={(e) => setSelectedAvailability(e.target.value)}
//               className="dashboard-select"
//             >
//               <option value="all">All Status</option>
//               <option value="available">Available</option>
//               <option value="unavailable">Unavailable</option>
//             </select>
            
//             {(selectedLocation !== "all" ||
//               selectedModel !== "all" ||
//               selectedAvailability !== "all" || 
//               searchTerm) && (
//                 <button className="clear-filter-btn" onClick={handleClearFilters}>
//                   Clear All Filters
//                 </button>
//               )}
//           </div>

//           <div className="right-section">
//             <div className="capsule-search">
//               <span className="search-icon">🔍</span>

//               <input
//                 type="text"
//                 placeholder="Search vehicle, model, location or status..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//               />

//               {searchTerm && (
//                 <button className="clear-btn" onClick={handleClearSearch}>
//                   ✖
//                 </button>
//               )}

//               {searchTerm && suggestions.length > 0 && (
//                 <ul className="glass-dropdown">
//                   {suggestions.slice(0, 5).map((suggestion, index) => (
//                     <li
//                       key={index}
//                       onClick={() => {
//                         setSearchTerm(suggestion);
//                         setSuggestions([]);
//                       }}
//                     >
//                       {suggestion}
//                     </li>
//                   ))}
//                 </ul>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>

//       {loading ? (
//         <p style={{ textAlign: "center", color: "white" }}>Loading...</p>
//       ) : (
//         <div className="vehicle-container">
//           {filteredVehicles.length > 0 ? (
//             filteredVehicles.map((vehicle) => (
//               <div
//                 key={vehicle._id}
//                 className="vehicle-card"
//                 onClick={() => {
//                   setSelectedVehicle(vehicle);
//                   setActiveImage(vehicle.images?.[0]); // first image default
//                 }}
//               >
//                 <div className="vehicle-left">
//                   <h3>🚘 {vehicle.model}</h3>
//                   <p>🚚 {formatVehicleNumber(vehicle.vehicleNumber)}</p>
//                   <p>
//                     📍{" "}
//                     {(() => {
//                       const firstWord =
//                         vehicle.location?.trim().split(" ")[0] || "";
//                       return (
//                         firstWord.charAt(0).toUpperCase() +
//                         firstWord.slice(1).toLowerCase()
//                       );
//                     })()}
//                   </p>
//                 </div>

//                 <div className="vehicle-right">
//                   <span
//                     className={`status-badge ${vehicle.isAvailable ? "available" : "unavailable"
//                       }`}
//                   >
//                     {vehicle.isAvailable
//                       ? "Available"
//                       : vehicle.statusReason || "Unavailable"}
//                   </span>
//                 </div>
//               </div>
//             ))
//           ) : (
//             <p style={{ textAlign: "center", color: "white", fontSize: "18px" }}>
//               No vehicles match your filters
//             </p>
//           )}
//         </div>
//       )}
      
//       {selectedVehicle && (
//         <div className="neo-overlay" onClick={() => setSelectedVehicle(null)}>
//           <div className="neo-modal" onClick={(e) => e.stopPropagation()}>
//             {/* LEFT IMAGE SECTION */}
//             <div className="neo-image-section">
//               <img
//                 key={activeImage}
//                 src={getImageUrl(activeImage)}
//                 alt="Vehicle"
//                 className="neo-main-image"
//               />

//               <div className="neo-thumbnails">
//                 {selectedVehicle.images?.map((img, index) => (
//                   <img
//                     key={index}
//                     src={getImageUrl(img)}
//                     alt="thumb"
//                     className={`neo-thumb ${activeImage === img ? "neo-active" : ""
//                       }`}
//                     onClick={() => setActiveImage(img)}
//                   />
//                 ))}
//               </div>
//             </div>

//             {/* RIGHT DETAILS SECTION */}
//             <div className="neo-details-section">
//               <button
//                 className="neo-close"
//                 onClick={() => setSelectedVehicle(null)}
//               >
//                 ✕
//               </button>
//               {/* NEWLY CHANGED UI  */}
//               <div className="newContentRightMain">
//                 <div className="neoHeadingNew">{selectedVehicle.model}</div>

//                 <table className="neoContentsMain">
//                   <tbody>
//                     <tr>
//                       <td className="newContentLeft">Vehicle Number</td>
//                       <td className="newContentLeft">
//                         🆔 {formatVehicleNumber(selectedVehicle.vehicleNumber)}
//                       </td>
//                     </tr>

//                     <tr>
//                       <td className="newContentLeft">Location</td>
//                       <td className="newContentLeft">
//                         📍 {selectedVehicle.location
//                           ? selectedVehicle.location.charAt(0).toUpperCase() +
//                           selectedVehicle.location.slice(1).toLowerCase()
//                           : ""}
//                       </td>
//                     </tr>

//                     <tr>
//                       <td className="newContentLeft">Status</td>
//                       <td
//                         className={`${selectedVehicle.isAvailable
//                           ? "neo-available highlight"
//                           : "neo-unavailable"
//                           } newContentLeft`}
//                       >
//                         {selectedVehicle.isAvailable
//                           ? "🟢 Available"
//                           : `🔴 ${selectedVehicle.statusReason
//                             ? selectedVehicle.statusReason.charAt(0).toUpperCase() +
//                             selectedVehicle.statusReason.slice(1).toLowerCase()
//                             : "Unavailable"
//                           }`}
//                       </td>
//                     </tr>

//                     <tr>
//                       <td className="newContentLeft">Speaker</td>
//                       <td className="newContentLeft">
//                         🔊 {selectedVehicle.speaker
//                           ? `${selectedVehicle.speaker} (${selectedVehicle.speakerNos || 0} Nos)`
//                           : "N/A"}
//                       </td>
//                     </tr>

//                     <tr>
//                       <td className="newContentLeft">Generator</td>
//                       <td className="newContentLeft">
//                         ⚡{selectedVehicle.generator
//                           ? `${selectedVehicle.generator} (${selectedVehicle.generatorNos || 0} Nos)`
//                           : "N/A"}
//                       </td>
//                     </tr>
//                   </tbody>
//                 </table>
//               </div>
//               {/* NEWLY CHANGED UI  */}
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default VehicleInfo;