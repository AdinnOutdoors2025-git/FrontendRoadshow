import React, { useState, useContext, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import './ad1Manage.css';
import './ad1VehicleUpload.css';
import './ad1VehicleUploadVideos.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';
import { baseUrl } from '../Authentication/BASE_URL';
import './RichText.css';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

function VehicleUpload() {
    const { state } = useLocation();
    const { id } = useParams();
    const navigate = useNavigate();

    // // Rating Stars Components (keep your existing code)
    // const RatingStars = ({ rating }) => {
    //     const fullStars = Math.floor(rating);
    //     const halfStar = rating % 1 !== 0;
    //     const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    //     return (
    //         <div className='Product-rating-star'>
    //             {[...Array(fullStars)].map((_, index) => (
    //                 <span key={index} className="fa-solid fa-star Product-stars1"></span>
    //             ))}
    //             {halfStar && <span className="fa-solid fa-star-half-alt Product-stars1"></span>}
    //             {[...Array(emptyStars)].map((_, index) => (
    //                 <span key={index} className="fa-solid fa-star Product-empty-star1 Product-stars1"></span>
    //             ))}
    //         </div>
    //     );
    // };

    // const RatingStars1 = ({ rating }) => {
    //     const fullStars = Math.floor(rating);
    //     const halfStar = rating % 1 !== 0;
    //     const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    //     return (
    //         <div>
    //             <div className='Product-rating-star1'>
    //                 {[...Array(fullStars)].map((_, index) => (
    //                     <span key={index} className="fa-solid fa-star Product-stars1"></span>
    //                 ))}
    //                 {halfStar && <span className="fa-solid fa-star-half-alt Product-stars1"></span>}
    //                 {[...Array(emptyStars)].map((_, index) => (
    //                     <span key={index} className="fa-solid fa-star Product-empty-star1 Product-stars1"></span>
    //                 ))}
    //             </div>
    //         </div>
    //     );
    // };



    // Updated RatingStars Component
    const RatingStars = ({ rating }) => {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

        return (
            <div className='Product-rating-star'>
                {[...Array(fullStars)].map((_, index) => (
                    <span key={`full-${index}`} className="fa-solid fa-star Product-stars1"></span>
                ))}
                {hasHalfStar && <span className="fa-solid fa-star-half-alt Product-stars1"></span>}
                {[...Array(emptyStars)].map((_, index) => (
                    <span key={`empty-${index}`} className="fa-solid fa-star Product-empty-star1 Product-stars1"></span>
                ))}
                <span className="rating-value-text">({rating})</span>
            </div>
        );
    };

    // Updated RatingStars1 Component (for the preview section)
    const RatingStars1 = ({ rating }) => {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

        return (
            <div>
                <div className='Product-rating-star1'>
                    {[...Array(fullStars)].map((_, index) => (
                        <span key={`full-${index}`} className="fa-solid fa-star Product-stars1"></span>
                    ))}
                    {hasHalfStar && <span className="fa-solid fa-star-half-alt Product-stars1"></span>}
                    {[...Array(emptyStars)].map((_, index) => (
                        <span key={`empty-${index}`} className="fa-solid fa-star Product-empty-star1 Product-stars1"></span>
                    ))}
                    <span className="rating-value-text">({rating})</span>
                </div>
            </div>
        );
    };

    // State declarations
    const [vehicleName, setVehicleName] = useState("");
    const [vehicleAmount, setVehicleAmount] = useState("");
    const [vehicleID, setVehicleId] = useState("");
    const [vehicleDeliveryDay, setVehicleDeliveryDay] = useState("");
    const [vehicleAudio, setVehicleAudio] = useState("");
    const [vehicleBranding, setVehicleBranding] = useState("");
    const [vehiclePower, setVehiclePower] = useState("");
    const [vehicleRating, setVehicleRating] = useState("4.3");
    const [vehicleWidth, setVehicleWidth] = useState('');
    const [vehicleHeight, setVehicleHeight] = useState('');
    const [vehicleFixedAmount, setVehicleFixedAmount] = useState('999');
    const [vehicleFixedAmountOffer, setVehicleFixedAmountOffer] = useState('5');
    const [richTextContent, setRichTextContent] = useState('');

    // AVAILABLE VEHICLE COUNT 
    const [vehicleAvailableOverAllCount, setVehicleAvailableOverAllCount] = useState('');
    const [vehicleAvailableBookedCount, setVehicleAvailableBookedCount] = useState('');
    const [vehicleAvailableBalanceCount, setVehicleAvailableBalanceCount] = useState('');


    // Image and file states
    const [imageFile, setImageFile] = useState(null);
    const [image, setImage] = useState("");
    const [additionalFiles, setAdditionalFiles] = useState([]);
    const [uploading, setUploading] = useState(false);

    // Similar products states
    const [similarProdId, setSimilarProdId] = useState('');
    const [selectedSimilarProducts, setSelectedSimilarProducts] = useState([]);
    const [searchSuggestions, setSearchSuggestions] = useState([]);
    const [vehiclesData, setVehiclesData] = useState([]);

    // Edit state
    const [editVehicle, setEditVehicle] = useState(null);

    // Error states
    const [errors, setErrors] = useState({
        vehicleName: false,
        vehicleAmount: false,
        vehicleID: false,
        vehicleDeliveryDay: false,
        vehicleAudio: false,
        vehicleBranding: false,
        vehiclePower: false,
        vehicleRating: false,
        vehicleHeight: false,
        vehicleWidth: false,
        vehicleAvailableOverAllCount: false,
        vehicleAvailableBookedCount: false,
        vehicleAvailableBalanceCount: false,

        image: false,
    });

    // Utility functions
    const ProdSquareFeet = () => {
        const squareFeet = vehicleWidth * vehicleHeight;
        return squareFeet;
    };

    // const handleRatingChange = (value) => {
    //     let newRating = parseFloat(value);
    //     if (newRating >= 0 && newRating <= 5) {
    //         setVehicleRating(newRating);
    //     }
    // };

    const normalizeCode = (code) => {
        return code ? code.toString().toLowerCase().trim().replace(/\s+/g, '') : '';
    };

    // Fetch vehicles data
    useEffect(() => {
        fetch(`${baseUrl}/vehicles`)
            .then((response) => response.json())
            .then((data) => {
                const vehiclesWithVisibility = data.map((vehicle) => ({
                    ...vehicle,
                    visible: vehicle.vehicleDetails?.visible !== false,
                }));
                setVehiclesData(vehiclesWithVisibility.sort((a, b) =>
                    b.vehicleDetails?.visible - a.vehicleDetails?.visible
                ));
            })
            .catch(error => console.error('Error fetching vehicles:', error));
    }, []);

    // Prefill form for editing
    useEffect(() => {
        console.log("Location state:", state);
        if (state?.editVehicle) {
            const vehicle = state.editVehicle;
            console.log("Editing vehicle:", vehicle);
            setEditVehicle(vehicle);

            if (vehicle.vehicleDetails) {
                const details = vehicle.vehicleDetails;
                setVehicleId(details.vehicleID || '');
                setVehicleName(details.name || '');
                setVehicleAmount(details.amount || '');
                setVehicleDeliveryDay(details.deliveryDay || '');
                setVehicleAudio(details.audio || '');
                setVehicleBranding(details.branding || '');
                setVehiclePower(details.power || '');
                setVehicleRating(details.rating || '');
                setVehicleWidth(details.vehicleSize?.width || '');
                setVehicleHeight(details.vehicleSize?.height || '');
                setVehicleAvailableOverAllCount(details.vehicleCount?.OverAllCount || '');
                setVehicleAvailableBookedCount(details.vehicleCount?.BookedCount || '');
                setVehicleAvailableBalanceCount(details.vehicleCount?.BalanceCount || '');
                setImage(details.image || '');
                setRichTextContent(details.vehicleDescription || '');

                // Set additional files
                if (details.additionalFiles && details.additionalFiles.length > 0) {
                    setAdditionalFiles(details.additionalFiles.map(file => ({
                        ...file,
                        previewUrl: file.url,
                        id: file.public_id
                    })));
                }
            }

            // Set similar vehicles
            if (vehicle.similarVehicles && vehicle.similarVehicles.length > 0) {
                setSelectedSimilarProducts(vehicle.similarVehicles);
            }
        }
    }, [state]);

    // CORRECTED: Search suggestions handler
    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSimilarProdId(value);

        if (!value.trim()) {
            setSearchSuggestions([]);
            return;
        }

        const normalizedInput = normalizeCode(value);

        // Get currently selected vehicle IDs to avoid duplicates
        const selectedIds = selectedSimilarProducts.map(p =>
            normalizeCode(p.VehicleID || p.vehicleID)
        );

        // Filter vehicles that match search and aren't already selected
        const matches = vehiclesData.filter(vehicle => {
            const vehicleDetails = vehicle.vehicleDetails || {};
            const vehicleId = vehicleDetails.vehicleID || '';
            const vehicleName = vehicleDetails.name || '';

            const isMatch =
                normalizeCode(vehicleId).includes(normalizedInput) ||
                vehicleName.toLowerCase().includes(value.toLowerCase());

            const notSelected = !selectedIds.includes(normalizeCode(vehicleId));

            return isMatch && notSelected;
        }).slice(0, 5);

        setSearchSuggestions(matches);
    };

    // CORRECTED: Handle product selection
    const handleSelectProduct = () => {
        const enteredId = similarProdId.trim();
        if (!enteredId) return;

        const normalizedInput = normalizeCode(enteredId);
        const selectedIds = selectedSimilarProducts.map(p =>
            normalizeCode(p.VehicleID || p.vehicleID)
        );

        // Find matches
        const matches = vehiclesData.filter(vehicle => {
            const vehicleDetails = vehicle.vehicleDetails || {};
            const vehicleId = vehicleDetails.vehicleID || '';
            const vehicleName = vehicleDetails.name || '';

            const matchCode = normalizeCode(vehicleId) === normalizedInput;
            const matchName = vehicleName.toLowerCase().includes(enteredId.toLowerCase());

            const notSelected = !selectedIds.includes(normalizeCode(vehicleId));

            return (matchCode || matchName) && notSelected;
        });

        if (matches.length === 0) {
            alert("No matching vehicles found");
            return;
        }

        if (matches.length > 1) {
            alert("Multiple matches found - please select from suggestions");
            return;
        }

        const vehicleToAdd = matches[0];

        // Create similar vehicle object in the correct format
        const similarVehicle = {
            VehicleID: vehicleToAdd.vehicleDetails?.vehicleID,
            Name: vehicleToAdd.vehicleDetails?.name,
            image: vehicleToAdd.vehicleDetails?.image,
            vehiclePrice: vehicleToAdd.vehicleDetails?.amount
        };

        setSelectedSimilarProducts(prev => [...prev, similarVehicle]);
        setSimilarProdId('');
        setSearchSuggestions([]);
    };

    // CORRECTED: Handle remove product
    const handleRemoveProduct = (vehicleId) => {
        if (!window.confirm("Are you sure you want to remove this vehicle?")) return;

        const normalizedId = normalizeCode(vehicleId);
        setSelectedSimilarProducts(prev =>
            prev.filter(vehicle =>
                normalizeCode(vehicle.VehicleID) !== normalizedId
            )
        );
    };

    // CORRECTED: Handle suggestion click
    const handleSuggestionClick = (vehicle) => {
        const similarVehicle = {
            VehicleID: vehicle.vehicleDetails?.vehicleID,
            Name: vehicle.vehicleDetails?.name,
            image: vehicle.vehicleDetails?.image,
            vehiclePrice: vehicle.vehicleDetails?.amount
        };

        setSelectedSimilarProducts(prev => [...prev, similarVehicle]);
        setSimilarProdId('');
        setSearchSuggestions([]);
    };

    // Image and file handlers (keep your existing code)
    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const previewUrl = URL.createObjectURL(file);
            setImage(previewUrl);
            setImageFile(file);
        }
    };

    const handleFileChangeAdded = (e) => {
        if (!e.target.files || e.target.files.length === 0) return;
        const files = Array.from(e.target.files).filter(file =>
            file.type.startsWith('video/') ||
            file.type.startsWith('image/') ||
            ['.mp4', '.mov', '.avi', '.mkv', '.jpg', '.jpeg', '.png', '.gif'].some(ext =>
                file.name.toLowerCase().endsWith(ext))
        );
        if (files.length === 0) {
            alert('Please select valid video or image files');
            return;
        }

        const currentNonDeletedFiles = additionalFiles.filter(f => !f.markedForDeletion).length;
        if (currentNonDeletedFiles + files.length > 5) {
            alert(`Maximum 5 files allowed. You already have ${currentNonDeletedFiles} files.`);
            return;
        }

        const newFiles = files.map(file => ({
            file,
            previewUrl: URL.createObjectURL(file),
            id: `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            type: file.type.startsWith('video/') ? 'video' : 'image',
            isNew: true
        }));
        setAdditionalFiles(prev => [...prev, ...newFiles]);
        e.target.value = '';
    };

    const handleDeleteAdded = async (fileToDelete) => {
        if (!window.confirm('Delete this file?')) return;
        try {
            if (fileToDelete.public_id) {
                setAdditionalFiles(prev =>
                    prev.map(file =>
                        file.public_id === fileToDelete.public_id
                            ? { ...file, markedForDeletion: true }
                            : file
                    )
                );
            } else {
                setAdditionalFiles(prev =>
                    prev.filter(file => file.id !== fileToDelete.id)
                );
            }
        } catch (error) {
            console.error('Delete error:', error);
            alert('Failed to delete file');
        }
    };

    // Form validation
    const validateForm = () => {
        const validAdditionalFiles = additionalFiles.filter(file => !file.markedForDeletion);
        const newErrors = {
            vehicleName: !vehicleName,
            vehicleAmount: !vehicleAmount,
            vehicleID: !vehicleID,
            vehicleDeliveryDay: !vehicleDeliveryDay,
            vehicleAudio: !vehicleAudio,
            vehicleBranding: !vehicleBranding,
            vehiclePower: !vehiclePower,
            vehicleRating: !vehicleRating,
            vehicleHeight: !vehicleHeight,
            vehicleWidth: !vehicleWidth,
            vehicleAvailableOverAllCount: !vehicleAvailableOverAllCount,
            vehicleAvailableBookedCount: !vehicleAvailableBookedCount,
            vehicleAvailableBalanceCount: !vehicleAvailableBalanceCount,

            image: !image || image === " ",
        };
        setErrors(newErrors);
        return !Object.values(newErrors).some(error => error);
    };

    // Save vehicle function (keep your existing code with CORRECTED similar vehicles format)
    const handleSaveProduct = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            alert("Please fill all required fields correctly");
            return;
        }

        const validAdditionalFiles = additionalFiles.filter(file => !file.markedForDeletion);
        if (validAdditionalFiles.length > 5) {
            alert(`Maximum 5 additional files allowed. You have ${validAdditionalFiles.length} files.`);
            return;
        }

        if (selectedSimilarProducts.length === 0) {
            if (!window.confirm("You haven't added any similar vehicles. Continue anyway?")) {
                return;
            }
        }

        if (validAdditionalFiles.length === 0) {
            if (!window.confirm("You haven't added any additional files. Continue without additional files?")) {
                return;
            }
        }

        setUploading(true);

        const method = editVehicle ? 'PUT' : 'POST';
        const url = editVehicle ? `${baseUrl}/vehicles/${editVehicle._id}` : `${baseUrl}/vehicles`;

        try {
            // Your existing file upload logic here...
            let cloudinaryUrl = image;
            let cloudinaryPublicId = editVehicle?.vehicleDetails?.imagePublicId || null;

            if (imageFile && !image.startsWith('http')) {
                const formData = new FormData();
                formData.append("file", imageFile);
                const uploadResponse = await fetch(`${baseUrl}/upload`, {
                    method: "POST",
                    body: formData
                });
                if (!uploadResponse.ok) {
                    throw new Error('Failed to upload main image');
                }
                const uploadData = await uploadResponse.json();
                cloudinaryUrl = uploadData.imageUrl;
                cloudinaryPublicId = uploadData.public_id;
            }
            else if (image.startsWith('http')) {
                console.log("Using existing main image URL:", image);
            }
            else {
                throw new Error('Main image is required');
            }

            // Handle additional files upload (your existing code)...
            const finalAdditionalFiles = [];
            let fileIndex = 1;

            const newFilesToUpload = additionalFiles.filter(file => !file.public_id && file.file && !file.markedForDeletion);
            if (newFilesToUpload.length > 0) {
                const formData = new FormData();
                newFilesToUpload.forEach(fileObj => {
                    formData.append('files', fileObj.file);
                });

                const filesResponse = await fetch(`${baseUrl}/save-videos`, {
                    method: 'POST',
                    body: formData
                });

                if (!filesResponse.ok) {
                    const errorText = await filesResponse.text();
                    console.error('Upload failed:', errorText);
                    throw new Error('Failed to upload additional files');
                }

                const savedFiles = await filesResponse.json();
                savedFiles.forEach(file => {
                    finalAdditionalFiles.push({
                        url: file.url,
                        public_id: file.public_id,
                        type: file.type
                    });
                });
            }

            // Add existing files
            additionalFiles.forEach(file => {
                if (file.public_id && !file.markedForDeletion) {
                    finalAdditionalFiles.push({
                        url: file.url,
                        public_id: file.public_id,
                        type: file.type
                    });
                }
            });

            // Delete marked files
            const filesToDelete = additionalFiles.filter(file => file.markedForDeletion && file.public_id);
            for (const file of filesToDelete) {
                try {
                    await fetch(`${baseUrl}/delete-video`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            public_id: file.public_id,
                            resource_type: file.type
                        })
                    });
                } catch (deleteError) {
                    console.error('Error deleting file:', deleteError);
                }
            }

            // CORRECTED: Submit data with proper similar vehicles format
            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    vehicleDetails: {
                        vehicleID: vehicleID,
                        name: vehicleName,
                        amount: parseFloat(vehicleAmount),
                        deliveryDay: parseInt(vehicleDeliveryDay),
                        audio: vehicleAudio,
                        branding: vehicleBranding,
                        power: vehiclePower,
                        rating: vehicleRating,
                        vehicleSize: {
                            width: vehicleWidth,
                            height: vehicleHeight,
                            VehicleSizeSquareFeet: ProdSquareFeet(),
                        },
                        vehicleCount: {
                            OverAllCount: vehicleAvailableOverAllCount,
                            BookedCount: vehicleAvailableBookedCount,
                            BalanceCount: vehicleAvailableBalanceCount,
                        },
                        image: cloudinaryUrl,
                        imagePublicId: cloudinaryPublicId,
                        additionalFiles: finalAdditionalFiles,
                        vehicleDescription: richTextContent,
                        visible: true,
                    },
                    similarVehicles: selectedSimilarProducts // Already in correct format
                }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Server response error:', errorText);
                throw new Error('Failed to save vehicle data');
            }

            const result = await response.json();
            console.log('Vehicle saved successfully:', result);

            // if (!editVehicle) {
            //     alert("Vehicle added successfully!");
            //     resetForm();
            // } else {
            //     alert("Vehicle updated successfully!");
            //     setTimeout(() => {
            //         navigate('/admin#vehicles');
            //     }, 1500);
            // }



            if (!editVehicle) {
                alert("Vehicle added successfully!");
            } else {
                alert("Vehicle updated successfully!");
                // Navigate back to vehicles list after successful update
                setTimeout(() => {
                    navigate('/admin#vehicles');
                }, 1500);
                resetForm();

            }
            // Reset form only for new vehicles
            if (!editVehicle) {
                resetForm();
            }

        } catch (error) {
            console.error('Error saving vehicle:', error);
            alert("An error occurred while saving the vehicle.");
        } finally {
            setUploading(false);
        }
    };

    const resetForm = () => {
        setVehicleId('');
        setVehicleName('');
        setVehicleAmount('');
        setVehicleDeliveryDay('');
        setVehicleAudio('');
        setVehicleBranding('');
        setVehiclePower('');
        setVehicleRating('');
        setVehicleWidth('');
        setVehicleHeight('');
        setImage('');
        setAdditionalFiles([]);
        setRichTextContent('');
        setEditVehicle(null);
        setImageFile(null);
        setVehicleAvailableOverAllCount('');
        setVehicleAvailableBookedCount('');
        setVehicleAvailableBalanceCount('');
        setSelectedSimilarProducts([]);
        setSimilarProdId('');
    };

    // Clean up preview URLs
    useEffect(() => {
        return () => {
            if (image && !image.startsWith('http')) {
                URL.revokeObjectURL(image);
            }
            additionalFiles.forEach(file => {
                if (file.previewUrl) {
                    URL.revokeObjectURL(file.previewUrl);
                }
            });
        };
    }, [image, additionalFiles]);

    // Rich text editor configuration
    const modules = {
        toolbar: [
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
            [{ font: [] }],
            [{ size: [] }],
            [{ 'align': [] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            ['link', 'image', 'video'],
        ]
    };

    const formats = ['header', 'font', 'size', 'align', 'bold', 'italic', 'underline', 'strike', 'blockquote', 'list', 'bullet', 'list', 'ordered', 'link', 'image', 'video'];

    return (
        <div>
            <form onSubmit={handleSaveProduct}>
                <div className='adManageMain'>
                    {/* Left side section */}
                    <div className='adManageContentLeft'>
                        <div className='clientDetailHeading'> Primary Image</div>
                        <div className='ManageLeftImg1'>
                            <img src={image} className='ManageLeftImg1' alt="Vehicle_Image" />
                        </div>

                        {/* Additional Images/Videos */}
                        <div className='manageprodMain manageProdSideContents'>
                            <div className='manageprodSideHeading'>Additional Images</div>
                            <div className='adminProductVideoLeft'>
                                <div className='videoPreviewMain'>
                                    {additionalFiles
                                        .filter(file => !file.markedForDeletion)
                                        .slice(0, 5)
                                        .map((file, index) => (
                                            <div key={file.id || file.public_id} className={`videoPreview ${index + 1}`}>
                                                <div className="videoPreviewContainer">
                                                    {file.type === 'video' || (file.url && file.url.match(/\.(mp4|mov|avi|mkv)$/i)) ? (
                                                        <video controls>
                                                            <source src={file.url || file.previewUrl} type="video/mp4" />
                                                        </video>
                                                    ) : (
                                                        <img
                                                            src={file.url || file.previewUrl}
                                                            alt="Preview"
                                                            style={{ objectFit: 'cover', height: '100%', width: '100%' }}
                                                        />
                                                    )}
                                                    <button
                                                        className="deleteButton"
                                                        onClick={() => handleDeleteAdded(file)}
                                                        disabled={uploading}
                                                    >
                                                        ×
                                                    </button>
                                                </div>
                                            </div>
                                        ))}

                                    {Array.from({ length: 5 - additionalFiles.filter(f => !f.markedForDeletion).length }).map((_, index) => (
                                        <div key={`empty_${index}`} className={`videoPreview ${index + 1}`}>
                                            <div className="emptyPreview">No file</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Vehicle details section */}
                        <div className='manageprodMain'>
                            <div className="ManageProdDetails">
                                <div className='ManageProdLeftHeading'>Name</div>
                                <div className='ManageProdRightContent'>{vehicleName}</div>
                            </div>
                            <div className="ManageProdDetails">
                                <div className='ManageProdLeftHeading'>Price</div>
                                <div className='ManageProdRightContent'>₹ {vehicleAmount} Per Day </div>
                            </div>
                            <div className="ManageProdDetails">
                                <div className='ManageProdLeftHeading'>LED Screen Size</div>
                                <div className='ManageProdRightContent'>{vehicleWidth} X {vehicleHeight} | {ProdSquareFeet()} Sq.ft </div>
                            </div>
                            <div className="ManageProdDetails">
                                <div className='ManageProdLeftHeading'>Delivery</div>
                                <div className='ManageProdRightContent'>{vehicleDeliveryDay} - Day</div>
                            </div>
                            <div className="ManageProdDetails">
                                <div className='ManageProdLeftHeading'>Audio</div>
                                <div className='ManageProdRightContent'>{vehicleAudio}</div>
                            </div>
                            <div className="ManageProdDetails">
                                <div className='ManageProdLeftHeading'>Branding</div>
                                <div className='ManageProdRightContent'>{vehicleBranding}</div>
                            </div>
                            <div className="ManageProdDetails">
                                <div className='ManageProdLeftHeading'>Power</div>
                                <div className='ManageProdRightContent'>{vehiclePower}</div>
                            </div>
                            <div className="ManageProdDetails">
                                <div className='ManageProdLeftHeading'>Rating</div>
                                <div className='ManageProdRightContent'>
                                    <span className='Product-star-main'>
                                        {/* <span><img src='./images/rating_board.png' className='Product-rate-board1' alt="Rating" style={{ width: 'max-content' }} /></span> */}
                                        <span>
                                        {/* <RatingStars rating={vehicleRating} /> */}
                                        {vehicleRating}
                                         </span>
                                    </span>
                                </div>
                            </div>
                        </div>


                        {/* VEHICLE COUNT SHOWN SECTION  */}
                        <div className='manageprodMain'>
                            <div className="ManageProdDetails">
                                <div className='ManageProdLeftHeading ManageProdLeftHeadingCount'>Over All Vehicles</div>
                                <div className='ManageProdRightContent'>{vehicleAvailableOverAllCount}</div>
                            </div>
                            <div className="ManageProdDetails">
                                <div className='ManageProdLeftHeading ManageProdLeftHeadingCount'>Booked Vehicles</div>
                                <div className='ManageProdRightContent'>{vehicleAvailableBookedCount}</div>
                            </div>
                            <div className="ManageProdDetails">
                                <div className='ManageProdLeftHeading ManageProdLeftHeadingCount'>Balance Vehicles</div>
                                <div className='ManageProdRightContent'>{vehicleAvailableBalanceCount}</div>
                            </div>
                        </div>



                        {/* Similar Vehicles Section - CORRECTED */}
                        <div className='manageprodMain'>
                            <div className='manageprodSideHeading'>Selected Similar Vehicles</div>
                            {selectedSimilarProducts.length > 0 ? (
                                selectedSimilarProducts.map((vehicle, index) => (
                                    <div className='manageSimilarprod' key={index}>
                                        <div className='manageSimilarImg'>
                                            <img src={vehicle.image} className='manageSimilarImg' alt={vehicle.Name} />
                                        </div>
                                        <div>
                                            <div className='ManageProdRightContent1'>{vehicle.Name}</div>
                                            <div className='manageSimilarProdCode'>{vehicle.VehicleID}</div>
                                        </div>
                                        <div className='similarProdClose' onClick={() => handleRemoveProduct(vehicle.VehicleID)}>
                                            <i className="fa-solid fa-xmark"></i>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className='smilarProdError'>No Similar Vehicles Selected</p>
                            )}
                        </div>
                    </div>

                    {/* Right section */}
                    <div>
                        {/* Primary Image Upload */}
                        <div className='manageClientSection'>
                            <div className='clientDetailHeading'> Primary Image </div>
                            <div className="upload-section">
                                <input type="file" accept="image/*" id='fileInput' onChange={handleImageUpload} hidden />
                                <label htmlFor="fileInput" className={`file-upload-box ${errors.image ? 'AdminProdinput-error' : ''}`}>
                                    <center>
                                        <img src="./images/FileUpload.svg" height={50} width={50} alt="Upload Icon" />
                                    </center>
                                    <div className="upload-text">
                                        <div className="FileHeading">Drag and Drop an Image or Choose File</div>
                                        <span className="file-info">1600 x 1200 (4:3) recommended. PNG, JPG and GIF files are allowed</span>
                                    </div>
                                </label>
                                {errors.image && <div className="AdminProderror-message">Vehicle Main image is required</div>}
                            </div>
                        </div>

                        {/* Additional Images/Videos */}
                        <div className='manageClientSection'>
                            <div className='clientDetailHeading'> Additional Images </div>
                            <div className='adminProductVideoRight'>
                                <center>
                                    <img src="./images/FileUpload.svg" height={50} width={50} alt="Upload Icon" />
                                </center>
                                <input
                                    type='file'
                                    accept='video/*,image/*'
                                    onChange={handleFileChangeAdded}
                                    multiple
                                    disabled={uploading || additionalFiles.filter(f => !f.markedForDeletion).length >= 5}
                                />
                                <p>
                                    {uploading ? 'Uploading...' : `Upload ${5 - additionalFiles.filter(f => !f.markedForDeletion).length} or more files`}
                                </p>
                            </div>
                        </div>

                        {/* Vehicle Management Section */}
                        <div className='manageClientSection'>
                            <div className='manageRightSideHeading'>Vehicle Management</div>
                            <div className='d-flex manageClientInformation'>
                                <div className='manageClientInfoLeft'>
                                    <div className='clientDetailSection'>
                                        <div className='clientDetailHeading'>Vehicle Name</div>
                                        <input
                                            type='text'
                                            placeholder='Enter Vehicle Name'
                                            value={vehicleName}
                                            onChange={(e) => {
                                                setVehicleName(e.target.value);
                                                setErrors(prev => ({ ...prev, vehicleName: false }));
                                            }}
                                            className={`clientDetailsInput ${errors.vehicleName ? 'AdminProdinput-error' : ''}`}
                                        />
                                        {errors.vehicleName && <div className="AdminProderror-message">Vehicle name is required</div>}
                                    </div>

                                    <div className='clientDetailSection'>
                                        <div className='clientDetailHeading'>Price</div>
                                        <input
                                            type='number'
                                            placeholder='Enter Price'
                                            value={vehicleAmount}
                                            onChange={(e) => {
                                                setVehicleAmount(e.target.value);
                                                setErrors(prev => ({ ...prev, vehicleAmount: false }));
                                            }}
                                            className={`clientDetailsInput ${errors.vehicleAmount ? 'AdminProdinput-error' : ''}`}
                                        />
                                        {errors.vehicleAmount && <div className="AdminProderror-message">Vehicle Amount is required</div>}
                                    </div>

                                    <div className='clientDetailSection'>
                                        <div className='clientDetailHeading'>Delivery Day</div>
                                        <select style={{ width: '100px' }}
                                            className={`clientDetailsInput ratingInput ${errors.vehicleDeliveryDay ? 'AdminProdinput-error' : ''}`}
                                            value={vehicleDeliveryDay}
                                            onChange={(e) => setVehicleDeliveryDay(e.target.value)}
                                        >
                                            <option value="">Select</option>
                                            <option value="1">1</option>
                                            <option value="2">2</option>
                                            <option value="3">3</option>
                                            <option value="4">4</option>
                                            <option value="5">5</option>
                                            <option value="6">6</option>
                                            <option value="7">7</option>
                                            <option value="8">8</option>
                                            <option value="9">9</option>
                                        </select>
                                        {errors.vehicleDeliveryDay && <div className="AdminProderror-message">Vehicle Delivery Day is required</div>}
                                    </div>

                                    <div className='clientDetailSection'>
                                        <div className='clientDetailHeading'>Branding</div>
                                        <input
                                            type='text'
                                            placeholder='Enter Branding'
                                            value={vehicleBranding}
                                            onChange={(e) => {
                                                setVehicleBranding(e.target.value);
                                                setErrors(prev => ({ ...prev, vehicleBranding: false }));
                                            }}
                                            className={`clientDetailsInput ${errors.vehicleBranding ? 'AdminProdinput-error' : ''}`}
                                        />
                                        {errors.vehicleBranding && <div className="AdminProderror-message">Vehicle Branding is required</div>}
                                    </div>
                                </div>

                                <div className='manageClientInfoRight'>
                                    <div className='clientDetailSection'>
                                        <div className='clientDetailHeading'>Vehicle ID</div>
                                        <input
                                            type='text'
                                            placeholder='Enter Vehicle ID'
                                            value={vehicleID}
                                            onChange={(e) => {
                                                setVehicleId(e.target.value);
                                                setErrors(prev => ({ ...prev, vehicleID: false }));
                                            }}
                                            className={`clientDetailsInput ${errors.vehicleID ? 'AdminProdinput-error' : ''}`}
                                        />
                                        {errors.vehicleID && <div className="AdminProderror-message">Vehicle ID is required</div>}
                                    </div>

                                    <div className='clientDetailSection'>
                                        <div className='clientDetailHeading'>Size</div>
                                        <div className='sizeWidthValues'>
                                            W : <input
                                                type='number'
                                                value={vehicleWidth}
                                                onChange={(e) => {
                                                    setVehicleWidth(e.target.value);
                                                    setErrors(prev => ({ ...prev, vehicleWidth: false }));
                                                }}
                                                className={`sizeWidthInput ${errors.vehicleWidth ? 'AdminProdinput-error' : ''}`}
                                            />
                                            <span className='sizeMultiply'> X </span>
                                            H : <input
                                                type='number'
                                                value={vehicleHeight}
                                                onChange={(e) => {
                                                    setVehicleHeight(e.target.value);
                                                    setErrors(prev => ({ ...prev, vehicleHeight: false }));
                                                }}
                                                className={`sizeWidthInput ${errors.vehicleHeight ? 'AdminProdinput-error' : ''}`}
                                            />
                                            <span className='sizeWidthSlash'> | </span>
                                            <label> {ProdSquareFeet()} </label>Sq.ft
                                            {(errors.vehicleWidth || errors.vehicleHeight) && <div className="AdminProderror-message">Vehicle Height & Width is required</div>}
                                        </div>
                                    </div>

                                    <div className='clientDetailSection'>
                                        <div className='clientDetailHeading'>Audio</div>
                                        <input
                                            type='text'
                                            placeholder='Enter Audio'
                                            value={vehicleAudio}
                                            onChange={(e) => {
                                                setVehicleAudio(e.target.value);
                                                setErrors(prev => ({ ...prev, vehicleAudio: false }));
                                            }}
                                            className={`clientDetailsInput ${errors.vehicleAudio ? 'AdminProdinput-error' : ''}`}
                                        />
                                        {errors.vehicleAudio && <div className="AdminProderror-message">Vehicle Audio is required</div>}
                                    </div>

                                    <div className='clientDetailSection'>
                                        <div className='clientDetailHeading'>Power</div>
                                        <input
                                            type='text'
                                            placeholder='Enter Power'
                                            value={vehiclePower}
                                            onChange={(e) => {
                                                setVehiclePower(e.target.value);
                                                setErrors(prev => ({ ...prev, vehiclePower: false }));
                                            }}
                                            className={`clientDetailsInput ${errors.vehiclePower ? 'AdminProdinput-error' : ''}`}
                                        />
                                        {errors.vehiclePower && <div className="AdminProderror-message">Vehicle Power is required</div>}
                                    </div>
                                </div>
                            </div>
                        </div>







                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            {/* AVAILABLE VEHICLE COUNT ADD SECTION   */}
                            {/* <div> */}
                            <div className='manageClientSection' style={{ width: '400px', border: '1px solid red' }} >
                                <div className='clientDetailHeading'>Available Vehicles</div>
                                {/* Availability Content */}
                                <div>
                                    {/* Over All Vehicles */}
                                    <div className='rdShowAvailVehBtnContentBelowAdmin' >
                                        <div className='clientDetailHeading' >Over All Vehicles</div>
                                        <div > - </div>
                                        <div >

                                            <input
                                                type='number'
                                                value={vehicleAvailableOverAllCount}
                                                onChange={(e) => {
                                                    setVehicleAvailableOverAllCount(e.target.value);
                                                    setErrors(prev => ({ ...prev, vehicleAvailableOverAllCount: false }));
                                                }}
                                                className={`sizeWidthInput ${errors.vehicleAvailableOverAllCount ? 'AdminProdinput-error' : ''}`}
                                            />
                                        </div>
                                    </div>
                                    {/* Booked Vehicles  */}
                                    <div className='rdShowAvailVehBtnContentBelowAdmin'>
                                        <div className='clientDetailHeading' >Booked Vehicles</div>
                                        <div > - </div>
                                        <div >
                                            <input
                                                type='number'
                                                value={vehicleAvailableBookedCount}
                                                onChange={(e) => {
                                                    setVehicleAvailableBookedCount(e.target.value);
                                                    setErrors(prev => ({ ...prev, vehicleAvailableBookedCount: false }));
                                                }}
                                                className={`sizeWidthInput ${errors.vehicleAvailableBookedCount ? 'AdminProdinput-error' : ''}`}
                                            />
                                        </div>
                                    </div>
                                    {/* Balance Vehicles  */}
                                    <div className='rdShowAvailVehBtnContentBelowAdmin'>
                                        <div className='clientDetailHeading' >Balance Vehicles</div>
                                        <div > - </div>
                                        <div >
                                            <input
                                                type='number'
                                                value={vehicleAvailableBalanceCount}
                                                onChange={(e) => {
                                                    setVehicleAvailableBalanceCount(e.target.value);
                                                    setErrors(prev => ({ ...prev, vehicleAvailableBalanceCount: false }));
                                                }}
                                                className={`sizeWidthInput ${errors.vehicleAvailableBalanceCount ? 'AdminProdinput-error' : ''}`}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* </div> */}


                            {/* Rating Section */}
                            {/* <div style={{ display: 'flex', gap: '10px' }}>
                            <div className='manageClientSection' style={{ width: '40%' }}>
                                <div className='clientDetailHeading'>Ratings</div>
                                <div className='ProductRatingMain'>
                                    <div>
                                        <span className='Product-star-main'>
                                            <RatingStars1 rating={parseFloat(vehicleRating) || 0} />
                                        </span>
                                    </div>
                                    <div>
                                        <select
                                            className='clientDetailsInput ratingInput'
                                            value={vehicleRating}
                                            onChange={(e) => handleRatingChange(e.target.value)}
                                        >
                                            <option value="0.0">0.0</option>
                                            <option value="0.5">0.5</option>
                                            <option value="1.0">1.0</option>
                                            <option value="1.5">1.5</option>
                                            <option value="2.0">2.0</option>
                                            <option value="2.5">2.5</option>
                                            <option value="3.0">3.0</option>
                                            <option value="3.5">3.5</option>
                                            <option value="4.0">4.0</option>
                                            <option value="4.5">4.5</option>
                                            <option value="5.0">5.0</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div> */}


                            <div >
                                <div className='manageClientSection' style={{ width: '200px' }}>
                                    <div className='clientDetailHeading'>Ratings</div>
                                    <div className='ProductRatingMain'>
                                        <div>
                                            <input
                                                type='text'
                                                value={vehicleRating}
                                                onChange={(e) => {
                                                    setVehicleRating(e.target.value);
                                                    setErrors(prev => ({ ...prev, vehicleRating: false }));
                                                }}
                                                className={`sizeWidthInput ${errors.vehicleRating ? 'AdminProdinput-error' : ''}`}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>


                        {/* Similar Vehicles Section - CORRECTED */}
                        <div className='manageClientSection'>
                            <div className='clientDetailHeading'>Similar Vehicles</div>
                            <div className='manageClientInformation'>
                                <div className='manageClientInfoLeft' style={{ position: 'relative' }}>
                                    <input
                                        type='text'
                                        placeholder='Vehicle ID or Name'
                                        value={similarProdId}
                                        onChange={handleSearchChange}
                                        className='clientDetailsInput'
                                    />
                                    {searchSuggestions.length > 0 && (
                                        <div className="suggestions-dropdown">
                                            {searchSuggestions.map((vehicle) => (
                                                <div
                                                    key={vehicle._id}
                                                    className="suggestion-item"
                                                    onClick={() => handleSuggestionClick(vehicle)}
                                                >
                                                    <div className="suggestion-code">
                                                        {vehicle.vehicleDetails?.vehicleID}
                                                    </div>
                                                    <div className="suggestion-name">
                                                        {vehicle.vehicleDetails?.name}
                                                    </div>
                                                    <div className="suggestion-image">
                                                        <img
                                                            src={vehicle.vehicleDetails?.image}
                                                            alt={vehicle.vehicleDetails?.name}
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <div className='manageClientInfoRight'>
                                    <div
                                        className='manageProductSelectBtn'
                                        onClick={handleSelectProduct}
                                    >
                                        Select
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Rich Text Editor */}
                <div className='richTextEditorMain'>
                    <div className='BlogContentEditorMain'>
                        <div className='BlogContentEditor'>
                            <ReactQuill
                                theme="snow"
                                value={richTextContent}
                                onChange={setRichTextContent}
                                modules={modules}
                                formats={formats}
                                className='BlogContentEditor-frame'
                            />
                        </div>
                        <div className='BlogContentPreview'>
                            <h4 className="text-center">Vehicle Description</h4>
                            <div
                                className='preview-content'
                                dangerouslySetInnerHTML={{ __html: richTextContent }}
                            />
                        </div>
                    </div>
                </div>

                <button
                    className="calendarSaveBtn"
                    type='submit'
                    disabled={uploading}
                >
                    {uploading ? 'Processing...' : (editVehicle ? 'Update' : 'Save')}
                </button>
            </form>
        </div>
    )
}

export default VehicleUpload;