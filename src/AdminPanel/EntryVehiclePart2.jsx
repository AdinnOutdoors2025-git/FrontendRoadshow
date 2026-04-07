import React, { useState, useEffect } from "react";
import { permitTypes } from "./vehicleOptions";
import "./css/entryNewVehicles.css";

const EntryVehiclePart2 = ({
  formData,
  handleChange,
  imagePreviews,
  removeImage,
  replaceImage,
  step,
  goNext,
  goPrev,
  totalSteps,
  isSubmitting,
  handleSubmit,
}) => {
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setErrors({});
  }, [step]);

  const validate = () => {
    const newErrors = {};

    if (step === 4) {
      if (!formData.mainImage || formData.mainImage.length === 0)
        newErrors.mainImage = "At least one main cover image is required";
    }

    if (step === 5) {
      if (!formData.driverName.trim())
        newErrors.driverName = "Driver name is required";
      if (!formData.driverPhone.trim())
        newErrors.driverPhone = "Driver phone is required";
      else if (!/^[6-9]\d{9}$/.test(formData.driverPhone.trim()))
        newErrors.driverPhone = "Enter a valid 10-digit mobile number";
      if (!formData.driverExperience)
        newErrors.driverExperience = "Driver experience is required";
      else if (Number(formData.driverExperience) < 0)
        newErrors.driverExperience = "Experience cannot be negative";
      if (!formData.languagesKnown.trim())
        newErrors.languagesKnown = "Languages known is required";
      if (!formData.helperAvailable)
        newErrors.helperAvailable = "Please select helper availability";
    }

    if (step === 6) {
      if (!formData.rcValidTill)
        newErrors.rcValidTill = "RC valid till date is required";
      if (!formData.insuranceValidTill)
        newErrors.insuranceValidTill = "Insurance valid till date is required";
      if (!formData.pollutionValidTill)
        newErrors.pollutionValidTill = "Pollution certificate date is required";
      if (!formData.permitType)
        newErrors.permitType = "Permit type is required";
      if (!formData.emergencyContact.trim())
        newErrors.emergencyContact = "Emergency contact is required";
      else if (!/^[6-9]\d{9}$/.test(formData.emergencyContact.trim()))
        newErrors.emergencyContact = "Enter a valid 10-digit mobile number";
    }

    if (step === 7) {
      if (!formData.priorityLevel)
        newErrors.priorityLevel = "Priority level is required";
      if (!formData.internalRating)
        newErrors.internalRating = "Internal rating is required";
      else if (Number(formData.internalRating) < 1 || Number(formData.internalRating) > 5)
        newErrors.internalRating = "Rating must be between 1 and 5";
      if (!formData.featured)
        newErrors.featured = "Please select featured option";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validate()) goNext();
  };

  const handleFinalSubmit = (e) => {
    e.preventDefault();
    if (validate()) handleSubmit(e);
  };

  const ImageUploadBlock = ({ label, fieldName, required }) => (
    <div className="form-group">
      <label>{label} {required && <span className="required">*</span>}</label>
      <input
        type="file"
        name={fieldName}
        multiple
        accept="image/*"
        onChange={handleChange}
      />
      {errors[fieldName] && <span className="error-text">{errors[fieldName]}</span>}
      {imagePreviews[fieldName]?.length > 0 && (
        <div className="preview-grid">
          {imagePreviews[fieldName].map((img, index) => (
            <div key={index} className="preview-wrapper">
              <img src={img} alt={`${label} Preview`} className="preview-image" />
              <div className="preview-actions">
                <button
                  type="button"
                  className="delete-btn"
                  onClick={() => removeImage(fieldName, index)}
                >
                  Delete
                </button>
                <label className="replace-btn">
                  Replace
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={(e) => replaceImage(fieldName, index, e.target.files[0])}
                  />
                </label>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <form onSubmit={handleFinalSubmit}>
      <div className="sections-grid">

        {/* ===== STEP 4: MEDIA ===== */}
        {step === 4 && (
          <div className="form-section">
            <h2>Vehicle Images & Media</h2>
            <div className="form-grid">
              <ImageUploadBlock label="Main Cover Image" fieldName="mainImage" required />
            </div>
          </div>
        )}

        {/* ===== STEP 5: DRIVER ===== */}
        {step === 5 && (
          <div className="form-section">
            <h2>Driver & Staff Info</h2>
            <div className="form-grid">

              <div className="form-group">
                <label>Driver Name <span className="required">*</span></label>
                <input
                  type="text"
                  name="driverName"
                  value={formData.driverName}
                  onChange={handleChange}
                  placeholder="Enter driver name"
                />
                {errors.driverName && <span className="error-text">{errors.driverName}</span>}
              </div>

              <div className="form-group">
                <label>Driver Phone <span className="required">*</span></label>
                <input
                  type="tel"
                  name="driverPhone"
                  value={formData.driverPhone}
                  onChange={handleChange}
                  placeholder="Eg: 9876543210"
                />
                {errors.driverPhone && <span className="error-text">{errors.driverPhone}</span>}
              </div>

              <div className="form-group">
                <label>Experience (Years) <span className="required">*</span></label>
                <input
                  type="number"
                  name="driverExperience"
                  value={formData.driverExperience}
                  onChange={handleChange}
                  placeholder="Eg: 5"
                />
                {errors.driverExperience && <span className="error-text">{errors.driverExperience}</span>}
              </div>

              <div className="form-group">
                <label>Languages Known <span className="required">*</span></label>
                <input
                  type="text"
                  name="languagesKnown"
                  placeholder="Eg: English, Tamil, Hindi"
                  value={formData.languagesKnown}
                  onChange={handleChange}
                />
                {errors.languagesKnown && <span className="error-text">{errors.languagesKnown}</span>}
              </div>

              <div className="form-group">
                <label>Helper / Technician Available <span className="required">*</span></label>
                <select name="helperAvailable" value={formData.helperAvailable} onChange={handleChange}>
                  <option value="">Select</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
                {errors.helperAvailable && <span className="error-text">{errors.helperAvailable}</span>}
              </div>

            </div>
          </div>
        )}

        {/* ===== STEP 6: LEGAL ===== */}
        {step === 6 && (
          <div className="form-section">
            <h2>Legal & Safety</h2>
            <div className="form-grid">

              <div className="form-group">
                <label>RC Valid Till <span className="required">*</span></label>
                <input
                  type="date"
                  name="rcValidTill"
                  value={formData.rcValidTill}
                  onChange={handleChange}
                />
                {errors.rcValidTill && <span className="error-text">{errors.rcValidTill}</span>}
              </div>

              <div className="form-group">
                <label>Insurance Valid Till <span className="required">*</span></label>
                <input
                  type="date"
                  name="insuranceValidTill"
                  value={formData.insuranceValidTill}
                  onChange={handleChange}
                />
                {errors.insuranceValidTill && <span className="error-text">{errors.insuranceValidTill}</span>}
              </div>

              <div className="form-group">
                <label>Pollution Certificate Valid Till <span className="required">*</span></label>
                <input
                  type="date"
                  name="pollutionValidTill"
                  value={formData.pollutionValidTill}
                  onChange={handleChange}
                />
                {errors.pollutionValidTill && <span className="error-text">{errors.pollutionValidTill}</span>}
              </div>

              <div className="form-group">
                <label>Permit Type <span className="required">*</span></label>
                <select name="permitType" value={formData.permitType} onChange={handleChange}>
                  <option value="">Select Permit Type</option>
                  {permitTypes.map((p, i) => (
                    <option key={i} value={p}>{p}</option>
                  ))}
                </select>
                {errors.permitType && <span className="error-text">{errors.permitType}</span>}
              </div>

              <div className="form-group">
                <label>Emergency Contact <span className="required">*</span></label>
                <input
                  type="text"
                  name="emergencyContact"
                  value={formData.emergencyContact}
                  onChange={handleChange}
                  placeholder="Eg: 9876543210"
                />
                {errors.emergencyContact && <span className="error-text">{errors.emergencyContact}</span>}
              </div>

            </div>
          </div>
        )}

        {/* ===== STEP 7: ADMIN ===== */}
        {step === 7 && (
          <div className="form-section">
            <h2>Internal Admin Controls</h2>
            <div className="form-grid">

              <div className="form-group">
                <label>Priority Level <span className="required">*</span></label>
                <select name="priorityLevel" value={formData.priorityLevel} onChange={handleChange}>
                  <option value="">Select Priority</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
                {errors.priorityLevel && <span className="error-text">{errors.priorityLevel}</span>}
              </div>

              <div className="form-group">
                <label>Vehicle Rating (Internal) <span className="required">*</span></label>
                <input
                  type="number"
                  name="internalRating"
                  min="1"
                  max="5"
                  placeholder="Rate from 1 to 5"
                  value={formData.internalRating}
                  onChange={handleChange}
                />
                {errors.internalRating && <span className="error-text">{errors.internalRating}</span>}
              </div>

              <div className="form-group">
                <label>Featured Vehicle <span className="required">*</span></label>
                <select name="featured" value={formData.featured} onChange={handleChange}>
                  <option value="">Select Option</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
                {errors.featured && <span className="error-text">{errors.featured}</span>}
              </div>

            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="step-buttons">
          <button type="button" className="prev-btn" onClick={goPrev}>Previous</button>

          {step < totalSteps && (
            <button type="button" className="next-btn" onClick={handleNext}>Next</button>
          )}

          {step === totalSteps && (
            <button type="submit" className="submit-btn" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit Vehicle"}
            </button>
          )}
        </div>

      </div>
    </form>
  );
};

export default EntryVehiclePart2;