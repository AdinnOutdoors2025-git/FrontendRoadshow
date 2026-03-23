//VEHICLE INFO BASED ON THE ELECTION 
import React, { useEffect, useState, useMemo } from "react";
import "./VehicleInfo.css";
import "./VehicleInfo1.css";
import { baseUrl } from "../Authentication/BASE_URL";

function VehicleInfo() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const [selectedModel, setSelectedModel] = useState("all");
  const [selectedAvailability, setSelectedAvailability] = useState("all");
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [activeImage, setActiveImage] = useState("");
  const [imageLoaded, setImageLoaded] = useState(false);

  //SCROLLED STICKY 
  const [isScrolled, setIsScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    fetchVehicles();
    const interval = setInterval(() => {
      fetchVehicles();
    }, 300000); // every 5 Minutes
    return () => clearInterval(interval);
  }, []);

  const fetchVehicles = async () => {
    try {
      const response = await fetch(`${baseUrl}/getVehiclesAvailabilityElection`);
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

  // ✅ Unique Models (from availability list)
  const models = [
    "all",
    ...new Set(
      vehicles.map((v) => v.modelName?.toLowerCase().trim()).filter(Boolean),
    ),
  ];

  // ✅ Filter Logic
  const filteredVehicles = vehicles.filter((v) => {
    const modelName = v.modelName?.toLowerCase().trim() || "";
    const location = v.location?.toLowerCase().trim() || "";
    const statusReason = v.statusReason?.toLowerCase().trim() || "";
    
    const matchesModel =
      selectedModel === "all" ? true : modelName === selectedModel;

    const matchesAvailability =
      selectedAvailability === "all"
        ? true
        : selectedAvailability === "available"
          ? (v.availableCount > 0)
          : (v.unavailableCount > 0);

    const matchesSearch =
      modelName.includes(searchTerm.toLowerCase()) ||
      location.includes(searchTerm.toLowerCase()) ||
      statusReason.includes(searchTerm.toLowerCase()) ||
      v.availableCount?.toString().includes(searchTerm) ||
      v.unavailableCount?.toString().includes(searchTerm) ||
      v.remainingCount?.toString().includes(searchTerm);

    return (
      matchesModel && matchesAvailability && matchesSearch
    );
  });

  // ✅ Availability Counts (Dynamic)
  const totalAvailable = filteredVehicles.reduce((sum, v) => sum + (v.availableCount || 0), 0);
  const totalUnavailable = filteredVehicles.reduce((sum, v) => sum + (v.unavailableCount || 0), 0);
  const totalRemaining = filteredVehicles.reduce((sum, v) => sum + (v.remainingCount || 0), 0);
console.log("Total remaining",totalAvailable, totalUnavailable,  totalRemaining);


  // ✅ Auto Suggestions
  useEffect(() => {
    if (!searchTerm) {
      setSuggestions([]);
      return;
    }

    const lowerSearch = searchTerm.toLowerCase();

    const allSuggestions = vehicles.flatMap((v) => [
      v.modelName,
      v.location,
      v.statusReason,
      `${v.availableCount} available`,
      `${v.unavailableCount} unavailable`,
      `${v.remainingCount} remaining`
    ]);

    const filteredSuggestions = allSuggestions.filter((item) =>
      item?.toLowerCase().includes(lowerSearch),
    );

    setSuggestions([...new Set(filteredSuggestions)]);
  }, [searchTerm, vehicles]);

  const handleClearSearch = () => {
    setSearchTerm("");
    setSuggestions([]);
    setSelectedModel("all");
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setSuggestions([]);
    setSelectedModel("all");
    setSelectedAvailability("all");
  };

  // ✅ Status Mood
  const statusMood = useMemo(() => {
    const total = vehicles.length;
    const modelsWithAvailable = vehicles.filter((v) => v.availableCount > 0).length;

    if (modelsWithAvailable === total && total > 0) return "all-available";
    if (modelsWithAvailable > total / 2) return "mostly-available";
    if (modelsWithAvailable === 0 && total > 0) return "none-available";
    return "mixed";
  }, [vehicles]);

  return (
    <div className={`availability-page ${statusMood}`}>
      <div className="hero-section">
        <h1>Vehicle Availability List</h1>
        <p>Adinn RoadShows</p>
      </div>
      
      <div className={`liquid-dashboard-header ${isScrolled ? 'scrolled' : ''}`}>
        {/* Count Badges */}
        <div className="header-count-container">
          <div className="header-count-badges">
            <div className="count-badge available-badge">
              <span className="count-icon">🟢</span>
              <span className="count-number">{totalAvailable}</span>
              <span className="count-label">Available</span>
            </div>
            <div className="count-badge unavailable-badge">
              <span className="count-icon">🔴</span>
              <span className="count-number">{totalUnavailable}</span>
              <span className="count-label">Unavailable</span>
            </div>
             <div className="count-badge remaining-badge">
              <span className="count-icon">🟡
              {/* 🟠 */}
              </span>
              <span className="count-number">{totalRemaining}</span>
              <span className="count-label">Remaining</span>
            </div>
          </div>
        </div>
        
        <div className="liquid-capsule">
          {/* ===== MOBILE VIEW (≤ 768px) ===== */}
          <div className="mobile-view">
            {/* Mobile Filter Row - 2 column grid */}
            <div className="mobile-filter-row" style={{ gridTemplateColumns: "1fr 1fr" }}>
              <div className="filter-item">
                <select
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  className="mobile-select model-select"
                >
                  {models.map((mod, index) => (
                    <option key={index} value={mod}>
                      {mod === "all"
                        ? "🚘 All Models"
                        : `🚘 ${mod.charAt(0).toUpperCase() + mod.slice(1)}`}
                    </option>
                  ))}
                </select>
              </div>
{/* ALL STATUS FILTER  */}
              {/* <div className="filter-item">
                <select
                  value={selectedAvailability}
                  onChange={(e) => setSelectedAvailability(e.target.value)}
                  className="mobile-select status-select"
                >
                  <option value="all">🔵 All Status</option>
                  <option value="available">🟢 Available</option>
                  <option value="unavailable">🔴 Unavailable</option>
                </select>
              </div> */}

            </div>

            {/* Mobile Search and Clear Row */}
            <div className="mobile-search-row">
              <div className="mobile-search-wrapper">
                <div className="capsule-search mobile-search">
                  <span className="search-icon">🔍</span>
                  <input
                    type="text"
                    placeholder="Search by model, location, count..."
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
              {(selectedModel !== "all" || selectedAvailability !== "all") && (
                <button className="mobile-clear-filters" onClick={handleClearFilters}>
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* ===== DESKTOP VIEW (> 768px) ===== */}
          <div className="desktop-view">
            {/* Desktop Dropdown Filters */}
            <div className="capsule-dropdowns">
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
{/* ALL STATUS FILTER  */}
              {/* <select
                value={selectedAvailability}
                onChange={(e) => setSelectedAvailability(e.target.value)}
                className="dashboard-select"
              >
                <option value="all">🔵 All Status</option>
                <option value="available">🟢 Available Only</option>
                <option value="unavailable">🔴 Unavailable Only</option>
              </select> */}
              
              {/* Desktop Clear Filters Button */}
              {(selectedModel !== "all" || selectedAvailability !== "all") && (
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
                  placeholder="Search by model, location, count..."
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
                }}
              >
                <div className="vehicle-left">
                  <h3>🚘 {vehicle.modelName}</h3>
                  <p>📦 Available: {vehicle.availableCount || 0} | Unavailable: {vehicle.unavailableCount || 0}</p>
                  <p>✅ Remaining: {vehicle.remainingCount || 0}</p>
                  {vehicle.location && (
                    <p>📍 {vehicle.location.charAt(0).toUpperCase() + vehicle.location.slice(1).toLowerCase()}</p>
                  )}
                </div>

                {/* <div className="vehicle-right">
                  <div
                    className={`status-badge ${vehicle.availableCount > 0 ? "available" : "unavailable"}`}
                  >
                    {vehicle.availableCount > 0 
                      ? `Available (${vehicle.availableCount})` 
                      : vehicle.statusReason || "Unavailable"}
                  </div>
                </div> */}

                 <div className="vehicle-right">
            <div
              className={`status-badge ${
                vehicle.remainingCount === 0 
                  ? "unavailable blinking"  // ← Added "blinking" class here
                  : vehicle.availableCount > 0 
                    ? "available" 
                    : "unavailable"
              }`}
            >
              {vehicle.remainingCount === 0 
                ? "Unavailable" 
                : vehicle.availableCount > 0 
                  ? `Available (${vehicle.availableCount})` 
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
            {/* LEFT SECTION - No images for availability list */}
            <div className="neo-image-section" style={{ justifyContent: "center", alignItems: "center", display: "flex" }}>
              <div style={{ textAlign: "center", padding: "20px" }}>
                <div style={{ fontSize: "64px", marginBottom: "20px" }}>🚛</div>
                <h3 style={{ color: "#fff" }}>{selectedVehicle.modelName}</h3>
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
                <div className="neoHeadingNew">{selectedVehicle.modelName}</div>

                <table className="neoContentsMain">
                  <tbody>
                    <tr>
                      <td className="newContentLeft">Model Name</td>
                      <td className="newContentLeft">
                        🚘 {selectedVehicle.modelName}
                      </td>
                    </tr>

                    <tr>
                      <td className="newContentLeft">Available Count</td>
                      <td className="newContentLeft">
                        🟢 {selectedVehicle.availableCount || 0}
                      </td>
                    </tr>

                    <tr>
                      <td className="newContentLeft">Unavailable Count</td>
                      <td className="newContentLeft">
                        🔴 {selectedVehicle.unavailableCount || 0}
                      </td>
                    </tr>

                    <tr>
                      <td className="newContentLeft">Remaining Count</td>
                      <td className="newContentLeft">
                        ✅ {selectedVehicle.remainingCount || 0}
                      </td>
                    </tr>

                    {selectedVehicle.location && (
                      <tr>
                        <td className="newContentLeft">Location</td>
                        <td className="newContentLeft">
                          📍 {selectedVehicle.location.charAt(0).toUpperCase() + 
                             selectedVehicle.location.slice(1).toLowerCase()}
                        </td>
                      </tr>
                    )}

                    {selectedVehicle.statusReason && (
                      <tr>
                        <td className="newContentLeft">Status Reason</td>
                        <td className="newContentLeft neo-unavailable">
                          ℹ️ {selectedVehicle.statusReason.charAt(0).toUpperCase() + 
                              selectedVehicle.statusReason.slice(1).toLowerCase()}
                        </td>
                      </tr>
                    )}
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
