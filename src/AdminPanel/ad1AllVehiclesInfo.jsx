import React, { useState, useContext, useEffect, useCallback } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import { baseUrl } from "../Authentication/BASE_URL";
import "./RichText.css";

import "react-quill/dist/quill.snow.css";

function AllVehiclesInfo() {
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicleId, setSelectedVehicleId] = useState("");
  const [model, setModel] = useState("");
  const [location, setLocation] = useState("");
  const [status, setStatus] = useState("");
  const [availabilityList, setAvailabilityList] = useState([]);
  const [editId, setEditId] = useState(null);
  const [availabilityType, setAvailabilityType] = useState("");

  // Fetch Vehicles using fetch()
  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await fetch(`${baseUrl}/getVehicles`);

        const data = await response.json();

        if (data.status === true) {
          setVehicles(data.data);
        } else {
          console.error("API returned success false");
        }
      } catch (error) {
        console.error("Error fetching vehicles:", error);
      }
    };

    fetchVehicles();
  }, []);
  // Handle Select Change
  const handleVehicleChange = (e) => {
    const vehicleId = e.target.value;
    setSelectedVehicleId(vehicleId);

    const selectedVehicle = vehicles.find(
      (vehicle) => vehicle._id === vehicleId,
    );

    if (selectedVehicle) {
      setModel(selectedVehicle.model);
    } else {
      setModel("");
    }
  };

  const fetchAvailability = async () => {
    try {
      const response = await fetch(`${baseUrl}/getVehiclesAvailability`);
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

  // ✅ SAVE FUNCTION
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const url = editId
        ? `${baseUrl}/updateVehiclesAvailability/${editId}`
        : `${baseUrl}/saveVehiclesAvailability`;

      const method = editId ? "PUT" : "POST";

      const selectedVehicle = vehicles.find(
        (vehicle) => vehicle._id === selectedVehicleId,
      );

    const response = await fetch(url, {
  method,
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    vehicleId: selectedVehicleId,
    vehicleNumber: selectedVehicle?.vehicleNumber,
    model,
    location,
    isAvailable: availabilityType === "available",
    statusReason:
      availabilityType === "unavailable" ? status : "",
  }),
});


      const data = await response.json();

      if (data.success) {
        toast.success(editId ? "Updated Successfully" : "Saved Successfully");
        setSelectedVehicleId("");
        setModel("");
        setLocation("");
        setStatus("");
        setEditId(null);
        fetchAvailability();
        setAvailabilityType("");
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  // edit function
const handleEdit = (item) => {
  setEditId(item._id);

  const vehicleId =
    typeof item.vehicleId === "object"
      ? item.vehicleId._id
      : item.vehicleId;

  setSelectedVehicleId(vehicleId);
  setModel(item.model);
  setLocation(item.location);

  if (item.isAvailable) {
    setAvailabilityType("available");
    setStatus("");
  } else {
    setAvailabilityType("unavailable");
    setStatus(item.statusReason || "");
  }
};


  // delete function
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;

    try {
      const response = await fetch(
        `${baseUrl}/deleteVehiclesAvailability/${id}`,
        { method: "DELETE" },
      );

      const data = await response.json();

      if (data.success) {
        toast.success("Deleted Successfully");
        fetchAvailability();
      }
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="adManageMain">
          {/* Right section */}
          <div>
            <div className="manageClientSection">
              <div className="manageRightSideHeading">
                Vehicle Availability Management
              </div>
              <div className="d-flex manageClientInformation">
                <div className="manageClientInfoLeft">
                  <div className="clientDetailSection">
                    <div className="clientDetailHeading">Vehicle Number</div>
                    <select
                      className="clientDetailsInput"
                      value={selectedVehicleId}
                      onChange={handleVehicleChange}
                    >
                      <option value="">Select Vehicle</option>
                      {vehicles.map((vehicle) => (
                        <option key={vehicle._id} value={vehicle._id}>
                          {vehicle.vehicleNumber}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="clientDetailSection">
                    <div className="clientDetailHeading">Model</div>
                    <input
                      type="text"
                      className="clientDetailsInput"
                      value={model}
                      readOnly
                    />
                  </div>

                  <div className="clientDetailSection">
                    <div className="clientDetailHeading">Location</div>
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="Enter Location"
                      className="clientDetailsInput"
                    />
                  </div>

                  <div className="clientDetailSection">
                    <div className="clientDetailHeading">Availability</div>

                    <div className="availabilityOptions">
                      <label>
                        <input
                          type="radio"
                          name="availability"
                          value="available"
                          checked={availabilityType === "available"}
                          onChange={() => {
                            setAvailabilityType("available");
                            setStatus(""); // clear status text
                          }}
                        />
                        Available
                      </label>

                      <label style={{ marginLeft: "20px" }}>
                        <input
                          type="radio"
                          name="availability"
                          value="unavailable"
                          checked={availabilityType === "unavailable"}
                          onChange={() => {
                            setAvailabilityType("unavailable");
                          }}
                        />
                        Unavailable
                      </label>
                    </div>
                  </div>
                  {availabilityType === "unavailable" && (
                    <div className="clientDetailSection">
                      <div className="clientDetailHeading">Reason / Status</div>
                      <input
                        type="text"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        placeholder="Enter reason (e.g., Maintenance)"
                        className="clientDetailsInput"
                      />
                    </div>
                  )}
                </div>
                {/* Vehicle List Section */}
                <div className="manageClientInfoRight vehicleListBox">
                  <div className="vehicleListHeading">Vehicle List</div>

                  <div className="vehicleScroll">
                    {availabilityList.map((item) => (
                      <div key={item._id} className="vehicleCard">
                        <div className="vehicleNumber">
                          {item.vehicleNumber}
                        </div>
                        <div className="vehicleModel">Model: {item.model}</div>
                        <div className="vehicleLocation">
                          Location: {item.location}
                        </div>
                        <div className="vehicleStatus">
                          Status: {item.status}
                        </div>

                        <div className="vehicleActions">
                          <button
                            type="button"
                            className="editBtn"
                            onClick={() => handleEdit(item)}
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            className="deleteBtn"
                            onClick={() => handleDelete(item._id)}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Vehicle List Section */}
              </div>
            </div>
          </div>
        </div>

        <button className="calendarSaveBtn" type="submit" disabled="">
          SAVE
        </button>
      </form>
    </div>
  );
}

export default AllVehiclesInfo;
