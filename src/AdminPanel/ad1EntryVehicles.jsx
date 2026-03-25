import React, {
  useState,
  useContext,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import { baseUrl } from "../Authentication/BASE_URL";
import "./RichText.css";

import "react-quill/dist/quill.snow.css";

function EntryVehicles() {
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [model, setModel] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [vehicles, setVehicles] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [images, setImages] = useState([]);
  const fileInputRef = useRef(null);
  const [newModelName, setNewModelName] = useState("");
  const [modelList, setModelList] = useState([]);
  const [speaker, setSpeaker] = useState("");
  const [speakerNos, setSpeakerNos] = useState("");
  const [generator, setGenerator] = useState("");
  const [generatorNos, setGeneratorNos] = useState("");

  const fetchModels = async () => {
    try {
      const response = await fetch(`${baseUrl}/getVehicleModels`);
      const data = await response.json();

      if (data.status === true) {
        setModelList(data.data);
      }
    } catch (error) {
      console.error("Error fetching models:", error);
    }
  };

  const validate = () => {
    let newErrors = {};

    if (!vehicleNumber.trim()) {
      newErrors.vehicleNumber = "Vehicle number is required";
    }
    // Optional: Indian vehicle format validation
    else if (!/^[A-Z]{2}[0-9]{1,2}[A-Z]{1,2}[0-9]{4}$/i.test(vehicleNumber)) {
      newErrors.vehicleNumber = "Invalid vehicle number format";
    }

    if (!model.trim()) {
      newErrors.model = "Model is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // =========================
  // SUBMIT FUNCTION
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("vehicleNumber", vehicleNumber);
      formData.append("model", model);
      formData.append("speaker", speaker);
      formData.append("speakerNos", speakerNos);
      formData.append("generator", generator);
      formData.append("generatorNos", generatorNos);

      images.forEach((img) => {
        formData.append("images", img);
      });

      let response;

      if (editingId) {
        response = await fetch(`${baseUrl}/updateVehicle/${editingId}`, {
          method: "PUT",
          body: formData,
        });
      } else {
        response = await fetch(`${baseUrl}/entryVehicles`, {
          method: "POST",
          body: formData,
        });
      }

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || "Operation failed");
        return;
      }

      await fetchVehicles();

      toast.success(
        editingId
          ? "Vehicle updated successfully!"
          : "Vehicle added successfully!",
      );

      setEditingId(null);
      setVehicleNumber("");
      setModel("");
      setSpeaker("");
      setSpeakerNos("");
      setGenerator("");
      setGeneratorNos("");
      setImages([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = ""; // <- this clears the selected files
      }
    } catch (error) {
      toast.error("Server error");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // Handle Edit
  // =========================
  const handleEdit = (vehicle) => {
    setVehicleNumber(vehicle.vehicleNumber);
    setModel(vehicle.model);
    setSpeaker(vehicle.speaker || "");
    setSpeakerNos(vehicle.speakerNos || "");
    setGenerator(vehicle.generator || "");
    setGeneratorNos(vehicle.generatorNos || "");
    setEditingId(vehicle._id);
  };

  // =========================
  // Handle Delete
  // =========================

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete?")) return;

    try {
      const response = await fetch(`${baseUrl}/deleteVehicle/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (data.status === true) {
        setVehicles(vehicles.filter((v) => v._id !== id));
        toast.success("Vehicle deleted successfully!");
      }
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  // =========================
  // FETCH VEHICLES
  // =========================
  const fetchVehicles = useCallback(async () => {
    try {
      const response = await fetch(`${baseUrl}/getVehicles`);
      const data = await response.json();

      if (data.status === true) {
        setVehicles(data.data);
      }
    } catch (error) {
      console.error("Error fetching vehicles:", error);
    }
  }, []);

  useEffect(() => {
    fetchVehicles();
    fetchModels();
  }, []);

  const handleSaveModel = async () => {
    if (!newModelName.trim()) {
      toast.error("Model name is required");
      return;
    }

    try {
      const response = await fetch(`${baseUrl}/saveVehicleModel`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
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
      fetchModels(); // refresh dropdown
    } catch (error) {
      toast.error("Server error");
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="adManageMain">
          {/* Right section */}
          <div>
            <div className="manageClientSection entryvechile">
              <div className="manageRightSideHeading">Vehicle Management</div>
              <div className="d-flex manageClientInformation">
                <div className="manageClientInfoLeft">
                  <div className="clientDetailSection">
                    <div className="clientDetailHeading">Vehicle Number</div>
                    <input
                      type="text"
                      placeholder="Enter Vehicle Number"
                      value={vehicleNumber}
                      className={`clientDetailsInput `}
                      onChange={(e) =>
                        setVehicleNumber(e.target.value.toUpperCase())
                      }
                    />
                    {errors.vehicleNumber && (
                      <div className="AdminProderror-message">
                        {errors.vehicleNumber}
                      </div>
                    )}
                  </div>

                  <div className="clientDetailSection">
                    <div className="clientDetailHeading">Add Model</div>
                    <div style={{ display: "flex", gap: "10px" }}>
                      <input
                        type="text"
                        placeholder="Enter Model Name"
                        className="clientDetailsInput"
                        value={newModelName}
                        onChange={(e) =>
                          setNewModelName(e.target.value.toUpperCase())
                        }
                      />
                      <button
                        type="button"
                        className="editBtn"
                        onClick={handleSaveModel}
                      >
                        Save
                      </button>
                    </div>
                  </div>

                  <div className="clientDetailSection">
                    <div className="clientDetailHeading">Select Model</div>
                    <select
                      className="clientDetailsInput"
                      value={model}
                      onChange={(e) => {
                        const selectedModel = e.target.value;
                        setModel(selectedModel);

                        // 🔥 Find vehicle with same model
                        const existingVehicle = vehicles.find(
                          (v) =>
                            v.model.toLowerCase().trim() ===
                            selectedModel.toLowerCase().trim(),
                        );

                        if (existingVehicle) {
                          setSpeaker(existingVehicle.speaker || "");
                          setSpeakerNos(existingVehicle.speakerNos || "");
                          setGenerator(existingVehicle.generator || "");
                          setGeneratorNos(existingVehicle.generatorNos || "");
                        } else {
                          // Clear if no vehicle found
                          setSpeaker("");
                          setSpeakerNos("");
                          setGenerator("");
                          setGeneratorNos("");
                        }
                      }}
                    >
                      <option value="">Select Model</option>
                      {modelList.map((m) => (
                        <option key={m._id} value={m.modelName}>
                          {m.modelName}
                        </option>
                      ))}
                    </select>

                    {errors.model && (
                      <div className="AdminProderror-message">
                        {errors.model}
                      </div>
                    )}
                  </div>

                  <div className="clientDetailSection">
                    <div className="clientDetailHeading">
                      Speaker (Optional)
                    </div>
                    <input
                      type="text"
                      placeholder="Enter Speaker Details"
                      className="clientDetailsInput"
                      value={speaker}
                      onChange={(e) => setSpeaker(e.target.value)}
                    />
                  </div>

                  <div className="clientDetailSection">
                    <div className="clientDetailHeading">
                      Speaker NOS (Optional)
                    </div>
                    <input
                      type="number"
                      placeholder="Enter Speaker Quantity"
                      className="clientDetailsInput"
                      value={speakerNos}
                      onChange={(e) => setSpeakerNos(e.target.value)}
                    />
                  </div>

                  <div className="clientDetailSection">
                    <div className="clientDetailHeading">
                      Generator (Optional)
                    </div>
                    <input
                      type="text"
                      placeholder="Enter Generator Details"
                      className="clientDetailsInput"
                      value={generator}
                      onChange={(e) => setGenerator(e.target.value)}
                    />
                  </div>

                  <div className="clientDetailSection">
                    <div className="clientDetailHeading">
                      Generator NOS (Optional)
                    </div>
                    <input
                      type="number"
                      placeholder="Enter Generator Quantity"
                      className="clientDetailsInput"
                      value={generatorNos}
                      onChange={(e) => setGeneratorNos(e.target.value)}
                    />
                  </div>

                  <div className="clientDetailSection">
                    <div className="clientDetailHeading">
                      Upload Images (Max 4)
                    </div>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      ref={fileInputRef}
                      onChange={(e) => {
                        const files = Array.from(e.target.files);

                        if (files.length > 4) {
                          toast.error("Maximum 4 images allowed");
                          return;
                        }

                        setImages(files);
                      }}
                    />
                  </div>
                </div>
                {/* Vehicle List Section */}
                <div className="manageClientInfoRight vehicleListSection">
                  <div className="vehicleListHeading">Vehicle List</div>

                  <div className="vehicleScrollContainer">
                    {vehicles.length === 0 ? (
                      <div>No vehicles found</div>
                    ) : (
                      vehicles.map((vehicle) => (
                        <div key={vehicle._id} className="vehicleCard">
                          <div className="vehicleContent">
                            <div className="vehicleNumber">
                              {vehicle.vehicleNumber}
                            </div>

                            <div className="vehicleModel">
                              Model: {vehicle.model}
                            </div>

                            <div className="vehicleActions">
                              <button
                                type="button"
                                className="editBtn"
                                onClick={() => handleEdit(vehicle)}
                              >
                                Edit
                              </button>

                              <button
                                type="button"
                                className="deleteBtn"
                                onClick={() => handleDelete(vehicle._id)}
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Vehicle List Section */}
              </div>
            </div>
          </div>
        </div>

        <button className="calendarSaveBtn" type="submit" disabled={loading}>
          {loading ? "Saving..." : "Save"}
        </button>
      </form>
    </div>
  );
}

export default EntryVehicles;
