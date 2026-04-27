
// import React, { useState, useEffect, useCallback } from "react";
// import { baseUrls } from "../Authentication/BASE_URL";
// import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
// import axios from "axios";
// // import * as XLSX from "xlsx";
// import * as XLSX from "xlsx-js-style";
// import "./css/orderManagement.css";
// import jsPDF from "jspdf";
// import autoTable from "jspdf-autotable";
// import JSZip from "jszip";
// import { saveAs } from "file-saver";

// const stages = [
//   { id: "newOrder", label: "New Order" },
//   { id: "proposal", label: "Proposal" },
//   { id: "negotiation", label: "Negotiation" },
//   { id: "closedWon", label: "Closed Won" },
//   { id: "closedLoss", label: "Closed Loss" },
// ];

// const stageLabels = {
//   newOrder: "New Order",
//   proposal: "Proposal",
//   negotiation: "Negotiation",
//   closedWon: "Closed Won",
//   closedLoss: "Closed Loss",
// };

// // Get today's date string "YYYY-MM-DD"
// const getTodayString = () => {
//   const d = new Date();
//   return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
// };

// // ─────────────────────────────────────────────────────────────────────────────
// // HELPER 1: Get stage at a specific date (from pipelineLogs)
// // Returns: stage name or null (if no log on that date)
// // ─────────────────────────────────────────────────────────────────────────────
// const getStageAtDate = (order, targetDateStr) => {
//   const target = new Date(targetDateStr);
//   target.setHours(23, 59, 59, 999);

//   const logs = order.pipelineLogs || [];
//   if (logs.length === 0) return null;

//   const sorted = [...logs].sort(
//     (a, b) => new Date(a.movedAt) - new Date(b.movedAt)
//   );

//   if (new Date(order.createdAt) > target) return null;

//   const logsUpToTarget = sorted.filter(
//     (log) => new Date(log.movedAt) <= target
//   );

//   if (logsUpToTarget.length === 0) return null;
  
//   const lastLog = logsUpToTarget[logsUpToTarget.length - 1];
  
//   const targetDateStrOnly = targetDateStr.split('T')[0];
//   const logDateStrOnly = new Date(lastLog.movedAt).toISOString().split('T')[0];
  
//   if (targetDateStrOnly === getTodayString() && logDateStrOnly !== targetDateStrOnly) {
//     return null;
//   }
  
//   return lastLog.toStage;
// };

// // const getCurrentStageForToday = (order) => {
// //   const today = getTodayString();
// //   const stageFromLogs = getStageAtDate(order, today);
// //   return stageFromLogs;
// // };

// const getCurrentStageForToday = (order) => {
//   const logs = order.pipelineLogs || [];
//   if (logs.length === 0) return null;

//   const sorted = [...logs].sort(
//     (a, b) => new Date(a.movedAt) - new Date(b.movedAt)
//   );

//   // Latest log-ல் இருக்கற stage return பண்ணும்
//   return sorted[sorted.length - 1].toStage;
// };


// const formatDateTimeCustom = (dateStr) => {
//   const date = new Date(dateStr);

//   const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN",
//                   "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

//   const day = date.getDate(); // no pad (4, 17, etc.)
//   const month = months[date.getMonth()];
//   const year = date.getFullYear();

//   let hours = date.getHours();
//   const minutes = String(date.getMinutes()).padStart(2, "0");
//   const seconds = String(date.getSeconds()).padStart(2, "0");

//   const ampm = hours >= 12 ? "PM" : "AM";
//   hours = hours % 12 || 12; // convert to 12-hour

//   return `${day}/${month}/${year}, ${hours}:${minutes}:${seconds} ${ampm}`;
// };


// const getStageForRange = (order, fromStr, toStr) => {
//   const fromDate = new Date(fromStr);
//   fromDate.setHours(0, 0, 0, 0);
//   const toDate = new Date(toStr);
//   toDate.setHours(23, 59, 59, 999);

//   const logs = order.pipelineLogs || [];
  
//   // If no logs at all, return null
//   if (logs.length === 0) return null;

//   // Sort logs by movedAt
//   const sorted = [...logs].sort(
//     (a, b) => new Date(a.movedAt) - new Date(b.movedAt)
//   );

 
//   const logsInRange = sorted.filter(log => {
//     const logDate = new Date(log.movedAt);
//     return logDate >= fromDate && logDate <= toDate;
//   });

//   // If no log in the filter range, return null (order won't show in any column)
//   if (logsInRange.length === 0) {
//     return null;
//   }


//   // Sort logs in range by date (ascending)
//   const rangeLogs = [...logsInRange].sort(
//     (a, b) => new Date(a.movedAt) - new Date(b.movedAt)
//   );
  
//   // Get the LAST log within the filter range
//   const lastLogInRange = rangeLogs[rangeLogs.length - 1];
  
//   // Return the stage the order was moved TO in the last log
//   return lastLogInRange.toStage;
// };

// function Ad1OrdersManagement() {
//   const [orders, setOrders] = useState([]);
//   const [selectedOrder, setSelectedOrder] = useState(null);
//   console.log("selectedOrder",selectedOrder)

//   const [filterFrom, setFilterFrom] = useState("");
//   const [filterTo, setFilterTo] = useState("");
//   const [isFiltering, setIsFiltering] = useState(false);

//   const [swipeModal, setSwipeModal] = useState({
//     open: false,
//     orderId: null,
//     newStage: null,
//     oldStage: null,
//     handlername: "",
//     reasonDescription: "",
//     showReason: false,
//     error: "",
//   });

//   useEffect(() => {
//     fetchOrders();
//   }, []);

//   useEffect(() => {
//     if (selectedOrder) {
//       const latest = orders.find((o) => o._id === selectedOrder._id);
//       if (latest) setSelectedOrder(latest);
//     }
//   }, [orders]);

//   const fetchOrders = useCallback(async () => {
//     try {
//       const res = await axios.get(`${baseUrls}/getOrders`);
//       if (res.data && res.data.orders) setOrders(res.data.orders);
//     } catch (err) {
//       console.log("Fetch orders error:", err);
//     }
//   }, []);

//   // ─────────────────────────────────────────────────────────────────────────
//   // getOrdersByStage — Main filtering function
//   // ─────────────────────────────────────────────────────────────────────────
//   // const getOrdersByStage = (stageId) => {
//   //   if (isFiltering && filterFrom && filterTo) {
//   //     // FILTER MODE: Orders that had a log within the range AND were in this stage
//   //     return orders.filter((order) => {
//   //       const stage = getStageForRange(order, filterFrom, filterTo);
//   //       return stage === stageId;
//   //     });
//   //   } 
    
//   //   else {
//   //     // NO FILTER MODE: Orders that have a pipelineLog entry on today's date
//   //     return orders.filter((order) => {
//   //       const currentStage = getCurrentStageForToday(order);
//   //       return currentStage === stageId;
//   //     });
//   //   }
//   // };

//   const getOrdersByStage = (stageId) => {
//   if (isFiltering && filterFrom && filterTo) {
//     // FILTER MODE: range-ல் log இருந்தா மட்டும்
//     return orders.filter((order) => {
//       const stage = getStageForRange(order, filterFrom, filterTo);
//       return stage === stageId;
//     });
//   } else {
//     // NO FILTER MODE: latest stage basis-ல் எல்லாமே காட்டு
//     return orders.filter((order) => {
//       const currentStage = getCurrentStageForToday(order);
//       return currentStage === stageId;
//     });
//   }
// };

// const handleDownloadPDF = async () => {
//   const formatDateForDisplay = (dateStr) => {
//     if (!dateStr) return "";
//     const date = new Date(dateStr);
//     const day = String(date.getDate()).padStart(2, "0");
//     const monthNames = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];
//     return `${day}/${monthNames[date.getMonth()]}/${date.getFullYear()}`;
//   };

//   // ✅ UPDATED FORMAT
//   const formatDateForFilename = (dateStr) => {
//     if (!dateStr) return "";
//     const date = new Date(dateStr);
//     const day = String(date.getDate()).padStart(2, "0");
//     const monthNames = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];
//     return `${day}_${monthNames[date.getMonth()]}_${date.getFullYear()}`;
//   };

//   const getYearRangeText = () => {
//   if (isFiltering && filterFrom && filterTo) {
//     const fromYear = new Date(filterFrom).getFullYear();
//     const toYear = new Date(filterTo).getFullYear();

//     return fromYear === toYear
//       ? `(${fromYear})`
//       : `(${fromYear} - ${toYear})`;
//   } else {
//     return `(${new Date().getFullYear()})`;
//   }
// };

//   const stageColors = {
//     newOrder:    [33, 150, 243],
//     proposal:    [255, 152, 0],
//     negotiation: [156, 39, 176],
//     closedWon:   [76, 175, 80],
//     closedLoss:  [244, 67, 54],
//   };

//   const zip = new JSZip();

//   stages.forEach((stage) => {
//     const stageOrders = getOrdersByStage(stage.id);

//     const totalValue = stageOrders.reduce(
//       (sum, o) => sum + (Number(o.grandTotal) || 0),
//       0
//     );

//     const totalVehicles = stageOrders.reduce(
//       (sum, o) => sum + (o.bookingItems?.length || 0),
//       0
//     );

//     const color = stageColors[stage.id] || [68, 114, 196];

//     const doc = new jsPDF({
//       orientation: "landscape",
//       unit: "mm",
//       format: "a4",
//     });

//     const pageW = doc.internal.pageSize.getWidth();

//     // ===== HEADER =====
//     doc.setFillColor(68, 114, 196);
//     doc.rect(0, 0, pageW, 18, "F");

//     doc.setTextColor(255, 255, 255);
//     doc.setFontSize(16);
//     doc.setFont("helvetica", "bold");
//    doc.text(
//   `ROADSHOW ORDERS MANAGEMENT REPORT ${getYearRangeText()}`,
//   pageW / 2,
//   8,
//   { align: "center" }
// );

//     doc.setFontSize(10);
//     doc.setFont("helvetica", "normal");

//     const subtitle =
//       isFiltering && filterFrom && filterTo
//         ? `Period: ${formatDateForDisplay(filterFrom)} to ${formatDateForDisplay(filterTo)}`
//         : `Date: ${formatDateForDisplay(getTodayString())}`;

//     doc.text(subtitle, pageW / 2, 14, { align: "center" });

//     // ===== STATUS HEADER =====
//     doc.setFillColor(...color);
//     doc.rect(0, 19, pageW, 10, "F");

//     doc.setTextColor(255, 255, 255);
//     doc.setFontSize(13);
//     doc.setFont("helvetica", "bold");
//     doc.text(
//       `STATUS: ${stage.label.toUpperCase()}`,
//       pageW / 2,
//       25.5,
//       { align: "center" }
//     );

//     // ===== SUMMARY BAR =====
//     doc.setFillColor(232, 240, 254);
//     doc.rect(0, 30, pageW, 9, "F");

