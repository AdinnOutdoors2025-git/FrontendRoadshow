

import { useEffect, useRef, useState } from "react";
import AddModelModal from "../reusablemodel/vehiclemodeltype";
import { baseUrls } from "../Authentication/BASE_URL";
import { useAuth } from '../Authentication/LoginContext';

function VehicleModelSelect({ value, onChange}) {
  const [modelTypes, setModelTypes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const wrapperRef = useRef(null);
  const { getAuthHeaders } = useAuth();

  const fetchModels = async () => {
    setIsLoading(true);
    try {
       const response = await fetch(`${baseUrls}/getVehicleModels`, {
        headers: getAuthHeaders(), 
      });
      const data = await response.json();
      if (data.status) setModelTypes(data.data);
    } catch (err) {
      console.error("Failed to fetch vehicle models:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchModels();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (model) => {
    onChange({ target: { name: "model", value: model.modelName } });
    setIsOpen(false);
  };

//   const handleModelSaved = async (savedName) => {
//     await fetchModels();
//     // Auto-select the newly added model
//     setModelTypes((prev) => {
//       const found = prev.find(
//         (m) => m.modelName.toLowerCase() === savedName.toLowerCase()
//       );
//       if (found) {
//         onChange({ target: { name: "model", value: found._id } });
//       }
//       return prev;
//     });
//   };

const handleModelSaved = async (savedData) => {
  await fetchModels();
  
  // savedData could be an object or a string, handle both
  const savedName = typeof savedData === "string" ? savedData : savedData?.modelName;
  
  if (!savedName) return;

  setModelTypes((prev) => {
    const found = prev.find(
      (m) => m.modelName.toLowerCase() === savedName.toLowerCase()
    );
    if (found) {
      onChange({ target: { name: "model", value: found.modelName} });
    }
    return prev;
  });
};

  const selectedModel = modelTypes.find((m) => m.modelName === value);

  return (
    <>
   

      <div className="form-group">
        <label>Vehicle Model Type</label>
        <div className="custom-select-wrapper" ref={wrapperRef}>
          {/* Trigger */}
          <button
            type="button"
            className={`custom-select-trigger ${isOpen ? "open" : ""}`}
            onClick={() => setIsOpen((prev) => !prev)}
          >
            <span className={selectedModel ? "" : "placeholders"}>
              {selectedModel ? selectedModel.modelName : "Select Model Type"}
            </span>
            <span className="chevron">▼</span>
          </button>

          {/* Dropdown */}
          {isOpen && (
            <div className="custom-dropdown">
              <div className="dropdown-options">
                {isLoading ? (
                  <div className="dropdown-option loading-opt">
                    Loading models...
                  </div>
                ) : modelTypes.length === 0 ? (
                  <div className="dropdown-option loading-opt">
                    No models found
                  </div>
                ) : (
                  modelTypes.map((model) => (
                    <div
                      key={model._id}
                      className={`dropdown-option ${
                        value === model.modelName ? "selected" : ""
                      }`}
                      onClick={() => handleSelect(model)}
                    >
                      {model.modelName}
                    </div>
                  ))
                )}
              </div>

              {/* Divider + Add New — always at bottom inside dropdown */}
              <div className="dropdown-divider" />
              <button
                type="button"
                className="dropdown-add-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsOpen(false);
                  setIsModalOpen(true);
                }}
              >
                <span className="plus-icon">+</span>
                Add New Model
              </button>
            </div>
          )}
        </div>
      </div>

      <AddModelModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSaved={handleModelSaved}
       
      />
    </>
  );
}
export default VehicleModelSelect;