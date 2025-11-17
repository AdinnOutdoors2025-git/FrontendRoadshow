import React, { useState, useRef, useEffect } from 'react'
import Navbar from './a1Navbar'
import Footer from './a3Footer'
import './a2VehicleTypesDetails.css';
import { useVehicle } from './A_VehicleContext';
import { useParams } from "react-router-dom";
import { baseUrl } from '../Authentication/BASE_URL';
// import './b2book.css';
import { MainLayout } from '../Authentication/MainLayout';

function VehicleTypesDetails() {
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
                        // deliveryDay: data.vehicleDetails.deliveryDay,
                        screenResolution: data.vehicleDetails.screenresolution,
                        audio: data.vehicleDetails.audio,
                        // branding: data.vehicleDetails.branding,
                        power: data.vehicleDetails.power,
                        rating: data.vehicleDetails.rating,
                        vehicleWidth: data.vehicleDetails.vehicleSize.width,
                        vehicleHeight: data.vehicleDetails.vehicleSize.height,
                        VehicleSizeSquareFeet: data.vehicleDetails.vehicleSize.VehicleSizeSquareFeet,
                        image: data.vehicleDetails.image, 
                          overAllCount : data.vehicleDetails.vehicleCount.OverAllCount,
                        bookedCount : data.vehicleDetails.vehicleCount.BookedCount,
                        balanceCount : data.vehicleDetails.vehicleCount.BalanceCount,
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

    // if (isLoading) {
    //     return (
    //         <div className="text-center py-5">
    //             <div className="spinner-border text-primary" role="status">
    //                 <span className="visually-hidden">Loading...</span>
    //             </div>
    //         </div>
    //     );
    // }

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
                        {/* <div className='main-media-display'>
                            {currentPreviewType === 'video' ? (
                                <video
                                    className='RdVehicleDetailsMainImg'
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
                                    src={currentMainImage || currentVehicle.image}
                                    className='RdVehicleDetailsMainImg'
                                    alt={currentVehicle.name}
                                    onClick={handleMainImageClick}
                                    style={{ cursor: 'pointer' }}
                                />
                            )}
                        </div>

                        <div className='RdVehicleDetailsSubImgMain'>
                            <div
                                className={`thumbnail-container ${isMainImageSelected() ? 'selected' : ''}`}
                                onClick={handleMainImageClick}
                            >
                                <img
                                    src={currentVehicle.image}
                                    className='RdVehicleDetailsSubImg'
                                    alt="Main"
                                />
                            </div>

                            {additionalFiles.map((file, index) => (
                                <div
                                    key={index}
                                    className={`thumbnail-container ${isFileSelected(index) ? 'selected' : ''}`}
                                    onClick={() => handleFileChange(file, index)}
                                >
                                    {file.type === 'video' || (file.url && file.url.match(/\.(mp4|mov|avi|mkv)$/i)) ? (
                                        <div className="video-thumbnail">
                                            <video
                                                className='RdVehicleDetailsSubImg'
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
                                            className='RdVehicleDetailsSubImg'
                                            alt={`Additional ${index + 1}`}
                                        />
                                    )}
                                </div>
                            ))}
                        </div> */}


                        <div className='book-mainImage'>
                            {currentPreviewType === 'video' ? (
                                <video className='book-mainImg1'
                                    ref={videoRef}
                                    key={currentVideoUrl} // Add key to force re-render
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


                        {/* <div className='item-scroll-additional'>
                            <div className='book-images-section'>
                                <div
                                    className={`book-images ${isMainImageSelected() ? 'selected' : ''}`}
                                    onClick={() => handleMainImageClick()}
                                    style={{ cursor: 'pointer' }}>
                                    <img
                                        src={currentVehicle?.image}
                                        className="img-fluid book-img11"
                                        alt="Main VehicleImg"
                                    />
                                </div>
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
                                                    onLoadedData={(e) => {
                                                        if (e.target.duration) {
                                                            e.target.currentTime = 0;
                                                        }
                                                    }}
                                                    onSeeked={(e) => {
                                                        e.target.pause();
                                                    }}
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
                                                style={{
                                                    width: '100%',
                                                    height: '100%',
                                                    objectFit: 'cover',
                                                }}
                                            />
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div> */}



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

                    <div className='col-md-6 vehicleDetailsContentRight ' 
                  //  style={{height:'700px', overflowX:'hidden', overflowY:'scroll'}}
                    >
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
                                {/* <div className='rdVehDetailedShownContent'>
                                    <div className='rdVehDetailedShownContentLeft'>Delivery</div>
                                    <div> : </div>
                                    <div className='rdVehDetailedShownContentRight'>{currentVehicle.deliveryDay} Day(s)</div>
                                </div> */}
                                <div className='rdVehDetailedShownContent'>
                                    <div className='rdVehDetailedShownContentLeft'>Screen Size</div>
                                    <div> : </div>
                                    <div className='rdVehDetailedShownContentRight'>{currentVehicle.vehicleWidth} x {currentVehicle.vehicleHeight} ft ({currentVehicle.VehicleSizeSquareFeet} sq.ft)</div>
                                </div>
                                <div className='rdVehDetailedShownContent'>
                                    <div className='rdVehDetailedShownContentLeft'>Screen Resolution</div>
                                    <div> : </div>
                                    <div className='rdVehDetailedShownContentRight'>{currentVehicle.screenResolution}</div>
                                </div>
                                <div className='rdVehDetailedShownContent'>
                                    <div className='rdVehDetailedShownContentLeft'>Audio</div>
                                    <div> : </div>
                                    <div className='rdVehDetailedShownContentRight'>{currentVehicle.audio}</div>
                                </div>
                                {/* <div className='rdVehDetailedShownContent'>
                                    <div className='rdVehDetailedShownContentLeft'>Branding</div>
                                    <div> : </div>
                                    <div className='rdVehDetailedShownContentRight'>{currentVehicle.branding}</div>
                                </div> */}
                                <div className='rdVehDetailedShownContent'>
                                    <div className='rdVehDetailedShownContentLeft'>Power</div>
                                    <div> : </div>
                                    <div className='rdVehDetailedShownContentRight'>{currentVehicle.power}</div>
                                </div>
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

            {/* Similar Vehicles Section (Replaces Past Roadshow) */}
            {/* <div className='container'>
                <div className='PastRdShowMain'>
                    <div className='rdVehProdDetailsHeading rdVehDetailsPgContent1Heading pastRdHeading'>
                        Similar Vehicles
                    </div>
                    <div className='row'>
                        {currentVehicle.similarVehicles && currentVehicle.similarVehicles.length > 0 ? (
                            currentVehicle.similarVehicles.map((similarVehicle, index) => (
                                <div key={index} className='col-md-4 PastRoadShowContent'>
                                    <div className="similar-vehicle-card">
                                        <img 
                                            src={similarVehicle.image} 
                                            className='PastRoadShowImg' 
                                            alt={similarVehicle.Name}
                                        />
                                        <div className="similar-vehicle-info">
                                            <div className="similar-vehicle-name">{similarVehicle.Name}</div>
                                            <div className="similar-vehicle-price">
                                                ₹ {similarVehicle.vehiclePrice.toLocaleString()} / Day
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-12 text-center">
                                <p>No similar vehicles available</p>
                            </div>
                        )}
                    </div>
                </div>
            </div> */}



            {/* Past Roadshow  */}
            <div className='container'>
                <div className='PastRdShowMain'>
                    <div className='rdVehProdDetailsHeading rdVehDetailsPgContent1Heading pastRdHeading'>Past Roadshow</div>
                    <div className='row'>

                        {currentVehicle.similarVehicles && currentVehicle.similarVehicles.length > 0 ? (
                            currentVehicle.similarVehicles.map((similarVehicle, index) => (
                                <div className='col-md-12 PastRoadShowContent' >
                                    <center>
                                        <img src={similarVehicle.image} className='PastRoadShowImg'></img>
                                    </center>
                                </div>



                            ))
                        ) : (
                            <div className="col-12 text-center">
                                <p>No similar vehicles available</p>
                            </div>
                        )}
                        {/* <div className='col-md-12 PastRoadShowContent' >
                            <center>
                                <img src='./images/PastRoadShowImg1.png' className='PastRoadShowImg'></img>
                            </center>
                        </div>
                        <div className='col-md-12 PastRoadShowContent' >
                            <center>
                                <img src='./images/PastRoadShowImg2.png' className='PastRoadShowImg'></img>
                            </center>
                        </div>
                        <div className='col-md-12 PastRoadShowContent' >
                            <center>
                                <img src='./images/PastRoadShowImg3.png' className='PastRoadShowImg'></img>
                            </center>
                        </div> */}

                    </div>
                </div>
            </div>




            <Footer />
        </div>
                </MainLayout>

    )
}

export default VehicleTypesDetails;