//     doc.setTextColor(31, 78, 121);
//     doc.setFontSize(10);
//     doc.setFont("helvetica", "bold");

//     doc.text(
//       `Total Orders: ${stageOrders.length}   |   Total Value:  Rs.${totalValue.toLocaleString("en-IN")}   |   Total Vehicles: ${totalVehicles}`,
//       pageW / 2,
//       35.5,
//       { align: "center" }
//     );

//     // ===== TABLE =====
//     const columns = [
//       { header: "S.No", dataKey: "sno" },
//       { header: "Order ID", dataKey: "orderId" },
//       { header: "Company Name", dataKey: "companyName" },
//       { header: "Contact", dataKey: "name" },
//       { header: "Phone", dataKey: "phone" },
//       { header: "Email", dataKey: "email" },
//       { header: "Designation", dataKey: "designation" },
//       { header: "Grand Total", dataKey: "grandTotal" },
//       { header: "Vehicles", dataKey: "vehicles" },
//       { header: "Handler", dataKey: "handler" },
//       { header: "Stage", dataKey: "stage" },
//       { header: "Created Date", dataKey: "createdAt" },
//       { header: "Reason", dataKey: "reason" },
//     ];

//     const rows = stageOrders.map((order, i) => {
//       let currentStageLabel = "";

//       if (isFiltering && filterFrom && filterTo) {
//         currentStageLabel =
//           stageLabels[getStageForRange(order, filterFrom, filterTo)] || "";
//       } else {
//         currentStageLabel =
//           stageLabels[getCurrentStageForToday(order)] || "";
//       }

//       return {
//         sno: i + 1,
//         orderId: order.orderId || "",
//         companyName: order.companyName || "",
//         name: order.name || "",
//         phone: order.phone || "",
//         email: order.email || "",
//         designation: order.designation || "",
//         grandTotal: ` Rs. ${Number(order.grandTotal).toLocaleString("en-IN")}`,
//         vehicles: order.bookingItems?.length || 0,
//         handler: order.handlername || "-",
//         stage: currentStageLabel,
//         createdAt: order.createdAt
//           ? formatDateForDisplay(order.createdAt)
//           : "",
//         reason: order.reasonDescription || "-",
//       };
//     });

//     autoTable(doc, {
//       startY: 41,
//       columns,
//       body: rows,
//       styles: {
//         fontSize: 7.5,
//         cellPadding: 2.5,
//         halign: "center",
//         valign: "middle",
//       },
//       headStyles: {
//         fillColor: color,
//         textColor: [255, 255, 255],
//         fontStyle: "bold",
//       },
//     });

//     // ===== SUMMARY TABLE =====
//     const finalY = (doc.lastAutoTable?.finalY || 150) + 8;

//     const summaryData = [
//       ["Total Orders", String(stageOrders.length)],
//       ["Total Vehicles", String(totalVehicles)],
//       ["Total Amount", `  Rs. ${totalValue.toLocaleString("en-IN")}`],
//     ];

//     autoTable(doc, {
//       startY: finalY,
//       head: [["Description", "Value"]],
//       body: summaryData,
//       tableWidth: 80,
//       margin: { left: 10 },
//     });

//     // ===== PDF NAME =====
//     const pdfFilename =
//       isFiltering && filterFrom && filterTo
//         ? `RoadShowOrder_${stage.label.replace(/\s+/g, "_")}_${formatDateForFilename(filterFrom)}_to_${formatDateForFilename(filterTo)}.pdf`
//         : `RoadShowOrder_${stage.label.replace(/\s+/g, "_")}_${formatDateForFilename(getTodayString())}.pdf`;

//     const pdfBlob = doc.output("blob");
//     zip.file(pdfFilename, pdfBlob);
//   });

//   // ===== ZIP NAME =====
//   const zipFilename =
//     isFiltering && filterFrom && filterTo
//       ? `RoadShowOrder_Report_${formatDateForFilename(filterFrom)}_to_${formatDateForFilename(filterTo)}.zip`
//       : `RoadShowOrder_Report_${formatDateForFilename(getTodayString())}.zip`;

//   const zipBlob = await zip.generateAsync({ type: "blob" });

//   saveAs(zipBlob, zipFilename);
// };


// const handleDownloadExcel = () => {
//   const workbook = XLSX.utils.book_new();

//   // Format date for display - 18/APR/2026 format
//   const formatDateForDisplay = (dateStr) => {
//     if (!dateStr) return "";
//     const date = new Date(dateStr);
//     const day = String(date.getDate()).padStart(2, "0");
//     const monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
//     const month = monthNames[date.getMonth()];
//     const year = date.getFullYear();
//     return `${day}/${month}/${year}`;
//   };
  
//   // Format date with month name for filename
// const formatDateWithMonthName = (dateStr) => {
//   if (!dateStr) return "";
//   const date = new Date(dateStr);
//   const day = String(date.getDate()).padStart(2, "0");
//   const monthNames = ["APR","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];
//   const month = monthNames[date.getMonth()];
//   const year = date.getFullYear();

//   return `${day}_${month}_${year}`; 
// };

//     const getYearRangeText = () => {
//   if (isFiltering && filterFrom && filterTo) {
//     const fromYear = new Date(filterFrom).getFullYear();
//     const toYear = new Date(filterTo).getFullYear();

//     return fromYear === toYear
//       ? `(${fromYear})`
//       : `(${fromYear} - ${toYear})`;
//   } else {
//     return `(${new Date().getFullYear()})`;
//   }
// };
  
//   // Style definitions with center alignment
//   const headerStyle = {
//     font: { bold: true, sz: 11, color: { rgb: "FFFFFF" } },
//     fill: { fgColor: { rgb: "4472C4" } },
//     alignment: { horizontal: "center", vertical: "center" },
//     border: {
//       top: { style: "thin", color: { rgb: "FFFFFF" } },
//       bottom: { style: "thin", color: { rgb: "FFFFFF" } },
//       left: { style: "thin", color: { rgb: "FFFFFF" } },
//       right: { style: "thin", color: { rgb: "FFFFFF" } }
//     }
//   };
  
//   const evenRowStyle = {
//     fill: { fgColor: { rgb: "F8F9FA" } },
//     alignment: { horizontal: "center", vertical: "center" }
//   };
  
//   const oddRowStyle = {
//     fill: { fgColor: { rgb: "FFFFFF" } },
//     alignment: { horizontal: "center", vertical: "center" }
//   };
  
//   const summaryLabelStyle = {
//     font: { bold: true, sz: 11 },
//     fill: { fgColor: { rgb: "E8F0FE" } },
//     alignment: { horizontal: "center", vertical: "center" },
//     border: {
//       top: { style: "thin", color: { rgb: "D0D0D0" } },
//       bottom: { style: "thin", color: { rgb: "D0D0D0" } },
//       left: { style: "thin", color: { rgb: "D0D0D0" } },
//       right: { style: "thin", color: { rgb: "D0D0D0" } }
//     }
//   };
  
//   const summaryValueStyle = {
//     font: { bold: true, sz: 11, color: { rgb: "1F4E79" } },
//     fill: { fgColor: { rgb: "E8F0FE" } },
//     alignment: { horizontal: "center", vertical: "center" },
//     numFmt: "#,##0.00",
//     border: {
//       top: { style: "thin", color: { rgb: "D0D0D0" } },
//       bottom: { style: "thin", color: { rgb: "D0D0D0" } },
//       left: { style: "thin", color: { rgb: "D0D0D0" } },
//       right: { style: "thin", color: { rgb: "D0D0D0" } }
//     }
//   };
  
//   const sectionHeaderStyle = {
//     font: { bold: true, sz: 12, color: { rgb: "1F4E79" } },
//     fill: { fgColor: { rgb: "D6E4F0" } },
//     alignment: { horizontal: "center", vertical: "center" }
//   };
  
//   let reportTitle = "";
//   let reportSubtitle = "";
  
//   if (isFiltering && filterFrom && filterTo) {
//     reportTitle =  `ROADSHOW ORDERS MANAGEMENT REPORT ${getYearRangeText()}`;
//     reportSubtitle = `Period: ${formatDateForDisplay(filterFrom)} to ${formatDateForDisplay(filterTo)}`;
//   } else {
//     const today = getTodayString();
//     reportTitle = `ROADSHOW ORDERS MANAGEMENT REPORT ${getYearRangeText()}`;
//     reportSubtitle = `Date: ${formatDateForDisplay(today)}`;
//   }

//   stages.forEach((stage) => {
//     const stageOrders = getOrdersByStage(stage.id);
    
//     // Calculate summary data
//     const totalValue = stageOrders.reduce((sum, o) => sum + (Number(o.grandTotal) || 0), 0);
//     const totalVehicles = stageOrders.reduce((sum, o) => sum + (o.bookingItems?.length || 0), 0);
    
//     // Create sheet data with styling information
//     const sheetData = [];
    
//     // Add title section with merge info
//     sheetData.push([{ v: reportTitle, s: { font: { bold: true, sz: 16, color: { rgb: "1F4E79" } }, alignment: { horizontal: "center", vertical: "center" } } }]);
//     sheetData.push([{ v: reportSubtitle, s: { font: { bold: true, sz: 12, color: { rgb: "4472C4" } }, alignment: { horizontal: "center", vertical: "center" } } }]);
//     sheetData.push([{ v: `STATUS: ${stage.label.toUpperCase()}`, s: { font: { bold: true, sz: 14, color: { rgb: "FFFFFF" } }, fill: { fgColor: { rgb: "4472C4" } }, alignment: { horizontal: "center", vertical: "center" } } }]);
//     sheetData.push([{ v: `Total Orders: ${stageOrders.length} | Total Value: ₹${totalValue.toLocaleString("en-IN")} | Total Vehicles: ${totalVehicles}`, s: { font: { bold: true, sz: 11 }, alignment: { horizontal: "center", vertical: "center" } } }]);
//     sheetData.push([]); // Empty row for spacing
    
//     // Table Headers with styling
//     const headers = [
//       { v: "S.No", s: headerStyle },
//       { v: "Order ID", s: headerStyle },
//       { v: "Company Name", s: headerStyle },
//       { v: "Contact Person", s: headerStyle },
//       { v: "Phone", s: headerStyle },
//       { v: "Email", s: headerStyle },
//       { v: "Designation", s: headerStyle },
//       { v: "Grand Total (₹)", s: { ...headerStyle, alignment: { horizontal: "center", vertical: "center" } } },
//       { v: "Vehicles", s: { ...headerStyle, alignment: { horizontal: "center", vertical: "center" } } },
//       { v: "Handler Name", s: headerStyle },
//       { v: "Current Stage", s: headerStyle },
//       { v: "Created Date", s: headerStyle },
//       { v: "Reason", s: headerStyle }
//     ];
    
//     sheetData.push(headers);
    
//     // Table Rows with center alignment
//     stageOrders.forEach((order, index) => {
//       let currentStageLabel = "";
//       if (isFiltering && filterFrom && filterTo) {
//         currentStageLabel = stageLabels[getStageForRange(order, filterFrom, filterTo)] || "";
//       } else {
//         currentStageLabel = stageLabels[getCurrentStageForToday(order)] || "";
//       }
      
