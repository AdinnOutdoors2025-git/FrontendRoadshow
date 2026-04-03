import React, { useState, useEffect, useCallback } from "react";
import { baseUrls } from "../Authentication/BASE_URL";
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
  const [selectedOrder, setSelectedOrder] = useState(null);

  const [swipeModal, setSwipeModal] = useState({
    open: false,
    orderId: null,
    newStage: null,
    oldStage: null,
    handlername: "",
    reasonDescription: "",
    showReason: false,
    error: "",
  });

  useEffect(() => { fetchOrders(); }, []);

  useEffect(() => {
    if (selectedOrder) {
      const latest = orders.find((o) => o._id === selectedOrder._id);
      if (latest) setSelectedOrder(latest);
    }
  }, [orders]);

  const fetchOrders = useCallback(async () => {
    try {
      const res = await axios.get(`${baseUrls}/getOrders`);
      if (res.data && res.data.orders) setOrders(res.data.orders);
    } catch (err) {
      console.log("Fetch orders error:", err);
    }
  }, []);


  const isSubmitEnabled = () => {
    const { handlername, reasonDescription, showReason } = swipeModal;
    const hasSwipe = handlername.trim().length > 0;
    const hasReason = reasonDescription.trim().length > 0;
    const swipeAlreadySaved = !!(
      orders.find((o) => o._id === swipeModal.orderId)?.handlername
    );

    if (showReason) {
      if (swipeAlreadySaved) return hasReason;   // Case 3
      return hasSwipe && hasReason;              // Case 2
    }
    return hasSwipe;                             // Case 1
  };


  const onDragEnd = async (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) return;

    const orderId = draggableId;
    const newStage = destination.droppableId;
    const oldStage = source.droppableId;

    const draggedOrder = orders.find((o) => o._id === orderId);
    const hashandlername = !!draggedOrder?.handlername;
    const isClosedLoss = newStage === "closedLoss";

    const needSwipe = !hashandlername;
    const needReason = isClosedLoss;

    if (needSwipe || needReason) {
      setSwipeModal({
        open: true,
        orderId,
        newStage,
        oldStage,
        handlername: "",
        reasonDescription: "",
        showReason: isClosedLoss,
        error: "",
      });
      return;
    }

    // handlername exists AND not closedLoss → move directly
    await updatePipeline(orderId, newStage, oldStage, null, null);
  };


  const updatePipeline = async (
    orderId, newStage, oldStage, handlername, reasonDescription
  ) => {
    const updatedOrders = orders.map((order) =>
      order._id === orderId
        ? {
          ...order,
          pipelineStatus: newStage,
          ...(handlername ? { handlername } : {}),
          ...(reasonDescription ? { reasonDescription } : {}),
        }
        : order
    );
    setOrders(updatedOrders);

    if (selectedOrder && selectedOrder._id === orderId) {
      const updatedSelected = updatedOrders.find((o) => o._id === orderId);
      if (updatedSelected) {
        setSelectedOrder({
          ...updatedSelected,
          pipelineLogs: [
            ...(updatedSelected.pipelineLogs || []),
            {
              fromStage: oldStage,
              toStage: newStage,
              movedBy: handlername || updatedSelected.handlername || "Admin",
              movedAt: new Date(),
            },
          ],
        });
      }
    }

    try {
      await axios.put(`${baseUrls}/updateOrderPipeline/${orderId}`, {
        pipelineStatus: newStage,
        movedBy: handlername || "Admin",
        handlername: handlername || undefined,
        reasonDescription: reasonDescription || undefined,
      });
      await fetchOrders();
    } catch (err) {
      console.log(err);
      await fetchOrders();
    }
  };


  const handleSwipeConfirm = async () => {
    const {
      orderId, newStage, oldStage,
      handlername, reasonDescription, showReason,
    } = swipeModal;

    const swipeAlreadySaved = !!(
      orders.find((o) => o._id === orderId)?.handlername
    );

    if (!swipeAlreadySaved && !handlername.trim()) {
      setSwipeModal((p) => ({ ...p, error: "Please enter Handler name" }));
      return;
    }
    if (showReason && !reasonDescription.trim()) {
      setSwipeModal((p) => ({ ...p, error: "Please enter reason description" }));
      return;
    }

    setSwipeModal({
      open: false, orderId: null, newStage: null, oldStage: null,
      handlername: "", reasonDescription: "", showReason: false, error: "",
    });

    await updatePipeline(
      orderId,
      newStage,
      oldStage,
      handlername.trim() || null,
      reasonDescription.trim() || null
    );
  };


  const handleSwipeCancel = () => {
    setSwipeModal({
      open: false, orderId: null, newStage: null, oldStage: null,
      handlername: "", reasonDescription: "", showReason: false, error: "",
    });
  };

  const getOrdersByStage = (stageId) =>
    orders.filter((o) => o.pipelineStatus === stageId);

  const getStatusColor = (status) => {
    switch (status) {
      case "newOrder": return "badge-new";
      case "proposal": return "badge-proposal";
      case "negotiation": return "badge-negotiation";
      case "closedWon": return "badge-won";
      case "closedLoss": return "badge-loss";
      default: return "badge-default";
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
                          onClick={() => setSelectedOrder(order)}
                        >
                          <div className="order-header">
                            {order.handlername && (
                              <span className="swipe-name-tag">{order.handlername}</span>
                            )}
                          </div>
                          <h4 className="company-name">{order.companyName}</h4>
                          <p className="contact-name">{order.name}</p>



                          <div className="order-price">₹ {order.grandTotal}</div>
                          <div className="order-meta">
                            <span>{order.bookingItems.length} Vehicles</span>
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


      {swipeModal.open && (() => {
        const swipeAlreadySaved = !!(
          orders.find((o) => o._id === swipeModal.orderId)?.handlername
        );
        const submitEnabled = isSubmitEnabled();

        return (
          <div className="order-popup-overlay">
            <div className="order-popup swipe-modal">

              <div className="popup-header">
                <h2>
                  {swipeModal.showReason ? "Closed Loss Details" : "Handler Name"}
                </h2>
                <button className="close-btn" onClick={handleSwipeCancel}>✕</button>
              </div>

              <div className="popup-section">
                <p className="swipe-modal-desc">
                  Moving to <b>{stageLabels[swipeModal.newStage]}</b>
                </p>

                {/* Swipe Name — hide when already saved (Case 3) */}
                {!swipeAlreadySaved && (
                  <div className="field-group">
                    <label className="field-label">Handler Name *</label>
                    <input
                      type="text"
                      className="swipe-input"
                      placeholder="Enter handler name..."
                      value={swipeModal.handlername}
                      autoFocus
                      onChange={(e) =>
                        setSwipeModal((p) => ({
                          ...p, handlername: e.target.value, error: "",
                        }))
                      }
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && submitEnabled) handleSwipeConfirm();
                        if (e.key === "Escape") handleSwipeCancel();
                      }}
                    />
                  </div>
                )}


                {swipeModal.showReason && (
                  <div className="field-group">
                    <label className="field-label">Reason *</label>
                    <textarea
                      className="swipe-input reason-textarea"
                      placeholder="Enter reason for closing as loss..."
                      rows={3}
                      value={swipeModal.reasonDescription}
                      autoFocus={swipeAlreadySaved}
                      onChange={(e) =>
                        setSwipeModal((p) => ({
                          ...p, reasonDescription: e.target.value, error: "",
                        }))
                      }
                    />
                  </div>
                )}

                {swipeModal.error && (
                  <p className="swipe-error">{swipeModal.error}</p>
                )}
              </div>

              <div className="popup-footer swipe-modal-footer">
                <button className="btn-cancel" onClick={handleSwipeCancel}>
                  Cancel
                </button>
                <button
                  className="btn-confirm"
                  onClick={handleSwipeConfirm}
                  disabled={!submitEnabled}
                  style={{
                    opacity: submitEnabled ? 1 : 0.45,
                    cursor: submitEnabled ? "pointer" : "not-allowed",
                  }}
                >
                  Confirm
                </button>
              </div>

            </div>
          </div>
        );
      })()}


      {selectedOrder && (
        <div className="order-popup-overlay">
          <div className="order-popup">
            <div className="popup-header">
              <div className="popup-header-left">
                <div className="popup-title-row">
                  <h2>Order Details</h2>
                  {selectedOrder.handlername && (
                    <span className="handler-badge">🙋 {selectedOrder.handlername}</span>
                  )}
                </div>
              </div>
              <button className="close-btn" onClick={() => setSelectedOrder(null)}>✕</button>
            </div>

            {/* Reason Box - separate above popup-section */}
            {selectedOrder.reasonDescription && (
              <div className="reason-box">
                <span className="reason-label">Reason</span>
                <p className="reason-desc">{selectedOrder.reasonDescription}</p>
              </div>
            )}

            <div className="popup-section">
              <p><b>Order ID:</b> {selectedOrder.orderId}</p>
              <p><b>Company Name:</b> {selectedOrder.companyName}</p>
              <p><b>Contact Person:</b> {selectedOrder.name}</p>
              <p><b>Phone:</b> {selectedOrder.phone}</p>
              <p><b>Email:</b> {selectedOrder.email}</p>
              <p><b>Designation:</b> {selectedOrder.designation}</p>
              <p>
                <b>Pipeline Status:</b>{" "}
                <span className={`status-badge ${getStatusColor(selectedOrder.pipelineStatus)}`}>
                  {stageLabels[selectedOrder.pipelineStatus]}
                </span>
              </p>
            </div>

            <div className="popup-section">
              <h3>Pipeline History</h3>
              <div className="history-container">
                {selectedOrder.pipelineLogs &&
                  selectedOrder.pipelineLogs
                    .slice()
                    .reverse()
                    .map((log, index) => (
                      <div className="history-item" key={index}>
                        <div className={`history-dot ${getStatusColor(log.toStage)}`}></div>
                        <div className="history-content">
                          <p>
                            <b>{log.fromStage ? stageLabels[log.fromStage] : "Start"}</b>
                            {" → "}
                            <b>{stageLabels[log.toStage]}</b>
                          </p>
                          <span>
                            {log.movedBy} • {new Date(log.movedAt).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    ))}
              </div>
            </div>

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
                      <td>₹ {Number(item.pricePerDay).toLocaleString('en-IN')}</td>
                      <td>₹ {Number(item.totalAmount).toLocaleString('en-IN')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="popup-footer">
             <h3>Total Amount : ₹ {Number(selectedOrder.grandTotal).toLocaleString('en-IN')}</h3>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Ad1OrdersManagement;