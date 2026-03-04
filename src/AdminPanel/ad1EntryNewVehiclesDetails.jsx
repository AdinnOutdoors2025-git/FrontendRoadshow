import React, { useState, useEffect } from "react";
import { baseUrl } from "../Authentication/BASE_URL";
import { ToastContainer, toast } from "react-toastify";
import "./showNewVehiclesEntry.css";

function Ad1EntryNewVehiclesDetails() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVehicle, setSelectedVehicle] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const vehiclesPerPage = 6; // 3 + 3 layout

  const [statusFilter, setStatusFilter] = useState("");
  const [modelFilter, setModelFilter] = useState("");
  const [nameFilter, setNameFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");


  const fetchVehicles = async () => {
    try {
      const response = await fetch(`${baseUrl}/getNewVehicles`);
      const data = await response.json();

      if (data.success) {
        setVehicles(data.data);
      } else {
        toast.error("Failed to fetch vehicles");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const getModelFolderName = (model) => {
    if (!model) return "";
    return model.replace(/\s+/g, "_");
  };

  const uniqueModels = [
    ...new Set(vehicles.map((v) => v.model).filter(Boolean)),
  ];
  const uniqueNames = [
    ...new Set(vehicles.map((v) => v.vehicleName).filter(Boolean)),
  ];

  const indexOfLast = currentPage * vehiclesPerPage;
  const indexOfFirst = indexOfLast - vehiclesPerPage;
const filteredVehicles = vehicles.filter((vehicle) => {
  const matchesDropdownFilters =
    (!statusFilter || vehicle.availability === statusFilter) &&
    (!modelFilter || vehicle.model === modelFilter) &&
    (!nameFilter || vehicle.vehicleName === nameFilter);

  const matchesSearch =
    !searchTerm ||
    vehicle.vehicleName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.model?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.vehicleNumber?.toLowerCase().includes(searchTerm.toLowerCase());

  return matchesDropdownFilters && matchesSearch;
});

const totalPages = Math.ceil(filteredVehicles.length / vehiclesPerPage);
const currentVehicles = filteredVehicles.slice(indexOfFirst, indexOfLast);

  const goToPage = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const renderField = (label, value) => (
    <div className="detail-row">
      <span>{label}</span>
      <strong>{value || "-"}</strong>
    </div>
  );

  const renderImages = (title, images) => {
    if (!images || images.length === 0) return null;
    const folderName = getModelFolderName(selectedVehicle.model);

    return (
      <div className="media-block">
        <h4>{title}</h4>
        <div className="image-grid">
          {images.map((img, i) => (
            <img
              key={i}
              src={`${baseUrl}/uploads/${folderName}/${img}`}
              alt=""
            />
          ))}
        </div>
      </div>
    );
  };

  useEffect(() => {
    fetchVehicles();
    setCurrentPage(1);
  }, [statusFilter, modelFilter, nameFilter, searchTerm]);
  return (
    <div className="vehicle-list-container">
      <h2 className="page-title">All Vehicles</h2>
      {/* {filter start} */}
      <div className="filter-bar">
  {/* STATUS FILTER */}
  <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
    <option value="">All Status</option>
    <option value="Available">Available</option>
    <option value="Unavailable">Unavailable</option>
  </select>

  {/* MODEL FILTER */}
  <select value={modelFilter} onChange={(e) => setModelFilter(e.target.value)}>
    <option value="">All Models</option>
    {uniqueModels.map((model, i) => (
      <option key={i} value={model}>{model}</option>
    ))}
  </select>

  {/* VEHICLE NAME FILTER */}
  <select value={nameFilter} onChange={(e) => setNameFilter(e.target.value)}>
    <option value="">All Vehicles</option>
    {uniqueNames.map((name, i) => (
      <option key={i} value={name}>{name}</option>
    ))}
  </select>
  {/* SEARCH INPUT */}
<input
  type="text"
  placeholder="Search by name, model, vehicle number..."
  value={searchTerm}
  onChange={(e) => setSearchTerm(e.target.value)}
  className="search-input"
/>
  {/* RESET */}
  <button
    className="reset-btn"
    onClick={() => {
      setStatusFilter("");
  setModelFilter("");
  setNameFilter("");
  setSearchTerm("");
  setCurrentPage(1);
    }}
  >
    Reset
  </button>

</div>
      {/* {filter end} */}

      {loading ? (
        <p>Loading vehicles...</p>
      ) : (
        <>
          <div className="vehicle-grid">
            {currentVehicles.map((vehicle) => {
              const folderName = getModelFolderName(vehicle.model);

              return (
                <div
                  key={vehicle._id}
                  className="vehicle-card"
                  onClick={() => setSelectedVehicle(vehicle)}
                >
                  <div className="card-image">
                    {vehicle.mainImage?.length > 0 && (
                      <img
                        src={`${baseUrl}/uploads/${folderName}/${vehicle.mainImage[0]}`}
                        alt={vehicle.vehicleName}
                      />
                    )}
                  </div>
                  <div className="card-content">
                    <h3>{vehicle.vehicleName}</h3>
                    <p>{vehicle.model}</p>

                    <div className="card-bottom">
                      <span className="price">₹{vehicle.basePrice}</span>
                    </div>

                    <span
                      className={
                        vehicle.availability === "Available"
                          ? "status-available"
                          : "status-unavailable"
                      }
                    >
                      {vehicle.availability}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pagination">
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                className={
                  currentPage === index + 1 ? "page-btn active" : "page-btn"
                }
                onClick={() => goToPage(index + 1)}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </>
      )}

      {/* ================= SECTIONED MODAL ================= */}
      {selectedVehicle && (
        <div className="modal-overlay" onClick={() => setSelectedVehicle(null)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <button
              className="modal-close"
              onClick={() => setSelectedVehicle(null)}
            >
              ×
            </button>

            <h2 className="modal-title">{selectedVehicle.vehicleName}</h2>

            {/* BASIC */}
            <div className="detail-section">
              <h3>Basic Information</h3>
              <div className="details-grid">
                {renderField("Vehicle Type", selectedVehicle.vehicleType)}
                {renderField("Model", selectedVehicle.model)}
                {renderField("Vehicle Number", selectedVehicle.vehicleNumber)}
                {renderField("Year", selectedVehicle.year)}
                {renderField("Fuel Type", selectedVehicle.fuelType)}
                {renderField("Transmission", selectedVehicle.transmission)}
                {renderField(
                  "Seating Capacity",
                  selectedVehicle.seatingCapacity,
                )}
              </div>
            </div>

            {/* CAMPAIGN */}
            <div className="detail-section">
              <h3>Campaign Features</h3>
              <div className="details-grid">
                {renderField("Campaign Type", selectedVehicle.campaignType)}
                {renderField("LED Available", selectedVehicle.ledAvailable)}
                {renderField("LED Size", selectedVehicle.ledSize)}
                {renderField("Sound System", selectedVehicle.soundSystem)}
                {renderField("Roof Setup", selectedVehicle.roofSetup)}
                {renderField("Generator", selectedVehicle.generatorAvailable)}
                {renderField("Lighting", selectedVehicle.lighting)}
              </div>
            </div>

            {/* PRICING */}
            <div className="detail-section">
              <h3>Pricing & Availability</h3>
              <div className="details-grid">
                {renderField("Base Price", `₹${selectedVehicle.basePrice}`)}
                {renderField("Pricing Type", selectedVehicle.pricingType)}
                {renderField("Min Booking", selectedVehicle.minBooking)}
                {renderField(
                  "Extra Hour Charge",
                  selectedVehicle.extraHourCharge,
                )}
                {renderField("Driver Charge", selectedVehicle.driverCharge)}
                {renderField("Fuel Policy", selectedVehicle.fuelPolicy)}
                {renderField(
                  "Security Deposit",
                  selectedVehicle.securityDeposit,
                )}
                {renderField("Availability", selectedVehicle.availability)}
              </div>
            </div>

            {/* MEDIA */}
            <div className="detail-section">
              <h3>Media</h3>
              {renderImages("Main Images", selectedVehicle.mainImage)}
              {renderImages("Side Images", selectedVehicle.sideImages)}
              {renderImages("Interior Images", selectedVehicle.interiorImages)}
              {renderImages(
                "LED Display Images",
                selectedVehicle.ledDisplayImage,
              )}
              {renderImages("Branding Samples", selectedVehicle.brandingSample)}
            </div>

            {/* DRIVER */}
            <div className="detail-section">
              <h3>Driver Information</h3>
              <div className="details-grid">
                {renderField("Driver Name", selectedVehicle.driverName)}
                {renderField("Driver Phone", selectedVehicle.driverPhone)}
                {renderField("Experience", selectedVehicle.driverExperience)}
                {renderField("Languages", selectedVehicle.languagesKnown)}
                {renderField(
                  "Helper Available",
                  selectedVehicle.helperAvailable,
                )}
              </div>
            </div>

            {/* LEGAL */}
            <div className="detail-section">
              <h3>Legal & Safety</h3>
              <div className="details-grid">
                {renderField(
                  "RC Valid Till",
                  selectedVehicle.rcValidTill?.split("T")[0],
                )}
                {renderField(
                  "Insurance Valid Till",
                  selectedVehicle.insuranceValidTill?.split("T")[0],
                )}
                {renderField(
                  "Pollution Valid Till",
                  selectedVehicle.pollutionValidTill?.split("T")[0],
                )}
                {renderField("Permit Type", selectedVehicle.permitType)}
                {renderField(
                  "Emergency Contact",
                  selectedVehicle.emergencyContact,
                )}
              </div>
            </div>

            {/* ADMIN */}
            <div className="detail-section">
              <h3>Internal Admin Details</h3>
              <div className="details-grid">
                {renderField("Priority Level", selectedVehicle.priorityLevel)}
                {renderField("Internal Rating", selectedVehicle.internalRating)}
                {renderField("Featured", selectedVehicle.featured)}
                {renderField("Internal Notes", selectedVehicle.internalNotes)}
              </div>
            </div>
          </div>
        </div>
      )}

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

export default Ad1EntryNewVehiclesDetails;