//       const rowStyle = index % 2 === 0 ? evenRowStyle : oddRowStyle;
//       const stageColor = getStageColorForExcel(currentStageLabel);
      
//       const row = [
//         { v: index + 1, s: { ...rowStyle, alignment: { horizontal: "center", vertical: "center" } } },
//         { v: order.orderId || "", s: { ...rowStyle, alignment: { horizontal: "center", vertical: "center" } } },
//         { v: order.companyName || "", s: { ...rowStyle, font: { bold: true }, alignment: { horizontal: "center", vertical: "center" } } },
//         { v: order.name || "", s: { ...rowStyle, alignment: { horizontal: "center", vertical: "center" } } },
//         { v: order.phone || "", s: { ...rowStyle, alignment: { horizontal: "center", vertical: "center" } } },
//         { v: order.email || "", s: { ...rowStyle, alignment: { horizontal: "center", vertical: "center" } } },
//         { v: order.designation || "", s: { ...rowStyle, alignment: { horizontal: "center", vertical: "center" } } },
//         { v: `₹ ${Number(order.grandTotal).toLocaleString("en-IN") || 0}`, s: { ...rowStyle, alignment: { horizontal: "center", vertical: "center" }, numFmt: "#,##0.00" } },
//         { v: order.bookingItems?.length || 0, s: { ...rowStyle, alignment: { horizontal: "center", vertical: "center" } } },
//         { v: order.handlername || "—", s: { ...rowStyle, alignment: { horizontal: "center", vertical: "center" } } },
//         { v: currentStageLabel, s: { ...rowStyle, font: { color: { rgb: stageColor }, bold: true }, alignment: { horizontal: "center", vertical: "center" } } },
//         { v: order.createdAt ? formatDateForDisplay(order.createdAt) : "", s: { ...rowStyle, alignment: { horizontal: "center", vertical: "center" } } },
//         { v: order.reasonDescription || "—", s: { ...rowStyle, alignment: { horizontal: "center", vertical: "center" } } }
//       ];
      
//       sheetData.push(row);
//     });
    
//     sheetData.push([]); 
    
//     // Summary Section with center alignment
//     sheetData.push([{ v: "SUMMARY", s: { ...sectionHeaderStyle, alignment: { horizontal: "center", vertical: "center" } } }]);
//     sheetData.push([{ v: "", s: {} }]);
    
//     const summaryRows = [
//       [{ v: "Total Orders", s: { ...summaryLabelStyle, alignment: { horizontal: "center", vertical: "center" } } }, 
//        { v: stageOrders.length, s: { ...summaryValueStyle, alignment: { horizontal: "center", vertical: "center" } } }],
//       [{ v: "Total Vehicles", s: { ...summaryLabelStyle, alignment: { horizontal: "center", vertical: "center" } } }, 
//        { v: totalVehicles, s: { ...summaryValueStyle, alignment: { horizontal: "center", vertical: "center" } } }],
//       [{ v: "Total Amount (₹)", s: { ...summaryLabelStyle, alignment: { horizontal: "center", vertical: "center" } } }, 
//        { v: `₹ ${Number(totalValue).toLocaleString("en-IN")}`, s: { ...summaryValueStyle, alignment: { horizontal: "center", vertical: "center" }, numFmt: "#,##0.00" } }],
//     ];
    
//     summaryRows.forEach(row => sheetData.push(row));
    
//     // Convert to worksheet
//     const worksheet = XLSX.utils.aoa_to_sheet(sheetData);
    
//     // Set column widths
//     worksheet['!cols'] = [
//       { wch: 8 },   // S.No
//       { wch: 18 },  // Order ID
//       { wch: 30 },  // Company Name
//       { wch: 22 },  // Contact Person
//       { wch: 15 },  // Phone
//       { wch: 30 },  // Email
//       { wch: 18 },  // Designation
//       { wch: 20 },  // Grand Total
//       { wch: 12 },  // Vehicles
//       { wch: 20 },  // Handler Name
//       { wch: 18 },  // Current Stage
//       { wch: 18 },  // Created Date
//       { wch: 35 }   // Reason
//     ];
    
//     // Set row heights
//     worksheet['!rows'] = [
//       { hpt: 35 },  // Title row
//       { hpt: 25 },  // Subtitle row
//       { hpt: 30 },  // Stage header
//       { hpt: 25 },  // Summary line
//       { hpt: 10 },  // Empty row
//       { hpt: 28 }   // Table headers
//     ];
    
//     // Add merge configurations for title rows
//     if (!worksheet['!merges']) worksheet['!merges'] = [];
    
//     const titleMergeRefs = ['A1:M1', 'A2:M2', 'A3:M3', 'A4:M4'];
//     titleMergeRefs.forEach(ref => {
//       const range = XLSX.utils.decode_range(ref);
//       worksheet['!merges'].push(range);
//     });
    
//     // Add borders to table
//     const tableStartRow = 5; // After headers and empty rows
//     const tableEndRow = tableStartRow + stageOrders.length;
//     const tableStartCol = 0;
//     const tableEndCol = 12;
    
//     for (let row = tableStartRow; row <= tableEndRow; row++) {
//       for (let col = tableStartCol; col <= tableEndCol; col++) {
//         const cellRef = XLSX.utils.encode_cell({ r: row, c: col });
//         if (worksheet[cellRef]) {
//           worksheet[cellRef].s = {
//             ...worksheet[cellRef].s,
//             border: {
//               top: { style: "thin", color: { rgb: "D0D0D0" } },
//               bottom: { style: "thin", color: { rgb: "D0D0D0" } },
//               left: { style: "thin", color: { rgb: "D0D0D0" } },
//               right: { style: "thin", color: { rgb: "D0D0D0" } }
//             }
//           };
//         }
//       }
//     }
    
//     const sheetName = stage.label.replace(/\s+/g, '').substring(0, 31);
//     XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
//   });
  
//   // Generate filename
//   const today = getTodayString();
//   const formattedToday = formatDateWithMonthName(today);
  
//   let filename;
//   if (isFiltering) {
//     const formattedFrom = formatDateWithMonthName(filterFrom);
//     const formattedTo = formatDateWithMonthName(filterTo);
//     filename = `RoadShowOrder_Report_${formattedFrom}_to_${formattedTo}.xlsx`;
//   } else {
//     filename = `RoadShowOrder_Report_${formattedToday}.xlsx`;
//   }
  
//   XLSX.writeFile(workbook, filename);
// };
// // ─────────────────────────────────────────────────────────────────────────
// // Excel Styling Helper Functions
// // ─────────────────────────────────────────────────────────────────────────

// // Header style for table columns
// const headerStyle = {
//   font: { bold: true, sz: 11, color: { rgb: "FFFFFF" } },
//   fill: { fgColor: { rgb: "4472C4" } },
//   alignment: { horizontal: "center", vertical: "center", wrapText: true },
//   border: {
//     top: { style: "thin", color: { rgb: "FFFFFF" } },
//     bottom: { style: "thin", color: { rgb: "FFFFFF" } },
//     left: { style: "thin", color: { rgb: "FFFFFF" } },
//     right: { style: "thin", color: { rgb: "FFFFFF" } }
//   }
// };

// // Alternating row styles
// const evenRowStyle = {
//   fill: { fgColor: { rgb: "F2F2F2" } },
//   alignment: { vertical: "center" }
// };

// const oddRowStyle = {
//   fill: { fgColor: { rgb: "FFFFFF" } },
//   alignment: { vertical: "center" }
// };

// // Section header style
// const sectionHeaderStyle = {
//   font: { bold: true, sz: 13, color: { rgb: "FFFFFF" } },
//   fill: { fgColor: { rgb: "2E75B6" } },
//   alignment: { horizontal: "left", vertical: "center" },
//   border: {
//     bottom: { style: "medium", color: { rgb: "1F4E79" } }
//   }
// };

// // Summary label style
// const summaryLabelStyle = {
//   font: { bold: true, sz: 11 },
//   fill: { fgColor: { rgb: "E7E6E6" } },
//   alignment: { horizontal: "left", vertical: "center" },
//   border: {
//     bottom: { style: "thin", color: { rgb: "BFBFBF" } }
//   }
// };

// // Summary value style
// const summaryValueStyle = {
//   font: { sz: 11 },
//   alignment: { horizontal: "right", vertical: "center" },
//   border: {
//     bottom: { style: "thin", color: { rgb: "BFBFBF" } }
//   }
// };

// // Get stage color for Excel
// const getStageColorForExcel = (stageLabel) => {
//   const colorMap = {
//     "New Order": "2196F3",     // Blue
//     "Proposal": "FF9800",      // Orange
//     "Negotiation": "9C27B0",   // Purple
//     "Closed Won": "4CAF50",    // Green
//     "Closed Loss": "F44336"    // Red
//   };
//   return colorMap[stageLabel] || "000000";
// };



// // Format date with month name for filename
// const formatDateWithMonthName = (dateStr) => {
//   const date = new Date(dateStr);
//   const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", 
//                   "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
//   const year = date.getFullYear();
//   const month = months[date.getMonth()];
//   const day = String(date.getDate()).padStart(2, "0");
//   return `${year}-${month}-${day}`;
// };

//   const handleApplyFilter = () => {
//     if (!filterFrom || !filterTo) {
//       alert("Please select both From and To dates.");
//       return;
//     }
//     if (new Date(filterFrom) > new Date(filterTo)) {
//       alert("From date cannot be after To date.");
//       return;
//     }
//     setIsFiltering(true);
//   };

//   const handleClearFilter = () => {
//     setFilterFrom("");
//     setFilterTo("");
//     setIsFiltering(false);
//   };

//   const isSubmitEnabled = () => {
//     const { handlername, reasonDescription, showReason } = swipeModal;
//     const hasSwipe = handlername.trim().length > 0;
//     const hasReason = reasonDescription.trim().length > 0;
//     const swipeAlreadySaved = !!(
//       orders.find((o) => o._id === swipeModal.orderId)?.handlername
//     );
//     if (showReason) {
//       if (swipeAlreadySaved) return hasReason;
//       return hasSwipe && hasReason;
//     }
//     return hasSwipe;
//   };

//   const onDragEnd = async (result) => {
//     const { destination, source, draggableId } = result;
//     if (!destination) return;
//     if (
//       destination.droppableId === source.droppableId &&
//       destination.index === source.index
//     )
//       return;

//     const orderId = draggableId;
//     const newStage = destination.droppableId;
//     const oldStage = source.droppableId;

//     const draggedOrder = orders.find((o) => o._id === orderId);
//     const hashandlername = !!draggedOrder?.handlername;
//     const isClosedLoss = newStage === "closedLoss";
//     const needSwipe = !hashandlername;
//     const needReason = isClosedLoss;

