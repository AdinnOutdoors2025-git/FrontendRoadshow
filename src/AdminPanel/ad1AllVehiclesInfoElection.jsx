import React, { useState, useEffect } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import { baseUrls } from "../Authentication/BASE_URL";
import "./RichText.css";
import "./ad1VehiclesInfo1.css";
import "react-quill/dist/quill.snow.css";
import { useAuth } from '../Authentication/LoginContext';

function AllVehiclesInfoElection() {
  const [vehicles, setVehicles] = useState([]);
  const [selectedModelId, setSelectedModelId] = useState("");
  const [modelName, setModelName] = useState("");
  const [location, setLocation] = useState("");
  const [status, setStatus] = useState("");
  const [availabilityList, setAvailabilityList] = useState([]);
  const [editId, setEditId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchFilter, setSearchFilter] = useState("all"); // New filter state
  const [vehicleAvailabilityCount, setVehicleAvailabilityCount] = useState('');
  const [vehicleUnavailabilityCount, setVehicleUnavailabilityCount] = useState('');
  const [vehicleRemainingCount, setVehicleRemainingCount] = useState('');

  const [newModelName, setNewModelName] = useState("");
  const [models, setModels] = useState([]);
  const [editingModelId, setEditingModelId] = useState(null);
  const [editingModelValue, setEditingModelValue] = useState("");

  // State variables for model management
  const [editModelName, setEditModelName] = useState("");
  const [isEditingModel, setIsEditingModel] = useState(false);

  // VEHICLE AVAILABILITY REMAINING COUNT with validation
  const calculateRemainingCount = (available, unavailable) => {
    const availableNum = parseInt(available) || 0;
    const unavailableNum = parseInt(unavailable) || 0;
    return availableNum - unavailableNum;
  };
     const { getAuthHeaders } = useAuth();

  const remainingVehicleCount = calculateRemainingCount(vehicleAvailabilityCount, vehicleUnavailabilityCount);

  // Validation function for counts
  const validateCounts = (available, unavailable) => {
    const availableNum = parseInt(available) || 0;
    const unavailableNum = parseInt(unavailable) || 0;

    if (unavailableNum > availableNum) {
      toast.error(`Invalid: Unavailable count (${unavailableNum}) cannot be greater than Available count (${availableNum})!`);
      return false;
    }

    if (availableNum < 0 || unavailableNum < 0) {
      toast.error("Counts cannot be negative!");
      return false;
    }

    return true;
  };

  // Fetch all vehicle models
const fetchModels = async () => {
    try {
      const response = await fetch(`${baseUrls}/getVehicleModelsElection`, {
        method: 'GET',
        headers: getAuthHeaders(),  
      });
      const data = await response.json();
      if (data.status === true) {
        setModels(data.data);
      }
    } catch (error) {
      console.error("Error fetching models:", error);
    }
  };

  // Fetch vehicles (entry vehicles)
useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await fetch(`${baseUrls}/getVehicles`, {
          method: 'GET',
          headers: getAuthHeaders(),  
        });
        const data = await response.json();
        if (data.status === true) {
          setVehicles(data.data);
        }
      } catch (error) {
        console.error("Error fetching vehicles:", error);
      }
    };
    fetchVehicles();
    fetchModels();
  }, []);

  // Fetch availability list
