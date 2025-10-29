import React, { useState, useRef, useEffect } from 'react'
import Navbar from './a1Navbar';
import Footer from './a3Footer';
import { MainLayout } from '../Authentication/MainLayout';
import '../components/a2VehicleTypesDetails.css';
import { useVehicle } from './A_VehicleContext';
import { useParams } from "react-router-dom";
import { baseUrl } from '../Authentication/BASE_URL';

function AdminVehicleDetails() {
    const { vehicleId } = useParams();
    const { selectedVehicle, setSelectedVehicle } = useVehicle();

    const [currentVehicle, setCurrentVehicle] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [additionalFiles, setAdditionalFiles] = useState([]);
    const [currentMainImage, setCurrentMainImage] = useState('');
    const [currentPreviewType, setCurrentPreviewType] = useState('image');
    const [currentVideoUrl, setCurrentVideoUrl] = useState('');
    const [selectedFileIndex, setSelectedFileIndex] = useState(-1);

    const videoRef = useRef(null);

    useEffect(() => {
        const fetchVehicle = async () => {
            try {
                setIsLoading(true);

                // If vehicle is already in context (from home page click)
                if (selectedVehicle) {
                    console.log("Using context vehicle:", selectedVehicle);
                    setCurrentVehicle(selectedVehicle);
                    setAdditionalFiles(selectedVehicle.additionalFiles || []);
                    setCurrentMainImage(selectedVehicle.image);
                    setSelectedFileIndex(-1);
                    setIsLoading(false);
                    return;
                }

                // If accessed via direct URL, fetch the vehicle
                if (vehicleId) {
                    const actualId = vehicleId.split('-')[0];
                    console.log("Fetching vehicle with ID:", actualId);
                    const response = await fetch(`${baseUrl}/vehicles/${actualId}`);

                    if (!response.ok) {
                        throw new Error('Vehicle not found');
                    }

                    const data = await response.json();
                    console.log("Fetched vehicle data:", data);

                    const mappedVehicle = {
                        _id: data._id,
                        vehicleID: data.vehicleDetails.vehicleID,
                        name: data.vehicleDetails.name,
                        amount: data.vehicleDetails.amount,
                        deliveryDay: data.vehicleDetails.deliveryDay,
                        audio: data.vehicleDetails.audio,
                        branding: data.vehicleDetails.branding,
                        power: data.vehicleDetails.power,
                        rating: data.vehicleDetails.rating,
                        vehicleWidth: data.vehicleDetails.vehicleSize.width,
                        vehicleHeight: data.vehicleDetails.vehicleSize.height,
                        VehicleSizeSquareFeet: data.vehicleDetails.vehicleSize.VehicleSizeSquareFeet,
                        image: data.vehicleDetails.image,
                        overAllCount: data.vehicleDetails.vehicleCount.OverAllCount,
                        bookedCount: data.vehicleDetails.vehicleCount.BookedCount,
                        balanceCount: data.vehicleDetails.vehicleCount.BalanceCount,
                        additionalFiles: data.vehicleDetails.additionalFiles || [],
                        vehicleDescription: data.vehicleDetails.vehicleDescription,
                        similarVehicles: data.similarVehicles || []
                    };

                    setCurrentVehicle(mappedVehicle);
                    setAdditionalFiles(data.vehicleDetails.additionalFiles || []);
                    setCurrentMainImage(data.vehicleDetails.image);
                    setSelectedVehicle(mappedVehicle);
                    setSelectedFileIndex(-1);
                }
            } catch (error) {
                console.error("Error fetching vehicle:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchVehicle();
    }, [vehicleId, selectedVehicle, setSelectedVehicle]);

    // Image/Video change handler
    const handleFileChange = (file, index) => {
        if (file.type === 'video' || (file.url && file.url.match(/\.(mp4|mov|avi|mkv)$/i))) {
            setCurrentPreviewType('video');
            setCurrentVideoUrl(file.url);
            setSelectedFileIndex(index);
        } else {
            setCurrentPreviewType('image');
            setCurrentMainImage(file.url);
            setCurrentVideoUrl('');
            setSelectedFileIndex(index);
        }
    };

    // Handle main image click to reset to original
    const handleMainImageClick = () => {
        if (currentVehicle && currentVehicle.image) {
            setCurrentMainImage(currentVehicle.image);
            setCurrentPreviewType('image');
            setCurrentVideoUrl('');
            setSelectedFileIndex(-1);
        }
    };

    // Check if a file is currently selected
    const isFileSelected = (index) => {
        return selectedFileIndex === index;
    };

    // Check if main image is selected
    const isMainImageSelected = () => {
        return selectedFileIndex === -1;
    };
    //VEHICLE AVAILABILITY SHOWN SECTION
    // NEW STATE: Track if availability section is visible
    const [showAvailability, setShowAvailability] = useState(false);

    // NEW FUNCTION: Toggle availability section visibility
    const toggleAvailability = () => {
        setShowAvailability(!showAvailability);
    };
    // Close availability modal when clicking outside
    const handleBackdropClick = (e) => {
        if (e.target.classList.contains('availability-backdrop')) {
            setShowAvailability(false);
        }
    };
    //LOADING STATES
    if (isLoading) {
        return (
            <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    if (!currentVehicle) {
        return (
            <div className="text-center py-5">
                <div>Vehicle not found</div>
            </div>
        );
    }

    return (
        <MainLayout>
            <div>
                <Navbar />
                <div className='container my-5'>
                    <div className='row'>
                        <div className='col-md-6 vehicleDetailsImgSection'>
                            <div className='book-mainImage'>
                                {currentPreviewType === 'video' ? (
                                    <video className='book-mainImg1'
                                        ref={videoRef}
                                        key={currentVideoUrl}
                                        controls
                                        autoPlay
                                    >
                                        <source src={currentVideoUrl} type="video/mp4" />
                                        Your browser does not support the video tag.
                                    </video>
                                ) : (
                                    <img
                                        src={currentMainImage || currentVehicle?.imageUrl}
                                        className="img-fluid book-mainImg1"
                                        alt="Large image"
                                        onClick={handleMainImageClick}
                                    />
                                )}
                            </div>

                            {/* Horizontal Scroll Version */}
                            <div className='item-scroll-additional horizontal'>
                                <div className='book-images-section horizontal'>
                                    {/* Main Image Thumbnail */}
                                    <div
                                        className={`book-images ${isMainImageSelected() ? 'selected' : ''}`}
                                        onClick={handleMainImageClick}
                                        style={{ cursor: 'pointer' }}>
                                        <img
                                            src={currentVehicle?.image}
                                            className="img-fluid book-img11"
                                            alt="Main VehicleImg"
                                        />
                                    </div>

                                    {/* Additional Files Thumbnails */}
                                    {additionalFiles.map((file, index) => (
                                        <div
                                            key={index}
                                            className={`book-images ${isFileSelected(index) ? 'selected' : ''}`}
                                            onClick={() => handleFileChange(file, index)}
                                            style={{ cursor: 'pointer' }}>
                                            {file.type === 'video' || (file.url && file.url.match(/\.(mp4|mov|avi|mkv)$/i)) ? (
                                                <div className="video-thumbnail-wrapper">
                                                    <video className='book-img11'
                                                        muted
                                                        preload="metadata"
                                                    >
                                                        <source src={file.url} type="video/mp4" />
                                                    </video>
                                                    <div className="video-play-icon">▶</div>
                                                </div>
                                            ) : (
                                                <img
                                                    src={file.url}
                                                    className="img-fluid book-img11"
                                                    alt={`Additional ${index + 1}`}
                                                />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className='col-md-6 vehicleDetailsContentRight'>
                            {/* Vehicle Details */}
                            <div className='rdVehDetailsPgContent1'>
                                <div className='rdAvailVehName1 rdVehProdDetailsHeading'>{currentVehicle.name}</div>
                                <div className='rdAvailVehRate1'>₹ {currentVehicle.amount.toLocaleString()} / Per Day</div>
                                <div className='rdAvailVehRatingStarMain1'>
                                    <div className='rdAvailVehRatingStar1'>{currentVehicle.rating}</div>
                                    <div>
                                        <img src='/images/AvailVehRatingStar.png' className='rdAvailVehRatingStarIcon1' alt="Rating" />
                                    </div>
                                </div>
                            </div>

                            {/* Date Selection */}
                            <div className='rdVehDetailsPgContent1'>
                                <div className='rdVehDetailsPgContent1Heading rdVehProdDetailsHeading'>Select Date</div>
                                <div className='rdVehDetailsPgContent1DateFromToMain'>
                                    <div>
                                        <div className='rdVehDetailsPgContent1DateFromTo'>From</div>
                                        <div className='rdVehDetailsPgContent1Date'>Select Date</div>
                                    </div>
                                    <div>
                                        <div className='rdVehDetailsPgContent1DateFromTo'>To</div>
                                        <div className='rdVehDetailsPgContent1Date'>Select Date</div>
                                    </div>
                                </div>
                            </div>

                            {/* Reach Us Button */}
                            <div className='rdVehDetailsPgContent1'>
                                <button className='rdAvailVehDtsReachUsBtn'>
                                    <div>
                                        <img src='/images/rdAvailVehDtsReachUsCallIcon.png' className='rdAvailVehDtsReachUsCallIcon' alt="Call" />
                                    </div>
                                    <div>Reach Us</div>
                                </button>
                            </div>

                            {/* Product Details */}
                            <div className='rdVehDetailsPgContent1'>
                                <div className='rdVehProdDetailsHeading rdVehDetailsPgContent2Heading'>Product Details</div>
                                <div className='rdVehDetailedShownMain'>
                                    <div className='rdVehDetailedShownContent'>
                                        <div className='rdVehDetailedShownContentLeft'>Delivery</div>
                                        <div> : </div>
                                        <div className='rdVehDetailedShownContentRight'>{currentVehicle.deliveryDay} Day(s)</div>
                                    </div>
                                    <div className='rdVehDetailedShownContent'>
                                        <div className='rdVehDetailedShownContentLeft'>Vehicle Size</div>
                                        <div> : </div>
                                        <div className='rdVehDetailedShownContentRight'>{currentVehicle.vehicleWidth} x {currentVehicle.vehicleHeight} ft ({currentVehicle.VehicleSizeSquareFeet} sq.ft)</div>
                                    </div>
                                    <div className='rdVehDetailedShownContent'>
                                        <div className='rdVehDetailedShownContentLeft'>Audio</div>
                                        <div> : </div>
                                        <div className='rdVehDetailedShownContentRight'>{currentVehicle.audio}</div>
                                    </div>
                                    <div className='rdVehDetailedShownContent'>
                                        <div className='rdVehDetailedShownContentLeft'>Branding</div>
                                        <div> : </div>
                                        <div className='rdVehDetailedShownContentRight'>{currentVehicle.branding}</div>
                                    </div>
                                    <div className='rdVehDetailedShownContent'>
                                        <div className='rdVehDetailedShownContentLeft'>Power</div>
                                        <div> : </div>
                                        <div className='rdVehDetailedShownContentRight'>{currentVehicle.power}</div>
                                    </div>
                                </div>

                                {/* ADMIN SPECIFIC CONTENT - Vehicle Availability Button */}
                                <div className='rdVehDetailsPgContent1'>
                                    <button
                                        className='adminVehDetailsAvailabilityBtn'
                                        onClick={toggleAvailability}
                                    >
                                        Vehicle Availability
                                    </button>
                                </div>


                                {/* Vehicle Description */}
                                {currentVehicle.vehicleDescription && (
                                    <div className='rdVehProdDetailsDescription'>
                                        <div
                                            className='rdVehProdDetailsDescriptionContent'
                                            dangerouslySetInnerHTML={{ __html: currentVehicle.vehicleDescription }}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Past Roadshow  */}
                <div className='container'>
                    <div className='PastRdShowMain'>
                        <div className='rdVehProdDetailsHeading rdVehDetailsPgContent1Heading pastRdHeading'>Past Roadshow</div>
                        <div className='row'>
                            {currentVehicle.similarVehicles && currentVehicle.similarVehicles.length > 0 ? (
                                currentVehicle.similarVehicles.map((similarVehicle, index) => (
                                    <div className='col-md-12 PastRoadShowContent' key={index}>
                                        <center>
                                            <img src={similarVehicle.image} className='PastRoadShowImg' alt={`Past Roadshow ${index + 1}`} />
                                        </center>
                                    </div>
                                ))
                            ) : (
                                <div className="col-12 text-center">
                                    <p>No similar vehicles available</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <Footer />
            </div>












            {/* Vehicle Availability Section - Conditionally Rendered */}
            {/* {showAvailability && (
                                    <div className='rdShowAvailVehBtnContentMain'>
                                        <div>
                                            <div className='rdShowAvailVehBtnContentBelow'>
                                                <div className='rdShowAvailVehBtnContentHeading'>Over All Vehicles</div>
                                                <div className='rdShowAvailVehBtnContentHypen'> - </div>
                                                <div className='rdShowAvailVehBtnContentHypen'> {currentVehicle.overAllCount} </div>
                                            </div>
                                            <div className='rdShowAvailVehBtnContentBelow'>
                                                <div className='rdShowAvailVehBtnContentHeading'>Booked Vehicles</div>
                                                <div className='rdShowAvailVehBtnContentHypen'> - </div>
                                                <div className='rdShowAvailVehBtnContentHypen'>{currentVehicle.bookedCount} </div>
                                            </div>
                                            <div className='rdShowAvailVehBtnContentBelow'>
                                                <div className='rdShowAvailVehBtnContentHeading'>Balance Vehicles</div>
                                                <div className='rdShowAvailVehBtnContentHypen'> - </div>
                                                <div className='rdShowAvailVehBtnContentHypen'>{currentVehicle.balanceCount} </div>
                                            </div>
                                        </div>

                                        <div className='rdShowAvailVehBtnContentMainCloseBtn' onClick={toggleAvailability}>
                                            <img src='/images/rdShowAvailVehBtnContentMainCloseBtn.png' className='rdShowAvailVehBtnContentMainCloseBtn'></img>
                                        </div>

                                    </div>
                                )} */}

            {/* Vehicle Availability Modal - Conditionally Rendered */}
            {showAvailability && (
                <div
                    className='availability-backdrop'
                    onClick={handleBackdropClick}
                >
                    <div className='availability-modal'>
                        <div className='availability-content'>
                            <div className='availability-header'>
                                <h3>Vehicle Availability</h3>
                                <button
                                    className='availability-close-btn'
                                    onClick={toggleAvailability}
                                >
                                    ×
                                </button>
                            </div>

                            <div className='availability-stats'>
                                <div className='availability-stat-item'>
                                    <div className='stat-label'>Overall Vehicles</div>
                                    <div className='stat-separator'>-</div>
                                    <div className='stat-count'>{currentVehicle.overAllCount}</div>
                                </div>
                                <div className='availability-stat-item'>
                                    <div className='stat-label'>Booked Vehicles</div>
                                    <div className='stat-separator'>-</div>
                                    <div className='stat-count'>{currentVehicle.bookedCount}</div>
                                </div>
                                <div className='availability-stat-item'>
                                    <div className='stat-label'>Balance Vehicles</div>
                                    <div className='stat-separator'>-</div>
                                    <div className='stat-count'>{currentVehicle.balanceCount}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}





        </MainLayout>
    )
}

export default AdminVehicleDetails;



