//     if (needSwipe || needReason) {
//       setSwipeModal({
//         open: true,
//         orderId,
//         newStage,
//         oldStage,
//         handlername: "",
//         reasonDescription: "",
//         showReason: isClosedLoss,
//         error: "",
//       });
//       return;
//     }
//     await updatePipeline(orderId, newStage, oldStage, null, null);
//   };

//   const updatePipeline = async (
//     orderId,
//     newStage,
//     oldStage,
//     handlername,
//     reasonDescription
//   ) => {
//     const updatedOrders = orders.map((order) =>
//       order._id === orderId
//         ? {
//             ...order,
//             pipelineStatus: newStage,
//             ...(handlername ? { handlername } : {}),
//             ...(reasonDescription ? { reasonDescription } : {}),
//           }
//         : order
//     );
//     setOrders(updatedOrders);

//     if (selectedOrder && selectedOrder._id === orderId) {
//       const updatedSelected = updatedOrders.find((o) => o._id === orderId);
//       if (updatedSelected) {
//         setSelectedOrder({
//           ...updatedSelected,
//           pipelineLogs: [
//             ...(updatedSelected.pipelineLogs || []),
//             {
//               fromStage: oldStage,
//               toStage: newStage,
//               movedBy: handlername || updatedSelected.handlername || "Admin",
//               movedAt: new Date(),
//             },
//           ],
//         });
//       }
//     }

//     try {
//       await axios.put(`${baseUrls}/updateOrderPipeline/${orderId}`, {
//         pipelineStatus: newStage,
//         movedBy: handlername || "Admin",
//         handlername: handlername || undefined,
//         reasonDescription: reasonDescription || undefined,
//       });
//       await fetchOrders();
//     } catch (err) {
//       console.log(err);
//       await fetchOrders();
//     }
//   };

//   const handleSwipeConfirm = async () => {
//     const {
//       orderId,
//       newStage,
//       oldStage,
//       handlername,
//       reasonDescription,
//       showReason,
//     } = swipeModal;

//     const swipeAlreadySaved = !!(
//       orders.find((o) => o._id === orderId)?.handlername
//     );

//     if (!swipeAlreadySaved && !handlername.trim()) {
//       setSwipeModal((p) => ({ ...p, error: "Please enter Handler name" }));
//       return;
//     }
//     if (showReason && !reasonDescription.trim()) {
//       setSwipeModal((p) => ({
//         ...p,
//         error: "Please enter reason description",
//       }));
//       return;
//     }

//     setSwipeModal({
//       open: false,
//       orderId: null,
//       newStage: null,
//       oldStage: null,
//       handlername: "",
//       reasonDescription: "",
//       showReason: false,
//       error: "",
//     });

//     await updatePipeline(
//       orderId,
//       newStage,
//       oldStage,
//       handlername.trim() || null,
//       reasonDescription.trim() || null
//     );
//   };

//   const handleSwipeCancel = () => {
//     setSwipeModal({
//       open: false,
//       orderId: null,
//       newStage: null,
//       oldStage: null,
//       handlername: "",
//       reasonDescription: "",
//       showReason: false,
//       error: "",
//     });
//   };

//   const getStatusColor = (status) => {
//     switch (status) {
//       case "newOrder":    return "badge-new";
//       case "proposal":    return "badge-proposal";
//       case "negotiation": return "badge-negotiation";
//       case "closedWon":   return "badge-won";
//       case "closedLoss":  return "badge-loss";
//       default:            return "badge-default";
//     }
//   };

//   return (
//     <>
//       {/* ── Date Filter Bar ────────────────────────────────────────────── */}
//       <div className="filter-bar">
//         <div className="filter-group">
//           <label className="filter-label">From Date</label>
//           <input
//             type="date"
//             className="filter-input"
//             value={filterFrom}
//             onChange={(e) => {
//               setFilterFrom(e.target.value);
//               setIsFiltering(false);
//             }}
//           />
//         </div>
//         <div className="filter-group">
//           <label className="filter-label">To Date</label>
//           <input
//             type="date"
//             className="filter-input"
//             value={filterTo}
//             onChange={(e) => {
//               setFilterTo(e.target.value);
//               setIsFiltering(false);
//             }}
//           />
//         </div>
//         <button className="order_applys-filter" onClick={handleApplyFilter}>
//           Apply Filter
//         </button>
//         {isFiltering && (
//           <button className="btn-filter-clear" onClick={handleClearFilter}>
//             Clear Filter
//           </button>
//         )}
        
//         <button 
//           className="btn-excel-downloads" 
//           onClick={handleDownloadExcel}

//         >
//           📊 Download Excel
//         </button>
        

//         <button 
//   className="btn-excel-downloads-pdf" 
//   onClick={handleDownloadPDF}
 
// >
//   📄 Download PDF
// </button>
       
//       </div>

//       {/* ── Pipeline Board ─────────────────────────────────────────────── */}
//       <DragDropContext onDragEnd={onDragEnd}>
//         <div className="pipeline-container">
//           {stages.map((stage) => {
//             const stageOrders = getOrdersByStage(stage.id);
//             return (
//               <Droppable droppableId={stage.id} key={stage.id} type="ORDER">
//                 {(provided) => (
//                   <div
//                     className="pipeline-column"
//                     ref={provided.innerRef}
//                     {...provided.droppableProps}
//                   >
//                     <h3>
//                       {stage.label}
//                       <span className="stage-count">{stageOrders.length}</span>
//                     </h3>

//                     <div className="orders-list">
//                       {stageOrders.length === 0 && (
//                         <div className="empty-stage">
//                           <p>No orders</p>
//                         </div>
//                       )}

//                       {stageOrders.map((order, index) => (
//                         <Draggable
//                           draggableId={order._id.toString()}
//                           index={index}
//                           key={order._id}
//                         >
//                           {(provided) => (
//                             <div
//                               className="order-card"
//                               ref={provided.innerRef}
//                               {...provided.draggableProps}
//                               {...provided.dragHandleProps}
//                               onClick={() => setSelectedOrder(order)}
//                             >
//                               <div className="order-header">
//                                 {order.handlername && (
//                                   <span className="swipe-name-tag">
//                                     {order.handlername}
//                                   </span>
//                                 )}
//                               </div>
//                               <h4 className="company-name">{order.companyName}</h4>
//                               <p className="contact-name">{order.name}</p>
//                               <div className="order-price">
//                                 ₹ {Number(order.grandTotal).toLocaleString("en-IN")}
//                               </div>
//                               <div className="order-meta">
//                                 <span>{order.bookingItems.length} Vehicles</span>
//                               </div>
//                               {isFiltering && filterFrom && filterTo && (
//                                 <div className="filtered-stage-note">
//                                   <span
//                                     className={`status-badge ${getStatusColor(
//                                       getStageForRange(order, filterFrom, filterTo)
//                                     )}`}
//                                   >
//                                     {stageLabels[getStageForRange(order, filterFrom, filterTo)]}
//                                   </span>
//                                 </div>
//                               )}
//                             </div>
//                           )}
//                         </Draggable>
//                       ))}
//                       {provided.placeholder}
//                     </div>
//                   </div>
//                 )}
//               </Droppable>
//             );
//           })}
//         </div>
//       </DragDropContext>

//       {/* ── Swipe Modal ─────────────────────────────────────────────────── */}
//       {swipeModal.open &&
//         (() => {
//           const swipeAlreadySaved = !!(
//             orders.find((o) => o._id === swipeModal.orderId)?.handlername
//           );
//           const submitEnabled = isSubmitEnabled();

//           return (
//             <div className="order-popup-overlay">
//               <div className="order-popup swipe-modal">
//                 <div className="popup-header">
//                   <h2>
//                     {swipeModal.showReason
//                       ? "Closed Loss Details"
//                       : "Handler Name"}
//                   </h2>
//                   <button className="close-btn" onClick={handleSwipeCancel}>
//                     ✕
//                   </button>
//                 </div>
//                 <div className="popup-section">
//                   <p className="swipe-modal-desc">
//                     Moving to <b>{stageLabels[swipeModal.newStage]}</b>
//                   </p>
//                   {!swipeAlreadySaved && (
//                     <div className="field-group">
//                       <label className="field-label">Handler Name *</label>
//                       <input
//                         type="text"
//                         className="swipe-input"
//                         placeholder="Enter handler name..."
//                         value={swipeModal.handlername}
//                         autoFocus
//                         onChange={(e) =>
//                           setSwipeModal((p) => ({
//                             ...p,
//                             handlername: e.target.value,
//                             error: "",
//                           }))
//                         }
//                         onKeyDown={(e) => {
//                           if (e.key === "Enter" && submitEnabled)
//                             handleSwipeConfirm();
//                           if (e.key === "Escape") handleSwipeCancel();
//                         }}
//                       />
//                     </div>
//                   )}
//                   {swipeModal.showReason && (
//                     <div className="field-group">
//                       <label className="field-label">Reason *</label>
//                       <textarea
//                         className="swipe-input reason-textarea"
//                         placeholder="Enter reason for closing as loss..."
//                         rows={3}
//                         value={swipeModal.reasonDescription}
//                         autoFocus={swipeAlreadySaved}
//                         onChange={(e) =>
//                           setSwipeModal((p) => ({
//                             ...p,
//                             reasonDescription: e.target.value,
//                             error: "",
//                           }))
//                         }
//                       />
//                     </div>
//                   )}
//                   {swipeModal.error && (
//                     <p className="swipe-error">{swipeModal.error}</p>
//                   )}
//                 </div>
//                 <div className="popup-footer swipe-modal-footer">
//                   <button className="btn-cancel" onClick={handleSwipeCancel}>
//                     Cancel
//                   </button>
//                   <button
//                     className="btn-confirm"
//                     onClick={handleSwipeConfirm}
//                     disabled={!submitEnabled}
//                     style={{
//                       opacity: submitEnabled ? 1 : 0.45,
//                       cursor: submitEnabled ? "pointer" : "not-allowed",
//                     }}
//                   >
//                     Confirm
//                   </button>
//                 </div>
//               </div>
//             </div>
//           );
//         })()}

//       {/* ── Order Detail Popup ──────────────────────────────────────────── */}
//       {selectedOrder && (
//         <div className="order-popup-overlay">
//           <div className="order-popup">
//             <div className="popup-header">
//               <div className="popup-header-left">
//                 <div className="popup-title-row">
//                   <h2>Order Details</h2>
//                   {selectedOrder.handlername && (
//                     <span className="handler-badge">
//                       🙋 {selectedOrder.handlername}
//                     </span>
//                   )}
//                 </div>
//               </div>
//               <button
//                 className="close-btn"
//                 onClick={() => setSelectedOrder(null)}
//               >
//                 ✕
//               </button>
//             </div>

//             {selectedOrder.reasonDescription && (
//               <div className="reason-box">
//                 <span className="reason-label">Reason</span>
//                 <p className="reason-desc">{selectedOrder.reasonDescription}</p>
//               </div>
//             )}

