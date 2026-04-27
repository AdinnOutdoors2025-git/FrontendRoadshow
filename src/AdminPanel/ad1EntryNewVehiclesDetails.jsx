

import React, { useState, useEffect, useRef } from "react";
import { baseUrls } from "../Authentication/BASE_URL";
import { ToastContainer, toast } from "react-toastify";
import "./showNewVehiclesEntry.css";
import { useAuth } from "../Authentication/LoginContext";

// ===================== CONSTANTS =====================
export const vehicleTypes = ["Van", "Bus", "Truck", "Tempo", "Auto", "Bike"];
export const fuelTypes = ["Diesel", "Petrol", "Electric"];
export const transmissionTypes = ["Manual", "Automatic"];
export const campaignTypes = [
  "Political",
  "Corporate Branding",
  "Product Launch",
  "Awareness Campaign",
  "Election Roadshow",
];
export const availabilityStatus = [
  "Available",
  "Booked",
  "Under Maintenance",
  "Disabled",
];
export const permitTypes = ["Local", "State", "National"];
export const tamilNaduCities = [
  "Chennai",
  "Coimbatore",
  "Madurai",
  "Trichy",
  "Salem",
  "Tirunelveli",
  "Erode",
  "Vellore",
  "Thoothukudi",
  "Dindigul",
];

