import React, { useState, useEffect, useCallback } from "react";
import { baseUrl } from "../Authentication/BASE_URL";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import axios from "axios";
import "./css/orderManagement.css";

const stages = [
  { id: "newOrder", label: "New Order" },
  { id: "proposal", label: "Proposal" },
  { id: "negotiation", label: "Negotiation" },
  { id: "closedWon", label: "Closed Won" },
  { id: "closedLoss", label: "Closed Loss" },
];

const stageLabels = {
  newOrder: "New Order",
  proposal: "Proposal",
  negotiation: "Negotiation",
  closedWon: "Closed Won",
  closedLoss: "Closed Loss",
};

function Ad1OrdersManagement() {
  const [orders, setOrders] = useState([]);

  // ✅ NEWLY ADDED – store selected order for popup
  const [selectedOrder, setSelectedOrder] = useState(null);
  useEffect(() => {
    fetchOrders(); // runs once
  }, []);

  useEffect(() => {
    if (selectedOrder) {
      const latest = orders.find((o) => o._id === selectedOrder._id);
      if (latest) {
        setSelectedOrder(latest);
      }
    }
  }, [orders]);
  const fetchOrders = useCallback(async () => {
    try {
      const res = await axios.get(`${baseUrl}/getOrders`);

      if (res.data && res.data.orders) {
        setOrders(res.data.orders);
      }
    } catch (error) {
      console.log("Fetch orders error:", error);
    }
  }, []);

  const onDragEnd = async (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const orderId = draggableId;
    const newStage = destination.droppableId;

    const updatedOrders = orders.map((order) =>
      order._id === orderId ? { ...order, pipelineStatus: newStage } : order,
    );

    setOrders(updatedOrders);

    // update popup automatically
    if (selectedOrder) {
      const updatedSelected = updatedOrders.find(
        (o) => o._id === selectedOrder._id,
      );

      if (updatedSelected) {
        setSelectedOrder({
          ...updatedSelected,
          pipelineLogs: [
            ...(updatedSelected.pipelineLogs || []),
            {
              fromStage: selectedOrder.pipelineStatus,
              toStage: newStage,
              movedBy: "Admin",
              movedAt: new Date(),
            },
          ],
        });
      }
    }

    try {
      await axios.put(`${baseUrl}/updateOrderPipeline/${orderId}`, {
        pipelineStatus: newStage,
        movedBy: "Admin",
      });

      // ✅ Re-sync with database
      await fetchOrders();
    } catch (error) {
      console.log(error);

      // rollback if API fails
      await fetchOrders();
    }
  };

  const getOrdersByStage = (stageId) => {
    return orders.filter((o) => o.pipelineStatus === stageId);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "newOrder":
        return "badge-new";

      case "proposal":
        return "badge-proposal";

      case "negotiation":
        return "badge-negotiation";

      case "closedWon":
        return "badge-won";

      case "closedLoss":
        return "badge-loss";

      default:
        return "badge-default";
    }
  };

  return (
    <>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="pipeline-container">
          {stages.map((stage) => (
            <Droppable droppableId={stage.id} key={stage.id} type="ORDER">
              {(provided) => (
                <div
                  className="pipeline-column"
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  <h3>{stage.label}</h3>

                  {getOrdersByStage(stage.id).map((order, index) => (
                    <Draggable
                      draggableId={order._id.toString()}
                      index={index}
                      key={order._id}
                    >
                      {(provided) => (
                        <div
                          className="order-card"
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          // ✅ NEWLY ADDED – open popup when clicking card
                          onClick={() => setSelectedOrder(order)}
                        >
                          <h4 className="company-name">{order.companyName}</h4>
                          <p className="contact-name">{order.name}</p>
                          <div className="order-price">
                            ₹ {order.grandTotal}
                          </div>
                          <div className="order-meta">
                            <span>🚗 {order.bookingItems.length} Vehicles</span>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}

                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>

      {/* ===================== */}
      {/* ✅ NEWLY ADDED CRM ORDER POPUP */}
      {/* ===================== */}

      {selectedOrder && (
        <div className="order-popup-overlay">
          <div className="order-popup">
            <div className="popup-header">
              <h2>Order Details</h2>

              {/* close button */}
              <button
                className="close-btn"
                onClick={() => setSelectedOrder(null)}
              >
                ✕
              </button>
            </div>

            {/* Order Info */}
            <div className="popup-section">
              <p>
                <b>Order ID:</b> {selectedOrder.orderId}
              </p>
              <p>
                <b>Company Name:</b> {selectedOrder.companyName}
              </p>
              <p>
                <b>Contact Person:</b> {selectedOrder.name}
              </p>
              <p>
                <b>Phone:</b> {selectedOrder.phone}
              </p>
              <p>
                <b>Email:</b> {selectedOrder.email}
              </p>
              <p>
                <b>Designation:</b> {selectedOrder.designation}
              </p>
              <p>
                <b>Pipeline Status:</b>
                <span
                  className={`status-badge ${getStatusColor(selectedOrder.pipelineStatus)}`}
                >
                  {stageLabels[selectedOrder.pipelineStatus]}
                </span>
              </p>
            </div>

            {/* Order Timeline */}
            {/* ORDER TIMELINE */}

            <div className="popup-section">
              {/* Show order pipeline history */}
              <div className="popup-section">
                <h3>Pipeline History</h3>

                <div className="history-container">
                  {selectedOrder.pipelineLogs &&
                    selectedOrder.pipelineLogs
                      .slice()
                      .reverse()
                      .map((log, index) => (
                        <div className="history-item" key={index}>
                          <div
                            className={`history-dot ${getStatusColor(log.toStage)}`}
                          ></div>

                          <div className="history-content">
                            <p>
                              <b>
                                {log.fromStage
                                  ? stageLabels[log.fromStage]
                                  : "Start"}
                              </b>{" "}
                              →<b>{stageLabels[log.toStage]}</b>
                            </p>

                            <span>
                              {log.movedBy} •{" "}
                              {new Date(log.movedAt).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      ))}
                </div>
              </div>
              {/* Show order pipeline history */}
            </div>

            {/* Vehicle Table */}
            <div className="popup-section">
              <h3>Vehicle Booking</h3>

              <table className="vehicle-table">
                <thead>
                  <tr>
                    <th>Vehicle Model</th>
                    <th>City</th>
                    <th>Quantity</th>
                    <th>From</th>
                    <th>To</th>
                    <th>Total Days</th>
                    <th>Price/Day</th>
                    <th>Total</th>
                  </tr>
                </thead>

                <tbody>
                  {selectedOrder.bookingItems.map((item) => (
                    <tr key={item._id}>
                      <td>{item.vehicleModel}</td>
                      <td>{item.city}</td>
                      <td>{item.quantity}</td>
                      <td>{new Date(item.fromDate).toLocaleDateString()}</td>
                      <td>{new Date(item.toDate).toLocaleDateString()}</td>
                      <td>{item.totalDays}</td>
                      <td>₹ {item.pricePerDay}</td>
                      <td>₹ {item.totalAmount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Total */}
            <div className="popup-footer">
              <h3>Total Amount : ₹ {selectedOrder.grandTotal}</h3>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Ad1OrdersManagement;