//             <div className="popup-section">
//               <p><b>Order ID:</b> {selectedOrder.orderId}</p>
//               <p><b>Company Name:</b> {selectedOrder.companyName}</p>
//               <p><b>Contact Person:</b> {selectedOrder.name}</p>
//               <p><b>Phone:</b> {selectedOrder.phone}</p>
//               <p><b>Email:</b> {selectedOrder.email}</p>
//               <p><b>Designation:</b> {selectedOrder.designation}</p>
//               <p>
//                 <b>Pipeline Status:</b>{" "}
//                 <span
//                   className={`status-badge ${getStatusColor(
//                     selectedOrder.pipelineStatus
//                   )}`}
//                 >
//                   {stageLabels[selectedOrder.pipelineStatus]}
//                 </span>
//               </p>
//             </div>

//             {/* ── Negotiation History (NEW) ──────────────────────── */}
// {selectedOrder.negotiationLogs &&
//   selectedOrder.negotiationLogs.length > 0 && (
//     <div className="popup-section">
//       <h3>Negotiation History</h3>
//       <div className="history-container">
//         {selectedOrder.negotiationLogs
//           .slice()
//           .reverse()
//           .map((log, index) => (
//             <div className="history-item" key={index}>
//               <div
//                 className={`history-dot ${getStatusColor("negotiation")}`}
//               />
//               <div className="history-content">
//                 <p>
//                   <b>
//                     {log.fromStage
//                       ? stageLabels[log.fromStage]
//                       : "Start"}
//                   </b>
//                   {" → "}
//                   <b>{stageLabels[log.toStage]}</b>
//                 </p>
//                 <p
//                   style={{
//                     color: "var(--color-text-success, #1a7a4a)",
//                     fontWeight: 500,
//                     margin: "2px 0",
//                   }}
//                 >
//                   Negotiated Amount: ₹{" "}
//                   {Number(log.amount).toLocaleString("en-IN")}
//                 </p>
//                 <span>
//                   {log.movedBy} •{" "}
//                  {formatDateTimeCustom(log.movedAt)}
//                 </span>
//               </div>
//             </div>
//           ))}
//       </div>

//       {/* Grand Negotiation Total summary */}
//       <div
//         style={{
//           marginTop: 10,
//           padding: "8px 12px",
//           background: "var(--color-background-secondary)",
//           borderRadius: 6,
//           display: "flex",
//           justifyContent: "space-between",
//           alignItems: "center",
//         }}
//       >
//         <span style={{ fontWeight: 500 }}>
//           Current Negotiation Total
//         </span>
//         <span style={{ fontWeight: 600, fontSize: 15 }}>
//           ₹{" "}
//           {Number(
//             selectedOrder.grandNegotiationTotal
//           ).toLocaleString("en-IN")}
//         </span>
//       </div>
//     </div>
//   )}

//             <div className="popup-section">
//               <h3>Pipeline History</h3>
//               <div className="history-container">
//                 {selectedOrder.pipelineLogs &&
//                   selectedOrder.pipelineLogs
//                     .slice()
//                     .reverse()
//                     .map((log, index) => (
//                       <div className="history-item" key={index}>
//                         <div
//                           className={`history-dot ${getStatusColor(log.toStage)}`}
//                         ></div>
//                         <div className="history-content">
//                           <p>
//                             <b>
//                               {log.fromStage
//                                 ? stageLabels[log.fromStage]
//                                 : "Start"}
//                             </b>
//                             {" → "}
//                             <b>{stageLabels[log.toStage]}</b>
//                           </p>
//                           <span>
//                             {log.movedBy} •{" "}
//                            {formatDateTimeCustom(log.movedAt)}
//                           </span>
//                         </div>
//                       </div>
//                     ))}
//               </div>
//             </div>

//             <div className="popup-section">
//               <h3>Vehicle Booking</h3>
//               <table className="vehicle-table">
//                 <thead>
//                   <tr>
//                     <th>Vehicle Model</th>
//                     <th>City</th>
//                     <th>Quantity</th>
//                     <th>From</th>
//                     <th>To</th>
//                     <th>Total Days</th>
//                     <th>Price/Day</th>
//                     <th>Total Amount</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {selectedOrder.bookingItems.map((item) => (
//                     <tr key={item._id}>
//                       <td>{item.vehicleModel}</td>
//                       <td>{item.city}</td>
//                       <td>{item.quantity}</td>
//                       <td>  {formatDateTimeCustom(item.fromDate)}</td>
//                       <td>{formatDateTimeCustom(item.toDate)}</td>
//                       <td>{item.totalDays}</td>
//                       <td>₹ {Number(item.pricePerDay).toLocaleString("en-IN")}</td>
//                       <td>₹ {Number(item.totalAmount).toLocaleString("en-IN")}</td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>

//             <div className="popup-footer">
//               <h3>
//                 Total Amount : ₹{" "}
//                 {Number(selectedOrder.grandTotal).toLocaleString("en-IN")}
//               </h3>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// }

// export default Ad1OrdersManagement;


import React, { useState, useEffect, useCallback } from "react";
import { baseUrls } from "../Authentication/BASE_URL";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import axios from "axios";
// import * as XLSX from "xlsx";
import * as XLSX from "xlsx-js-style";
import "./css/orderManagement.css";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import JSZip from "jszip";
import { saveAs } from "file-saver";

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

// Get today's date string "YYYY-MM-DD"
const getTodayString = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

// ─────────────────────────────────────────────────────────────────────────────
// HELPER 1: Get stage at a specific date (from pipelineLogs)
// Returns: stage name or null (if no log on that date)
// ─────────────────────────────────────────────────────────────────────────────
const getStageAtDate = (order, targetDateStr) => {
  const target = new Date(targetDateStr);
  target.setHours(23, 59, 59, 999);

  const logs = order.pipelineLogs || [];
  if (logs.length === 0) return null;

  const sorted = [...logs].sort(
    (a, b) => new Date(a.movedAt) - new Date(b.movedAt)
  );

  if (new Date(order.createdAt) > target) return null;

  const logsUpToTarget = sorted.filter(
    (log) => new Date(log.movedAt) <= target
  );

  if (logsUpToTarget.length === 0) return null;
  
  const lastLog = logsUpToTarget[logsUpToTarget.length - 1];
  
  const targetDateStrOnly = targetDateStr.split('T')[0];
  const logDateStrOnly = new Date(lastLog.movedAt).toISOString().split('T')[0];
  
  if (targetDateStrOnly === getTodayString() && logDateStrOnly !== targetDateStrOnly) {
    return null;
  }
  
  return lastLog.toStage;
};

const getCurrentStageForToday = (order) => {
  const logs = order.pipelineLogs || [];
  if (logs.length === 0) return null;

  const sorted = [...logs].sort(
    (a, b) => new Date(a.movedAt) - new Date(b.movedAt)
  );

  // Latest log-ல் இருக்கற stage return பண்ணும்
  return sorted[sorted.length - 1].toStage;
};

const formatDateTimeCustom = (dateStr) => {
  const date = new Date(dateStr);

  const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN",
                  "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

  const day = date.getDate(); // no pad (4, 17, etc.)
  const month = months[date.getMonth()];
  const year = date.getFullYear();

  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12; // convert to 12-hour

  return `${day}/${month}/${year}, ${hours}:${minutes}:${seconds} ${ampm}`;
};

const getStageForRange = (order, fromStr, toStr) => {
  const fromDate = new Date(fromStr);
  fromDate.setHours(0, 0, 0, 0);
  const toDate = new Date(toStr);
  toDate.setHours(23, 59, 59, 999);

  const logs = order.pipelineLogs || [];
  
  // If no logs at all, return null
  if (logs.length === 0) return null;

  // Sort logs by movedAt
  const sorted = [...logs].sort(
    (a, b) => new Date(a.movedAt) - new Date(b.movedAt)
  );

  const logsInRange = sorted.filter(log => {
    const logDate = new Date(log.movedAt);
    return logDate >= fromDate && logDate <= toDate;
  });

  // If no log in the filter range, return null (order won't show in any column)
  if (logsInRange.length === 0) {
    return null;
  }

  // Sort logs in range by date (ascending)
  const rangeLogs = [...logsInRange].sort(
    (a, b) => new Date(a.movedAt) - new Date(b.movedAt)
  );
  
  // Get the LAST log within the filter range
  const lastLogInRange = rangeLogs[rangeLogs.length - 1];
  
  // Return the stage the order was moved TO in the last log
  return lastLogInRange.toStage;
};

function Ad1OrdersManagement() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  console.log("selectedOrder",selectedOrder)

  const [filterFrom, setFilterFrom] = useState("");
  const [filterTo, setFilterTo] = useState("");
  const [isFiltering, setIsFiltering] = useState(false);

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

  useEffect(() => {
    fetchOrders();
  }, []);

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

  const getOrdersByStage = (stageId) => {
    if (isFiltering && filterFrom && filterTo) {
      // FILTER MODE: range-ல் log இருந்தா மட்டும்
      return orders.filter((order) => {
        const stage = getStageForRange(order, filterFrom, filterTo);
        return stage === stageId;
      });
    } else {
      // NO FILTER MODE: latest stage basis-ல் எல்லாமே காட்டு
      return orders.filter((order) => {
        const currentStage = getCurrentStageForToday(order);
        return currentStage === stageId;
      });
    }
  };
  
  // NEW FUNCTION: Get the stage to display in popup based on filter state
  const getDisplayStageForOrder = (order) => {
    if (isFiltering && filterFrom && filterTo) {
      // When filter is active, show the stage during the filtered date range
      const stageInRange = getStageForRange(order, filterFrom, filterTo);
      return stageInRange || order.pipelineStatus;
    } else {
      // When no filter, show current stage
      const currentStage = getCurrentStageForToday(order);
      return currentStage || order.pipelineStatus;
    }
  };


