import React, { useState, useEffect } from 'react'
import './a1Home.css';
import Navbar from './a1Navbar';
import { useNavigate } from 'react-router-dom';
import Footer from './a3Footer';
import slugify from 'slugify';
import { baseUrl } from '../Authentication/BASE_URL';
import { useVehicle } from './A_VehicleContext';
import { MainLayout } from '../Authentication/MainLayout';

function RdHome() {
    const navigate = useNavigate();
    const [vehicleData, setVehicleData] = useState([]);
    const [isLoading, setIsLoading] = useState(true); // Changed from null to true
    const { setSelectedVehicle } = useVehicle();

    const fetchVehicles = async () => {
        try {
            setIsLoading(true);
            const response = await fetch(`${baseUrl}/vehicles`);
            const result = await response.json();
            const visibleVehicles = result.filter(
                visibleProd => visibleProd.vehicleDetails.visible !== false
            ).slice(0, 3);

            const mappedVehicles = visibleVehicles.map(vehicle => ({
                _id: vehicle._id, // Add this - it's missing in your current code
                vehicleID: vehicle.vehicleDetails.vehicleID,
                name: vehicle.vehicleDetails.name,
                amount: vehicle.vehicleDetails.amount,
                deliveryDay: vehicle.vehicleDetails.deliveryDay,
                audio: vehicle.vehicleDetails.audio,
                branding: vehicle.vehicleDetails.branding,
                power: vehicle.vehicleDetails.power,
                rating: vehicle.vehicleDetails.rating,
                vehicleWidth: vehicle.vehicleDetails.vehicleSize.width,
                vehicleHeight: vehicle.vehicleDetails.vehicleSize.height,
                VehicleSizeSquareFeet: vehicle.vehicleDetails.vehicleSize.VehicleSizeSquareFeet,
                image: vehicle.vehicleDetails.image,
                 overAllCount: vehicle.vehicleDetails.vehicleCount.OverAllCount,
                bookedCount: vehicle.vehicleDetails.vehicleCount.BookedCount,
                balanceCount: vehicle.vehicleDetails.vehicleCount.BalanceCount,
                additionalFiles: vehicle.vehicleDetails.additionalFiles,
                vehicleDescription: vehicle.vehicleDetails.vehicleDescription,
                similarVehicles: vehicle.similarVehicles || [] // Add this for similar vehicles
            }));

            setVehicleData(mappedVehicles);
        }
        catch (err) {
            console.log("Failed to fetch vehicles", err);
        }
        finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchVehicles();
    }, []);

    const handleVehicleDetails = (vehicle) => {
        // CORRECTED: Use the vehicle object directly since it's already mapped
        const vehicleData = {
            _id: vehicle._id,
            vehicleID: vehicle.vehicleID,
            name: vehicle.name,
            amount: vehicle.amount,
            deliveryDay: vehicle.deliveryDay,
            audio: vehicle.audio,
            branding: vehicle.branding,
            power: vehicle.power,
            rating: vehicle.rating,
            vehicleWidth: vehicle.vehicleWidth,
            vehicleHeight: vehicle.vehicleHeight,
            VehicleSizeSquareFeet: vehicle.VehicleSizeSquareFeet,
            image: vehicle.image,
             overAllCount: vehicle.overAllCount,
            bookedCount: vehicle.bookedCount,
            balanceCount: vehicle.balanceCount,
            additionalFiles: vehicle.additionalFiles,
            vehicleDescription: vehicle.vehicleDescription,
            similarVehicles: vehicle.similarVehicles
        };

        // Set the selected vehicle in context
        setSelectedVehicle(vehicleData);

        // Navigate to details page
        navigate(`/vehicleTypesDetails/${vehicleData._id}-${slugify(vehicleData.name)}`);
    }

    if (isLoading) {
        return (
            <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <MainLayout>

        <div>
            {/* Roadshow Navbar section */}
            <Navbar />
<div>
            {/* Roadshow banner*/}
            <div>
                <img src='./images/RoadshowBanner.png' className='rdshowHomeBanner' alt="Roadshow Banner" />
            </div>

            {/* Available Vehicle section */}
            <div className='container rdAvailableVehMain'>
                <div className='RdShowHomeSideHeading'>
                    Available Vehicles
                </div>
                <div className='rdAvailableContentMain'>
                    {vehicleData.map((vehicle) => (
                        <div key={vehicle._id} className='rdAvailContentInside' onClick={() => handleVehicleDetails(vehicle)}>
                            <div>
                                {/* Vehicle Image */}
                                <div className='rdAvailVehImg'>
                                    <img src={vehicle.image} alt={vehicle.name} className='rdAvailVehImg' />
                                </div>

                                {/* Vehicle Details */}
                                <div className='rdAvailVehDetails'>
                                    <div className='rdAvailVehName'> {vehicle.name}</div>
                                    <div className='rdAvailVehRate'>₹ {vehicle.amount.toLocaleString()} / Per Day</div>
                                    <div className='rdAvailVehRatingStar' >
                                        <div> {vehicle.rating} </div>
                                        <div>
                                            <img src='./images/AvailVehRatingStar.png' className='rdAvailVehRatingStarIcon' alt="Rating Star" />
                                        </div>
                                    </div>

                                    {/* View Details Button */}
                                    <button className='rdAvailVehBtn' onClick={() => handleVehicleDetails(vehicle)} >
                                        View Details
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className='container'>
                <button className='rdAvailVehBtn rdAvailVehViewBtn' onClick={() => navigate('/vehicleTypes')} >
                    View All
                </button>
            </div>

            {/* Rest of your existing JSX remains the same */}
            {/* Live RoadShow Activity */}
            <div className='LiveRdShowMain container' >
                <div className='LiveRdShowContentLeft'>
                    <div className='LiveRdShowContentHeading'>Live Roadshow Activity</div>
                    <div className='LiveRdShowContentPara'>Real-time updates of our active roadshow vehicles across cities.</div>
                    <div className='LiveRdShowContentPara'>Currently, 5 vehicles are on the road across Madurai, Coimbatore, Salem, Trichy, and Chennai.</div>
                </div>
                <div className='LiveRdShowContentRight'>
                    <img src='./images/LiveRoadActivityImg.png' className='LiveRdShowContentRight' alt="Live Road Activity" />
                </div>
            </div>

            {/* Why Choose Us */}
            <div className='container my-5'>
                <div className='RdShowHomeSideHeading'>
                    Why Choose Us
                </div>
                <div className='row justify-content-center'>
                    <div className='col-md-3 col-sm-6 text-center mb-4'>
                        <div>
                            <img src='./images/WhyChooseImg1.png' className='img-fluid why-choose-img' alt='RTO Certified' />
                            <div className='whyChooseContent'>RTO Certified</div>
                        </div>
                    </div>
                    <div className='col-md-3 col-sm-6 text-center mb-4'>
                        <div>
                            <img src='./images/WhyChooseImg2.png' className='img-fluid why-choose-img' alt='One-Stop Solution' />
                            <div className='whyChooseContent'> One-Stop Solution</div>
                        </div>
                    </div>
                    <div className='col-md-3 col-sm-6 text-center mb-4'>
                        <div>
                            <img src='./images/WhyChooseImg3.png' className='img-fluid why-choose-img' alt='24/7 Support' />
                            <div className='whyChooseContent'>24/7 Support</div>
                        </div>
                    </div>
                    <div className='col-md-3 col-sm-6 text-center mb-4'>
                        <div>
                            <img src='./images/WhyChooseImg4.png' className='img-fluid why-choose-img' alt='Fast Delivery' />
                            <div className='whyChooseContent'>Fast Delivery</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* HOW IT WORKS */}
            <div className='container my-5'>
                <div className='RdShowHomeSideHeading'>
                    How It Works
                </div>
                <div className='row justify-content-center howItWorksMain'>
                    <div className='col-md-4 col-sm-6 text-center '>
                        <div>
                            <img src='./images/HowItWorksImg1.png' className='img-fluid howItWorksImg' alt='Select' />
                            <div className='whyChooseContent howItWorksContent'>Select</div>
                        </div>
                    </div>
                    <div className='col-md-4 col-sm-6 text-center '>
                        <div>
                            <img src='./images/HowItWorksImg2.png' className='img-fluid howItWorksImg' alt='Book' />
                            <div className='whyChooseContent howItWorksContent'>Book</div>
                        </div>
                    </div>
                    <div className='col-md-4 col-sm-6 text-center '>
                        <div>
                            <img src='./images/HowItWorksImg3.png' className='img-fluid howItWorksImg' alt='Go Live' />
                            <div className='whyChooseContent howItWorksContent'>Go Live</div>
                        </div>
                    </div>
                </div>
            </div>
</div>
            {/* Roadshow Footer */}
            <Footer />
        </div>
        </MainLayout>

    )
}
export default RdHome;