// ===================== TAG INPUT (Vehicle Numbers) =====================
function TagInput({ value, onChange }) {
  const [inputVal, setInputVal] = useState("");

  // value is an array of strings
  const tags = Array.isArray(value) ? value : value ? [value] : [];

  const addTag = () => {
    const trimmed = inputVal.trim();
    if (!trimmed) return;
    if (!tags.includes(trimmed)) {
      onChange([...tags, trimmed]);
    }
    setInputVal("");
  };

  const removeTag = (idx) => {
    onChange(tags.filter((_, i) => i !== idx));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag();
    } else if (e.key === "Backspace" && !inputVal && tags.length > 0) {
      removeTag(tags.length - 1);
    }
  };

  return (
    <div className="tag-input-wrapper">
      {tags.map((tag, i) => (
        <span key={i} className="tag-chip">
          {tag}
          <button
            type="button"
            className="tag-remove"
            onClick={() => removeTag(i)}
          >
            ×
          </button>
        </span>
      ))}
      <input
        type="text"
        className="tag-inner-input"
        value={inputVal}
        onChange={(e) => setInputVal(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={addTag}
        placeholder={tags.length === 0 ? "Type & press Enter to add..." : ""}
      />
    </div>
  );
}

// ===================== VEHICLE NUMBER TOOLTIP =====================
function VehicleNumberTooltip({ numbers }) {
  const [show, setShow] = useState(false);
  const arr = Array.isArray(numbers)
    ? numbers
    : numbers
    ? [numbers]
    : [];

  if (arr.length === 0) return <strong>-</strong>;

  return (
    <div
      className="vnum-tooltip-wrapper"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      <strong className="vnum-label">
        {arr.length} Number{arr.length > 1 ? "s" : ""} 🔍
      </strong>
      {show && (
        <div className="vnum-tooltip">
          {arr.map((n, i) => (
            <span key={i} className="vnum-tooltip-item">
              {n}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

// ===================== MAIN COMPONENT =====================
function Ad1EntryNewVehiclesDetails() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVehicle, setSelectedVehicle] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const vehiclesPerPage = 6;

  const [statusFilter, setStatusFilter] = useState("");
  const [modelFilter, setModelFilter] = useState("");
  const [nameFilter, setNameFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // Edit states
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [saving, setSaving] = useState(false);

  // Model types from API
  const [modelTypes, setModelTypes] = useState([]);
  const [imageFiles, setImageFiles] = useState({
  mainImage: [],
  sideImages: [],
  interiorImages: [],
  ledDisplayImage: [],
  brandingSample: [],
  vehicleVideo: [],
});

  const { getAuthHeaders ,getToken } = useAuth();

  // ===================== FETCH MODELS =====================
  const fetchModels = async () => {
    try {
      const response = await fetch(`${baseUrls}/getVehicleModels`, {
        headers: getAuthHeaders(),
      });
      const data = await response.json();
      if (data.status) setModelTypes(data.data);
    } catch (err) {
      console.error("Failed to fetch vehicle models:", err);
    }
  };

  useEffect(() => {
    fetchModels();
  }, []);

  // ===================== FETCH VEHICLES =====================
  const fetchVehicles = async () => {
    try {
      const response = await fetch(`${baseUrls}/getNewVehicles`, {
        method: "GET",
        headers: getAuthHeaders(),
      });
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

  useEffect(() => {
    fetchVehicles();
    setCurrentPage(1);
  }, [statusFilter, modelFilter, nameFilter, searchTerm]);

  // ===================== HELPERS =====================
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

  const filteredVehicles = vehicles.filter((vehicle) => {
    const matchesDropdownFilters =
      (!statusFilter || vehicle.availability === statusFilter) &&
      (!modelFilter || vehicle.model === modelFilter) &&
      (!nameFilter || vehicle.vehicleName === nameFilter);

    const matchesSearch =
      !searchTerm ||
      vehicle.vehicleName
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      vehicle.model?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.vehicleNumber
        ?.join?.(" ")
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());

    return matchesDropdownFilters && matchesSearch;
  });

  const totalPages = Math.ceil(filteredVehicles.length / vehiclesPerPage);
  const indexOfFirst = (currentPage - 1) * vehiclesPerPage;
  const currentVehicles = filteredVehicles.slice(
    indexOfFirst,
    indexOfFirst + vehiclesPerPage
  );

  const goToPage = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ===================== VIEW MODE HELPERS =====================
  const renderField = (label, value, isVehicleNumber = false) => (
    <div className="detail-row" key={label}>
      <span>{label}</span>
      {isVehicleNumber ? (
        <VehicleNumberTooltip numbers={value} />
      ) : (
        <strong>{value || "-"}</strong>
      )}
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
              src={`${baseUrls}/uploads/${folderName}/${img}`}
              alt=""
            />
          ))}
        </div>
      </div>
    );
  };

  // ===================== EDIT HANDLERS =====================
  // const handleEditClick = (e) => {
  //   e.stopPropagation();
  //   setEditForm({
  //     ...selectedVehicle,
  //     // vehicleNumber as array for TagInput
  //     vehicleNumber: Array.isArray(selectedVehicle.vehicleNumber)
  //       ? selectedVehicle.vehicleNumber
  //       : selectedVehicle.vehicleNumber
  //       ? [selectedVehicle.vehicleNumber]
  //       : [],
  //     rcValidTill: selectedVehicle.rcValidTill?.split("T")[0] || "",
  //     insuranceValidTill:
  //       selectedVehicle.insuranceValidTill?.split("T")[0] || "",
  //     pollutionValidTill:
  //       selectedVehicle.pollutionValidTill?.split("T")[0] || "",
  //   });
  //   setIsEditing(true);
  // };

  const handleEditClick = (e) => {
  e.stopPropagation();
  setImageFiles({
    mainImage: [], sideImages: [], interiorImages: [],
    ledDisplayImage: [], brandingSample: [], vehicleVideo: [],
  });
  setEditForm({
    ...selectedVehicle,
    vehicleNumber: Array.isArray(selectedVehicle.vehicleNumber)
      ? selectedVehicle.vehicleNumber
      : selectedVehicle.vehicleNumber ? [selectedVehicle.vehicleNumber] : [],
    rcValidTill: selectedVehicle.rcValidTill?.split("T")[0] || "",
    insuranceValidTill: selectedVehicle.insuranceValidTill?.split("T")[0] || "",
    pollutionValidTill: selectedVehicle.pollutionValidTill?.split("T")[0] || "",
  });
  setIsEditing(true);
};

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleTagChange = (name, tags) => {
    setEditForm((prev) => ({ ...prev, [name]: tags }));
  };

// const handleSave = async () => {
//   setSaving(true);
//   try {
//     const formData = new FormData();


//     // Check if ID is valid
//     if (!selectedVehicle._id || selectedVehicle._id.length !== 24) {
//       toast.error("Invalid Vehicle ID. Please refresh and try again.");
//       setSaving(false);
//       return;
//     }

//     const excludeKeys = [
//       "_id",
//       "__v",
//       "createdAt",
//       "updatedAt",
//       "mainImage",
//       "sideImages",
//       "interiorImages",
//       "ledDisplayImage",
//       "brandingSample",
//       "vehicleVideo",
//     ];

//     // Process each field
//     Object.entries(editForm).forEach(([key, value]) => {
//       if (!excludeKeys.includes(key) && value !== undefined && value !== null && value !== "") {
        
//         if (key === "vehicleNumber") {
//           // Handle vehicle numbers array
//           let nums = Array.isArray(value) ? value : [value];
//           // Remove duplicates and empty strings
//           nums = [...new Set(nums.filter(v => v && v.trim()))];
//           if (nums.length > 0) {
//             formData.append("vehicleNumber", nums.join(","));
//           }
//         } 
//         else if (key === "vehicleCount") {
//           // Don't send vehicleCount as it's auto-calculated
//           // Skip it
//         }
//         else if (typeof value === "object" && !(value instanceof File)) {
//           // Handle objects (but shouldn't happen in this form)
//           formData.append(key, JSON.stringify(value));
//         } 
//         else {
//           formData.append(key, value);
//         }
//       }
//     });

// // Image files append
// Object.entries(imageFiles).forEach(([key, files]) => {
//   files.forEach((file) => {
//     formData.append(key, file);
//   });
// });

//     const response = await fetch(
//       `${baseUrls}/updateVehicle/${selectedVehicle._id}`,
//       {
//         method: "PUT",
//         headers: { 
//           'Authorization': `Bearer ${getToken()}`
//         },
//         body: formData,
//       }
//     );

//     const data = await response.json();
    
    
//     if (data.success) {
//       toast.success("Vehicle updated successfully!");
//       setSelectedVehicle(data.data);
//       setIsEditing(false);
//       await fetchVehicles(); // Refresh the list
//     } else {
//       toast.error(data.message || "Update failed");
//     }
//   } catch (error) {
//     console.error("Update error:", error);
//     toast.error("Something went wrong: " + error.message);
//   } finally {
//     setSaving(false);
//   }
// };


const handleSave = async () => {
  setSaving(true);
  try {
    const formData = new FormData();

    if (!selectedVehicle._id || selectedVehicle._id.length !== 24) {
      toast.error("Invalid Vehicle ID. Please refresh and try again.");
      setSaving(false);
      return;
    }

    const excludeKeys = [
      "_id", "__v", "createdAt", "updatedAt",
      "mainImage", "sideImages", "interiorImages",
      "ledDisplayImage", "brandingSample", "vehicleVideo",
    ];

    // Normal fields
    Object.entries(editForm).forEach(([key, value]) => {
      if (!excludeKeys.includes(key) && value !== undefined && value !== null && value !== "") {
        if (key === "vehicleNumber") {
          let nums = Array.isArray(value) ? value : [value];
          nums = [...new Set(nums.filter((v) => v && v.trim()))];
          if (nums.length > 0) formData.append("vehicleNumber", nums.join(","));
        } else if (key === "vehicleCount") {
          // skip - auto calculated
        } else if (typeof value === "object" && !(value instanceof File)) {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, value);
        }
      }
    });

    // ✅ Existing images - backend-ku anuppu (remaining ones after delete)
    const imageFieldsList = [
      "mainImage", "sideImages", "interiorImages",
      "ledDisplayImage", "brandingSample", "vehicleVideo",
    ];

    imageFieldsList.forEach((key) => {
      const existing = editForm[key] || [];
      existing.forEach((imgName) => {
        formData.append(key, imgName);
      });
    });

    // ✅ New image files
    Object.entries(imageFiles).forEach(([key, files]) => {
      files.forEach((file) => {
        formData.append(key, file);
      });
    });

    const response = await fetch(`${baseUrls}/updateVehicle/${selectedVehicle._id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
      body: formData,
    });

    const data = await response.json();

    if (data.success) {
      toast.success("Vehicle updated successfully!");
      setSelectedVehicle(data.data);
      setIsEditing(false);
      setImageFiles({
        mainImage: [], sideImages: [], interiorImages: [],
        ledDisplayImage: [], brandingSample: [], vehicleVideo: [],
      });
      await fetchVehicles();
    } else {
      toast.error(data.message || "Update failed");
    }
  } catch (error) {
    console.error("Update error:", error);
    toast.error("Something went wrong: " + error.message);
  } finally {
    setSaving(false);
  }
};
  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditForm({});
  };

  const handleModalClose = () => {
    setSelectedVehicle(null);
    setIsEditing(false);
    setEditForm({});
  };

  // ===================== EDIT FIELD COMPONENTS =====================
  const EditInput = ({ label, name, type = "text", optional = true }) => (
    <div className="edit-field">
      <label>
        {label}
        {optional && <span className="optional-badge">Optional</span>}
      </label>
      <input
        type={type}
        name={name}
        value={editForm[name] ?? ""}
        onChange={handleFormChange}
      />
    </div>
  );

  const EditSelect = ({ label, name, options, optional = true }) => (
    <div className="edit-field">
      <label>
        {label}
        {optional && <span className="optional-badge">Optional</span>}
      </label>
      <select name={name} value={editForm[name] ?? ""} onChange={handleFormChange}>
        <option value="">Select</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );

  // ===================== RENDER =====================
  return (
    <div className="vehicle-list-container">
      <h2 className="page-title">All Vehicles</h2>

      {/* FILTER BAR */}
      <div className="filter-bar">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All Status</option>
          {availabilityStatus.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        <select
          value={modelFilter}
          onChange={(e) => setModelFilter(e.target.value)}
        >
          <option value="">All Models</option>
          {uniqueModels.map((model, i) => (
            <option key={i} value={model}>
              {model}
            </option>
          ))}
        </select>

        <select
          value={nameFilter}
          onChange={(e) => setNameFilter(e.target.value)}
        >
          <option value="">All Vehicles</option>
          {uniqueNames.map((name, i) => (
            <option key={i} value={name}>
              {name}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Search by name, model, vehicle number..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />

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

      {/* VEHICLE GRID */}
      {loading ? (
        <p>Loading vehicles...</p>
      ) : (
        <>
          <div className="vehicle-grid">
            {currentVehicles.length === 0 ? (
              <p
                style={{
                  gridColumn: "1/-1",
                  textAlign: "center",
                  color: "#888",
                  padding: "40px 0",
                }}
              >
                No vehicles found.
              </p>
            ) : (
              currentVehicles.map((vehicle) => {
                const folderName = getModelFolderName(vehicle.model);
                return (
                  <div
                    key={vehicle._id}
                    className="vehicle-card-senior"
                    onClick={() => {
                      setSelectedVehicle(vehicle);
                      setIsEditing(false);
                    }}
                  >
                    <div className="card-image">
                      {vehicle.mainImage?.length > 0 && (
                        <img
                          src={`${baseUrls}/uploads/${folderName}/${vehicle.mainImage[0]}`}
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
              })
            )}
          </div>

          {/* PAGINATION */}
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

      {/* ===================== MODAL ===================== */}
      {selectedVehicle && (
        <div className="modal-overlay" onClick={handleModalClose}>
          <div
            className="modal-container"
            onClick={(e) => e.stopPropagation()}
          >
            {/* CLOSE BUTTON */}
            <button className="modal-close" onClick={handleModalClose}>
              ×
            </button>

            {/* EDIT BUTTON */}
            {!isEditing && (
              <button className="modal-edit-btn" onClick={handleEditClick}>
                ✏️ Edit
              </button>
            )}

            <h2 className="modal-title">{selectedVehicle.vehicleName}</h2>

            {/* ============ EDIT MODE ============ */}
            {isEditing ? (
              <div className="edit-form-container">

                {/* BASIC INFO */}
                <h3 className="edit-section-title">Basic Information</h3>
                <div className="edit-grid">
                  <EditInput label="Vehicle Name" name="vehicleName" optional={false} />

                  {/* Vehicle Type */}
                  <EditSelect
                    label="Vehicle Type"
                    name="vehicleType"
                    options={vehicleTypes}
                  />

                  {/* Model - from API */}
                  <div className="edit-field">
                    <label>
                      Model <span className="optional-badge">Optional</span>
                    </label>
                    <select
                      name="model"
                      value={editForm.model ?? ""}
                      onChange={handleFormChange}
                    >
                      <option value="">Select Model</option>
                      {modelTypes.map((m, i) => (
                        <option key={i} value={m.modelName || m}>
                          {m.modelName || m}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Vehicle Numbers - Tag Input */}
                  <div className="edit-field edit-field-full">
                    <label>
                      Vehicle Numbers{" "}
                      <span className="optional-badge">Optional</span>
                      <span className="field-hint">
                        Type & press Enter or comma to add
                      </span>
                    </label>
                    <TagInput
                      value={editForm.vehicleNumber || []}
                      onChange={(tags) =>
                        handleTagChange("vehicleNumber", tags)
                      }
                    />
                  </div>

                  <EditInput label="Year" name="year" type="number" />

                  {/* Fuel Type */}
                  <EditSelect
                    label="Fuel Type"
                    name="fuelType"
                    options={fuelTypes}
                  />

                  {/* Transmission */}
                  <EditSelect
                    label="Transmission"
                    name="transmission"
                    options={transmissionTypes}
                  />

                  <EditInput
                    label="Seating Capacity"
                    name="seatingCapacity"
                    type="number"
                  />

                  {/* City */}
                  <div className="edit-field">
                    <label>
                      City <span className="optional-badge">Optional</span>
                    </label>
                    <select
                      name="city"
                      value={editForm.city ?? ""}
                      onChange={handleFormChange}
                    >
                      <option value="">Select City</option>
                      {tamilNaduCities.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* CAMPAIGN */}
                <h3 className="edit-section-title">Campaign Features</h3>
                <div className="edit-grid">
                  {/* Campaign Type */}
                  <div className="edit-field">
                    <label>
                      Campaign Type{" "}
                      <span className="optional-badge">Optional</span>
                    </label>
                    <select
                      name="campaignType"
                      value={editForm.campaignType ?? ""}
                      onChange={handleFormChange}
                    >
                      <option value="">Select</option>
                      {campaignTypes.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>

                  <EditSelect
                    label="LED Available"
                    name="ledAvailable"
                    options={["Yes", "No"]}
                  />
                  <EditInput label="LED Size" name="ledSize" />

                  {/* Sound System */}
                  <div className="edit-field">
                    <label>
                      Sound System{" "}
                      <span className="optional-badge">Optional</span>
                    </label>
                    <select
                      name="soundSystem"
                      value={editForm.soundSystem ?? ""}
                      onChange={handleFormChange}
                    >
                      <option value="">Select</option>
                      <option value="Mic">Mic</option>
                      <option value="Speaker">Speaker</option>
                      <option value="DJ Setup">DJ Setup</option>
                      <option value="No">No</option>
                    </select>
                  </div>

                  <EditInput label="Branding Side Size" name="brandingSideSize" />
                  <EditInput label="Branding Back Size" name="brandingBackSize" />

                  {/* Roof Setup */}
                  <div className="edit-field">
                    <label>
                      Roof Setup{" "}
                      <span className="optional-badge">Optional</span>
                    </label>
                    <select
                      name="roofSetup"
                      value={editForm.roofSetup ?? ""}
                      onChange={handleFormChange}
                    >
                      <option value="">Select</option>
                      <option value="Stage">Stage</option>
                      <option value="Standing Platform">
                        Standing Platform
                      </option>
                      <option value="None">None</option>
                    </select>
                  </div>

                  <EditSelect
                    label="Generator"
                    name="generatorAvailable"
                    options={["Yes", "No"]}
                  />

                  {/* Lighting */}
                  <div className="edit-field">
                    <label>
                      Lighting{" "}
                      <span className="optional-badge">Optional</span>
                    </label>
                    <select
                      name="lighting"
                      value={editForm.lighting ?? ""}
                      onChange={handleFormChange}
                    >
                      <option value="">Select</option>
                      <option value="Flood Lights">Flood Lights</option>
                      <option value="RGB Lights">RGB Lights</option>
                      <option value="None">None</option>
                    </select>
                  </div>
                </div>

                {/* PRICING */}
                <h3 className="edit-section-title">Pricing & Availability</h3>
                <div className="edit-grid">
                  <EditInput label="Base Price (₹)" name="basePrice" type="number" optional={false} />
                  <EditSelect
                    label="Pricing Type"
                    name="pricingType"
                    options={["PerDay", "PerHour", "PerKm", "Fixed"]}
                  />
                  <EditInput label="Min Booking" name="minBooking" />
                  <EditInput
                    label="Extra Hour Charge (₹)"
                    name="extraHourCharge"
                    type="number"
                  />

                  {/* Driver Charge */}
                  <div className="edit-field">
                    <label>
                      Driver Charge{" "}
                      <span className="optional-badge">Optional</span>
                    </label>
                    <select
                      name="driverCharge"
                      value={editForm.driverCharge ?? ""}
                      onChange={handleFormChange}
                    >
                      <option value="">Select</option>
                      <option value="Included">Included</option>
                      <option value="Extra">Extra</option>
                    </select>
                  </div>

                  {/* Fuel Policy */}
                  <div className="edit-field">
                    <label>
                      Fuel Policy{" "}
                      <span className="optional-badge">Optional</span>
                    </label>
                    <select
                      name="fuelPolicy"
                      value={editForm.fuelPolicy ?? ""}
                      onChange={handleFormChange}
                    >
                      <option value="">Select</option>
                      <option value="Included">Included</option>
                      <option value="Customer Pays">Customer Pays</option>
                    </select>
                  </div>

                  <EditInput
                    label="Security Deposit (₹)"
                    name="securityDeposit"
                    type="number"
                  />
                  <EditSelect
                    label="Discount Eligible"
                    name="discountEligible"
                    options={["Yes", "No"]}
                  />

                  {/* Availability */}
                  <div className="edit-field">
                    <label>
                      Availability{" "}
                      <span className="optional-badge">Optional</span>
                    </label>
                    <select
                      name="availability"
                      value={editForm.availability ?? ""}
                      onChange={handleFormChange}
                    >
                      <option value="">Select</option>
                      {availabilityStatus.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>


                {/* MEDIA UPLOAD */}
<h3 className="edit-section-title">Media</h3>
<div className="edit-grid">
  {[
    { key: "mainImage", label: "Main Images" },
    { key: "sideImages", label: "Side Images" },
    { key: "interiorImages", label: "Interior Images" },
    { key: "ledDisplayImage", label: "LED Display Images" },
    { key: "brandingSample", label: "Branding Samples" },
    { key: "vehicleVideo", label: "Vehicle Video" },
  ].map(({ key, label }) => {
    const folderName = getModelFolderName(editForm.model || selectedVehicle.model);
    const existingImages = editForm[key] || [];

    return (
      <div className="edit-field edit-field-full" key={key}>
        <label>
          {label} <span className="optional-badge">Optional</span>
        </label>

        {/* Existing images */}
        {existingImages.length > 0 && (
          <div className="existing-images-row">
            {existingImages.map((img, i) => (
              <div key={i} className="existing-img-thumb">
                <img
                  src={`${baseUrls}/uploads/${folderName}/${img}`}
                  alt=""
                />
                <button
                  type="button"
                  className="remove-img-btn"
                  onClick={() => {
                    setEditForm((prev) => ({
                      ...prev,
                      [key]: prev[key].filter((_, idx) => idx !== i),
                    }));
                  }}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        {/* New file input */}
        <input
          type="file"
          accept={key === "vehicleVideo" ? "video/*" : "image/*"}
          multiple={key !== "vehicleVideo"}
          onChange={(e) => {
            const files = Array.from(e.target.files);
            setImageFiles((prev) => ({
              ...prev,
              [key]: [...prev[key], ...files],
            }));
            e.target.value = ""; // reset input
          }}
          className="file-input"
        />

        {/* Preview newly selected files */}
        {imageFiles[key].length > 0 && (
          <div className="existing-images-row">
            {imageFiles[key].map((file, i) => (
              <div key={i} className="existing-img-thumb new-img-thumb">
                <img src={URL.createObjectURL(file)} alt="" />
                <button
                  type="button"
                  className="remove-img-btn"
                  onClick={() => {
                    setImageFiles((prev) => ({
                      ...prev,
                      [key]: prev[key].filter((_, idx) => idx !== i),
                    }));
                  }}
                >
                  ×
                </button>
                <span className="new-badge">NEW</span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  })}
</div>

                {/* DRIVER */}
                <h3 className="edit-section-title">Driver Information</h3>
                <div className="edit-grid">
                  <EditInput label="Driver Name" name="driverName" />
                  <EditInput label="Driver Phone" name="driverPhone" />
                  <EditInput
                    label="Experience (years)"
                    name="driverExperience"
                    type="number"
                  />
                  <EditInput label="Languages Known" name="languagesKnown" />
                  <EditSelect
                    label="Helper Available"
                    name="helperAvailable"
                    options={["Yes", "No"]}
                  />
                </div>

                {/* LEGAL */}
                <h3 className="edit-section-title">Legal & Safety</h3>
                <div className="edit-grid">
                  <EditInput
                    label="RC Valid Till"
                    name="rcValidTill"
                    type="date"
                  />
                  <EditInput
                    label="Insurance Valid Till"
                    name="insuranceValidTill"
                    type="date"
                  />
                  <EditInput
                    label="Pollution Valid Till"
                    name="pollutionValidTill"
                    type="date"
                  />

                  {/* Permit Type */}
                  <div className="edit-field">
                    <label>
                      Permit Type{" "}
                      <span className="optional-badge">Optional</span>
                    </label>
                    <select
                      name="permitType"
                      value={editForm.permitType ?? ""}
                      onChange={handleFormChange}
                    >
                      <option value="">Select</option>
                      {permitTypes.map((p) => (
                        <option key={p} value={p}>
                          {p}
                        </option>
                      ))}
                    </select>
                  </div>

                  <EditInput label="Emergency Contact" name="emergencyContact" />
                </div>

                {/* ADMIN */}
                <h3 className="edit-section-title">Internal Admin</h3>
                <div className="edit-grid">
                  <EditSelect
                    label="Priority Level"
                    name="priorityLevel"
                    options={["High", "Medium", "Low"]}
                  />
                  <EditInput
                    label="Internal Rating"
                    name="internalRating"
                    type="number"
                  />
                  <EditSelect
                    label="Featured"
                    name="featured"
                    options={["Yes", "No"]}
                  />
                  <div className="edit-field edit-field-full">
                    <label>
                      Internal Notes{" "}
                      <span className="optional-badge">Optional</span>
                    </label>
                    <textarea
                      name="internalNotes"
                      value={editForm.internalNotes ?? ""}
                      onChange={handleFormChange}
                      rows={3}
                    />
                  </div>
                </div>

                {/* ACTION BUTTONS */}
                <div className="edit-actions">
                  <button
                    className="cancel-btn"
                    onClick={handleCancelEdit}
                    disabled={saving}
                  >
                    Cancel
                  </button>
                  <button
                    className="save-btn"
                    onClick={handleSave}
                    disabled={saving}
                  >
                    {saving ? "Saving..." : "💾 Save Changes"}
                  </button>
                </div>
              </div>
            ) : (
              /* ============ VIEW MODE ============ */
              <>
                {/* BASIC */}
                <div className="detail-section">
                  <h3>Basic Information</h3>
                  <div className="details-grid">
                    {renderField("Vehicle Type", selectedVehicle.vehicleType)}
                    {renderField("Model", selectedVehicle.model)}
                    {renderField(
                      "Vehicle Numbers",
                      selectedVehicle.vehicleNumber,
                      true
                    )}
                    {renderField("Vehicle Count", selectedVehicle.vehicleCount)}
                    {renderField("Year", selectedVehicle.year)}
                    {renderField("Fuel Type", selectedVehicle.fuelType)}
                    {renderField("Transmission", selectedVehicle.transmission)}
                    {renderField(
                      "Seating Capacity",
                      selectedVehicle.seatingCapacity
                    )}
                    {renderField("City", selectedVehicle.city)}
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
                    {renderField(
                      "Branding Side Size",
                      selectedVehicle.brandingSideSize
                    )}
                    {renderField(
                      "Branding Back Size",
                      selectedVehicle.brandingBackSize
                    )}
                    {renderField("Roof Setup", selectedVehicle.roofSetup)}
                    {renderField(
                      "Generator",
                      selectedVehicle.generatorAvailable
                    )}
                    {renderField("Lighting", selectedVehicle.lighting)}
                  </div>
                </div>

                {/* PRICING */}
                <div className="detail-section">
                  <h3>Pricing & Availability</h3>
                  <div className="details-grid">
                    {renderField(
                      "Base Price",
                      `₹${selectedVehicle.basePrice}`
                    )}
                    {renderField("Pricing Type", selectedVehicle.pricingType)}
                    {renderField("Min Booking", selectedVehicle.minBooking)}
                    {renderField(
                      "Extra Hour Charge",
                      selectedVehicle.extraHourCharge
                    )}
                    {renderField("Driver Charge", selectedVehicle.driverCharge)}
                    {renderField("Fuel Policy", selectedVehicle.fuelPolicy)}
                    {renderField(
                      "Security Deposit",
                      selectedVehicle.securityDeposit
                    )}
                    {renderField(
                      "Discount Eligible",
                      selectedVehicle.discountEligible
                    )}
                    {renderField("Availability", selectedVehicle.availability)}
                  </div>
                </div>

                {/* MEDIA */}
                <div className="detail-section">
                  <h3>Media</h3>
                  {renderImages("Main Images", selectedVehicle.mainImage)}
                  {renderImages("Side Images", selectedVehicle.sideImages)}
                  {renderImages(
                    "Interior Images",
                    selectedVehicle.interiorImages
                  )}
                  {renderImages(
                    "LED Display Images",
                    selectedVehicle.ledDisplayImage
                  )}
                  {renderImages(
                    "Branding Samples",
                    selectedVehicle.brandingSample
                  )}
                  {!selectedVehicle.mainImage?.length &&
                    !selectedVehicle.sideImages?.length &&
                    !selectedVehicle.interiorImages?.length &&
                    !selectedVehicle.ledDisplayImage?.length &&
                    !selectedVehicle.brandingSample?.length && (
                      <p style={{ color: "#888", fontSize: "14px" }}>
                        No media uploaded.
                      </p>
                    )}
                </div>

                {/* DRIVER */}
                <div className="detail-section">
                  <h3>Driver Information</h3>
                  <div className="details-grid">
                    {renderField("Driver Name", selectedVehicle.driverName)}
                    {renderField("Driver Phone", selectedVehicle.driverPhone)}
                    {renderField(
                      "Experience",
                      selectedVehicle.driverExperience + " yrs"
                    )}
                    {renderField("Languages", selectedVehicle.languagesKnown)}
                    {renderField(
                      "Helper Available",
                      selectedVehicle.helperAvailable
                    )}
                  </div>
                </div>

                {/* LEGAL */}
                <div className="detail-section">
                  <h3>Legal & Safety</h3>
                  <div className="details-grid">
                    {renderField(
                      "RC Valid Till",
                      selectedVehicle.rcValidTill?.split("T")[0]
                    )}
                    {renderField(
                      "Insurance Valid Till",
                      selectedVehicle.insuranceValidTill?.split("T")[0]
                    )}
                    {renderField(
                      "Pollution Valid Till",
                      selectedVehicle.pollutionValidTill?.split("T")[0]
                    )}
                    {renderField("Permit Type", selectedVehicle.permitType)}
                    {renderField(
                      "Emergency Contact",
                      selectedVehicle.emergencyContact
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
              </>
            )}
          </div>
        </div>
      )}

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

export default Ad1EntryNewVehiclesDetails;
