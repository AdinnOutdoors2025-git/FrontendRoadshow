import React, { useEffect, useState } from 'react';
// import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from './a1Navbar';
import './a2VehicleTypes.css';
import Footer from './a3Footer';
import { useNavigate } from 'react-router-dom';

import slugify from 'slugify';
import { baseUrl } from '../Authentication/BASE_URL';
import { useVehicle } from './A_VehicleContext';
import { MainLayout } from '../Authentication/MainLayout';


function VehicleTypes() {
    // const cards = [
    //     { id: 1, image: './images/AvailVehImg1.png', name: 'LED Roadshow Vehicle', ratePerDay: 25000, rating: '4.3' },
    //     { id: 2, image: './images/AvailVehImg1.png', name: 'LED Roadshow Vehicle', ratePerDay: 25000, rating: '4.4' },
    //     { id: 3, image: './images/AvailVehImg1.png', name: 'LED Roadshow Vehicle', ratePerDay: 25000, rating: '4.5' },
    //     { id: 4, image: './images/AvailVehImg1.png', name: 'LED Roadshow Vehicle', ratePerDay: 25000, rating: '4.5' },
    //     { id: 5, image: './images/AvailVehImg1.png', name: 'LED Roadshow Vehicle', ratePerDay: 25000, rating: '4.5' },
    //     { id: 6, image: './images/AvailVehImg1.png', name: 'LED Roadshow Vehicle', ratePerDay: 25000, rating: '4.5' },

    // ];
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
            );

            const mappedVehicles = visibleVehicles.map(vehicle => ({
                _id: vehicle._id, // Add this - it's missing in your current code
                vehicleID: vehicle.vehicleDetails.vehicleID,
                name: vehicle.vehicleDetails.name,
                amount: vehicle.vehicleDetails.amount,
                // deliveryDay: vehicle.vehicleDetails.deliveryDay,
                screenresolution: vehicle.vehicleDetails.screenresolution,
                audio: vehicle.vehicleDetails.audio,
                // branding: vehicle.vehicleDetails.branding,
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
            // deliveryDay: vehicle.deliveryDay,
            screenresolution: vehicle.screenresolution,
            audio: vehicle.audio,
            // branding: vehicle.branding,
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
            // <div className="text-center py-5">
            //     <div className="spinner-border text-primary" role="status">
            //         <span className="visually-hidden">Loading...</span>
            //     </div>
            // </div>
            <div className="col-12 text-center loading-container">
                <img src='./images/BookLoading.svg' alt="Loading..." className="Book-loading-gif" />
            </div>
        );
    }


    return (
        <MainLayout>

            <div>
                <Navbar />
                <div className='container rdAvailVehDtpgOutsideMain  '>
                    <div className="row">
                        {vehicleData.map((card) => (
                            <div key={card.id} className="col-md-6  rdAvailVehDtpgOutside"
                                onClick={() => handleVehicleDetails(card)}
                            >
                                <div className='rdAvailVehDtpgMain' >
                                    <div>
                                        <div className='rdAvailVehImgDtpg'>
                                            <img src={card.image} alt={card.name} className='rdAvailVehImgDtpg' />
                                        </div>
                                        <div className='rdAvailVehDetailsDtpg'>
                                            <div className='rdAvailVehNameDtpg'> {card.name}</div>
                                            <div className='rdAvailVehRateDtpg'>₹ {card.amount.toLocaleString()} / Per Day</div>
                                            <div className='rdAvailVehRatingStarDtpg' >
                                                <div> {card.rating} </div>

                                                <div>  <img src='./images/AvailVehRatingStar.png' className='rdAvailVehRatingStarIcon' ></img></div> </div>

                                            {/* View Details Button */}
                                            <button className='rdAvailVehBtnDtpg'
                                                //   onClick={()=>navigate('/vehicleTypesDetails')}
                                                onClick={() => handleVehicleDetails(card)}
                                            >
                                                View Details
                                            </button>
                                        </div>



                                        {/* <p className="card-text text-primary fw-bold fs-4">{card.price}</p>
                                    <div className="mt-auto">
                                        <button className="btn btn-primary">View Details</button>
                                    </div> */}
                                    </div>
                                </div>
                            </div>
                        ))}






                    </div>

                </div>

                {/* RdVehTypesNeedHelp section  */}
                <div className='container'>
                    <img src='./images/RdVehTypesNeedHelpImg.png' className='RdVehTypesNeedHelpImg'></img>
                </div>
                {/* Roadshow Footer  */}
                <Footer />
            </div>
        </MainLayout>

    );
}

export default VehicleTypes;