// NO order

  const handleDownloadPDF = async () => {
    const formatDateForDisplay = (dateStr) => {
      if (!dateStr) return "";
      const date = new Date(dateStr);
      const day = String(date.getDate()).padStart(2, "0");
      const monthNames = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];
      return `${day}/${monthNames[date.getMonth()]}/${date.getFullYear()}`;
    };

    // ✅ UPDATED FORMAT
    const formatDateForFilename = (dateStr) => {
      if (!dateStr) return "";
      const date = new Date(dateStr);
      const day = String(date.getDate()).padStart(2, "0");
      const monthNames = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];
      return `${day}_${monthNames[date.getMonth()]}_${date.getFullYear()}`;
    };

    const getYearRangeText = () => {
      if (isFiltering && filterFrom && filterTo) {
        const fromYear = new Date(filterFrom).getFullYear();
        const toYear = new Date(filterTo).getFullYear();

        return fromYear === toYear
          ? `(${fromYear})`
          : `(${fromYear} - ${toYear})`;
      } else {
        return `(${new Date().getFullYear()})`;
      }
    };

    const stageColors = {
      newOrder:    [33, 150, 243],
      proposal:    [255, 152, 0],
      negotiation: [156, 39, 176],
      closedWon:   [76, 175, 80],
      closedLoss:  [244, 67, 54],
    };

    const zip = new JSZip();

    stages.forEach((stage) => {
      const stageOrders = getOrdersByStage(stage.id);

      const totalValue = stageOrders.reduce(
        (sum, o) => sum + (Number(o.grandTotal) || 0),
        0
      );

      const totalVehicles = stageOrders.reduce(
        (sum, o) => sum + (o.bookingItems?.length || 0),
        0
      );

      const color = stageColors[stage.id] || [68, 114, 196];

      const doc = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
      });

      const pageW = doc.internal.pageSize.getWidth();

      // ===== HEADER =====
      doc.setFillColor(68, 114, 196);
      doc.rect(0, 0, pageW, 18, "F");

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.text(
        `ROADSHOW ORDERS MANAGEMENT REPORT ${getYearRangeText()}`,
        pageW / 2,
        8,
        { align: "center" }
      );

      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");

      const subtitle =
        isFiltering && filterFrom && filterTo
          ? `Period: ${formatDateForDisplay(filterFrom)} to ${formatDateForDisplay(filterTo)}`
          : `Date: ${formatDateForDisplay(getTodayString())}`;

      doc.text(subtitle, pageW / 2, 14, { align: "center" });

      // ===== STATUS HEADER =====
      doc.setFillColor(...color);
      doc.rect(0, 19, pageW, 10, "F");

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(13);
      doc.setFont("helvetica", "bold");
      doc.text(
        `STATUS: ${stage.label.toUpperCase()}`,
        pageW / 2,
        25.5,
        { align: "center" }
      );

      // ===== SUMMARY BAR =====
      doc.setFillColor(232, 240, 254);
      doc.rect(0, 30, pageW, 9, "F");

      doc.setTextColor(31, 78, 121);
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");

      doc.text(
        `Total Orders: ${stageOrders.length}   |   Total Value:  Rs.${totalValue.toLocaleString("en-IN")}   |   Total Vehicles: ${totalVehicles}`,
        pageW / 2,
        35.5,
        { align: "center" }
      );

      // Check if there are no orders for this stage
      if (stageOrders.length === 0) {
        // Display "No order" message
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(255, 0, 0);
        doc.text(
          "NO ORDER",
          pageW / 2,
          60,
          { align: "center" }
        );
        
        // Add to zip with "No_Order" in filename
        const pdfFilename =
          isFiltering && filterFrom && filterTo
            ? `RoadShowOrder_${stage.label.replace(/\s+/g, "_")}_No_Order_${formatDateForFilename(filterFrom)}_to_${formatDateForFilename(filterTo)}.pdf`
            : `RoadShowOrder_${stage.label.replace(/\s+/g, "_")}_No_Order_${formatDateForFilename(getTodayString())}.pdf`;

        const pdfBlob = doc.output("blob");
        zip.file(pdfFilename, pdfBlob);
        return; // Skip the rest of the code for this stage
      }

      // ===== TABLE =====
      const columns = [
        { header: "S.No", dataKey: "sno" },
        { header: "Order ID", dataKey: "orderId" },
        { header: "Company Name", dataKey: "companyName" },
        { header: "Contact", dataKey: "name" },
        { header: "Phone", dataKey: "phone" },
        { header: "Email", dataKey: "email" },
        { header: "Designation", dataKey: "designation" },
        { header: "Grand Total", dataKey: "grandTotal" },
        { header: "Vehicles", dataKey: "vehicles" },
        { header: "Handler Name", dataKey: "handler" },
        { header: "Current Status", dataKey: "stage" },
        { header: "Created Date", dataKey: "createdAt" },
        { header: "Reason", dataKey: "reason" },
      ];

      const rows = stageOrders.map((order, i) => {
        let currentStageLabel = "";

        if (isFiltering && filterFrom && filterTo) {
          currentStageLabel =
            stageLabels[getStageForRange(order, filterFrom, filterTo)] || "";
        } else {
          currentStageLabel =
            stageLabels[getCurrentStageForToday(order)] || "";
        }

        return {
          sno: i + 1,
          orderId: order.orderId || "",
          companyName: order.companyName || "",
          name: order.name || "",
          phone: order.phone || "",
          email: order.email || "",
          designation: order.designation || "",
          grandTotal: ` Rs. ${Number(order.grandTotal).toLocaleString("en-IN")}`,
          vehicles: order.bookingItems?.length || 0,
          handler: order.handlername || "-",
          stage: currentStageLabel,
          createdAt: order.createdAt
            ? formatDateForDisplay(order.createdAt)
            : "",
          reason: order.reasonDescription || "-",
        };
      });

      autoTable(doc, {
        startY: 41,
        columns,
        body: rows,
        styles: {
          fontSize: 7.5,
          cellPadding: 2.5,
          halign: "center",
          valign: "middle",
        },
        headStyles: {
          fillColor: color,
          textColor: [255, 255, 255],
          fontStyle: "bold",
        },
      });

      // ===== SUMMARY TABLE =====
      const finalY = (doc.lastAutoTable?.finalY || 150) + 8;

      const summaryData = [
        ["Total Orders", String(stageOrders.length)],
        ["Total Vehicles", String(totalVehicles)],
        ["Total Amount", `  Rs. ${totalValue.toLocaleString("en-IN")}`],
      ];

      autoTable(doc, {
        startY: finalY,
        head: [["Description", "Value"]],
        body: summaryData,
        tableWidth: 80,
        margin: { left: 10 },
      });

      // ===== PDF NAME =====
      const pdfFilename =
        isFiltering && filterFrom && filterTo
          ? `RoadShowOrder_${stage.label.replace(/\s+/g, "_")}_${formatDateForFilename(filterFrom)}_to_${formatDateForFilename(filterTo)}.pdf`
          : `RoadShowOrder_${stage.label.replace(/\s+/g, "_")}_${formatDateForFilename(getTodayString())}.pdf`;

      const pdfBlob = doc.output("blob");
      zip.file(pdfFilename, pdfBlob);
    });

    // ===== ZIP NAME =====
    const zipFilename =
      isFiltering && filterFrom && filterTo
        ? `RoadShowOrder_Report_${formatDateForFilename(filterFrom)}_to_${formatDateForFilename(filterTo)}.zip`
        : `RoadShowOrder_Report_${formatDateForFilename(getTodayString())}.zip`;

    const zipBlob = await zip.generateAsync({ type: "blob" });

    saveAs(zipBlob, zipFilename);
  };


  const handleDownloadExcel = () => {
    const workbook = XLSX.utils.book_new();

    // Format date for display - 18/APR/2026 format
    const formatDateForDisplay = (dateStr) => {
      if (!dateStr) return "";
      const date = new Date(dateStr);
      const day = String(date.getDate()).padStart(2, "0");
      const monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
      const month = monthNames[date.getMonth()];
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    };
    
    // Format date with month name for filename
    const formatDateWithMonthName = (dateStr) => {
      if (!dateStr) return "";
      const date = new Date(dateStr);
      const day = String(date.getDate()).padStart(2, "0");
      const monthNames = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];
      const month = monthNames[date.getMonth()];
      const year = date.getFullYear();

      return `${day}_${month}_${year}`; 
    };

    const getYearRangeText = () => {
      if (isFiltering && filterFrom && filterTo) {
        const fromYear = new Date(filterFrom).getFullYear();
        const toYear = new Date(filterTo).getFullYear();

        return fromYear === toYear
          ? `(${fromYear})`
          : `(${fromYear} - ${toYear})`;
      } else {
        return `(${new Date().getFullYear()})`;
      }
    };
    
    // Style definitions with center alignment
    const headerStyle = {
      font: { bold: true, sz: 11, color: { rgb: "FFFFFF" } },
      fill: { fgColor: { rgb: "4472C4" } },
      alignment: { horizontal: "center", vertical: "center" },
      border: {
        top: { style: "thin", color: { rgb: "FFFFFF" } },
        bottom: { style: "thin", color: { rgb: "FFFFFF" } },
        left: { style: "thin", color: { rgb: "FFFFFF" } },
        right: { style: "thin", color: { rgb: "FFFFFF" } }
      }
    };
    
    const evenRowStyle = {
      fill: { fgColor: { rgb: "F8F9FA" } },
      alignment: { horizontal: "center", vertical: "center" }
    };
    
    const oddRowStyle = {
      fill: { fgColor: { rgb: "FFFFFF" } },
      alignment: { horizontal: "center", vertical: "center" }
    };
    
    const summaryLabelStyle = {
      font: { bold: true, sz: 11 },
      fill: { fgColor: { rgb: "E8F0FE" } },
      alignment: { horizontal: "center", vertical: "center" },
      border: {
        top: { style: "thin", color: { rgb: "D0D0D0" } },
        bottom: { style: "thin", color: { rgb: "D0D0D0" } },
        left: { style: "thin", color: { rgb: "D0D0D0" } },
        right: { style: "thin", color: { rgb: "D0D0D0" } }
      }
    };
    
    const summaryValueStyle = {
      font: { bold: true, sz: 11, color: { rgb: "1F4E79" } },
      fill: { fgColor: { rgb: "E8F0FE" } },
      alignment: { horizontal: "center", vertical: "center" },
      numFmt: "#,##0.00",
      border: {
        top: { style: "thin", color: { rgb: "D0D0D0" } },
        bottom: { style: "thin", color: { rgb: "D0D0D0" } },
        left: { style: "thin", color: { rgb: "D0D0D0" } },
        right: { style: "thin", color: { rgb: "D0D0D0" } }
      }
    };
    
    const sectionHeaderStyle = {
      font: { bold: true, sz: 12, color: { rgb: "1F4E79" } },
      fill: { fgColor: { rgb: "D6E4F0" } },
      alignment: { horizontal: "center", vertical: "center" }
    };
    
    let reportTitle = "";
    let reportSubtitle = "";
    
    if (isFiltering && filterFrom && filterTo) {
      reportTitle = `ROADSHOW ORDERS MANAGEMENT REPORT ${getYearRangeText()}`;
      reportSubtitle = `Period: ${formatDateForDisplay(filterFrom)} to ${formatDateForDisplay(filterTo)}`;
    } else {
      const today = getTodayString();
      reportTitle = `ROADSHOW ORDERS MANAGEMENT REPORT ${getYearRangeText()}`;
      reportSubtitle = `Date: ${formatDateForDisplay(today)}`;
    }

    stages.forEach((stage) => {
      const stageOrders = getOrdersByStage(stage.id);
      
      // Calculate summary data
      const totalValue = stageOrders.reduce((sum, o) => sum + (Number(o.grandTotal) || 0), 0);
      const totalVehicles = stageOrders.reduce((sum, o) => sum + (o.bookingItems?.length || 0), 0);
      
      // Create sheet data with styling information
      const sheetData = [];
      
      // Add title section with merge info
      sheetData.push([{ v: reportTitle, s: { font: { bold: true, sz: 16, color: { rgb: "1F4E79" } }, alignment: { horizontal: "center", vertical: "center" } } }]);
      sheetData.push([{ v: reportSubtitle, s: { font: { bold: true, sz: 12, color: { rgb: "4472C4" } }, alignment: { horizontal: "center", vertical: "center" } } }]);
      sheetData.push([{ v: `STATUS: ${stage.label.toUpperCase()}`, s: { font: { bold: true, sz: 14, color: { rgb: "FFFFFF" } }, fill: { fgColor: { rgb: "4472C4" } }, alignment: { horizontal: "center", vertical: "center" } } }]);
      sheetData.push([{ v: `Total Orders: ${stageOrders.length} | Total Value: ₹${totalValue.toLocaleString("en-IN")} | Total Vehicles: ${totalVehicles}`, s: { font: { bold: true, sz: 11 }, alignment: { horizontal: "center", vertical: "center" } } }]);
      sheetData.push([]); // Empty row for spacing
      
      // Check if there are no orders for this stage
      if (stageOrders.length === 0) {
        // Add "NO ORDER" message
        sheetData.push([{ v: "NO ORDER", s: { font: { bold: true, sz: 20, color: { rgb: "FF0000" } }, alignment: { horizontal: "center", vertical: "center" } } }]);
        sheetData.push([]); // Empty row
        
        // Convert to worksheet
        const worksheet = XLSX.utils.aoa_to_sheet(sheetData);
        
        // Set column widths
        worksheet['!cols'] = [{ wch: 50 }];
        
        // Set row heights
        worksheet['!rows'] = [
          { hpt: 35 },  // Title row
          { hpt: 25 },  // Subtitle row
          { hpt: 30 },  // Stage header
          { hpt: 25 },  // Summary line
          { hpt: 10 },  // Empty row
          { hpt: 60 }   // No order message row
        ];
        
        // Add merge configurations for all rows
        if (!worksheet['!merges']) worksheet['!merges'] = [];
        
        const mergeRefs = ['A1:A1', 'A2:A2', 'A3:A3', 'A4:A4', 'A6:A6'];
        mergeRefs.forEach(ref => {
          const range = XLSX.utils.decode_range(ref);
          worksheet['!merges'].push(range);
        });
        
        const sheetName = stage.label.replace(/\s+/g, '').substring(0, 31);
        XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
        return; // Skip the rest of the code for this stage
      }
      
      // Table Headers with styling
      const headers = [
        { v: "S.No", s: headerStyle },
        { v: "Order ID", s: headerStyle },
        { v: "Company Name", s: headerStyle },
        { v: "Contact Person", s: headerStyle },
        { v: "Phone", s: headerStyle },
        { v: "Email", s: headerStyle },
        { v: "Designation", s: headerStyle },
        { v: "Grand Total (₹)", s: { ...headerStyle, alignment: { horizontal: "center", vertical: "center" } } },
        { v: "Vehicles", s: { ...headerStyle, alignment: { horizontal: "center", vertical: "center" } } },
        { v: "Handler Name", s: headerStyle },
        { v: "Current Status", s: headerStyle },
        { v: "Created Date", s: headerStyle },
        { v: "Reason", s: headerStyle }
      ];
      
      sheetData.push(headers);
      
      // Table Rows with center alignment
      stageOrders.forEach((order, index) => {
        let currentStageLabel = "";
        if (isFiltering && filterFrom && filterTo) {
          currentStageLabel = stageLabels[getStageForRange(order, filterFrom, filterTo)] || "";
        } else {
          currentStageLabel = stageLabels[getCurrentStageForToday(order)] || "";
        }
        
        const rowStyle = index % 2 === 0 ? evenRowStyle : oddRowStyle;
        const stageColor = getStageColorForExcel(currentStageLabel);
        
        const row = [
          { v: index + 1, s: { ...rowStyle, alignment: { horizontal: "center", vertical: "center" } } },
          { v: order.orderId || "", s: { ...rowStyle, alignment: { horizontal: "center", vertical: "center" } } },
          { v: order.companyName || "", s: { ...rowStyle, font: { bold: true }, alignment: { horizontal: "center", vertical: "center" } } },
          { v: order.name || "", s: { ...rowStyle, alignment: { horizontal: "center", vertical: "center" } } },
          { v: order.phone || "", s: { ...rowStyle, alignment: { horizontal: "center", vertical: "center" } } },
          { v: order.email || "", s: { ...rowStyle, alignment: { horizontal: "center", vertical: "center" } } },
          { v: order.designation || "", s: { ...rowStyle, alignment: { horizontal: "center", vertical: "center" } } },
          { v: `₹ ${Number(order.grandTotal).toLocaleString("en-IN") || 0}`, s: { ...rowStyle, alignment: { horizontal: "center", vertical: "center" }, numFmt: "#,##0.00" } },
          { v: order.bookingItems?.length || 0, s: { ...rowStyle, alignment: { horizontal: "center", vertical: "center" } } },
          { v: order.handlername || "—", s: { ...rowStyle, alignment: { horizontal: "center", vertical: "center" } } },
          { v: currentStageLabel, s: { ...rowStyle, font: { color: { rgb: stageColor }, bold: true }, alignment: { horizontal: "center", vertical: "center" } } },
          { v: order.createdAt ? formatDateForDisplay(order.createdAt) : "", s: { ...rowStyle, alignment: { horizontal: "center", vertical: "center" } } },
          { v: order.reasonDescription || "—", s: { ...rowStyle, alignment: { horizontal: "center", vertical: "center" } } }
        ];
        
        sheetData.push(row);
      });
      
      sheetData.push([]); 
      
      // Summary Section with center alignment
      sheetData.push([{ v: "SUMMARY", s: { ...sectionHeaderStyle, alignment: { horizontal: "center", vertical: "center" } } }]);
      sheetData.push([{ v: "", s: {} }]);
      
      const summaryRows = [
        [{ v: "Total Orders", s: { ...summaryLabelStyle, alignment: { horizontal: "center", vertical: "center" } } }, 
         { v: stageOrders.length, s: { ...summaryValueStyle, alignment: { horizontal: "center", vertical: "center" } } }],
        [{ v: "Total Vehicles", s: { ...summaryLabelStyle, alignment: { horizontal: "center", vertical: "center" } } }, 
         { v: totalVehicles, s: { ...summaryValueStyle, alignment: { horizontal: "center", vertical: "center" } } }],
        [{ v: "Total Amount (₹)", s: { ...summaryLabelStyle, alignment: { horizontal: "center", vertical: "center" } } }, 
         { v: `₹ ${Number(totalValue).toLocaleString("en-IN")}`, s: { ...summaryValueStyle, alignment: { horizontal: "center", vertical: "center" }, numFmt: "#,##0.00" } }],
      ];
      
      summaryRows.forEach(row => sheetData.push(row));
      
      // Convert to worksheet
      const worksheet = XLSX.utils.aoa_to_sheet(sheetData);
      
      // Set column widths
      worksheet['!cols'] = [
        { wch: 8 },   // S.No
        { wch: 18 },  // Order ID
        { wch: 30 },  // Company Name
        { wch: 22 },  // Contact Person
        { wch: 15 },  // Phone
        { wch: 30 },  // Email
        { wch: 18 },  // Designation
        { wch: 20 },  // Grand Total
        { wch: 12 },  // Vehicles
        { wch: 20 },  // Handler Name
        { wch: 18 },  // Current Stage
        { wch: 18 },  // Created Date
        { wch: 35 }   // Reason
      ];
      
      // Set row heights
      worksheet['!rows'] = [
        { hpt: 35 },  // Title row
        { hpt: 25 },  // Subtitle row
        { hpt: 30 },  // Stage header
        { hpt: 25 },  // Summary line
        { hpt: 10 },  // Empty row
        { hpt: 28 }   // Table headers
      ];
      
      // Add merge configurations for title rows
      if (!worksheet['!merges']) worksheet['!merges'] = [];
      
      const titleMergeRefs = ['A1:M1', 'A2:M2', 'A3:M3', 'A4:M4'];
      titleMergeRefs.forEach(ref => {
        const range = XLSX.utils.decode_range(ref);
        worksheet['!merges'].push(range);
      });
      
      // Add borders to table
      const tableStartRow = 5; // After headers and empty rows
      const tableEndRow = tableStartRow + stageOrders.length;
      const tableStartCol = 0;
      const tableEndCol = 12;
      
      for (let row = tableStartRow; row <= tableEndRow; row++) {
        for (let col = tableStartCol; col <= tableEndCol; col++) {
          const cellRef = XLSX.utils.encode_cell({ r: row, c: col });
          if (worksheet[cellRef]) {
            worksheet[cellRef].s = {
              ...worksheet[cellRef].s,
              border: {
                top: { style: "thin", color: { rgb: "D0D0D0" } },
                bottom: { style: "thin", color: { rgb: "D0D0D0" } },
                left: { style: "thin", color: { rgb: "D0D0D0" } },
                right: { style: "thin", color: { rgb: "D0D0D0" } }
              }
            };
          }
        }
      }
      
      const sheetName = stage.label.replace(/\s+/g, '').substring(0, 31);
      XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
    });
    
    // Generate filename
    const today = getTodayString();
    const formattedToday = formatDateWithMonthName(today);
    
    let filename;
    if (isFiltering) {
      const formattedFrom = formatDateWithMonthName(filterFrom);
      const formattedTo = formatDateWithMonthName(filterTo);
      filename = `RoadShowOrder_Report_${formattedFrom}_to_${formattedTo}.xlsx`;
    } else {
      filename = `RoadShowOrder_Report_${formattedToday}.xlsx`;
    }
    
    XLSX.writeFile(workbook, filename);
  };
  
  // ─────────────────────────────────────────────────────────────────────────
  // Excel Styling Helper Functions
  // ─────────────────────────────────────────────────────────────────────────

  // Header style for table columns
  const headerStyle = {
    font: { bold: true, sz: 11, color: { rgb: "FFFFFF" } },
    fill: { fgColor: { rgb: "4472C4" } },
    alignment: { horizontal: "center", vertical: "center", wrapText: true },
    border: {
      top: { style: "thin", color: { rgb: "FFFFFF" } },
      bottom: { style: "thin", color: { rgb: "FFFFFF" } },
      left: { style: "thin", color: { rgb: "FFFFFF" } },
      right: { style: "thin", color: { rgb: "FFFFFF" } }
    }
  };

  // Alternating row styles
  const evenRowStyle = {
    fill: { fgColor: { rgb: "F2F2F2" } },
    alignment: { vertical: "center" }
  };

  const oddRowStyle = {
    fill: { fgColor: { rgb: "FFFFFF" } },
    alignment: { vertical: "center" }
  };

  // Section header style
  const sectionHeaderStyle = {
    font: { bold: true, sz: 13, color: { rgb: "FFFFFF" } },
    fill: { fgColor: { rgb: "2E75B6" } },
    alignment: { horizontal: "left", vertical: "center" },
    border: {
      bottom: { style: "medium", color: { rgb: "1F4E79" } }
    }
  };

  // Summary label style
  const summaryLabelStyle = {
    font: { bold: true, sz: 11 },
    fill: { fgColor: { rgb: "E7E6E6" } },
    alignment: { horizontal: "left", vertical: "center" },
    border: {
      bottom: { style: "thin", color: { rgb: "BFBFBF" } }
    }
  };

  // Summary value style
  const summaryValueStyle = {
    font: { sz: 11 },
    alignment: { horizontal: "right", vertical: "center" },
    border: {
      bottom: { style: "thin", color: { rgb: "BFBFBF" } }
    }
  };

  // Get stage color for Excel
  const getStageColorForExcel = (stageLabel) => {
    const colorMap = {
      "New Order": "2196F3",     // Blue
      "Proposal": "FF9800",      // Orange
      "Negotiation": "9C27B0",   // Purple
      "Closed Won": "4CAF50",    // Green
      "Closed Loss": "F44336"    // Red
    };
    return colorMap[stageLabel] || "000000";
  };

  // Format date with month name for filename
  const formatDateWithMonthName = (dateStr) => {
    const date = new Date(dateStr);
    const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", 
                    "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
    const year = date.getFullYear();
    const month = months[date.getMonth()];
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const handleApplyFilter = () => {
    if (!filterFrom || !filterTo) {
      alert("Please select both From and To dates.");
      return;
    }
    if (new Date(filterFrom) > new Date(filterTo)) {
      alert("From date cannot be after To date.");
      return;
    }
    setIsFiltering(true);
  };

  const handleClearFilter = () => {
    setFilterFrom("");
    setFilterTo("");
    setIsFiltering(false);
  };

  const isSubmitEnabled = () => {
    const { handlername, reasonDescription, showReason } = swipeModal;
    const hasSwipe = handlername.trim().length > 0;
    const hasReason = reasonDescription.trim().length > 0;
    const swipeAlreadySaved = !!(
      orders.find((o) => o._id === swipeModal.orderId)?.handlername
    );
    if (showReason) {
      if (swipeAlreadySaved) return hasReason;
      return hasSwipe && hasReason;
    }
    return hasSwipe;
  };

  const onDragEnd = async (result) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;

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
    await updatePipeline(orderId, newStage, oldStage, null, null);
  };

  const updatePipeline = async (
    orderId,
    newStage,
    oldStage,
    handlername,
    reasonDescription
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
      orderId,
      newStage,
      oldStage,
      handlername,
      reasonDescription,
      showReason,
    } = swipeModal;

    const swipeAlreadySaved = !!(
      orders.find((o) => o._id === orderId)?.handlername
    );

    if (!swipeAlreadySaved && !handlername.trim()) {
      setSwipeModal((p) => ({ ...p, error: "Please enter Handler name" }));
      return;
    }
    if (showReason && !reasonDescription.trim()) {
      setSwipeModal((p) => ({
        ...p,
        error: "Please enter reason description",
      }));
      return;
    }

    setSwipeModal({
      open: false,
      orderId: null,
      newStage: null,
      oldStage: null,
      handlername: "",
      reasonDescription: "",
      showReason: false,
      error: "",
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
      open: false,
      orderId: null,
      newStage: null,
      oldStage: null,
      handlername: "",
      reasonDescription: "",
      showReason: false,
      error: "",
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "newOrder":    return "badge-new";
      case "proposal":    return "badge-proposal";
      case "negotiation": return "badge-negotiation";
      case "closedWon":   return "badge-won";
      case "closedLoss":  return "badge-loss";
      default:            return "badge-default";
    }
  };

  return (
    <>
      {/* ── Date Filter Bar ────────────────────────────────────────────── */}
      <div className="filter-bar">
        <div className="filter-group">
          <label className="filter-label">From Date</label>
          <input
            type="date"
            className="filter-input"
            value={filterFrom}
            onChange={(e) => {
              setFilterFrom(e.target.value);
              setIsFiltering(false);
            }}
          />
        </div>
        <div className="filter-group">
          <label className="filter-label">To Date</label>
          <input
            type="date"
            className="filter-input"
            value={filterTo}
            onChange={(e) => {
              setFilterTo(e.target.value);
              setIsFiltering(false);
            }}
          />
        </div>
        <button className="order_applys-filter" onClick={handleApplyFilter}>
          Apply Filter
        </button>
        {isFiltering && (
          <button className="btn-filter-clear" onClick={handleClearFilter}>
            Clear Filter
          </button>
        )}
        
        <button 
          className="btn-excel-downloads" 
          onClick={handleDownloadExcel}

        >
          📊 Download Excel
        </button>
        
        <button 
          className="btn-excel-downloads-pdf" 
          onClick={handleDownloadPDF}
        >
          📄 Download PDF
        </button>
      </div>

      {/* ── Pipeline Board ─────────────────────────────────────────────── */}
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="pipeline-container">
          {stages.map((stage) => {
            const stageOrders = getOrdersByStage(stage.id);
            return (
              <Droppable droppableId={stage.id} key={stage.id} type="ORDER">
                {(provided) => (
                  <div
                    className="pipeline-column"
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                  >
                    <h3>
                      {stage.label}
                      <span className="stage-count">{stageOrders.length}</span>
                    </h3>

                    <div className="orders-list">
                      {stageOrders.length === 0 && (
                        <div className="empty-stage">
                          <p>No orders</p>
                        </div>
                      )}

                      {stageOrders.map((order, index) => (
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
                                  <span className="swipe-name-tag">
                                    {order.handlername}
                                  </span>
                                )}
                              </div>
                              <h4 className="company-name">{order.companyName}</h4>
                              <p className="contact-name">{order.name}</p>
                              <div className="order-price">
                                ₹ {Number(order.grandTotal).toLocaleString("en-IN")}
                              </div>
                              <div className="order-meta">
                                <span>{order.bookingItems.length} Vehicles</span>
                              </div>
                              {isFiltering && filterFrom && filterTo && (
                                <div className="filtered-stage-note">
                                  <span
                                    className={`status-badge ${getStatusColor(
                                      getStageForRange(order, filterFrom, filterTo)
                                    )}`}
                                  >
                                    {stageLabels[getStageForRange(order, filterFrom, filterTo)]}
                                  </span>
                                </div>
                              )}
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  </div>
                )}
              </Droppable>
            );
          })}
        </div>
      </DragDropContext>

      {/* ── Swipe Modal ─────────────────────────────────────────────────── */}
      {swipeModal.open &&
        (() => {
          const swipeAlreadySaved = !!(
            orders.find((o) => o._id === swipeModal.orderId)?.handlername
          );
          const submitEnabled = isSubmitEnabled();

          return (
            <div className="order-popup-overlay">
              <div className="order-popup swipe-modal">
                <div className="popup-header">
                  <h2>
                    {swipeModal.showReason
                      ? "Closed Loss Details"
                      : "Handler Name"}
                  </h2>
                  <button className="close-btn" onClick={handleSwipeCancel}>
                    ✕
                  </button>
                </div>
                <div className="popup-section">
                  <p className="swipe-modal-desc">
                    Moving to <b>{stageLabels[swipeModal.newStage]}</b>
                  </p>
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
                            ...p,
                            handlername: e.target.value,
                            error: "",
                          }))
                        }
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && submitEnabled)
                            handleSwipeConfirm();
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
                            ...p,
                            reasonDescription: e.target.value,
                            error: "",
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

      {/* ── Order Detail Popup ──────────────────────────────────────────── */}
      {selectedOrder && (
        <div className="order-popup-overlay">
          <div className="order-popup">
            <div className="popup-header">
              <div className="popup-header-left">
                <div className="popup-title-row">
                  <h2>Order Details</h2>
                  {selectedOrder.handlername && (
                    <span className="handler-badge">
                      🙋 {selectedOrder.handlername}
                    </span>
                  )}
                </div>
              </div>
              <button
                className="close-btn"
                onClick={() => setSelectedOrder(null)}
              >
                ✕
              </button>
            </div>

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
                <span
                  className={`status-badge ${getStatusColor(
                    getDisplayStageForOrder(selectedOrder)
                  )}`}
                >
                  {stageLabels[getDisplayStageForOrder(selectedOrder)]}
                </span>
              </p>
            </div>

            {/* ── Negotiation History (NEW) ──────────────────────── */}
            {selectedOrder.negotiationLogs &&
              selectedOrder.negotiationLogs.length > 0 && (
                <div className="popup-section">
                  <h3>Negotiation History</h3>
                  <div className="history-container">
                    {selectedOrder.negotiationLogs
                      .slice()
                      .reverse()
                      .map((log, index) => (
                        <div className="history-item" key={index}>
                          <div
                            className={`history-dot ${getStatusColor("negotiation")}`}
                          />
                          <div className="history-content">
                            <p>
                              <b>
                                {log.fromStage
                                  ? stageLabels[log.fromStage]
                                  : "Start"}
                              </b>
                              {" → "}
                              <b>{stageLabels[log.toStage]}</b>
                            </p>
                            <p
                              style={{
                                color: "var(--color-text-success, #1a7a4a)",
                                fontWeight: 500,
                                margin: "2px 0",
                              }}
                            >
                              Negotiated Amount: ₹{" "}
                              {Number(log.amount).toLocaleString("en-IN")}
                            </p>
                            <span>
                              {log.movedBy} •{" "}
                              {formatDateTimeCustom(log.movedAt)}
                            </span>
                          </div>
                        </div>
                      ))}
                  </div>

                  {/* Grand Negotiation Total summary */}
                  <div
                    style={{
                      marginTop: 10,
                      padding: "8px 12px",
                      background: "var(--color-background-secondary)",
                      borderRadius: 6,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span style={{ fontWeight: 500 }}>
                      Current Negotiation Total
                    </span>
                    <span style={{ fontWeight: 600, fontSize: 15 }}>
                      ₹{" "}
                      {Number(
                        selectedOrder.grandNegotiationTotal
                      ).toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>
              )}

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
                            </b>
                            {" → "}
                            <b>{stageLabels[log.toStage]}</b>
                          </p>
                          <span>
                            {log.movedBy} •{" "}
                            {formatDateTimeCustom(log.movedAt)}
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
                    <th>Total Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedOrder.bookingItems.map((item) => (
                    <tr key={item._id}>
                      <td>{item.vehicleModel}</td>
                      <td>{item.city}</td>
                      <td>{item.quantity}</td>
                      <td>{formatDateTimeCustom(item.fromDate)}</td>
                      <td>{formatDateTimeCustom(item.toDate)}</td>
                      <td>{item.totalDays}</td>
                      <td>₹ {Number(item.pricePerDay).toLocaleString("en-IN")}</td>
                      <td>₹ {Number(item.totalAmount).toLocaleString("en-IN")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="popup-footer">
              <h3>
                Total Amount : ₹{" "}
                {Number(selectedOrder.grandTotal).toLocaleString("en-IN")}
              </h3>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Ad1OrdersManagement;