const fetchAvailability = async () => {
    try {
      const response = await fetch(`${baseUrls}/getVehiclesAvailabilityElection`, {
        method: 'GET',
        headers: getAuthHeaders(),   
      });
      const data = await response.json();
      if (data.success) {
        setAvailabilityList(data.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchAvailability();
  }, []);

  // Handle model selection and prefill data
  const handleModelSelect = (modelId) => {
    setSelectedModelId(modelId);

    const selectedModel = models.find((model) => model._id === modelId);
    if (selectedModel) {
      setModelName(selectedModel.modelName);
    }

    // Find existing availability record for this model
    const existingRecord = availabilityList.find(
      (item) => item.modelId?._id === modelId || item.modelId === modelId
    );

    if (existingRecord && !editId) {
      setEditId(existingRecord._id);
      setVehicleAvailabilityCount(existingRecord.availableCount || 0);
      setVehicleUnavailabilityCount(existingRecord.unavailableCount || 0);
      setLocation(existingRecord.location || "");
      setStatus(existingRecord.statusReason || "");
    } else if (!editId) {
      setEditId(null);
      setVehicleAvailabilityCount("");
      setVehicleUnavailabilityCount("");
      setLocation("");
      setStatus("");
    }
  };

  // Save new model
  const handleSaveModel = async () => {
    if (!newModelName.trim()) {
      toast.error("Model name is required");
      return;
    }

    try {
      const response = await fetch(`${baseUrls}/saveVehicleModelElection`, {
        method: "POST",
        headers: getAuthHeaders(), 
        body: JSON.stringify({
          modelName: newModelName.toUpperCase(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || "Failed to save model");
        return;
      }

      toast.success("Model saved successfully");
      setNewModelName("");
      fetchModels();
    } catch (error) {
      toast.error("Server error");
    }
  };

  // Handle edit model click
  const handleEditModel = (model) => {
    setEditingModelId(model._id);
    setEditModelName(model.modelName);
    setIsEditingModel(true);
  };

  // Handle cancel edit
  const handleCancelEditModel = () => {
    setEditingModelId(null);
    setEditModelName("");
    setIsEditingModel(false);
  };

  // Handle update model
  const handleUpdateModel = async () => {
    if (!editModelName.trim()) {
      toast.error("Model name is required");
      return;
    }

    try {
      const response = await fetch(`${baseUrls}/updateVehicleModelElection/${editingModelId}`, {
        method: "PUT",
        headers: getAuthHeaders(), 
        body: JSON.stringify({
          modelName: editModelName.toUpperCase(),
        }),
      });

      const data = await response.json();

      if (data.status === true) {
        toast.success("Model updated successfully");
        setEditingModelId(null);
        setEditModelName("");
        setIsEditingModel(false);

        // Update the model name in the local state
        if (selectedModelId === editingModelId) {
          setModelName(editModelName.toUpperCase());
        }

        // Refresh models and availability to get updated data
        await fetchModels();
        await fetchAvailability();

        // Also update the selected model in the dropdown if it was edited
        if (selectedModelId === editingModelId) {
          // Re-trigger the model selection to refresh the form
          handleModelSelect(editingModelId);
        }
      } else {
        toast.error(data.message || "Failed to update model");
      }
    } catch (error) {
      console.error("Error updating model:", error);
      toast.error("Server error");
    }
  };

  // Handle delete model
  const handleDeleteModel = async (modelId) => {
    if (!window.confirm("Are you sure you want to delete this model? This will also delete all associated availability records.")) {
      return;
    }

    try {
      const response = await fetch(`${baseUrls}/deleteVehicleModelElection/${modelId}`, {
        method: "DELETE",
         headers: getAuthHeaders(), 
      });

      const data = await response.json();

      if (data.status === true) {
        toast.success("Model deleted successfully");

        if (selectedModelId === modelId) {
          setSelectedModelId("");
          setModelName("");
          setEditId(null);
          setVehicleAvailabilityCount("");
          setVehicleUnavailabilityCount("");
          setLocation("");
          setStatus("");
        }

        await fetchModels();
        await fetchAvailability();
      } else {
        toast.error(data.message || "Failed to delete model");
      }
    } catch (error) {
      toast.error("Server error");
    }
  };

  // Clear form function
  const clearForm = () => {
    setEditId(null);
    setSelectedModelId("");
    setModelName("");
    setLocation("");
    setStatus("");
    setVehicleAvailabilityCount("");
    setVehicleUnavailabilityCount("");
  };

  // Handle input changes with validation
  const handleAvailabilityChange = (e) => {
    const value = e.target.value;
    setVehicleAvailabilityCount(value);

    // Validate if both fields have values
    if (vehicleUnavailabilityCount !== '' && value !== '') {
      validateCounts(value, vehicleUnavailabilityCount);
    }
  };

  const handleUnavailabilityChange = (e) => {
    const value = e.target.value;
    setVehicleUnavailabilityCount(value);

    // Validate if both fields have values
    if (vehicleAvailabilityCount !== '' && value !== '') {
      validateCounts(vehicleAvailabilityCount, value);
    }
  };

  // Update your handleSubmit with validation
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedModelId) {
      toast.error("Please select a vehicle model");
      return;
    }

    // Validate counts before submission
    if (!validateCounts(vehicleAvailabilityCount, vehicleUnavailabilityCount)) {
      return;
    }

    // Check if remaining count is negative
    if (remainingVehicleCount < 0) {
      toast.error(`Invalid: Remaining count cannot be negative (${remainingVehicleCount})!`);
      return;
    }

    try {
      const url = editId
        ? `${baseUrls}/updateVehiclesAvailabilityElection/${editId}`
        : `${baseUrls}/saveVehiclesAvailabilityElection`;

      const method = editId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
       headers: getAuthHeaders(), 
        body: JSON.stringify({
          modelId: selectedModelId,
          modelName: modelName,
          location: location || "Default Location",
          availableCount: parseInt(vehicleAvailabilityCount) || 0,
          unavailableCount: parseInt(vehicleUnavailabilityCount) || 0,
          remainingCount: remainingVehicleCount,
          statusReason: status,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(editId ? "Updated Successfully" : "Saved Successfully");
        clearForm(); // Clear the form
        await fetchAvailability(); // Refresh the list
        await fetchModels(); // Also refresh models to get updated names
      } else {
        toast.error(data.message || "Something went wrong");
      }
    } catch (error) {
      console.error("Error saving availability:", error);
      toast.error("Something went wrong");
    }
  };

  // Edit function 
  const handleEdit = (item) => {
    setEditId(item._id);
    setSelectedModelId(item.modelId?._id || item.modelId);
    setModelName(item.modelName);
    setLocation(item.location || "");
    setVehicleAvailabilityCount(item.availableCount || 0);
    setVehicleUnavailabilityCount(item.unavailableCount || 0);
    setStatus(item.statusReason || "");
  };

  // Delete function
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;

    try {
      const response = await fetch(
        `${baseUrls}/deleteVehiclesAvailabilityElection/${id}`,
        { method: "DELETE" , headers: getAuthHeaders(), }
      );

      const data = await response.json();

      if (data.success) {
        toast.success("Deleted Successfully");
        await fetchAvailability();
      } else {
        toast.error(data.message || "Delete failed");
      }
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  // Enhanced filter list based on search term and filter type
  const filteredList = availabilityList.filter((item) => {
    const term = searchTerm.toLowerCase();
    const remaining = (item.availableCount || 0) - (item.unavailableCount || 0);

    // Apply search filter
    let matchesSearch = true;
    if (term) {
      matchesSearch = (
        item.modelName?.toLowerCase().includes(term) ||
        item.location?.toLowerCase().includes(term) ||
        item.statusReason?.toLowerCase().includes(term) ||
        item.availableCount?.toString().includes(term) ||
        item.unavailableCount?.toString().includes(term) ||
        remaining.toString().includes(term)
      );
    }

    // Apply status filter
    let matchesStatus = true;
    switch (searchFilter) {
      case "available":
        matchesStatus = remaining > 0;
        break;
      case "unavailable":
        matchesStatus = remaining === 0;
        break;
      case "negative":
        matchesStatus = remaining < 0;
        break;
      default:
        matchesStatus = true;
    }

    return matchesSearch && matchesStatus;
  });

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="adManageMain">
          <div>
            <div className="manageClientSection">
              <div className="manageRightSideHeading">
                Vehicle Availability Management (Election)
              </div>
              <div className="d-flex manageClientInformation">
                <div className="manageClientInfoLeft">

                  {/* Integrated Model Management Section */}
                  <div className="clientDetailSection">
                    <div className="clientDetailHeading">Manage Models</div>

                    {/* List of existing models with inline edit/delete */}
                    <div className="vehicleManageModelScrollMain">
                      <div className="vehicleManageModelScroll">
                        <div
                        // style={{ marginBottom: "15px", maxHeight: "200px", overflowY: "auto", border: "1px solid #e0e0e0", borderRadius: "4px" }}
                        >
                          {models.map((model) => (
                            <div
                              key={model._id}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                padding: "8px 12px",
                                borderBottom: "1px solid #f0f0f0",
                                backgroundColor: selectedModelId === model._id ? "#f5f5f5" : "white"
                              }}
                            >
                              {editingModelId === model._id ? (
                                // Edit mode
                                <div style={{ display: "flex", gap: "8px", flex: 1 }}>
                                  <input
                                    type="text"
                                    value={editModelName}
                                    onChange={(e) => setEditModelName(e.target.value.toUpperCase())}
                                    className="clientDetailsInput"
                                    style={{ flex: 1 }}
                                    autoFocus
                                  />
                                  <button
                                    type="button" title="Save"
                                    className="editBtn"
                                    onClick={handleUpdateModel}
                                    style={{ padding: "5px 12px" }}
                                  >
                                    <i className="fas fa-save"></i>
                                  </button>
                                  <button
                                    type="button" title="Cancel"
                                    className="deleteBtn"
                                    onClick={handleCancelEditModel}
                                    style={{ padding: "5px 12px" }}
                                  >
                                    <i className="fas fa-times"></i>
                                  </button>
                                </div>
                              ) : (
                                // View mode
                                <>
                                  <div
                                    style={{ flex: 1, cursor: "pointer" }}
                                    onClick={() => handleModelSelect(model._id)}
                                  >
                                    <span style={{ fontWeight: selectedModelId === model._id ? "bold" : "normal" }}>
                                      {model.modelName}
                                    </span>
                                  </div>
                                  <div style={{ display: "flex", gap: "8px" }}>
                                    <button
                                      type="button" title="Edit"
                                      className="editBtn"
                                      onClick={() => {
                                        setEditingModelId(model._id);
                                        setEditModelName(model.modelName);
                                        setIsEditingModel(true);
                                      }}
                                      style={{ padding: "4px 10px", fontSize: "12px" }}
                                    >
                                      <i className="fas fa-edit"></i>
                                    </button>
                                    <button
                                      type="button" title="Delete"
                                      className="deleteBtn"
                                      onClick={() => handleDeleteModel(model._id)}
                                      style={{ padding: "4px 10px", fontSize: "12px" }}
                                    >
                                      <i className="fas fa-trash-alt"></i>
                                    </button>
                                  </div>
                                </>
                              )}
                            </div>
                          ))}
                          {models.length === 0 && (
                            <div style={{ padding: "20px", textAlign: "center", color: "#999" }}>
                              No models added yet
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    {/* Add New Model */}
                    <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                      <input
                        type="text"
                        placeholder="Add new model (e.g., Led Model 6.3 × 3.15)"
                        className="clientDetailsInput"
                        value={newModelName}
                        onChange={(e) => setNewModelName(e.target.value.toUpperCase())}
                        style={{ flex: 1 }}
                      />
                      <button
                        type="button"
                        className="editBtn"
                        onClick={handleSaveModel}
                      >
                        <i className="fas fa-plus"></i> Add Model
                      </button>
                    </div>
                  </div>

                  {/* Model Selection Dropdown */}
                  <div className="clientDetailSection">
                    <div className="clientDetailHeading">Select Vehicle Model</div>
                    <select
                      className="clientDetailsInput"
                      value={selectedModelId}
                      onChange={(e) => handleModelSelect(e.target.value)}
                    >
                      <option value="">Select Model</option>
                      {models.map((model) => (
                        <option key={model._id} value={model._id}>
                          {model.modelName}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Availability Count */}
                  <div className="clientDetailSection">
                    <div className="clientDetailHeading">Available Count</div>
                    <input
                      type="number"
                      placeholder="Enter Available Count"
                      value={vehicleAvailabilityCount}
                      className="clientDetailsInput"
                      onChange={handleAvailabilityChange}
                      min="0"
                    />
                  </div>

                  {/* Unavailability Count */}
                  <div className="clientDetailSection">
                    <div className="clientDetailHeading">Unavailable Count</div>
                    <input
                      type="number"
                      placeholder="Enter Unavailable Count"
                      value={vehicleUnavailabilityCount}
                      className="clientDetailsInput"
                      onChange={handleUnavailabilityChange}
                      min="0"
                    />
                  </div>

                  {/* Remaining Count with warning */}
                  <div className="clientDetailSection">
                    <div className="clientDetailHeading">Remaining Count</div>
                    <input
                      type="number"
                      readOnly
                      placeholder="Enter Remaining Count"
                      value={remainingVehicleCount}
                      className="clientDetailsInput"
                      style={{
                        backgroundColor: remainingVehicleCount < 0 ? "#ffebee" : "#f5f5f5",
                        color: remainingVehicleCount < 0 ? "#c62828" : "#000"
                      }}
                    />
                    {remainingVehicleCount < 0 && (
                      <div style={{ color: "#c62828", fontSize: "12px", marginTop: "5px" }}>
                        ⚠️ Warning: Remaining count cannot be negative!
                      </div>
                    )}
                  </div>

                  {/* Location (Optional) */}
                  <div className="clientDetailSection">
                    <div className="clientDetailHeading">Location (Optional)</div>
                    <input
                      type="text"
                      placeholder="Enter Location"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="clientDetailsInput"
                    />
                  </div>

                  {/* Status Reason (Optional) */}
                  <div className="clientDetailSection">
                    <div className="clientDetailHeading">Status Reason (Optional)</div>
                    <input
                      type="text"
                      placeholder="Enter status reason if any"
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      className="clientDetailsInput"
                    />
                  </div>
                </div>

                {/* Vehicle List Section */}
                <div className="manageClientInfoRight vehicleListBox">
                  <div className="vehicleListHeading">Vehicle Availability List</div>

                  {/* Enhanced Search and Filter Section */}
                  <div style={{ marginBottom: "15px" }}>
                    <input
                      type="text"
                      placeholder="Search by Model, Location, Count, Status..."
                      className="vehicleSearchInput"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      style={{ marginBottom: "10px" }}
                    />


                  </div>

                  <div className="vehicleScroll">
                    {filteredList.map((item) => {
                      const remaining = (item.availableCount || 0) - (item.unavailableCount || 0);
                      const isNegative = remaining < 0;

                      return (
                        <div
                          key={item._id}
                          className="vehicleCard"
                        // style={{
                        //   borderLeft: isNegative ? "4px solid #dc3545" : "none",
                        //   backgroundColor: isNegative ? "#e73434" : "white"
                        // }}
                        >
                          <div className="vehicleNumber">Model: {item.modelName}</div>
                          <div className="vehicleLocation">
                            Available: {item.availableCount} | Unavailable: {item.unavailableCount}
                          </div>
                          <div style={{ color: isNegative ? "#dc3545" : "#333", fontWeight: isNegative ? "bold" : "normal" }}>
                            Remaining: {remaining}
                            {isNegative && " ⚠️ Invalid Data!"}
                          </div>
                          {item.location && (
                            <div>Location: {item.location}</div>
                          )}
                          {item.statusReason && (
                            <div className="statusReason">Reason: {item.statusReason}</div>
                          )}
                          <div className="vehicleActions">
                            <button
                              type="button"
                              className="editBtn"
                              onClick={() => handleEdit(item)}
                            >
                              <i className="fas fa-edit"></i> Edit
                            </button>
                            <button
                              type="button"
                              className="deleteBtn"
                              onClick={() => handleDelete(item._id)}
                            >
                              <i className="fas fa-trash-alt"></i> Delete
                            </button>
                          </div>
                        </div>
                      );
                    })}
                    {filteredList.length === 0 && (
                      <div style={{ textAlign: "center", padding: "20px" }}>
                        No records found matching your criteria
                      </div>
                    )}
                  </div>

                  {/* Summary Statistics */}
                  {/* <div style={{ marginTop: "15px", padding: "10px", backgroundColor: "#f8f9fa", borderRadius: "4px" }}>
                    <strong>Summary:</strong> Total: {filteredList.length} vehicles | 
                    Negative Records: {filteredList.filter(item => (item.availableCount - item.unavailableCount) < 0).length}
                  </div> */}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
          <button className="vehicleAvailabilityElectionSaveBtn" type="submit">
            <i className="fas fa-save"></i> {editId ? "UPDATE" : "SAVE"}
          </button>
          {editId && (
            <button
              type="button"
              className="vehicleAvailabilityElectionSaveBtn"
              onClick={clearForm}
              style={{ padding: "10px 20px" }}
            >
              <i className="fas fa-times"></i> CANCEL EDIT
            </button>
          )}
        </div>
      </form>
      <ToastContainer />
    </div>
  );
}

export default AllVehiclesInfoElection;