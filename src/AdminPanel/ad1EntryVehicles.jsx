import React, { useState, useContext, useEffect, useCallback } from "react";
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
      let response;

      if (editingId) {
        response = await fetch(`${baseUrl}/updateVehicle/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ vehicleNumber, model }),
        });
      } else {
        response = await fetch(`${baseUrl}/entryVehicles`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ vehicleNumber, model }),
        });
      }

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || "Operation failed");
        return;
      }

      await fetchVehicles(); // 🔥 reload list from DB

      toast.success(
        editingId
          ? "Vehicle updated successfully!"
          : "Vehicle added successfully!",
      );

      setEditingId(null);
      setVehicleNumber("");
      setModel("");
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
  }, []);

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="adManageMain">
          {/* Right section */}
          <div>
            <div className="manageClientSection">
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
                    <div className="clientDetailHeading">Model</div>
                    <input
                      type="text"
                      placeholder="Enter Model"
                      className={`clientDetailsInput `}
                      value={model}
                      onChange={(e) => setModel(e.target.value.toUpperCase())}
                    />
                    {errors.model && (
                      <div className="AdminProderror-message">
                        {errors.model}
                      </div>
                    )}
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
