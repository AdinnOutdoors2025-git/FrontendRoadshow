// SpotContext.js
import { createContext, useState, useContext } from "react";

// Create context
const SpotContext = createContext();

// Context Provider
export const SpotProvider = ({ children }) => {
  const [selectedSpot, setSelectedSpot] = useState(null);





  
  
    //STATE DISTRICTS & MEDIA TYPE SELECTION FUNCTION
    const initialStateDistricts = {
      "Tamil Nadu": ["Chennai", "Kanyakumari", "Karaikudi", "Krishnagiri", "Madurai", "Mayiladuthurai", "Pondicherry", "Sivagangai", "Trichy"],
      "Karnataka": ["Bangalore", "Mysore", "Mangalore", "Hubli-Dharwad", "Belgaum", "Davangere", "Bellary", "Tumkur", "Shimoga"],
      "Andhra Pradesh": ["Visakhapatnam", "Vijayawada", "Guntur", "Tirupati", "Rajahmundry", "Nellore", "Kakinada", "Kadapa", "Anantapur"],
      "Kerala": ["Thiruvananthapuram", "Kochi", "Kozhikode", "Thrissur", "Kollam", "Palakkad", "Alappuzha", "Kannur", "Kottayam"],
      "Telangana": ["Hyderabad", "Warangal", "Karimnagar", "Khammam", "Nizamabad", "Mahbubnagar", "Adilabad", "Siddipet", "Nalgonda"]
    };
  
    const initialMediaTypes = ["Gantry", "Bus Shelter", "Hoarding", "Pole Kiosk", "Police Booth", "Signal Post", "Unipole", "Wall Graphic", "Wall Hoarding"];
  
    const [stateInput, setStateInput] = useState("");
    const [districtInput, setDistrictInput] = useState("");
    const [mediaTypeInput, setMediaTypeInput] = useState("");
    const [stateDistricts, setStateDistricts] = useState(initialStateDistricts);
    const [mediaTypes, setMediaTypes] = useState(initialMediaTypes);
    const [selectedState, setSelectedState] = useState("Tamil Nadu");
    const [selectedDistrict, setSelectedDistrict] = useState("Chennai");
    const [showDistricts, setShowDistricts] = useState(false);
    const [showStates, setShowStates] = useState(false);
  
  
    // Function to format input: Removes extra spaces & converts to title case
    const formatInput = (input) => {
      return input
        .trim()
        .replace(/\s+/g, " ") // Replace multiple spaces with single space
        .toLowerCase()
        .split(" ")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
    };
  
    // Save new state, district, and media type
    const handleSave = () => {
      const formattedState = formatInput(stateInput);
      const formattedDistrict = formatInput(districtInput);
      const formattedMediaType = formatInput(mediaTypeInput);
  
      if (formattedState && formattedDistrict) {
        setStateDistricts(prev => ({
          ...prev,
          [formattedState]: prev[formattedState]
            ? [...new Set([...prev[formattedState], formattedDistrict])]
            : [formattedDistrict]
        }));
      }
  
      if (formattedMediaType) {
        setMediaTypes(prev => [...new Set([...prev, formattedMediaType])]);
      }
  
      setStateInput("");
      setDistrictInput("");
      setMediaTypeInput("");
    };
    const toggleStateDropdown = () => {
      setShowStates(!showStates);
      setShowDistricts(false);
    };
  
    const handleStateClick = (state) => {
      setSelectedState(state);
      setSelectedDistrict("");
      setShowDistricts(true);
    };
  
    const handleDistrictClick = (district) => {
      setSelectedDistrict(district);
      setShowDistricts(false);
      setShowStates(false);
    };
  


  return (
    <SpotContext.Provider value={{ selectedSpot, setSelectedSpot, initialStateDistricts, initialMediaTypes, toggleStateDropdown, handleStateClick, handleDistrictClick, stateDistricts, setStateDistricts, mediaTypes, setMediaTypes, selectedState, setSelectedState, selectedDistrict, setSelectedDistrict, showDistricts, setShowDistricts, showStates, setShowStates  }}>
      {children}
    </SpotContext.Provider>
  );
};

// Custom hook for easy usage
export const useSpot = () => useContext(SpotContext);
