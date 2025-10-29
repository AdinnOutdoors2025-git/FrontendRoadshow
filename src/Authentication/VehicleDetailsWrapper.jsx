import React from 'react';
import { useParams } from 'react-router-dom';
import { useLogin } from '../Authentication/LoginContext';
import VehicleTypesDetails from '../components/a2VehicleTypesDetails';
import AdminVehicleDetailsPg from '../components/AdminVehicleDetails';

function VehicleDetailsWrapper() {
  const { vehicleId } = useParams();
  const { employeeUser } = useLogin();

  // If employee is logged in, show admin version, else show regular version
  if (employeeUser) {
    return <AdminVehicleDetailsPg />;
  }
  
  return <VehicleTypesDetails />;
}

export default VehicleDetailsWrapper;