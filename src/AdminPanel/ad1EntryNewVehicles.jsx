import React, { useState, useEffect } from "react";
import "./css/entryNewVehicles.css";
import { ToastContainer } from "react-toastify";
import { toast } from "react-toastify";
import { baseUrls } from "../Authentication/BASE_URL";
import { useAuth } from "../Authentication/LoginContext";
import {
  vehicleTypes,
  fuelTypes,
  transmissionTypes,
  campaignTypes,
  availabilityStatus,
  permitTypes,
  tamilNaduCities,
} from "./vehicleOptions";
import VehicleModelSelect from "./VehicleModelSelect";

const EntryNewVehicles = () => {
  const initialFormState = {
    vehicleName: "",
    vehicleType: "",
    model: "",
    vehicleNumber: "",
    year: "",
    fuelType: "",
    transmission: "",
    seatingCapacity: "",
    city: "",

    campaignType: "",
    ledAvailable: "",
    ledSize: "",
    soundSystem: "",
    brandingSideSize: "",
    brandingBackSize: "",
    roofSetup: "",
    generatorAvailable: "",
    lighting: "",

    basePrice: "",
    pricingType: "",
    minBooking: "",
    extraHourCharge: "",
    driverCharge: "",
    fuelPolicy: "",
    securityDeposit: "",
    discountEligible: "",
    availability: "",

    driverName: "",
    driverPhone: "",
    driverExperience: "",
    languagesKnown: "",
    helperAvailable: "",
    internalRating: "",

    rcValidTill: "",
    insuranceValidTill: "",
    pollutionValidTill: "",
    permitType: "",
    emergencyContact: "",

    internalNotes: "",
    priorityLevel: "",
    featured: "",
  };

  const [formData, setFormData] = useState(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const [imagePreviews, setImagePreviews] = useState({
    mainImage: [],
    sideImages: [],
    interiorImages: [],
    ledDisplayImage: [],
    brandingSample: [],
  });

  const [step, setStep] = useState(1);
  const totalSteps = 7;
  const { getToken } = useAuth();

  const nextStep = () => {
    if (!validate()) return;
    setStep((prev) => Math.min(prev + 1, totalSteps));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const prevStep = () => {
    setStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (files) {
      const fileArray = Array.from(files);
      setFormData((prev) => ({ ...prev, [name]: fileArray }));
      const previewUrls = fileArray.map((file) => URL.createObjectURL(file));
      setImagePreviews((prev) => ({ ...prev, [name]: previewUrls }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const removeImage = (fieldName, index) => {
    setFormData((prev) => {
      const updatedFiles = [...(prev[fieldName] || [])];
      updatedFiles.splice(index, 1);
      return { ...prev, [fieldName]: updatedFiles };
    });
    setImagePreviews((prev) => {
      const updatedPreviews = [...(prev[fieldName] || [])];
      updatedPreviews.splice(index, 1);
      return { ...prev, [fieldName]: updatedPreviews };
    });
  };

  const replaceImage = (fieldName, index, newFile) => {
    setFormData((prev) => {
      const updatedFiles = [...(prev[fieldName] || [])];
      updatedFiles[index] = newFile;
      return { ...prev, [fieldName]: updatedFiles };
    });
    setImagePreviews((prev) => {
      const updatedPreviews = [...(prev[fieldName] || [])];
      updatedPreviews[index] = URL.createObjectURL(newFile);
      return { ...prev, [fieldName]: updatedPreviews };
    });
  };


  // Today midnight — for date expiry check
const getTodayMidnight = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
};

// Returns true if selected date is BEFORE today (already expired)
const isExpiredDate = (dateString) => {
  if (!dateString) return false;
  const selected = new Date(dateString);
  selected.setHours(0, 0, 0, 0);
  return selected < getTodayMidnight();
};

  // const validate = () => {
  //   let newErrors = {};

  //   if (step === 1) {
  //     if (!formData.vehicleName)
  //       newErrors.vehicleName = "Vehicle name required";
  //     if (!formData.vehicleType)
  //       newErrors.vehicleType = "Vehicle type required";
  //     if (!formData.model)
  //       newErrors.model = "Vehicle model required";
  //     if (!formData.city)
  //       newErrors.city = "City required";
  //     if (!formData.vehicleNumber)
  //       newErrors.vehicleNumber = "Vehicle number required";
  //     if (!formData.year)
  //       newErrors.year = "Year of manufacture required";
  //     if (!formData.fuelType)
  //       newErrors.fuelType = "Fuel type required";
  //     if (!formData.transmission)
  //       newErrors.transmission = "Transmission required";
  //     if (!formData.seatingCapacity)
  //       newErrors.seatingCapacity = "Seating capacity required";
  //   }

  //   if (step === 2) {
  //     if (!formData.campaignType)
  //       newErrors.campaignType = "Campaign type required";
  //     if (!formData.ledAvailable)
  //       newErrors.ledAvailable = "LED available selection required";
  //     if (formData.ledAvailable === "Yes" && !formData.ledSize)
  //       newErrors.ledSize = "LED size required";
  //     if (!formData.soundSystem)
  //       newErrors.soundSystem = "Sound system required";
  //     if (!formData.brandingSideSize)
  //       newErrors.brandingSideSize = "Branding side size required";
  //     if (!formData.brandingBackSize)
  //       newErrors.brandingBackSize = "Back panel size required";
  //     if (!formData.roofSetup)
  //       newErrors.roofSetup = "Roof setup required";
  //     if (!formData.generatorAvailable)
  //       newErrors.generatorAvailable = "Generator availability required";
  //     if (!formData.lighting)
  //       newErrors.lighting = "Lighting required";
  //   }

  //   if (step === 3) {
  //     if (!formData.basePrice)
  //       newErrors.basePrice = "Base price required";
  //     if (!formData.pricingType)
  //       newErrors.pricingType = "Pricing type required";
  //     if (!formData.minBooking)
  //       newErrors.minBooking = "Minimum booking duration required";
  //     if (!formData.extraHourCharge)
  //       newErrors.extraHourCharge = "Extra hour charge required";
  //     if (!formData.driverCharge)
  //       newErrors.driverCharge = "Driver charge required";
  //     if (!formData.fuelPolicy)
  //       newErrors.fuelPolicy = "Fuel policy required";
  //     if (!formData.securityDeposit)
  //       newErrors.securityDeposit = "Security deposit required";
  //     if (!formData.discountEligible)
  //       newErrors.discountEligible = "Discount eligibility required";
  //     if (!formData.availability)
  //       newErrors.availability = "Availability status required";
  //   }

  //   if (step === 4) {
  //     // Only mainImage required — others optional
  //     if (!formData.mainImage || formData.mainImage.length === 0)
  //       newErrors.mainImage = "Main cover image required";
  //   }

  //   if (step === 5) {
  //     if (!formData.driverName)
  //       newErrors.driverName = "Driver name required";
  //     if (!formData.driverPhone)
  //       newErrors.driverPhone = "Driver phone required";
  //     if (!formData.driverExperience)
  //       newErrors.driverExperience = "Driver experience required";
  //     if (!formData.languagesKnown)
  //       newErrors.languagesKnown = "Languages known required";
  //     if (!formData.helperAvailable)
  //       newErrors.helperAvailable = "Helper availability required";
  //   }

  //   if (step === 6) {
  //     if (!formData.rcValidTill)
  //       newErrors.rcValidTill = "RC valid till date required";
  //     if (!formData.insuranceValidTill)
  //       newErrors.insuranceValidTill = "Insurance valid till date required";
  //     if (!formData.pollutionValidTill)
  //       newErrors.pollutionValidTill = "Pollution certificate valid till required";
  //     if (!formData.permitType)
  //       newErrors.permitType = "Permit type required";
  //     if (!formData.emergencyContact)
  //       newErrors.emergencyContact = "Emergency contact required";
  //   }

  //   if (step === 7) {
  //     if (!formData.priorityLevel)
  //       newErrors.priorityLevel = "Priority level required";
  //     if (!formData.internalRating)
  //       newErrors.internalRating = "Internal rating required";
  //     if (!formData.featured)
  //       newErrors.featured = "Featured selection required";
  //     // internalNotes, createdDate, updatedDate → optional ✅
  //   }

  //   setErrors(newErrors);
  //   return Object.keys(newErrors).length === 0;
  // };


  const validate = () => {
    let newErrors = {};

    // ══ STEP 1 ══════════════════════════════════════════════════════════════
    if (step === 1) {
      // Vehicle Name — required + min 4 chars
      if (!formData.vehicleName) {
        newErrors.vehicleName = "Vehicle name is required";
      } else if (formData.vehicleName.trim().length < 4) {
        newErrors.vehicleName = "Vehicle name must be at least 4 characters";
      }

      if (!formData.vehicleType)
        newErrors.vehicleType = "Vehicle type is required";

      if (!formData.model)
        newErrors.model = "Vehicle model is required";

      if (!formData.city)
        newErrors.city = "City is required";

      // Vehicle Number — required only, no format check
      if (!formData.vehicleNumber)
        newErrors.vehicleNumber = "Vehicle number is required";

      if (!formData.year)
        newErrors.year = "Year of manufacture is required";

      if (!formData.fuelType)
        newErrors.fuelType = "Fuel type is required";

      if (!formData.transmission)
        newErrors.transmission = "Transmission is required";

      if (!formData.seatingCapacity)
        newErrors.seatingCapacity = "Seating capacity is required";
    }

    // ══ STEP 2 ══════════════════════════════════════════════════════════════
    if (step === 2) {
      if (!formData.campaignType)
        newErrors.campaignType = "Campaign type is required";

      if (!formData.ledAvailable)
        newErrors.ledAvailable = "LED available selection is required";

      if (formData.ledAvailable === "Yes") {
        if (!formData.ledSize) {
          newErrors.ledSize = "LED size is required";
        } else if (!/^\d+$/.test(formData.ledSize.trim())) {
          newErrors.ledSize = "LED size must contain numbers only";
        }
      }

      if (!formData.soundSystem)
        newErrors.soundSystem = "Sound system is required";

      if (!formData.brandingSideSize) {
        newErrors.brandingSideSize = "Branding side size is required";
      } else if (!/^\d+$/.test(formData.brandingSideSize.trim())) {
        newErrors.brandingSideSize = "Branding side size must be numbers only";
      }

      if (!formData.brandingBackSize) {
        newErrors.brandingBackSize = "Back panel size is required";
      } else if (!/^\d+$/.test(formData.brandingBackSize.trim())) {
        newErrors.brandingBackSize = "Back panel size must be numbers only";
      }

      if (!formData.roofSetup)
        newErrors.roofSetup = "Roof setup is required";

      if (!formData.generatorAvailable)
        newErrors.generatorAvailable = "Generator availability is required";

      if (!formData.lighting)
        newErrors.lighting = "Lighting is required";
    }

    // ══ STEP 3 ══════════════════════════════════════════════════════════════
    if (step === 3) {
      if (!formData.basePrice)
        newErrors.basePrice = "Base price is required";

      if (!formData.pricingType)
        newErrors.pricingType = "Pricing type is required";

      if (!formData.minBooking) {
        newErrors.minBooking = "Minimum booking duration is required";
      } else if (!/^\d+$/.test(formData.minBooking.trim())) {
        newErrors.minBooking = "Minimum booking duration must be numbers only";
      }

      if (!formData.extraHourCharge)
        newErrors.extraHourCharge = "Extra hour charge is required";

      if (!formData.driverCharge)
        newErrors.driverCharge = "Driver charge is required";

      if (!formData.fuelPolicy)
        newErrors.fuelPolicy = "Fuel policy is required";

      if (!formData.securityDeposit)
        newErrors.securityDeposit = "Security deposit is required";

      if (!formData.discountEligible)
        newErrors.discountEligible = "Discount eligibility is required";

      if (!formData.availability)
        newErrors.availability = "Availability status is required";
    }

    // ══ STEP 4 ══════════════════════════════════════════════════════════════
    if (step === 4) {
      if (!formData.mainImage || formData.mainImage.length === 0)
        newErrors.mainImage = "Main cover image is required";
    }

    // ══ STEP 5 ══════════════════════════════════════════════════════════════
    if (step === 5) {
      if (!formData.driverName)
        newErrors.driverName = "Driver name is required";

      if (!formData.driverPhone) {
        newErrors.driverPhone = "Driver phone is required";
      } else if (!/^\d{10}$/.test(formData.driverPhone.trim())) {
        newErrors.driverPhone = "Driver phone must be exactly 10 digits";
      }

      if (!formData.driverExperience)
        newErrors.driverExperience = "Driver experience is required";

      if (!formData.languagesKnown) {
        newErrors.languagesKnown = "Languages known is required";
      } else if (!/^[a-zA-Z\s,]+$/.test(formData.languagesKnown.trim())) {
        newErrors.languagesKnown =
          "Languages must contain letters only (no numbers or special characters)";
      }

      if (!formData.helperAvailable)
        newErrors.helperAvailable = "Helper availability is required";
    }

    // ══ STEP 6 ══════════════════════════════════════════════════════════════
    if (step === 6) {
      if (!formData.rcValidTill) {
        newErrors.rcValidTill = "RC valid till date is required";
      } else if (isExpiredDate(formData.rcValidTill)) {
        newErrors.rcValidTill =
          "RC certificate is expired — please update your RC before proceeding";
      }

      if (!formData.insuranceValidTill) {
        newErrors.insuranceValidTill = "Insurance valid till date is required";
      } else if (isExpiredDate(formData.insuranceValidTill)) {
        newErrors.insuranceValidTill =
          "Insurance is expired — please renew your insurance before proceeding";
      }

      if (!formData.pollutionValidTill) {
        newErrors.pollutionValidTill = "Pollution certificate valid till date is required";
      } else if (isExpiredDate(formData.pollutionValidTill)) {
        newErrors.pollutionValidTill =
          "Pollution certificate is expired — please renew before proceeding";
      }

      if (!formData.permitType)
        newErrors.permitType = "Permit type is required";

      if (!formData.emergencyContact) {
        newErrors.emergencyContact = "Emergency contact is required";
      } else if (!/^\d{10}$/.test(formData.emergencyContact.trim())) {
        newErrors.emergencyContact = "Emergency contact must be exactly 10 digits";
      }
    }

    // ══ STEP 7 ══════════════════════════════════════════════════════════════
    if (step === 7) {
      if (!formData.priorityLevel)
        newErrors.priorityLevel = "Priority level is required";

      if (!formData.internalRating)
        newErrors.internalRating = "Internal rating is required";

      if (!formData.featured)
        newErrors.featured = "Featured selection is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach((key) => {
        if (formData[key] instanceof File) {
          formDataToSend.append(key, formData[key]);
        } else if (Array.isArray(formData[key])) {
          formData[key].forEach((file) => formDataToSend.append(key, file));
        } else {
          formDataToSend.append(key, formData[key]);
        }
      });

      const response = await fetch(`${baseUrls}/createVehicle`, {
        method: "POST",
        headers: { Authorization: `Bearer ${getToken()}` },
        body: formDataToSend,
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Vehicle Added Successfully 🚗");
        setFormData(initialFormState);
        setImagePreviews({
          mainImage: [],
          sideImages: [],
          interiorImages: [],
          ledDisplayImage: [],
          brandingSample: [],
        });
        setStep(1);
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        toast.error("Error Adding Vehicle ❌");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Something went wrong ❌");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    setErrors({});
  }, [step]);

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <div className="stepper">
        {["Basic", "Campaign", "Pricing", "Media", "Driver", "Legal", "Admin"].map(
          (label, index) => (
            <div
              key={index}
              className={`step-item ${
                step === index + 1 ? "active" : step > index + 1 ? "completed" : ""
              }`}
            >
              <div className="step-circle">{index + 1}</div>
              <span>{label}</span>
            </div>
          )
        )}
      </div>

      <div className="sections-grid">

        {/* ================= STEP 1: BASIC INFO ================= */}
        {step === 1 && (
          <div className="form-section">
            <h2>Basic Vehicle Info</h2>
            <div className="form-grid">

              <div className="form-group">
                <label>Vehicle Name</label>
                <input
                  type="text"
                  name="vehicleName"
                  value={formData.vehicleName}
                  onChange={handleChange}
                   placeholder="Vehicle Name"
                />
                {errors.vehicleName && (
                  <span className="error-text">{errors.vehicleName}</span>
                )}
              </div>

              <div className="form-group">
                <label>Vehicle Type</label>
                <select
                  name="vehicleType"
                  value={formData.vehicleType}
                  onChange={handleChange}
                >
                  <option value="">Select Vehicle Type</option>
                  {vehicleTypes.map((type, i) => (
                    <option key={i} value={type}>{type}</option>
                  ))}
                </select>
                {errors.vehicleType && (
                  <span className="error-text">{errors.vehicleType}</span>
                )}
              </div>

              <VehicleModelSelect value={formData.model} onChange={handleChange} />
              {errors.model && (
                <span className="error-text">{errors.model}</span>
              )}

              <div className="form-group">
                <label>City</label>
                <select name="city" value={formData.city} onChange={handleChange}>
                  <option value="">Select City</option>
                  {tamilNaduCities.map((city, index) => (
                    <option key={index} value={city}>{city}</option>
                  ))}
                </select>
                {errors.city && (
                  <span className="error-text">{errors.city}</span>
                )}
              </div>

              <div className="form-group">
                <label>Vehicle Number</label>
                <input
                  type="text"
                  name="vehicleNumber"
                  value={formData.vehicleNumber}
                  onChange={handleChange}
                   placeholder="e.g. TN01AB1234"
                   style={{ textTransform: "uppercase" }}  
                />
                {errors.vehicleNumber && (
                  <span className="error-text">{errors.vehicleNumber}</span>
                )}
              </div>

              <div className="form-group">
                <label>Year of Manufacture</label>
                <input
                  type="number"
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                   placeholder={`e.g. ${new Date().getFullYear()}`}
                />
                {errors.year && (
                  <span className="error-text">{errors.year}</span>
                )}
              </div>

              <div className="form-group">
                <label>Fuel Type</label>
                <select name="fuelType" value={formData.fuelType} onChange={handleChange}>
                  <option value="">Select Fuel Type</option>
                  {fuelTypes.map((fuel, i) => (
                    <option key={i} value={fuel}>{fuel}</option>
                  ))}
                </select>
                {errors.fuelType && (
                  <span className="error-text">{errors.fuelType}</span>
                )}
              </div>

              <div className="form-group">
                <label>Transmission</label>
                <select name="transmission" value={formData.transmission} onChange={handleChange}>
                  <option value="">Select Transmission</option>
                  {transmissionTypes.map((t, i) => (
                    <option key={i} value={t}>{t}</option>
                  ))}
                </select>
                {errors.transmission && (
                  <span className="error-text">{errors.transmission}</span>
                )}
              </div>

              <div className="form-group">
                <label>Seating Capacity</label>
                <input
                  type="number"
                  name="seatingCapacity"
                  value={formData.seatingCapacity}
                  onChange={handleChange}
                  placeholder="e.g. 6"
                />
                {errors.seatingCapacity && (
                  <span className="error-text">{errors.seatingCapacity}</span>
                )}
              </div>

            </div>
          </div>
        )}

        {/* ================= STEP 2: CAMPAIGN FEATURES ================= */}
        {step === 2 && (
          <div className="form-section">
            <h2>Campaign Features</h2>
            <div className="form-grid">

              <div className="form-group">
                <label>Campaign Type</label>
                <select name="campaignType" value={formData.campaignType} onChange={handleChange}>
                  <option value="">Select Campaign</option>
                  {campaignTypes.map((c, i) => (
                    <option key={i} value={c}>{c}</option>
                  ))}
                </select>
                {errors.campaignType && (
                  <span className="error-text">{errors.campaignType}</span>
                )}
              </div>

              <div className="form-group">
                <label>LED Available</label>
                <select name="ledAvailable" value={formData.ledAvailable} onChange={handleChange}>
                  <option value="">Select LED</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
                {errors.ledAvailable && (
                  <span className="error-text">{errors.ledAvailable}</span>
                )}
              </div>

              {formData.ledAvailable === "Yes" && (
                <div className="form-group">
                  <label>LED Size</label>
                  <input
                    type="text"
                    name="ledSize"
                    value={formData.ledSize}
                    onChange={handleChange}
                      placeholder="e.g. 600"
                  />
                  {errors.ledSize && (
                    <span className="error-text">{errors.ledSize}</span>
                  )}
                </div>
              )}

              <div className="form-group">
                <label>Sound System</label>
                <select name="soundSystem" value={formData.soundSystem} onChange={handleChange}>
                  <option value="">Select Sound System</option>
                  <option value="Mic">Mic</option>
                  <option value="Speaker">Speaker</option>
                  <option value="DJ Setup">DJ Setup</option>
                </select>
                {errors.soundSystem && (
                  <span className="error-text">{errors.soundSystem}</span>
                )}
              </div>

              <div className="form-group">
                <label>Branding Space Size</label>
                <input
                  type="text"
                  name="brandingSideSize"
                  placeholder="Branding Space Size"
                  value={formData.brandingSideSize}
                  onChange={handleChange}
                />
                {errors.brandingSideSize && (
                  <span className="error-text">{errors.brandingSideSize}</span>
                )}
              </div>

              <div className="form-group">
                <label>Back Panel Size</label>
                <input
                  type="text"
                  name="brandingBackSize"
                  value={formData.brandingBackSize}
                    placeholder="Back Panel Size"
                  onChange={handleChange}
                />
                {errors.brandingBackSize && (
                  <span className="error-text">{errors.brandingBackSize}</span>
                )}
              </div>

              <div className="form-group">
                <label>Roof Setup</label>
                <select name="roofSetup" value={formData.roofSetup} onChange={handleChange}>
                  <option value="">Select Roof Setup</option>
                  <option value="Stage">Stage</option>
                  <option value="Standing Platform">Standing Platform</option>
                  <option value="None">None</option>
                </select>
                {errors.roofSetup && (
                  <span className="error-text">{errors.roofSetup}</span>
                )}
              </div>

              <div className="form-group">
                <label>Generator / Power Backup</label>
                <select name="generatorAvailable" value={formData.generatorAvailable} onChange={handleChange}>
                  <option value="">Select</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
                {errors.generatorAvailable && (
                  <span className="error-text">{errors.generatorAvailable}</span>
                )}
              </div>

              <div className="form-group">
                <label>Lighting</label>
                <select name="lighting" value={formData.lighting} onChange={handleChange}>
                  <option value="">Select Lighting</option>
                  <option value="Flood Lights">Flood Lights</option>
                  <option value="RGB Lights">RGB Lights</option>
                  <option value="None">None</option>
                </select>
                {errors.lighting && (
                  <span className="error-text">{errors.lighting}</span>
                )}
              </div>

            </div>
          </div>
        )}

        {/* ================= STEP 3: PRICING ================= */}
        {step === 3 && (
          <div className="form-section">
            <h2>Pricing & Availability</h2>
            <div className="form-grid">

              <div className="form-group">
                <label>Base Price</label>
                <input
                  type="number"
                  name="basePrice"
                  placeholder="Enter Base Price"
                  value={formData.basePrice}
                  onChange={handleChange}
                />
                {errors.basePrice && (
                  <span className="error-text">{errors.basePrice}</span>
                )}
              </div>

              <div className="form-group">
                <label>Pricing Type</label>
                <select name="pricingType" value={formData.pricingType} onChange={handleChange}>
                  <option value="">Select Pricing Type</option>
                  <option value="Per Hour">Per Hour</option>
                  <option value="Per Day">Per Day</option>
                  <option value="Per Km">Per Km</option>
                </select>
                {errors.pricingType && (
                  <span className="error-text">{errors.pricingType}</span>
                )}
              </div>

              <div className="form-group">
                <label>Minimum Booking Duration</label>
                <input
                  type="text"
                  name="minBooking"
                  placeholder="Eg: 4 hrs / 1 day"
                  value={formData.minBooking}
                  onChange={handleChange}
                />
                {errors.minBooking && (
                  <span className="error-text">{errors.minBooking}</span>
                )}
              </div>

              <div className="form-group">
                <label>Extra Hour Charge</label>
                <input
                  type="number"
                  name="extraHourCharge"
                  placeholder="Enter Extra Hour Charge"
                  value={formData.extraHourCharge}
                  onChange={handleChange}
                />
                {errors.extraHourCharge && (
                  <span className="error-text">{errors.extraHourCharge}</span>
                )}
              </div>

              <div className="form-group">
                <label>Driver Charge</label>
                <select name="driverCharge" value={formData.driverCharge} onChange={handleChange}>
                  <option value="">Select Charge</option>
                  <option value="Included">Included</option>
                  <option value="Extra">Extra</option>
                </select>
                {errors.driverCharge && (
                  <span className="error-text">{errors.driverCharge}</span>
                )}
              </div>

              <div className="form-group">
                <label>Fuel Policy</label>
                <select name="fuelPolicy" value={formData.fuelPolicy} onChange={handleChange}>
                  <option value="">Select Policy</option>
                  <option value="Included">Included</option>
                  <option value="Customer Pays">Customer Pays</option>
                </select>
                {errors.fuelPolicy && (
                  <span className="error-text">{errors.fuelPolicy}</span>
                )}
              </div>

              <div className="form-group">
                <label>Security Deposit Amount</label>
                <input
                  type="number"
                  name="securityDeposit"
                  placeholder="Enter Security Deposit Amount"
                  value={formData.securityDeposit}
                  onChange={handleChange}
                />
                {errors.securityDeposit && (
                  <span className="error-text">{errors.securityDeposit}</span>
                )}
              </div>

              <div className="form-group">
                <label>Discount Eligibility</label>
                <select name="discountEligible" value={formData.discountEligible} onChange={handleChange}>
                  <option value="">Select Discount</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
                {errors.discountEligible && (
                  <span className="error-text">{errors.discountEligible}</span>
                )}
              </div>

              <div className="form-group">
                <label>Availability Status</label>
                <select name="availability" value={formData.availability} onChange={handleChange}>
                  <option value="">Select Status</option>
                  {availabilityStatus.map((s, i) => (
                    <option key={i} value={s}>{s}</option>
                  ))}
                </select>
                {errors.availability && (
                  <span className="error-text">{errors.availability}</span>
                )}
              </div>

            </div>
          </div>
        )}

        {/* ================= STEP 4: MEDIA ================= */}
        {step === 4 && (
          <div className="form-section">
            <h2>Vehicle Images & Media</h2>
            <div className="form-grid">

              {/* Main Cover Image — REQUIRED */}
              <div className="form-group">
                <label>Main Cover Image <span style={{color:"red"}}>*</span></label>
                <input
                  type="file"
                  name="mainImage"
                  multiple
                  accept="image/*"
                  onChange={handleChange}
                />
                {errors.mainImage && (
                  <span className="error-text">{errors.mainImage}</span>
                )}
                {imagePreviews.mainImage?.length > 0 && (
                  <div className="preview-grid">
                    {imagePreviews.mainImage.map((img, index) => (
                      <div key={index} className="preview-wrapper">
                        <img src={img} alt="Main Preview" className="preview-image" />
                        <div className="preview-actions">
                          <button type="button" className="delete-btn" onClick={() => removeImage("mainImage", index)}>Delete</button>
                          <label className="replace-btn">
                            Replace
                            <input type="file" accept="image/*" hidden onChange={(e) => replaceImage("mainImage", index, e.target.files[0])} />
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Side View Images — OPTIONAL */}
              <div className="form-group">
                <label>Side View Images <span style={{color:"gray", fontSize:"12px"}}>(Optional)</span></label>
                <input type="file" name="sideImages" accept="image/*" multiple onChange={handleChange} />
                {imagePreviews.sideImages?.length > 0 && (
                  <div className="preview-grid">
                    {imagePreviews.sideImages.map((img, index) => (
                      <div key={index} className="preview-wrapper">
                        <img src={img} alt="Side Preview" className="preview-image" />
                        <div className="preview-actions">
                          <button type="button" className="delete-btn" onClick={() => removeImage("sideImages", index)}>Delete</button>
                          <label className="replace-btn">
                            Replace
                            <input type="file" accept="image/*" hidden onChange={(e) => replaceImage("sideImages", index, e.target.files[0])} />
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Interior Images — OPTIONAL */}
              <div className="form-group">
                <label>Interior Images <span style={{color:"gray", fontSize:"12px"}}>(Optional)</span></label>
                <input type="file" name="interiorImages" accept="image/*" multiple onChange={handleChange} />
                {imagePreviews.interiorImages?.length > 0 && (
                  <div className="preview-grid">
                    {imagePreviews.interiorImages.map((img, index) => (
                      <div key={index} className="preview-wrapper">
                        <img src={img} alt="Interior Preview" className="preview-image" />
                        <div className="preview-actions">
                          <button type="button" className="delete-btn" onClick={() => removeImage("interiorImages", index)}>Delete</button>
                          <label className="replace-btn">
                            Replace
                            <input type="file" accept="image/*" hidden onChange={(e) => replaceImage("interiorImages", index, e.target.files[0])} />
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* LED Display Image — OPTIONAL */}
              <div className="form-group">
                <label>LED Display Image <span style={{color:"gray", fontSize:"12px"}}>(Optional)</span></label>
                <input type="file" name="ledDisplayImage" accept="image/*" multiple onChange={handleChange} />
                {imagePreviews.ledDisplayImage?.length > 0 && (
                  <div className="preview-grid">
                    {imagePreviews.ledDisplayImage.map((img, index) => (
                      <div key={index} className="preview-wrapper">
                        <img src={img} alt="LED Preview" className="preview-image" />
                        <div className="preview-actions">
                          <button type="button" className="delete-btn" onClick={() => removeImage("ledDisplayImage", index)}>Delete</button>
                          <label className="replace-btn">
                            Replace
                            <input type="file" accept="image/*" hidden onChange={(e) => replaceImage("ledDisplayImage", index, e.target.files[0])} />
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Branding Sample — OPTIONAL */}
              <div className="form-group">
                <label>Branding Sample Image <span style={{color:"gray", fontSize:"12px"}}>(Optional)</span></label>
                <input type="file" name="brandingSample" accept="image/*" multiple onChange={handleChange} />
                {imagePreviews.brandingSample?.length > 0 && (
                  <div className="preview-grid">
                    {imagePreviews.brandingSample.map((img, index) => (
                      <div key={index} className="preview-wrapper">
                        <img src={img} alt="Branding Preview" className="preview-image" />
                        <div className="preview-actions">
                          <button type="button" className="delete-btn" onClick={() => removeImage("brandingSample", index)}>Delete</button>
                          <label className="replace-btn">
                            Replace
                            <input type="file" accept="image/*" hidden onChange={(e) => replaceImage("brandingSample", index, e.target.files[0])} />
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Video — OPTIONAL */}
              <div className="form-group">
                <label>Video <span style={{color:"gray", fontSize:"12px"}}>(Optional)</span></label>
                <input type="file" name="vehicleVideo" accept="video/*" onChange={handleChange} />
              </div>

            </div>
          </div>
        )}

        {/* ================= STEP 5: DRIVER INFO ================= */}
        {step === 5 && (
          <div className="form-section">
            <h2>Driver & Staff Info</h2>
            <div className="form-grid">

              <div className="form-group">
                <label>Driver Name</label>
                <input type="text" name="driverName" value={formData.driverName}   placeholder="Name" onChange={handleChange} />
                {errors.driverName && (
                  <span className="error-text">{errors.driverName}</span>
                )}
              </div>

              <div className="form-group">
                <label>Driver Phone</label>
                <input type="tel" name="driverPhone"   placeholder="Phone" value={formData.driverPhone} onChange={handleChange} />
                {errors.driverPhone && (
                  <span className="error-text">{errors.driverPhone}</span>
                )}
              </div>

              <div className="form-group">
                <label>Experience (Years)</label>
                <input type="number" name="driverExperience"   placeholder="e.g. 6" value={formData.driverExperience} onChange={handleChange} />
                {errors.driverExperience && (
                  <span className="error-text">{errors.driverExperience}</span>
                )}
              </div>

              <div className="form-group">
                <label>Languages Known</label>
                <input
                  type="text"
                  name="languagesKnown"
                  placeholder="Eg: English, Tamil, Hindi"
                  value={formData.languagesKnown}
                  onChange={handleChange}
                />
                {errors.languagesKnown && (
                  <span className="error-text">{errors.languagesKnown}</span>
                )}
              </div>

              <div className="form-group">
                <label>Helper / Technician Available</label>
                <select name="helperAvailable" value={formData.helperAvailable} onChange={handleChange}>
                  <option value="">Select</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
                {errors.helperAvailable && (
                  <span className="error-text">{errors.helperAvailable}</span>
                )}
              </div>

            </div>
          </div>
        )}

        {/* ================= STEP 6: LEGAL ================= */}
        {step === 6 && (
          <div className="form-section">
            <h2>Legal & Safety</h2>
            <div className="form-grid">

              <div className="form-group">
                <label>RC Valid Till</label>
                <input type="date" name="rcValidTill" value={formData.rcValidTill} onChange={handleChange} />
                {errors.rcValidTill && (
                  <span className="error-text">{errors.rcValidTill}</span>
                )}
              </div>

              <div className="form-group">
                <label>Insurance Valid Till</label>
                <input type="date" name="insuranceValidTill" value={formData.insuranceValidTill} onChange={handleChange} />
                {errors.insuranceValidTill && (
                  <span className="error-text">{errors.insuranceValidTill}</span>
                )}
              </div>

              <div className="form-group">
                <label>Pollution Certificate Valid Till</label>
                <input type="date" name="pollutionValidTill" value={formData.pollutionValidTill} onChange={handleChange} />
                {errors.pollutionValidTill && (
                  <span className="error-text">{errors.pollutionValidTill}</span>
                )}
              </div>

              <div className="form-group">
                <label>Permit Type</label>
                <select name="permitType" value={formData.permitType} onChange={handleChange}>
                  <option value="">Select Permit Type</option>
                  {permitTypes.map((p, i) => (
                    <option key={i} value={p}>{p}</option>
                  ))}
                </select>
                {errors.permitType && (
                  <span className="error-text">{errors.permitType}</span>
                )}
              </div>

              <div className="form-group">
                <label>Emergency Contact</label>
                <input type="text" name="emergencyContact"   placeholder="Contact NO" value={formData.emergencyContact} onChange={handleChange} />
                {errors.emergencyContact && (
                  <span className="error-text">{errors.emergencyContact}</span>
                )}
              </div>

            </div>
          </div>
        )}

        {/* ================= STEP 7: ADMIN ================= */}
        {step === 7 && (
          <div className="form-section">
            <h2>Internal Admin Controls (Hidden from User)</h2>
            <div className="form-grid">

              {/* Internal Notes — OPTIONAL */}
              <div className="form-group">
                <label>Internal Notes <span style={{color:"gray", fontSize:"12px"}}>(Optional)</span></label>
                <textarea
                  name="internalNotes"
                  placeholder="Enter internal notes for admin reference"
                  value={formData.internalNotes}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Priority Level</label>
                <select name="priorityLevel" value={formData.priorityLevel} onChange={handleChange}>
                  <option value="">Select Priority</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
                {errors.priorityLevel && (
                  <span className="error-text">{errors.priorityLevel}</span>
                )}
              </div>

              <div className="form-group">
                <label>Vehicle Rating (Internal)</label>
                <input
                  type="number"
                  name="internalRating"
                  min="1"
                  max="5"
                  placeholder="Rate from 1 to 5"
                  value={formData.internalRating}
                  onChange={handleChange}
                />
                {errors.internalRating && (
                  <span className="error-text">{errors.internalRating}</span>
                )}
              </div>

              <div className="form-group">
                <label>Featured Vehicle</label>
                <select name="featured" value={formData.featured} onChange={handleChange}>
                  <option value="">Select Option</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
                {errors.featured && (
                  <span className="error-text">{errors.featured}</span>
                )}
              </div>

              {/* Created Date — OPTIONAL / ReadOnly */}
              <div className="form-group">
                <label>Created Date <span style={{color:"gray", fontSize:"12px"}}>(Auto)</span></label>
                <input type="datetime-local" name="createdDate" value={formData.createdAt} readOnly />
              </div>

              {/* Last Updated Date — OPTIONAL / ReadOnly */}
              <div className="form-group">
                <label>Last Updated Date <span style={{color:"gray", fontSize:"12px"}}>(Auto)</span></label>
                <input type="datetime-local" name="updatedDate" value={formData.updatedAt} readOnly />
              </div>

            </div>
          </div>
        )}

        {/* ================= NAVIGATION BUTTONS ================= */}
        <div className="step-buttons">
          {step > 1 && (
            <button type="button" className="prev-btn" onClick={prevStep}>
              Previous
            </button>
          )}
          {step < totalSteps && (
            <button type="button" className="next-btn" onClick={nextStep}>
              Next
            </button>
          )}
          {step === totalSteps && (
            <button type="submit" className="submit-btn" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit Vehicle"}
            </button>
          )}
        </div>

      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </form>
  );
};

export default EntryNewVehicles;
