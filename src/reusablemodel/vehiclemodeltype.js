import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { baseUrls } from "../Authentication/BASE_URL";
import { useAuth } from '../Authentication/LoginContext';

function AddModelModal({ isOpen, onClose, onSaved }) {
  const [modelName, setModelName] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
   const { getAuthHeaders } = useAuth();
  

  // ✅ Prevent background scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleSave = async () => {
    if (!modelName.trim()) {
      setError("Model name is required");
      return;
    }
    setIsSaving(true);
    setError("");
    try {
      const response = await fetch(`${baseUrls}/saveVehicleModel`, {
        method: "POST",
         headers: getAuthHeaders(), 
        body: JSON.stringify({ modelName: modelName.trim() }),
      });
      const data = await response.json();
      if (data.status || data.success) {
        onSaved(data.data || { modelName: modelName.trim() });
        setModelName("");
        onClose();
      } else {
        setError(data.message || "Failed to save model");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleClose = () => {
    setModelName("");
    setError("");
    onClose();
  };

  if (!isOpen) return null;

  // ✅ createPortal renders modal directly in document.body
  // This prevents ANY layout shift or shake in the parent form
  return createPortal(
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <h3 className="modal-title">Add New Vehicle Model</h3>
        <p className="modal-subtitle">
          Enter the new vehicle model name to add it to the list.
        </p>
        <div className="form-group">
          <label>Vehicle Model Name</label>
          <input
            type="text"
            value={modelName}
            onChange={(e) => {
              setModelName(e.target.value);
              setError("");
            }}
            onKeyDown={(e) => e.key === "Enter" && handleSave()}
            placeholder="e.g. 4-SIDE PREMIUM"
            autoFocus
          />
          {error && <span className="error-text">{error}</span>}
        </div>
        <div className="modal-actions">
          <button type="button" className="btn btn-cancel" onClick={handleClose}>
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : "Save Model"}
          </button>
        </div>
      </div>
    </div>,
    document.body 
  );
}

export default AddModelModal;