import React, { useState, useContext, useEffect } from 'react';
import './ad1Manage.css';
import Calendar from './adNewCalender';
// import { CategoryContext } from './ad1';
// import { useSpot } from '../components/B0SpotContext';
import { useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
//BASE URL OF http://localhost:3001 FILE IMPORT 
import { baseUrl } from './BASE_URL';
function AdManageSection() {
    //Start rating board
    const RatingStars = ({ rating }) => {
        const fullStars = Math.floor(rating);
        const halfStar = rating % 1 !== 0;
        const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
        return (
            <div className='Product-rating-star'>
                {[...Array(fullStars)].map((_, index) => (
                    <span key={index} className="fa-solid fa-star Product-stars1"></span>
                ))}
                {halfStar && <span className="fa-solid fa-star-half-alt Product-stars1"></span>}
                {[...Array(emptyStars)].map((_, index) => (
                    <span key={index} className="fa-solid fa-star Product-empty-star1 Product-stars1"></span>
                ))}
            </div>
        );
    };
    // PRODUCT RATING SECTION 
    const RatingStars1 = ({ rating }) => {
        const fullStars = Math.floor(rating);
        const halfStar = rating % 1 !== 0;
        const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
        return (
            <div>
                <div className='Product-rating-star1'>
                    {[...Array(fullStars)].map((_, index) => (
                        <span key={index} className="fa-solid fa-star Product-stars1"></span>
                    ))}
                    {halfStar && <span className="fa-solid fa-star-half-alt Product-stars1"></span>}
                    {[...Array(emptyStars)].map((_, index) => (
                        <span key={index} className="fa-solid fa-star Product-empty-star1 Product-stars1"></span>
                    ))}
                </div>
                <div>

                </div>
            </div>

        );
    };

    // ERROR HANDLING MESSAGE 
    const [errors, setErrors] = useState({
        clientName: false,
        clientEmail: false,
        clientContact: false,
        clientCompany: false,
        clientPaidAmount: false
    });

    const validateForm = () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const newErrors = {
            clientName: !clientName,
            clientEmail: !clientEmail || !emailRegex.test(clientEmail),
            clientContact: !clientContact || clientContact.toString().length !== 10,
            clientCompany: !clientCompany,
            clientPaidAmount: !clientPaidAmount
        };

        setErrors(newErrors);
        return !Object.values(newErrors).some(error => error);
    };

    // PRODUCTS FETCH AND AUTOFILL FROM DATABASE 
    const [products, setProducts] = useState([]);
    const [clientName, setClientName] = useState("");
    const [clientEmail, setClientEmail] = useState("");
    const [clientContact, setClientContact] = useState("");
    const [clientCompany, setClientCompany] = useState("");
    const [clientPaidAmount, setClientPaidAmount] = useState("");
    const [productImage, setProductImage] = useState("");
    const [productName, setProductName] = useState("");
    const [productAmount, setProductAmount] = useState("");
    const [productID, setProductId] = useState("");
    const [prodLighting, setProdLighting] = useState("");
    const [productFrom, setProductFrom] = useState("");
    const [productTo, setProductTo] = useState("");
    const [productPrintingCost, setProductPrintingCost] = useState("");
    const [productMountingCost, setProductMountingCost] = useState("");
    const [productFixedAmount, setProductFixedAmount] = useState('999');
    const [productFixedAmountOffer, setProductFixedAmountOffer] = useState('5');

    // Rating section 
    const [prodRating, setProdRating] = useState(0);
    const handleRatingChange = (value) => {
        // Convert the value to a valid number, ensuring it remains within 0-5 range
        let newRating = parseFloat(value);
        if (newRating >= 0 && newRating <= 5) {
            setProdRating(newRating);
        }
    };
    // Product Size calculation 
    const [prodwidth, setProdWidth] = useState('');
    const [prodheight, setProdHeight] = useState('');
    // Calculate square feet
    const ProdSquareFeet = () => {
        const width = parseFloat(prodwidth) || 0;
        const height = parseFloat(prodheight) || 0;
        return (width * height).toFixed(2);
    };

    const [prodType, setProdType] = useState("");
    const [selectedState, setSelectedState] = useState("");
    const [selectedDistrict, setSelectedDistrict] = useState("");
   // const { initialStateDistricts, initialMediaTypes, toggleStateDropdown, handleStateClick, handleDistrictClick, stateDistricts, setStateDistricts, mediaTypes, setMediaTypes, showDistricts, setShowDistricts, showStates, setShowStates } = useSpot();
    //FETCH PRDOCUTS FROM DATABASE USING USEEFFECT
    // Add these state variables
    const [errorMessage, setErrorMessage] = useState('');
    const [showError, setShowError] = useState(false);
    // Add this state variable at the top of your component
    const [isSaving, setIsSaving] = useState(false);
    useEffect(() => {
        fetch(`${baseUrl}/products`)
            .then((response) => response.json())
            .then((data) => {
                const productsWithVisibility = data.map((product) => ({
                    ...product,
                    visible: product.visible !== false, // fallback to true
                }));
                setProducts(productsWithVisibility.sort((a, b) => b.visible - a.visible));
            });
    }, []);
    const fetchProductById = (code) => {
        const cleanedInput = code.replace(/^#/, '').trim().toLowerCase();
        // Reset all fields first
        setProductImage("");
        setProductName("");
        setProductAmount("");
        setProductPrintingCost("");
        setProductMountingCost("");
        setClientPaidAmount("");
        setProdLighting("");
        setProductFrom("");
        setProductTo("");
        setProdRating(0);
        setProdWidth("");
        setProdHeight("");
        setProductFixedAmount('');
        setProductFixedAmountOffer('');
        setProdType("");
        setSelectedState("");
        setSelectedDistrict("");
        const product = products.find(p => {
            // Handle missing prodCode and normalize
            const prodCode = p.prodCode || '';
            const cleanedProdCode = prodCode.replace(/^#/, '').trim().toLowerCase();
            return cleanedProdCode === cleanedInput;
        });


        if (product) {
            setProductImage(product.image || "");
            setProductName(product.name || "");
            setProductAmount(product.price?.toString() || "");
            setProductPrintingCost(product.printingCost?.toString() || "");
            setProductMountingCost(product.mountingCost?.toString() || "");
            setProdLighting(product.lighting || "");
            setProductFrom(product.from || "");
            setProductTo(product.to || "");
            setProdRating(product.rating || 0);
            setProdWidth(product.width?.toString() || "");
            setProdHeight(product.height?.toString() || "");
            setProductFixedAmount(product.fixedAmount?.toString() || "");
            setProductFixedAmountOffer(product.fixedOffer?.toString() || "");
            setProdType(product.mediaType || "");
            setSelectedState(product.location?.state || "");
            setSelectedDistrict(product.location?.district || "");
            setShowError(false); // Hide any existing errors
        } else {
            setErrorMessage('Product not found!');
            setShowError(true);
            // Auto-hide after 2 seconds
            setTimeout(() => setShowError(false), 2000);
        }
    };

    // Optional: Add typeahead search
    const [searchSuggestions, setSearchSuggestions] = useState([]);

    const handleProductIdChange = (e) => {
        const id = e.target.value;
        setProductId(id);

        // Show suggestions
        const matches = products.filter(p => {
            const code = (p.prodCode || '').toLowerCase();
            return code.includes(id.toLowerCase().replace(/^#/, ''));
        });
        setSearchSuggestions(matches);

        // Existing fetch logic
        if (id.length > 0) fetchProductById(id);
    };


    // Replace hardcoded bookedDates with fetched data
    const [bookedDates, setBookedDates] = useState([]);
    const [isCalendarOpen, setIsCalendarOpen] = useState(false); // State to toggle calendar
    // const [currentMonth, setCurrentMonth] = useState(new Date(2025, 2)); // Start with March 2025
    const today = new Date();
    const [currentMonth, setCurrentMonth] = useState(new Date()); // Start with March 2025

    // Add date validation for past dates
    const isPastDate = (date) => {
        const today = new Date();
        today.setUTCHours(0, 0, 0, 0);
        const normalizedDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
        return normalizedDate < today;
    };

    // Campaign Date Selection
    const [selectedDates, setSelectedDates] = useState({ start: null, end: null });
    const [confirmedDates, setConfirmedDates] = useState({}); // To store confirmed dates
    console.log(selectedDates);
    console.log("NEW SELECTED START DATE", selectedDates.start);
    // console.log(" SELECTED START DATE" , selectedDates.start.toISOString());
    const formattedStartDate = selectedDates.start; // Stores full date in ISO format
    const formattedEndDate = selectedDates.end;
    console.log("NEW START DATE", formattedStartDate);
    console.log("NEW  END DATE", formattedEndDate);
    const generateMonth = (monthDate) => {
        const year = monthDate.getFullYear();
        const month = monthDate.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startDay = firstDay.getDay();
        const days = [];
        // Fill empty days
        for (let i = 0; i < startDay; i++) {
            days.push(null);
        }

        // Fill actual days
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);
            days.push(date);
        }
        // Fill remaining days
        while (days.length < 42) days.push(null);
        return days;
    };
    const handleDateClick = (date) => {
        if (!date || isNaN(date.getTime())) return;

        // Create date without time component
        const normalizedDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
        // Check if date is booked or in the past
        const isBooked = bookedDates.some(d =>
            d.getUTCFullYear() === normalizedDate.getUTCFullYear() &&
            d.getUTCMonth() === normalizedDate.getUTCMonth() &&
            d.getUTCDate() === normalizedDate.getUTCDate()
        );

        const isPast = isPastDate(normalizedDate);

        if (isBooked || isPast) return;
        if (bookedDates.some(d =>
            d.getUTCFullYear() === normalizedDate.getUTCFullYear() &&
            d.getUTCMonth() === normalizedDate.getUTCMonth() &&
            d.getUTCDate() === normalizedDate.getUTCDate()
        )) return;

        if (!selectedDates.start || selectedDates.end) {
            setSelectedDates({ start: normalizedDate, end: null });
        } else {
            if (normalizedDate < selectedDates.start) {
                setSelectedDates({ start: normalizedDate, end: selectedDates.start });
            } else {
                setSelectedDates({ start: selectedDates.start, end: normalizedDate });
            }
        }
    };
    const resetDates = () => {
        setSelectedDates({ start: null, end: null });
        setConfirmedDates({ start: null, end: null }); // Reset confirmed dates

    };

    // UPDATED DATE CLASS CALCULATION
    const getDateSelectionClass = (date) => {
        if (!date || isNaN(date.getTime())) return "disabled";


        const normalizedDate = new Date(Date.UTC(
            date.getFullYear(),
            date.getMonth(),
            date.getDate()
        ));

        // Check if date is booked
        const isBooked = bookedDates.some(d =>
            d.getUTCFullYear() === normalizedDate.getUTCFullYear() &&
            d.getUTCMonth() === normalizedDate.getUTCMonth() &&
            d.getUTCDate() === normalizedDate.getUTCDate()
        );

        if (isBooked) return "booked";
        if (isPastDate(normalizedDate)) return "past";

        const dateString = date.toISOString().split('T')[0];
        const utcDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
        const startUTC = selectedDates.start ? new Date(Date.UTC(
            selectedDates.start.getFullYear(),
            selectedDates.start.getMonth(),
            selectedDates.start.getDate()
        )) : null;

        const endUTC = selectedDates.end ? new Date(Date.UTC(
            selectedDates.end.getFullYear(),
            selectedDates.end.getMonth(),
            selectedDates.end.getDate()
        )) : null;

        if (bookedDates.some(d =>
            d.getUTCFullYear() === utcDate.getUTCFullYear() &&
            d.getUTCMonth() === utcDate.getUTCMonth() &&
            d.getUTCDate() === utcDate.getUTCDate()
        )) return "booked";

        if (startUTC && utcDate.getTime() === startUTC.getTime()) return "selected-start";
        if (endUTC && utcDate.getTime() === endUTC.getTime()) return "selected-end";
        if (startUTC && endUTC && utcDate > startUTC && utcDate < endUTC) {
            return "selected-range";
        }

        return "";
    };

    const goToNextMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
    };
    const goToPreviousMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
    };

    // Calculate total price dynamically when start and end dates are selected
    const pricePerDay = productAmount || 0; // Ensure pricePerDay is defined
    const getAvailableDaysInRange = (start, end) => {
        if (!start || !end || isNaN(start.getTime()) || isNaN(end.getTime())) {
            return [];
        }
        const days = [];
        const current = new Date(start);
        // Normalize to UTC midnight for accurate comparison
        const normalizeDate = (date) => {
            return Date.UTC(
                date.getFullYear(),
                date.getMonth(),
                date.getDate()
            );
        };

        // Create Set of booked dates in UTC
        const bookedUTCDates = new Set(
            bookedDates.map(d => normalizeDate(d))
        );
        while (current <= end) {
            // Check if current date is not booked
            const currentUTC = normalizeDate(current);
            if (!bookedUTCDates.has(currentUTC)) {
                days.push(new Date(current));
            }
            current.setDate(current.getDate() + 1);
        }

        return days;
    };
    const availableDays =
        selectedDates.start && selectedDates.end
            ? getAvailableDaysInRange(selectedDates.start, selectedDates.end)
            : [];
    const totalDays = availableDays.length;
    const totalPrice = totalDays * pricePerDay;
    console.log(totalPrice);
    console.log(totalDays);
    //CALENDER SMALL SCREENS
    // UPDATED DATE CONFIRMATION
    const confirmDates = () => {
        if (selectedDates.start && selectedDates.end) {
            // Normalize dates to UTC midnight
            const startUTC = new Date(Date.UTC(
                selectedDates.start.getFullYear(),
                selectedDates.start.getMonth(),
                selectedDates.start.getDate()));
            const endUTC = new Date(Date.UTC(
                selectedDates.end.getFullYear(),
                selectedDates.end.getMonth(),
                selectedDates.end.getDate()));
            setConfirmedDates({ start: startUTC, end: endUTC });
            setIsCalendarOpen(false);
        }
    };
    const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth <= 991);
    useEffect(() => {
        const handleResize = () => {
            setIsSmallScreen(window.innerWidth <= 991);
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const [productsOrderData, setProductsOrderData] = useState([]);
    const [editOrder, setEditOrder] = useState(null);
    // const [bookedDates, setBookedDates] = useState([]);

    useEffect(() => {
        const fetchBookedDates = async () => {
            try {
                // Include current order ID in exclusion if editing
                const url = editOrder
                    ? `${baseUrl}/booked-dates?excludeOrderId=${editOrder._id}`
                    : `${baseUrl}/booked-dates`;

                const res = await fetch(url);
                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }

                const data = await res.json();

                // Ensure data is an array before mapping
                if (!Array.isArray(data)) {
                    throw new Error('Invalid data format received');
                }

                // Safely parse dates
                const parsedDates = data
                    .map(d => {
                        try {
                            return new Date(d);
                        } catch (e) {
                            console.warn('Invalid date format:', d);
                            return null;
                        }
                    })
                    .filter(date => date instanceof Date && !isNaN(date));

                setBookedDates(parsedDates);
            } catch (err) {
                console.error('Error fetching booked dates:', err);
                setBookedDates([]); // Reset to empty array on error
            }
        };

        fetchBookedDates();
    }, [editOrder]); // Add editOrder to dependency array if needed

    useEffect(() => {
        if (editOrder) {
            // UPDATED DATE PARSING FUNCTION
            const parseDate = (dateString) => {
                if (!dateString) return null;
                // Handle UTC dates consistently
                if (dateString.includes('T')) {
                    const dt = new Date(dateString);
                    return new Date(Date.UTC(dt.getUTCFullYear(), dt.getUTCMonth(), dt.getUTCDate()));
                }
                const parts = dateString.split('-');
                if (parts.length === 3) {
                    return new Date(Date.UTC(
                        parseInt(parts[0]),
                        parseInt(parts[1]) - 1,
                        parseInt(parts[2])
                    ));
                }

                return null;
            };
            const startDate = parseDate(editOrder.booking?.startDate);
            const endDate = parseDate(editOrder.booking?.endDate);
            if (startDate && endDate && !isNaN(startDate.getTime()) && !isNaN(endDate.getTime())) {
                // Ensure dates are ordered correctly
                const orderedDates = startDate > endDate ?
                    { start: endDate, end: startDate } :
                    { start: startDate, end: endDate };
                setSelectedDates(orderedDates);
                setConfirmedDates(orderedDates);
            }
            // Populate all form fields with the editOrder data
            setClientName(editOrder.client.name || "");
            setClientEmail(editOrder.client.email || "");
            setClientContact(editOrder.client.contact || "");
            setClientCompany(editOrder.client.company || "");
            setClientPaidAmount(editOrder.client.paidAmount || "");
            setProductId(editOrder.product.id || "");
            setProductName(editOrder.product.name || "");
            setProductImage(editOrder.product.image || "");
            setProductAmount(editOrder.product.price?.toString() || "");
            setProductPrintingCost(editOrder.product.printingCost?.toString() || "");
            setProductMountingCost(editOrder.product.mountingCost?.toString() || "");
            setProdLighting(editOrder.product.lighting || "");
            setProdWidth(editOrder.product.size.width?.toString() || 0);
            setProdHeight(editOrder.product.size.height?.toString() || 0);
            setProductFixedAmount(editOrder.product.fixedAmount?.toString() || 0);
            setProductFixedAmountOffer(editOrder.product.fixedAmountOffer?.toString() || 0);
            setProdRating(editOrder.product.rating || 0);
            setProductFrom(editOrder.product.fromLocation || "");
            setProductTo(editOrder.product.toLocation || "");
            setProdType(editOrder.product.mediaType || "");
            setSelectedState(editOrder.product.location.state || "");
            setSelectedDistrict(editOrder.product.location.district || "");

            // Handle dates - parse from ISO string or formatted string
            if (editOrder.booking.startDate && editOrder.booking.endDate) {
                try {
                    // Try parsing as ISO string first
                    let startDate = new Date(editOrder.booking.startDate);
                    let endDate = new Date(editOrder.booking.endDate);

                    // If parsing failed (invalid date), try alternative formats
                    if (isNaN(startDate.getTime())) {
                        // Handle other date formats if needed
                        const dateParts = editOrder.booking.startDate.split(' ');
                        if (dateParts.length === 2) {
                            const month = new Date(Date.parse(dateParts[0] + " 1, 2025")).getMonth();
                            const day = parseInt(dateParts[1]);
                            startDate = new Date(2025, month, day);
                        }
                    }

                    if (isNaN(endDate.getTime())) {
                        const dateParts = editOrder.booking.endDate.split(' ');
                        if (dateParts.length === 2) {
                            const month = new Date(Date.parse(dateParts[0] + " 1, 2025")).getMonth();
                            const day = parseInt(dateParts[1]);
                            endDate = new Date(2025, month, day);
                        }
                    }

                    if (!isNaN(startDate.getTime()) && !isNaN(endDate.getTime())) {
                        setSelectedDates({ start: startDate, end: endDate });
                        setConfirmedDates({ start: startDate, end: endDate });
                    } else {
                        console.warn("Could not parse dates from order data");
                        setSelectedDates({ start: null, end: null });
                        setConfirmedDates({ start: null, end: null });
                    }
                } catch (error) {
                    console.error("Error parsing dates:", error);
                    setSelectedDates({ start: null, end: null });
                    setConfirmedDates({ start: null, end: null });
                }
            }
        } else {
            resetForm();
        }
    }, [editOrder]);

    // Inside your component:
    const location = useLocation();

    useEffect(() => {
        if (location.state?.editOrder) {
            console.log("Received edit order:", location.state.editOrder);
            setEditOrder(location.state.editOrder);
        }
    }, [location.state]);
    const resetForm = () => {
        setProductName('');
        setProductImage('');
        setProductAmount('');
        setProductPrintingCost('');
        setProductMountingCost('');
        setProductId('');
        setProdLighting('');
        setProductFrom('');
        setProductTo('');
        setProdRating(0);
        setProdWidth('');
        setProdHeight('');
        setProductFixedAmount('');
        setProductFixedAmountOffer('');
        setProdType('');
        setClientName('');
        setClientContact('');
        setClientEmail('');
        setClientCompany('');
        setClientPaidAmount('')
        setSelectedState("");
        setSelectedDistrict("");
        setSelectedDates({ start: null, end: null });
        setEditOrder(null);
    };

    // Add this function to your component
    const sendOrderNotifications = async (orderData, orderId) => {
        try {
            const response = await fetch(`${baseUrl}/AdminOrder/send-order-notificationsAdmin`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    orderData,
                    orderId
                })
            });
            if (!response.ok) {
                const errorData = await response.json();

                console.error("Failed to send notifications", errorData);
                throw new Error('Failed to send notifications');

            }
        } catch (error) {
            console.error("Notification sending error:", error);
            return { success: false, error: error.message };
        }
    };

    // Add this SMS function to your component
    const sendOrderSMS = async (phone, orderId, isAdmin = false) => {
        try {
            const response = await fetch(`${baseUrl}/AdminOrder/send-admin-sms`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    phone,
                    templateId: isAdmin ? "1007478982147905431" : "1007197121174928712",
                    variables: {
                        orderId,
                        customerName: clientName,
                        amount: clientPaidAmount
                    }
                })
            });

            if (!response.ok) {
                console.error("Failed to send SMS");
            }
        } catch (error) {
            console.error("SMS sending error:", error);
        }
    };

    //Helper function to generate the next order ID
    const handleSaveProductOrder = async (e) => {
        e.preventDefault();
        // Validate form first
        if (!validateForm()) {
            toast.error("Please fill all required fields correctly");
            return;
        }
        // Set loading state
        setIsSaving(true);

        const today = new Date();
        const formattedToday = `${String(today.getDate()).padStart(2, '0')}/${String(today.getMonth() + 1).padStart(2, '0')}/${today.getFullYear()}`;
        try {
            // Generate order ID for new orders
            const orderId = editOrder ? editOrder._id : null;
            console.log("Generated Order ID:", orderId);
            // Validate required fields
            const requiredFields = {
                clientName: "Client name is required",
                clientContact: "Client contact is required",
                productID: "Product ID is required",
            };

            for (const [field, message] of Object.entries(requiredFields)) {
                if (!eval(field)) { // Note: Using eval here is just for demonstration - consider a safer approach
                    throw new Error(message);
                }
            }

            // Validate dates
            if (!selectedDates.start || !selectedDates.end) {
                throw new Error("Please select both start and end dates");
            }

            if (isNaN(selectedDates.start.getTime()) || isNaN(selectedDates.end.getTime())) {
                throw new Error("Invalid dates selected");
            }

            if (selectedDates.start > selectedDates.end) {
                throw new Error("End date must be after start date");
            }

            // Calculate available days
            const availableDays = getAvailableDaysInRange(selectedDates.start, selectedDates.end);
            const totalDays = availableDays.length;
            if (totalDays === 0) {
                throw new Error("No available days in selected range");
            }
            const totalPrice = totalDays * (parseFloat(productAmount) || 0);
            // Format dates in local time without timezone conversion
            const formatLocalDate = (date) => {
                if (!date || isNaN(date.getTime())) return null;
                // Use UTC methods to avoid timezone shifts
                return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
            };

            // Format dates for storage
            const formatDateForStorage = (date) => {
                return new Date(Date.UTC(
                    date.getFullYear(),
                    date.getMonth(),
                    date.getDate()
                ));
            };

            // Construct product object properly
            const productData = {
                id: productID,
                prodCode: productID,
                name: productName,
                image: productImage,
                price: Number(productAmount),
                printingCost: Number(productPrintingCost),
                mountingCost: Number(productMountingCost),
                lighting: prodLighting,
                fixedAmount: Number(productFixedAmount),
                fixedAmountOffer: Number(productFixedAmountOffer),
                size: {
                    width: Number(prodwidth),
                    height: Number(prodheight),
                    squareFeet: Number(ProdSquareFeet())
                },
                fromLocation: productFrom,
                toLocation: productTo,
                rating: Number(prodRating),
                mediaType: prodType,
                location: {
                    state: selectedState,
                    district: selectedDistrict
                },
                booking: {
                    startDate: formatDateForStorage(selectedDates.start),
                    endDate: formatDateForStorage(selectedDates.end),
                    totalDays: totalDays,
                    totalPrice: totalPrice
                },
                bookedDates: availableDays.map(date => formatDateForStorage(date))
            }
            // Prepare order data
            const orderData = {
                client: {
                    userId: productID,
                    name: clientName,
                    email: clientEmail,
                    contact: clientContact,
                    company: clientCompany,
                    paidAmount: Number(clientPaidAmount)
                },
                products: [productData],
                status: editOrder?.status || "Added Manually",
                orderType: "single",
            };
            // Submit to backend
            const response = await fetch(
                editOrder
                    ? `${baseUrl}/prodOrders/${editOrder._id}`
                    : `${baseUrl}/prodOrders`,
                {
                    method: editOrder ? 'PUT' : 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(orderData)
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to save order');
            }

            const result = await response.json();
            console.log("Order saved with ID:", result.orderId || result._id);
            // Send SMS notifications
            try {
                // Send SMS to user
                if (clientContact) {
                    await sendOrderSMS(clientContact, result.orderId || result._id);
                }

                // Send SMS to admin
                await sendOrderSMS('reactdeveloper@adinn.co.in', result.orderId || result._id, true);
            } catch (smsError) {
                console.error("SMS sending error:", smsError);
                // Don't fail the order if SMS fails
            }
            // AFTER SUCCESSFUL ORDER CREATION - SEND NOTIFICATIONS
            try {
                // Prepare order data for notifications
                const notificationData = {
                    client: {
                        name: clientName,
                        email: clientEmail,
                        contact: clientContact,
                        company: clientCompany,
                        paidAmount: clientPaidAmount
                    },
                    products: [{
                        name: productName,
                        prodCode: productID,
                        price: Number(productAmount),
                        booking: {
                            startDate: selectedDates.start,
                            endDate: selectedDates.end,
                            totalDays: totalDays,
                            totalPrice: totalPrice
                        }
                    }]
                };

                // Send notifications
                await sendOrderNotifications(notificationData, result.orderId || result._id);
            } catch (notificationError) {
                console.error("Notification error:", notificationError);
                // Don't fail the order if notifications fail
            }
            alert(`Order ${editOrder ? 'updated' : 'created'} successfully!with ID: ${result.orderId || result._id}`);
            resetForm();

        } catch (error) {
            console.error("Save error:", error);
            alert(`Error: ${error.message}`);
        }
        finally {
            // Reset loading state
            setIsSaving(false);
        }
    };

    return (
        <div>
            <form onSubmit={handleSaveProductOrder}>
                <div className='adManageMain'>
                    {/* Left side section  */}
                    <div className='adManageContentLeft'>
                        <div className='ManageLeftImg1'><img src={productImage} className='ManageLeftImg1'></img></div>
                        {/* Product details section  */}
                        <div className='manageprodMain'>
                            <div className="ManageProdDetails">
                                <div className='ManageProdLeftHeading'>Name</div>
                                <div className='ManageProdRightContent'>{productName}</div>
                            </div>
                            <div className="ManageProdDetails">
                                <div className='ManageProdLeftHeading'>Price</div>
                                <div className='ManageProdRightContent'>₹ {productAmount} Per Day </div>
                            </div>
                            <div className="ManageProdDetails">
                                <div className='ManageProdLeftHeading'>Printing Cost</div>
                                <div className='ManageProdRightContent'>₹ {productPrintingCost} Per Day </div>
                            </div>
                            <div className="ManageProdDetails">
                                <div className='ManageProdLeftHeading'>Mounting Cost</div>
                                <div className='ManageProdRightContent'>₹ {productMountingCost} Per Day </div>
                            </div>
                            <div className="ManageProdDetails">
                                <div className='ManageProdLeftHeading'>Size</div>
                                <div className='ManageProdRightContent'>{prodwidth} X {prodheight} | {ProdSquareFeet()} Sq.ft </div>
                            </div>
                            <div className="ManageProdDetails">
                                <div className='ManageProdLeftHeading'>Lighting</div>
                                <div className='ManageProdRightContent'>{prodLighting}</div>
                            </div>
                            <div className="ManageProdDetails">
                                <div className='ManageProdLeftHeading'>From</div>
                                <div className='ManageProdRightContent'>{productFrom}</div>
                            </div>
                            <div className="ManageProdDetails">
                                <div className='ManageProdLeftHeading'>To</div>
                                <div className='ManageProdRightContent'>{productTo}</div>
                            </div>
                            <div className="ManageProdDetails">
                                <div className='ManageProdLeftHeading'>FixedAmount</div>
                                <div className='ManageProdRightContent'>{productFixedAmount}</div>
                            </div>
                            <div className="ManageProdDetails">
                                <div className='ManageProdLeftHeading'>FixedOffer</div>
                                <div className='ManageProdRightContent'>{productFixedAmountOffer}</div>
                            </div>
                            <div className="ManageProdDetails">
                                <div className='ManageProdLeftHeading'>Rating</div>
                                <div className='ManageProdRightContent'>
                                    <span className='Product-star-main'>
                                        <span><img src='./images/rating_board.png' className='Product-rate-board1'></img></span>
                                        <span><RatingStars rating={prodRating} /> </span>
                                    </span>
                                </div>
                            </div>
                        </div>
                        {/* Select Category  section  */}
                        <div className='manageprodMain manageProdSideContents'>
                            <div className='manageprodSideHeading'>Selected Category</div>
                            <div className="ManageProdDetails">
                                <div className='ManageProdLeftHeading'>Location</div>
                                <div className='ManageProdRightContent'>
                                    {selectedState && selectedDistrict ? `${selectedState}, ${selectedDistrict}` : "Select a location"}
                                </div>
                            </div>
                            <div className="ManageProdDetails">
                                <div className='ManageProdLeftHeading'>Media Type</div>
                                <div className='ManageProdRightContent'>{prodType}</div>
                            </div>
                        </div>
                        {/* Client information section */}
                        <div className='manageprodMain manageProdSideContents'>
                            <div className='manageprodSideHeading'>Client Information</div>
                            <div className="ManageProdDetails">
                                <div className='ManageProdLeftHeading'>Name</div>
                                <div className='ManageProdRightContent'>{clientName}</div>
                            </div>
                            <div className="ManageProdDetails">
                                <div className='ManageProdLeftHeading'>Contact</div>
                                <div className='ManageProdRightContent'>{clientContact}</div>
                            </div>
                            <div className="ManageProdDetails">
                                <div className='ManageProdLeftHeading'>Email</div>
                                <div className='ManageProdRightContent'>{clientEmail}</div>
                            </div>
                            <div className="ManageProdDetails">
                                <div className='ManageProdLeftHeading'>Company</div>
                                <div className='ManageProdRightContent'>{clientCompany}</div>
                            </div>
                            <div className="ManageProdDetails">
                                <div className='ManageProdLeftHeading'>Paid Amount</div>
                                <div className='ManageProdRightContent'>{clientPaidAmount}</div>
                            </div>
                        </div>
                    </div>

                    {/* Right section  */}
                    <div>
                        {/* Client Section  */}
                        <div className='manageClientSection'>
                            <div className='manageRightSideHeading'>Client Information</div>
                            <div className='d-flex manageClientInformation'>
                                <div className='manageClientInfoLeft'>
                                    <div className='clientDetailSection'>
                                        <div className='clientDetailHeading'>Client Name</div>
                                        <input type='text' placeholder='Enter Name' value={clientName}
                                            onChange={(e) => {
                                                setClientName(e.target.value);
                                                setErrors(prev => ({ ...prev, clientName: false }));
                                            }} className={errors.clientName ? "clientDetailsInput AdminProdinput-error" : "clientDetailsInput"}></input>
                                        {errors.clientName && <div className="AdminClienterror-message">Name is required</div>}
                                    </div>
                                    <div className='clientDetailSection'>
                                        <div className='clientDetailHeading'>Client Email</div>
                                        <input type='email' placeholder='Enter Email' value={clientEmail}
                                            onChange={(e) => {
                                                setClientEmail(e.target.value);
                                                setErrors(prev => ({ ...prev, clientEmail: false }));
                                            }} className={errors.clientEmail ? "clientDetailsInput AdminProdinput-error" : "clientDetailsInput"}></input>
                                        {errors.clientEmail && <div className="AdminClienterror-message">
                                            {!clientEmail ? "Email is required" : "Invalid email format"}
                                        </div>}
                                    </div>
                                    <div className='clientDetailSection'>
                                        <div className='clientDetailHeading'>Paid Amount</div>
                                        <input type='number' placeholder='Enter Paid Amount' value={clientPaidAmount}
                                            onChange={(e) => {
                                                setClientPaidAmount(e.target.value);
                                                setErrors(prev => ({ ...prev, clientPaidAmount: false }));
                                            }} className={errors.clientPaidAmount ? "clientDetailsInput AdminProdinput-error" : "clientDetailsInput"}></input>
                                        {errors.clientPaidAmount && <div className="AdminClienterror-message">Paid Amount is required</div>}
                                    </div>
                                </div>
                                <div className='manageClientInfoRight'>
                                    <div className='clientDetailSection'>
                                        <div className='clientDetailHeading'>Client Contact</div>
                                        <input type='number' maxLength='10' placeholder='Enter Contact' value={clientContact}
                                            onChange={(e) => {
                                                setClientContact(e.target.value);
                                                setErrors(prev => ({ ...prev, clientContact: false }));
                                            }} className={errors.clientContact ? "clientDetailsInput AdminProdinput-error" : "clientDetailsInput"}></input>
                                        {errors.clientContact && <div className="AdminClienterror-message">
                                            {!clientContact ? "Contact is required" : "Contact must be 10 digits"}</div>}
                                    </div>
                                    <div className='clientDetailSection'>
                                        <div className='clientDetailHeading'>Company Name</div>
                                        <input type='text' placeholder='Enter Company' value={clientCompany}
                                            onChange={(e) => {
                                                setClientCompany(e.target.value);
                                                setErrors(prev => ({ ...prev, clientCompany: false }));
                                            }} className={errors.clientCompany ? "clientDetailsInput AdminProdinput-error" : "clientDetailsInput"}></input>
                                        {errors.clientCompany && <div className="AdminClienterror-message">Client Company is required</div>}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Product Section  */}
                        <div className='manageClientSection'>
                            <div className='manageRightSideHeading'>Product Management</div>
                            <div className='d-flex manageClientInformation'>

                                <div className='manageClientInfoLeft'>
                                    <div className='clientDetailSection'>
                                        <div className='clientDetailHeading'>Product Name</div>
                                        <input type='text' placeholder='Enter Product Name' value={productName} readOnly
                                            onChange={(e) => setProductName(e.target.value)} className='clientDetailsInput'></input>
                                    </div>
                                    <div className='clientDetailSection'>
                                        <div className='clientDetailHeading'>Price</div>
                                        <input type='number' placeholder='Enter Price' value={productAmount} readOnly
                                            onChange={(e) => { setProductAmount(e.target.value) }} className='clientDetailsInput'></input>
                                    </div>
                                    <div className='clientDetailSection'>
                                        <div className='clientDetailHeading'>Lighting Type</div>
                                        <input type='text' className='clientDetailsInput' value={prodLighting} readOnly
                                            onChange={(e) => setProdLighting(e.target.value)}>
                                        </input>
                                    </div>
                                    <div className='clientDetailSection'>
                                        <div className='clientDetailHeading'>Printing Cost</div>
                                        <input type='number' placeholder='Enter Price' value={productPrintingCost}
                                            onChange={(e) => { setProductPrintingCost(e.target.value); }}
                                            className='clientDetailsInput'></input>
                                    </div>
                                </div>

                                <div className='manageClientInfoRight'>
                                    <div className='clientDetailSection'>
                                        <div className='clientDetailHeading'>Product ID</div>
                                        <input type='text' placeholder='Enter Product ID' value={productID}
                                            onChange={handleProductIdChange}
                                            className='clientDetailsInput'></input>

                                        {/* Add error message here */}
                                        {showError && (
                                            <div className="error-message">
                                                {errorMessage}
                                            </div>
                                        )}

                                        {searchSuggestions.length > 0 && (
                                            <div className="suggestions-dropdown">
                                                {searchSuggestions.map((product) => (
                                                    <div
                                                        key={product.prodCode}
                                                        onClick={() => {
                                                            setProductId(product.prodCode);
                                                            fetchProductById(product.prodCode);
                                                            setSearchSuggestions([]);
                                                        }}
                                                        className="suggestion-item"
                                                    >
                                                        {product.prodCode} - {product.name}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    <div className='clientDetailSection'>
                                        <div className='clientDetailHeading'>Size</div>
                                        <div className='sizeWidthValues'>
                                            W : <input type='number' value={prodwidth} readOnly
                                                onChange={(e) => setProdWidth(e.target.value)} className='sizeWidthInput'></input><span className='sizeMultiply'> X </span>H : <input type='number' value={prodheight} readOnly
                                                    onChange={(e) => setProdHeight(e.target.value)} className='sizeWidthInput'></input> <span className='sizeWidthSlash'> | </span> <lable> {ProdSquareFeet()} </lable>Sq.ft

                                        </div>
                                    </div>
                                    <div className='clientDetailSection'>
                                        <div className='clientDetailHeading'>Location</div>
                                        <label className='locationFromLabel'>From <label style={{ float: 'right' }}>-</label></label>
                                        <input type='text' placeholder='Enter From' value={productFrom} readOnly
                                            onChange={(e) => setProductFrom(e.target.value)} className='clientDetailsInput locationInput'></input> <br></br>
                                        <label className='locationFromLabel'>To<label style={{ float: 'right' }}>-</label></label>
                                        <input type='text' placeholder='Enter To' value={productTo} readOnly
                                            onChange={(e) => setProductTo(e.target.value)} className='clientDetailsInput locationInput'></input>
                                    </div>
                                    <div className='clientDetailSection'>
                                        <div className='clientDetailHeading'>Mounting Cost</div>
                                        <input type='number' placeholder='Enter Price' value={productMountingCost}
                                            onChange={(e) => { setProductMountingCost(e.target.value); }}
                                            className='clientDetailsInput'></input>
                                    </div>
                                </div>

                            </div>

                        </div>

                        {/* Rating section  with OFFER */}
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <div className='manageClientSection' style={{ width: '40%' }}>
                                <div className='clientDetailHeading'>Ratings</div>
                                <div className='ProductRatingMain'>
                                    <div >
                                        <div>
                                            <span className='Product-star-main' >
                                                <RatingStars1 rating={parseFloat(prodRating) || 0} />
                                            </span>
                                        </div>
                                    </div>
                                    <div>
                                        <input type='text' className='clientDetailsInput ratingInput' value={prodRating} readOnly
                                            onChange={(e) => handleRatingChange(e.target.value)} >
                                        </input>
                                    </div>
                                </div>
                            </div>
                            <div className='manageClientSection' style={{ width: '60%' }}>
                                <div className='clientDetailHeading'>Offers</div>
                                <div className='ProductRatingMain'>
                                    <div className='AdminOfferDetails' >Pay ₹<input type='number' value={productFixedAmount} onChange={(e) => setProductFixedAmount(e.target.value)} className='sizeWidthInput adminOfferAmountInput' readOnly></input> and Get <input type='number' value={productFixedAmountOffer} onChange={(e) => setProductFixedAmountOffer(e.target.value)} className='sizeWidthInput adminOfferAmountPercentage' readOnly></input>% Off <span className='adminOfferRefundDetails'> 100% Refundable </span>
                                    </div>

                                </div>
                            </div>
                        </div>

                        {/* Select Category section   */}
                        <div className='manageClientSection'>
                            <div className='clientDetailHeading'>Select Category</div>
                            <div className='d-flex manageClientInformation'>
                                <div className='manageClientInfoLeft'>
                                    <div className='clientDetailHeading'>Location</div>
                                    <div className="location-container11">
                                        {/* Input field to display selected state & district */}
                                        <div className="input-wrapper"
                                        // onClick={toggleStateDropdown}
                                        >
                                            <input
                                                type="text"
                                                className="clientDetailsInput locationSelectInput"
                                                value={selectedState && selectedDistrict ? `${selectedState}, ${selectedDistrict}` : ""}
                                                placeholder="Select Location"
                                                readOnly
                                            />

                                        </div>

                                    </div>
                                </div>
                                <div className='manageClientInfoRight'>
                                    <div className='clientDetailHeading'>Media Type</div>
                                    <input type='text' className='clientDetailsInput' value={prodType} readOnly onChange={(e) => setProdType(e.target.value)} >
                                    </input>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
                <Calendar productAmount={productAmount}
                    selectedDates={selectedDates} setSelectedDates={setSelectedDates} generateMonth={generateMonth} handleDateClick={handleDateClick} resetDates={resetDates} getDateSelectionClass={getDateSelectionClass} goToNextMonth={goToNextMonth} goToPreviousMonth={goToPreviousMonth} bookedDates={bookedDates} currentMonth={currentMonth} setCurrentMonth={setCurrentMonth} confirmedDates={confirmedDates} setConfirmedDates={setConfirmedDates} pricePerDay={pricePerDay} confirmDates={confirmDates} totalDays={totalDays} totalPrice={totalPrice} isSmallScreen={isSmallScreen}
                    isValidDate={(date) => date && !isNaN(date.getTime())} isPastDate={isPastDate}
                />
                <button className="calendarSaveBtn" type='submit' disabled={isSaving}>
                    {/* {editOrder ? "Update" : "Save"} */}
                    {isSaving ? (
                        <span>
                            <i className="fa fa-spinner fa-spin"></i>
                            {editOrder ? " Updating..." : " Saving..."}
                        </span>
                    ) : (
                        editOrder ? "Update" : "Save"
                    )}
                </button>
            </form>
        </div>
    )
}
export default AdManageSection;