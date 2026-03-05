import React, {
  useState,
  useContext,
  useEffect,
  useCallback,
  useRef,
} from "react";
import "./css/entryNewVehicles.css";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { toast } from "react-toastify";
import { baseUrl } from "../Authentication/BASE_URL";
import {
  vehicleTypes,
  fuelTypes,
  transmissionTypes,
  campaignTypes,
  availabilityStatus,
  permitTypes,
  modelTypes,
  tamilNaduCities,
} from "./vehicleOptions";

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

      setFormData((prev) => ({
        ...prev,
        [name]: fileArray,
      }));

      const previewUrls = fileArray.map((file) => URL.createObjectURL(file));

      setImagePreviews((prev) => ({
        ...prev,
        [name]: previewUrls,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const removeImage = (fieldName, index) => {
    setFormData((prev) => {
      const updatedFiles = [...(prev[fieldName] || [])];
      updatedFiles.splice(index, 1);
      return {
        ...prev,
        [fieldName]: updatedFiles,
      };
    });

    setImagePreviews((prev) => {
      const updatedPreviews = [...(prev[fieldName] || [])];
      updatedPreviews.splice(index, 1);
      return {
        ...prev,
        [fieldName]: updatedPreviews,
      };
    });
  };

  const replaceImage = (fieldName, index, newFile) => {
    setFormData((prev) => {
      const updatedFiles = [...(prev[fieldName] || [])];
      updatedFiles[index] = newFile;
      return {
        ...prev,
        [fieldName]: updatedFiles,
      };
    });

    setImagePreviews((prev) => {
      const updatedPreviews = [...(prev[fieldName] || [])];
      updatedPreviews[index] = URL.createObjectURL(newFile);
      return {
        ...prev,
        [fieldName]: updatedPreviews,
      };
    });
  };

  const validate = () => {
    let newErrors = {};

    if (step === 1) {
      // if (!formData.vehicleName)
      //   newErrors.vehicleName = "Vehicle name required";
      // if (!formData.vehicleType)
      //   newErrors.vehicleType = "Vehicle type required";
      // if (!formData.vehicleNumber)
      //   newErrors.vehicleNumber = "Vehicle number required";
      // if (!formData.fuelType)
      //   newErrors.fuelType = "Vehicle type required";
    }

    if (step === 2) {
      if (formData.ledAvailable === "Yes" && !formData.ledSize)
        newErrors.ledSize = "LED size required";
    }

    if (step === 3) {
      // if (!formData.basePrice) newErrors.basePrice = "Base price required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setIsSubmitting(true); // 🔥 Start loading

    try {
      const formDataToSend = new FormData();

      Object.keys(formData).forEach((key) => {
        if (formData[key] instanceof File) {
          formDataToSend.append(key, formData[key]);
        } else if (Array.isArray(formData[key])) {
          formData[key].forEach((file) => {
            formDataToSend.append(key, file);
          });
        } else {
          formDataToSend.append(key, formData[key]);
        }
      });

      const response = await fetch(`${baseUrl}/createVehicle`, {
        method: "POST",
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
      setIsSubmitting(false); // 🔥 Stop loading (VERY IMPORTANT)
    }
  };

  useEffect(() => {
    setErrors({});
  }, [step]);

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <div className="stepper">
        {[
          "Basic",
          "Campaign",
          "Pricing",
          "Media",
          "Driver",
          "Legal",
          "Admin",
        ].map((label, index) => (
          <div
            key={index}
            className={`step-item ${
              step === index + 1
                ? "active"
                : step > index + 1
                  ? "completed"
                  : ""
            }`}
          >
            <div className="step-circle">{index + 1}</div>
            <span>{label}</span>
          </div>
        ))}
      </div>
      <div className="sections-grid">
        {step === 1 && (
          <>
            {" "}
            {/* ================= BASIC INFO ================= */}
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
                      <option key={i} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                  {errors.vehicleType && (
                    <span className="error-text">{errors.vehicleType}</span>
                  )}
                </div>

                <div className="form-group">
                  <label>Vehicle Model Type</label>
                  <select
                    name="model"
                    value={formData.model}
                    onChange={handleChange}
                  >
                    <option value="">Select Model Type</option>
                    {modelTypes.map((model, index) => (
                      <option key={index} value={model}>
                        {model}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>City</label>
                  <select
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                  >
                    <option value="">Select City</option>
                    {tamilNaduCities.map((city, index) => (
                      <option key={index} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Vehicle Number</label>
                  <input
                    type="text"
                    name="vehicleNumber"
                    value={formData.vehicleNumber}
                    onChange={handleChange}
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
                  />
                </div>

                <div className="form-group">
                  <label>Fuel Type</label>
                  <select
                    name="fuelType"
                    value={formData.fuelType}
                    onChange={handleChange}
                  >
                    <option value="">Select Fuel Type</option>

                    {fuelTypes.map((fuel, i) => (
                      <option key={i} value={fuel}>
                        {fuel}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Transmission</label>
                  <select
                    name="transmission"
                    value={formData.transmission}
                    onChange={handleChange}
                  >
                    <option value="">Select Transmission</option>
                    {transmissionTypes.map((t, i) => (
                      <option key={i} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Seating Capacity</label>
                  <input
                    type="number"
                    name="seatingCapacity"
                    value={formData.seatingCapacity}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            {" "}
            {/* ================= CAMPAIGN FEATURES ================= */}
            <div className="form-section">
              <h2>Campaign Features</h2>
              <div className="form-grid">
                <div className="form-group">
                  <label>Campaign Type</label>
                  <select
                    name="campaignType"
                    value={formData.campaignType}
                    onChange={handleChange}
                  >
                    <option value="">Select</option>
                    {campaignTypes.map((c, i) => (
                      <option key={i} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>LED Available</label>
                  <select
                    name="ledAvailable"
                    value={formData.ledAvailable}
                    onChange={handleChange}
                  >
                    <option value="">Select</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </div>

                {formData.ledAvailable === "Yes" && (
                  <div className="form-group">
                    <label>LED Size</label>
                    <input
                      type="text"
                      name="ledSize"
                      value={formData.ledSize}
                      onChange={handleChange}
                    />
                    {errors.ledSize && (
                      <p className="error-text">{errors.ledSize}</p>
                    )}
                  </div>
                )}

                <div className="form-group">
                  <label>Sound System</label>
                  <select
                    name="soundSystem"
                    value={formData.soundSystem}
                    onChange={handleChange}
                  >
                    <option value="">Select</option>
                    <option value="Mic">Mic</option>
                    <option value="Speaker">Speaker</option>
                    <option value="DJ Setup">DJ Setup</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Branding Space Size</label>
                  <input
                    type="text"
                    name="brandingSideSize"
                    placeholder="Side Panel Size"
                    value={formData.brandingSideSize}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label>Back Panel Size</label>
                  <input
                    type="text"
                    name="brandingBackSize"
                    value={formData.brandingBackSize}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label>Roof Setup</label>
                  <select
                    name="roofSetup"
                    value={formData.roofSetup}
                    onChange={handleChange}
                  >
                    <option value="">Select</option>
                    <option value="Stage">Stage</option>
                    <option value="Standing Platform">Standing Platform</option>
                    <option value="None">None</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Generator / Power Backup</label>
                  <select
                    name="generatorAvailable"
                    value={formData.generatorAvailable}
                    onChange={handleChange}
                  >
                    <option value="">Select</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Lighting</label>
                  <select
                    name="lighting"
                    value={formData.lighting}
                    onChange={handleChange}
                  >
                    <option value="">Select</option>
                    <option value="Flood Lights">Flood Lights</option>
                    <option value="RGB Lights">RGB Lights</option>
                    <option value="None">None</option>
                  </select>
                </div>
              </div>
            </div>
          </>
        )}

        {step === 3 && (
          <>
            {" "}
            {/* ================= PRICING ================= */}
            <div className="form-section">
              <h2>Pricing & Availability</h2>

              <div className="form-grid">
                {/* Base Price */}
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

                {/* Pricing Type */}
                <div className="form-group">
                  <label>Pricing Type</label>
                  <select
                    name="pricingType"
                    value={formData.pricingType}
                    onChange={handleChange}
                  >
                    <option value="">Select Pricing Type</option>
                    <option value="Per Hour">Per Hour</option>
                    <option value="Per Day">Per Day</option>
                    <option value="Per Km">Per Km</option>
                  </select>
                </div>

                {/* Minimum Booking Duration */}
                <div className="form-group">
                  <label>Minimum Booking Duration</label>
                  <input
                    type="text"
                    name="minBooking"
                    placeholder="Eg: 4 hrs / 1 day"
                    value={formData.minBooking}
                    onChange={handleChange}
                  />
                </div>

                {/* Extra Hour Charge */}
                <div className="form-group">
                  <label>Extra Hour Charge</label>
                  <input
                    type="number"
                    name="extraHourCharge"
                    placeholder="Enter Extra Hour Charge"
                    value={formData.extraHourCharge}
                    onChange={handleChange}
                  />
                </div>

                {/* Driver Charge */}
                <div className="form-group">
                  <label>Driver Charge</label>
                  <select
                    name="driverCharge"
                    value={formData.driverCharge}
                    onChange={handleChange}
                  >
                    <option value="">Select</option>
                    <option value="Included">Included</option>
                    <option value="Extra">Extra</option>
                  </select>
                </div>

                {/* Fuel Policy */}
                <div className="form-group">
                  <label>Fuel Policy</label>
                  <select
                    name="fuelPolicy"
                    value={formData.fuelPolicy}
                    onChange={handleChange}
                  >
                    <option value="">Select</option>
                    <option value="Included">Included</option>
                    <option value="Customer Pays">Customer Pays</option>
                  </select>
                </div>

                {/* NEW: Security Deposit */}
                <div className="form-group">
                  <label>Security Deposit Amount</label>
                  <input
                    type="number"
                    name="securityDeposit"
                    placeholder="Enter Security Deposit Amount"
                    value={formData.securityDeposit}
                    onChange={handleChange}
                  />
                </div>

                {/* NEW: Discount Eligibility */}
                <div className="form-group">
                  <label>Discount Eligibility</label>
                  <select
                    name="discountEligible"
                    value={formData.discountEligible}
                    onChange={handleChange}
                  >
                    <option value="">Select</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </div>

                {/* Availability Status */}
                <div className="form-group">
                  <label>Availability Status</label>
                  <select
                    name="availability"
                    value={formData.availability}
                    onChange={handleChange}
                  >
                    <option value="">Select Status</option>
                    {availabilityStatus.map((s, i) => (
                      <option key={i} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </>
        )}

        {step === 4 && (
          <>
            {" "}
            {/* ================= Vehicle Images & Media ================= */}
            <div className="form-section">
              <h2>Vehicle Images & Media</h2>

              <div className="form-grid">
                <div className="form-group">
                  <label>Main Cover Image</label>
                  <input
                    type="file"
                    name="mainImage"
                    multiple
                    accept="image/*"
                    onChange={handleChange}
                  />
                  {imagePreviews.mainImage?.length > 0 && (
                    <div className="preview-grid">
                      {imagePreviews.mainImage.map((img, index) => (
                        <div key={index} className="preview-wrapper">
                          <img
                            src={img}
                            alt="Main Preview"
                            className="preview-image"
                          />

                          <div className="preview-actions">
                            <button
                              type="button"
                              className="delete-btn"
                              onClick={() => removeImage("mainImage", index)}
                            >
                              Delete
                            </button>

                            <label className="replace-btn">
                              Replace
                              <input
                                type="file"
                                accept="image/*"
                                hidden
                                onChange={(e) =>
                                  replaceImage(
                                    "mainImage",
                                    index,
                                    e.target.files[0],
                                  )
                                }
                              />
                            </label>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <label>Side View Images</label>
                  <input
                    type="file"
                    name="sideImages"
                    accept="image/*"
                    multiple
                    onChange={handleChange}
                  />
                  {imagePreviews.sideImages?.length > 0 && (
                    <div className="preview-grid">
                      {imagePreviews.sideImages.map((img, index) => (
                        <div key={index} className="preview-wrapper">
                          <img
                            src={img}
                            alt="Side Preview"
                            className="preview-image"
                          />

                          <div className="preview-actions">
                            <button
                              type="button"
                              className="delete-btn"
                              onClick={() => removeImage("sideImages", index)}
                            >
                              Delete
                            </button>

                            <label className="replace-btn">
                              Replace
                              <input
                                type="file"
                                accept="image/*"
                                hidden
                                onChange={(e) =>
                                  replaceImage(
                                    "sideImages",
                                    index,
                                    e.target.files[0],
                                  )
                                }
                              />
                            </label>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <label>Interior Images</label>
                  <input
                    type="file"
                    name="interiorImages"
                    accept="image/*"
                    multiple
                    onChange={handleChange}
                  />
                  {imagePreviews.interiorImages?.length > 0 && (
                    <div className="preview-grid">
                      {imagePreviews.interiorImages.map((img, index) => (
                        <div key={index} className="preview-wrapper">
                          <img
                            src={img}
                            alt="Interior Preview"
                            className="preview-image"
                          />

                          <div className="preview-actions">
                            <button
                              type="button"
                              className="delete-btn"
                              onClick={() =>
                                removeImage("interiorImages", index)
                              }
                            >
                              Delete
                            </button>

                            <label className="replace-btn">
                              Replace
                              <input
                                type="file"
                                accept="image/*"
                                hidden
                                onChange={(e) =>
                                  replaceImage(
                                    "interiorImages",
                                    index,
                                    e.target.files[0],
                                  )
                                }
                              />
                            </label>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <label>LED Display Image</label>
                  <input
                    type="file"
                    name="ledDisplayImage"
                    accept="image/*"
                    multiple
                    onChange={handleChange}
                  />
                  {imagePreviews.ledDisplayImage?.length > 0 && (
                    <div className="preview-grid">
                      {imagePreviews.ledDisplayImage.map((img, index) => (
                        <div key={index} className="preview-wrapper">
                          <img
                            src={img}
                            alt="LED Preview"
                            className="preview-image"
                          />

                          <div className="preview-actions">
                            <button
                              type="button"
                              className="delete-btn"
                              onClick={() =>
                                removeImage("ledDisplayImage", index)
                              }
                            >
                              Delete
                            </button>

                            <label className="replace-btn">
                              Replace
                              <input
                                type="file"
                                accept="image/*"
                                hidden
                                onChange={(e) =>
                                  replaceImage(
                                    "ledDisplayImage",
                                    index,
                                    e.target.files[0],
                                  )
                                }
                              />
                            </label>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <label>Branding Sample Image</label>
                  <input
                    type="file"
                    name="brandingSample"
                    accept="image/*"
                    multiple
                    onChange={handleChange}
                  />
                  {imagePreviews.brandingSample?.length > 0 && (
                    <div className="preview-grid">
                      {imagePreviews.brandingSample.map((img, index) => (
                        <div key={index} className="preview-wrapper">
                          <img
                            src={img}
                            alt="Branding Preview"
                            className="preview-image"
                          />

                          <div className="preview-actions">
                            <button
                              type="button"
                              className="delete-btn"
                              onClick={() =>
                                removeImage("brandingSample", index)
                              }
                            >
                              Delete
                            </button>

                            <label className="replace-btn">
                              Replace
                              <input
                                type="file"
                                accept="image/*"
                                hidden
                                onChange={(e) =>
                                  replaceImage(
                                    "brandingSample",
                                    index,
                                    e.target.files[0],
                                  )
                                }
                              />
                            </label>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <label>Video (Optional)</label>
                  <input
                    type="file"
                    name="vehicleVideo"
                    accept="video/*"
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
          </>
        )}

        {step === 5 && (
          <>
            {" "}
            {/* ================= Driver & Staff Info ================= */}
            <div className="form-section">
              <h2>Driver & Staff Info (Optional)</h2>

              <div className="form-grid">
                <div className="form-group">
                  <label>Driver Name</label>
                  <input
                    type="text"
                    name="driverName"
                    value={formData.driverName}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label>Driver Phone</label>
                  <input
                    type="tel"
                    name="driverPhone"
                    value={formData.driverPhone}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label>Experience (Years)</label>
                  <input
                    type="number"
                    name="driverExperience"
                    value={formData.driverExperience}
                    onChange={handleChange}
                  />
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
                </div>

                <div className="form-group">
                  <label>Helper / Technician Available</label>
                  <select
                    name="helperAvailable"
                    value={formData.helperAvailable}
                    onChange={handleChange}
                  >
                    <option value="">Select</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </div>
              </div>
            </div>
          </>
        )}

        {step === 6 && (
          <>
            {" "}
            {/* ================= LEGAL ================= */}
            <div className="form-section">
              <h2>Legal & Safety</h2>
              <div className="form-grid">
                <div className="form-group">
                  <label>RC Valid Till</label>
                  <input
                    type="date"
                    name="rcValidTill"
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label>Insurance Valid Till</label>
                  <input
                    type="date"
                    name="insuranceValidTill"
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label>Pollution Certificate Valid Till</label>
                  <input
                    type="date"
                    name="pollutionValidTill"
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label>Permit Type</label>
                  <select
                    name="permitType"
                    value={formData.permitType}
                    onChange={handleChange}
                  >
                    <option value="">Select Permit Type</option>
                    {permitTypes.map((p, i) => (
                      <option key={i} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Emergency Contact</label>
                  <input
                    type="text"
                    name="emergencyContact"
                    value={formData.emergencyContact}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
          </>
        )}

        {step === 7 && (
          <>
            {" "}
            {/* ================= INTERNAL ADMIN CONTROLS ================= */}
            <div className="form-section">
              <h2>Internal Admin Controls (Hidden from User)</h2>

              <div className="form-grid">
                {/* Internal Notes */}
                <div className="form-group">
                  <label>Internal Notes</label>
                  <textarea
                    name="internalNotes"
                    placeholder="Enter internal notes for admin reference"
                    value={formData.internalNotes}
                    onChange={handleChange}
                  />
                </div>

                {/* Priority Level */}
                <div className="form-group">
                  <label>Priority Level</label>
                  <select
                    name="priorityLevel"
                    value={formData.priorityLevel}
                    onChange={handleChange}
                  >
                    <option value="">Select Priority</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>

                {/* Vehicle Rating (Internal) */}
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
                </div>

                {/* Featured Vehicle */}
                <div className="form-group">
                  <label>Featured Vehicle</label>
                  <select
                    name="featured"
                    value={formData.featured}
                    onChange={handleChange}
                  >
                    <option value="">Select Option</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </div>

                {/* Created Date */}
                <div className="form-group">
                  <label>Created Date</label>
                  <input
                    type="datetime-local"
                    name="createdDate"
                    value={formData.createdAt}
                    readOnly
                  />
                </div>

                {/* Last Updated Date */}
                <div className="form-group">
                  <label>Last Updated Date</label>
                  <input
                    type="datetime-local"
                    name="updatedDate"
                    value={formData.updatedAt}
                    readOnly
                  />
                </div>
              </div>
            </div>
          </>
        )}

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
            <button
              type="submit"
              className="submit-btn"
              disabled={isSubmitting}
            >
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
