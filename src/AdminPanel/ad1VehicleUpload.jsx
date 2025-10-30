// import React, { useState, useContext, useEffect } from 'react';
// import { useLocation, useNavigate, useParams } from 'react-router-dom';
// import './ad1Manage.css';
// import './ad1File.css';
// import './ad1FileVideoUpload.css';
// // import { useSpot } from '../components/B0SpotContext';
// import { ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import { toast } from 'react-toastify';
// import { baseUrl } from '../Authentication/BASE_URL';
// import './RichText.css';
// import ReactQuill from 'react-quill';
// import 'react-quill/dist/quill.snow.css';

// function ClientSection() {
//     const { state } = useLocation();
//     const { id } = useParams();
//     //Start rating board
//     const RatingStars = ({ rating }) => {
//         const fullStars = Math.floor(rating);
//         const halfStar = rating % 1 !== 0;
//         const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
//         return (
//             <div className='Product-rating-star'>
//                 {[...Array(fullStars)].map((_, index) => (
//                     <span key={index} className="fa-solid fa-star Product-stars1"></span>
//                 ))}
//                 {halfStar && <span className="fa-solid fa-star-half-alt Product-stars1"></span>}
//                 {[...Array(emptyStars)].map((_, index) => (
//                     <span key={index} className="fa-solid fa-star Product-empty-star1 Product-stars1"></span>
//                 ))}
//             </div>
//         );
//     };
//     // PRODUCT RATING SECTION 
//     const RatingStars1 = ({ rating }) => {
//         const fullStars = Math.floor(rating);
//         const halfStar = rating % 1 !== 0;
//         const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
//         return (
//             <div>
//                 <div className='Product-rating-star1'>
//                     {[...Array(fullStars)].map((_, index) => (
//                         <span key={index} className="fa-solid fa-star Product-stars1"></span>
//                     ))}
//                     {halfStar && <span className="fa-solid fa-star-half-alt Product-stars1"></span>}
//                     {[...Array(emptyStars)].map((_, index) => (
//                         <span key={index} className="fa-solid fa-star Product-empty-star1 Product-stars1"></span>
//                     ))}
//                 </div>
//                 <div>

//                 </div>
//             </div>

//         );
//     };
//     //HANDLING ERRORS
//     const [errors, setErrors] = useState({
//         vehicleName: false,
//         vehicleAmount: false,
//         vehicleID: false,
//         vehicleDeliveryDay: false,
//         vehicleAudio: false,
//         vehicleBranding: false,
//         vehiclePower: false,
//         vehicleRating: false,
//         vehicleHeight: false,
//         vehicleWidth: false,
//         image : false,
//         additionalFiles : false
//     });

//     const validateForm = () => {
//         const validAdditionalFiles = additionalFiles.filter(file => !file.markedForDeletion);
//         const newErrors = {
//             vehicleName: !vehicleName,
//             vehicleAmount: !vehicleAmount,
//             vehicleID: !vehicleID,
//             vehicleDeliveryDay: !vehicleDeliveryDay,
//             vehicleAudio: !vehicleAudio,
//             vehicleBranding: !vehicleBranding,
//             vehiclePower: !vehiclePower,
//             vehicleRating: !vehicleRating,
//             vehicleHeight: !vehicleHeight,
//             vehicleWidth: !vehicleWidth,
//             image: !image || image === " ",
//             additionalFiles: validAdditionalFiles.length > 3 // Add validation for additional files

//             // productFrom: !productFrom,
//             // productTo: !productTo,
//             // productPrintingCost: !productPrintingCost,
//             // productMountingCost: !productMountingCost,
//             // prodwidth: !prodwidth,
//             // prodheight: !prodheight,

//             // selectedState: !selectedState,
//             // // selectedDistrict: !selectedDistrict,
//             // similarProducts: false,
//             // prodLatitude: !prodLatitude,
//             // prodLongitude: !prodLongitude,
//             // prodLocationLink: false,
//             // additionalFiles: validAdditionalFiles.length < 3 // Add validation for additional files
//             //NEWLY ADDED 2 
//             // additionalFiles: validAdditionalFiles.length > 3 // Add validation for additional files

//         };
//         setErrors(newErrors);
//         return !Object.values(newErrors).some(error => error);
//     };

//     // // SIMILAR PRODUCTS 
//     // const [products, setProducts] = useState([]);
//     // //Fetch/get  products from data
//     // useEffect(() => {
//     //     fetch(`${baseUrl}/products`)
//     //         .then((response) => response.json())
//     //         .then((data) => {
//     //             const productsWithVisibility = data.map((product) => ({
//     //                 ...product,
//     //                 visible: product.visible !== false, // fallback to true
//     //             }));
//     //             setProducts(productsWithVisibility.sort((a, b) => b.visible - a.visible));
//     //         });
//     // }, []);

//     // const normalizeSimilarProducts = (products) =>
//     //     products.map(p => ({
//     //         ...p,
//     //         prodCode: p.ProdCode, // for UI consistency
//     //         name: p.Prodname
//     //     }));

//     const [similarProdId, setSimilarProdId] = useState('');
//     const [selectedSimilarProducts, setSelectedSimilarProducts] = useState([]); // Store selected products

//     // const normalizeCode = (code) => (code || '').replace(/^#/, '').trim().toLowerCase();
//     // const handleSelectProduct = () => {
//     //     const enteredId = similarProdId.trim();
//     //     if (!enteredId) return;

//     //     // Find matches using fuzzy search
//     //     const matches = products.filter(product => {
//     //         const matchCode = normalizeCode(product.prodCode) === normalizeCode(enteredId);
//     //         const matchName = product.name.toLowerCase().includes(enteredId.toLowerCase());
//     //         return matchCode || matchName;
//     //     });

//     //     if (matches.length === 0) {
//     //         toast.error("No matching products found");
//     //         return;
//     //     }

//     //     if (matches.length > 1) {
//     //         toast.info("Multiple matches found - please select from suggestions");
//     //         return;
//     //     }

//     //     const productToAdd = matches[0];

//     //     if (selectedSimilarProducts.some(p => normalizeCode(p.prodCode) === normalizeCode(productToAdd.prodCode))) {
//     //         toast.warning("Product already added");
//     //         return;
//     //     }

//     //     setSelectedSimilarProducts(prev => [...prev, productToAdd]);
//     //     setSimilarProdId('');
//     //     setSearchSuggestions([]);
//     // };

//     // const handleRemoveProduct = (prodCode) => {
//     //     if (!window.confirm("Are you sure you want to delete this product?")) return;

//     //     // Normalize code for comparison
//     //     const normalize = code => code.replace(/^#/, '').trim().toLowerCase();
//     //     const targetCode = normalize(prodCode);

//     //     setSelectedSimilarProducts(prev =>
//     //         prev.filter(product =>
//     //             normalize(product.prodCode) !== targetCode
//     //         )
//     //     );
//     // };

//     const [vehicleName, setVehicleName] = useState("");
//     const [vehicleAmount, setVehicleAmount] = useState("");
//     const [vehicleID, setVehicleId] = useState("");
//     const [vehicleDeliveryDay, setVehicleDeliveryDay] = useState("");
//     const [vehicleAudio, setVehicleAudio] = useState("");
//     const [vehicleBranding, setVehicleBranding] = useState("");
//     const [vehiclePower, setVehiclePower] = useState("");
//     // Rating section 
//     const [vehicleRating, setVehicleRating] = useState(4.5);
//     // Product Size calculation 
//     const [vehicleWidth, setVehicleWidth] = useState('');
//     const [vehicleHeight, setVehicleHeight] = useState('');
//     const ProdSquareFeet = () => {
//         const squareFeet = vehicleWidth * vehicleHeight;
//         return squareFeet;
//     };
//     // // const [prodLighting, setProdLighting] = useState("");
//     // const [vehicleFrom, setVehicleFrom] = useState("");
//     // const [vehicleTo, setVehicleTo] = useState("");
//     // const [vehiclePrintingCost, setVehiclePrintingCost] = useState("");
//     // const [vehicleMountingCost, setVehicleMountingCost] = useState("");
//     const [vehicleFixedAmount, setVehicleFixedAmount] = useState('999');
//     const [vehicleFixedAmountOffer, setVehicleFixedAmountOffer] = useState('5');

//     // Optional: Add typeahead search
//     const [searchSuggestions, setSearchSuggestions] = useState([]);

//     // // LATITUDE AND LOGITUDE
//     // const [prodLatitude, setProdLatitude] = useState('');
//     // const [prodLongitude, setProdLongitude] = useState('');
//     // const [prodLocationLink, setProdLocationLink] = useState('');

//     // const generateGoogleMapsLink = () => {
//     //     if (!prodLatitude || !prodLongitude) {
//     //         toast.error("Please enter both latitude and longitude");
//     //         return;
//     //     }
//     //     // Convert decimal degrees to degrees, minutes, seconds format
//     //     const latDegrees = Math.floor(Math.abs(prodLatitude));
//     //     const latMinutes = Math.floor((Math.abs(prodLatitude) - latDegrees) * 60);
//     //     const latSeconds = ((Math.abs(prodLatitude) - latDegrees - latMinutes / 60) * 3600).toFixed(1);
//     //     const latDirection = prodLatitude >= 0 ? 'N' : 'S';

//     //     const lonDegrees = Math.floor(Math.abs(prodLongitude));
//     //     const lonMinutes = Math.floor((Math.abs(prodLongitude) - lonDegrees) * 60);
//     //     const lonSeconds = ((Math.abs(prodLongitude) - lonDegrees - lonMinutes / 60) * 3600).toFixed(1);
//     //     const lonDirection = prodLongitude >= 0 ? 'E' : 'W';

//     //     // Construct the DMS (Degrees, Minutes, Seconds) string
//     //     const dmsString = `${latDegrees}°${latMinutes.toString().padStart(2, '0')}'${latSeconds}"${latDirection}+${lonDegrees}°${lonMinutes.toString().padStart(2, '0')}'${lonSeconds}"${lonDirection}`;

//     //     // Create the Google Maps link
//     //     const link = `https://www.google.com/maps/place/${dmsString}/@${prodLatitude},${prodLongitude},17z/data=!3m1!4b1!4m4!3m3!8m2!3d${prodLatitude}!4d${prodLongitude}?entry=ttu&g_ep=EgoyMDI1MDgwNC4wIKXMDSoASAFQAw%3D%3D`;

//     //     setProdLocationLink(link);
//     //     setErrors(prev => ({ ...prev, prodLocationLink: false }));

//     // };
//     const handleRatingChange = (value) => {
//         // Convert the value to a valid number, ensuring it remains within 0-5 range
//         let newRating = parseFloat(value);
//         if (newRating >= 0 && newRating <= 5) {
//             setVehicleRating(newRating);
//         }
//     };

//     // const [prodType, setProdType] = useState("Select");
//     // // State District selection 
//     // const { initialStateDistricts, initialMediaTypes, toggleStateDropdown, handleStateClick, handleDistrictClick, mediaTypes, setMediaTypes, selectedState, setSelectedState, selectedDistrict, setSelectedDistrict, showDistricts, setShowDistricts, showStates, setShowStates } = useSpot();
//     //IMAGE UPLOADED & ADDED SUB IMAGES/VIDEOS
//     const [imageFile, setImageFile] = useState(null); // Store the File object
//     const [image, setImage] = useState(""); // Store the preview URL or existing image URL

//     const [localFiles, setLocalFiles] = useState([]);
//     const [uploadedFiles, setUploadedFiles] = useState([]);
//     const [additionalFiles, setAdditionalFiles] = useState([]);

//     const [uploading, setUploading] = useState(false);
//     const [isSubmitted, setIsSubmitted] = useState(false);

//     // Modified handleImageUpload to only create a preview
//     const handleImageUpload = (event) => {
//         const file = event.target.files[0];
//         if (file) {
//             // Create a preview URL
//             const previewUrl = URL.createObjectURL(file);
//             setImage(previewUrl);
//             setImageFile(file);
//         }
//         // console.log(`Vehicle Main image URL: `, image);
//     };

//     console.log(`Vehicle Main image URL: `, image);

//     const handleFileChangeAdded = (e) => {
//         if (!e.target.files || e.target.files.length === 0) return;
//         const files = Array.from(e.target.files).filter(file =>
//             file.type.startsWith('video/') ||
//             file.type.startsWith('image/') ||
//             ['.mp4', '.mov', '.avi', '.mkv', '.jpg', '.jpeg', '.png', '.gif'].some(ext =>
//                 file.name.toLowerCase().endsWith(ext))
//         );
//         if (files.length === 0) {
//             alert('Please select valid video or image files');
//             return;
//         }

//         // Count only non-deleted files
//         const currentNonDeletedFiles = additionalFiles.filter(f => !f.markedForDeletion).length;

//         if (currentNonDeletedFiles + files.length > 5) {
//             alert(`Maximum 3 files allowed. You already have ${currentNonDeletedFiles} files.`);
//             return;
//         }

//         const newFiles = files.map(file => ({
//             file,
//             previewUrl: URL.createObjectURL(file),
//             id: `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
//             type: file.type.startsWith('video/') ? 'video' : 'image',
//             isNew: true // Mark as new for upload handling

//         }));
//         setAdditionalFiles(prev => [...prev, ...newFiles]);
//         e.target.value = '';
//     };

//     const handleDeleteAdded = async (fileToDelete) => {
//         if (!window.confirm('Delete this file?')) return;
//         try {
//             // If it's an uploaded file, delete from Cloudinary
//             if (fileToDelete.public_id) {
//                 setAdditionalFiles(prev =>
//                     prev.map(file =>
//                         file.public_id === fileToDelete.public_id
//                             ? { ...file, markedForDeletion: true }
//                             : file
//                     )
//                 );


//             } else {
//                 // If it's a local file, just remove from state
//                 setAdditionalFiles(prev =>
//                     prev.filter(file => file.id !== fileToDelete.id)
//                 );
//             }
//         } catch (error) {
//             console.error('Delete error:', error);
//             alert('Failed to delete file');
//         }
//     };



//     const [productsData, setProductsData] = useState([]);
//     const [editProduct, setEditProduct] = useState(null);

//     // // 👇 Prefill form if state has editProduct
//     // useEffect(() => {
//     //     if (state?.editProduct) {
//     //         const prod = state.editProduct;
//     //         setEditProduct(prod);
//     //         //image
//     //         setImage(prod.image || " ");
//     //         setProductName(prod.name || '');
//     //         setProductAmount(prod.price || '');
//     //         setProductFixedAmount(prod.fixedAmount || '999');
//     //         setProductFixedAmountOffer(prod.fixedOffer || '5');
//     //         setProductPrintingCost(prod.printingCost || '');
//     //         setProductMountingCost(prod.mountingCost || '');
//     //         setProductId(prod.prodCode || '');
//     //         setProdLighting(prod.lighting);
//     //         setProductFrom(prod.from || '');
//     //         setProductTo(prod.to || '');
//     //         setProdRating(prod.rating || 0);
//     //         setProdWidth(prod.width || '');
//     //         setProdHeight(prod.height || '');
//     //         setProdType(prod.mediaType || '');
//     //         setSelectedState(prod.location?.state || '');
//     //         setSelectedDistrict(prod.location?.district || '');
//     //         setImage(prod.image || '');
//     //         // setSelectedSimilarProducts(prod.similarProducts || []);
//     //         setSelectedSimilarProducts(normalizeSimilarProducts(prod.similarProducts || []));
//     //         setProdLatitude(prod.Latitude || '');
//     //         setProdLongitude(prod.Longitude || '');
//     //         setProdLocationLink(prod.LocationLink || '');
//     //         // Set additional files if they exist
//     //         if (prod.additionalFiles && prod.additionalFiles.length > 0) {
//     //             setAdditionalFiles(prod.additionalFiles);
//     //         }
//     //     }
//     // }, [state]);

//     // const fetchProduct = async () => {
//     //     const response = await fetch(`${baseUrl}/products`);
//     //     const data = await response.json();
//     //     setProductsData(data);
//     //     console.log(data);
//     //     // setEditProduct(data[0]);   
//     // }
//     // useEffect(
//     //     () => {
//     //         fetchProduct();
//     //     },
//     //     []
//     // );

//     // const handleSaveProduct = async (e) => {
//     //     e.preventDefault();
//     //     // Validate form first
//     //     if (!validateForm()) {
//     //         toast.error("Please fill all required fields correctly");
//     //         return;
//     //     }
//     //     // Validate additional files
//     //     const validAdditionalFiles = additionalFiles.filter(file => !file.markedForDeletion);
//     //     // if (validAdditionalFiles.length < 3) {
//     //     //     alert(`Please upload ${3 - validAdditionalFiles.length} more file(s)`);
//     //     //     return;
//     //     // }
//     //     if (validAdditionalFiles.length > 3) {
//     //         alert(`Maximum 3 additional files allowed. You have ${validAdditionalFiles.length} files.`);
//     //         return;
//     //     }

//     //     // Validate location link
//     //     if (!prodLocationLink) {
//     //         alert("Please generate location link");
//     //         return;
//     //     }

//     //     // // First check similar products count
//     //     // if (selectedSimilarProducts.length < 4) {
//     //     //     alert("Please add at least 4 similar products");
//     //     //     return;
//     //     // }
//     //     console.log("Save product");
//     //     // Optional warning (but still allows submission)
//     //     if (selectedSimilarProducts.length === 0) {
//     //         if (!window.confirm("You haven't added any similar products. Continue anyway?")) {
//     //             return;
//     //         }
//     //     }

//     //     // Show confirmation for products without additional files NEWLY ADDED 2 
//     //     if (validAdditionalFiles.length === 0) {
//     //         if (!window.confirm("You haven't added any additional files. Continue without additional files?")) {
//     //             return;
//     //         }
//     //     }
//     //     setUploading(true);
//     //     // Save product to database
//     //     const method = editProduct ? 'PUT' : 'POST';
//     //     const url = editProduct ? `${baseUrl}/products/${editProduct._id}` :
//     //         `${baseUrl}/products`;
//     //     try {
//     //         // STEP 1: Upload main image if it's a new file
//     //         let cloudinaryUrl = image; // Use existing URL if editing
//     //         // let additionalFiles = [...uploadedFiles];
//     //         let cloudinaryPublicId = editProduct?.imagePublicId || null;

//     //         // Only upload if we have a new file
//     //         if (imageFile && !image.startsWith('http')) {
//     //             const formData = new FormData();
//     //             formData.append("file", imageFile);
//     //             const uploadResponse = await fetch(`${baseUrl}/upload`, {
//     //                 method: "POST",
//     //                 body: formData
//     //             });
//     //             if (!uploadResponse.ok) {
//     //                 throw new Error('Failed to upload main image');
//     //             }
//     //             const uploadData = await uploadResponse.json();
//     //             cloudinaryUrl = uploadData.imageUrl;
//     //             cloudinaryPublicId = uploadData.public_id;
//     //             console.log("Main image URL:", cloudinaryUrl);

//     //         }
//     //         else if (image.startsWith('http')) {
//     //             console.log("Using existing main image URL:", image);
//     //         }
//     //         else {
//     //             throw new Error('Main image is required');
//     //         }
//     //         // Step 2: Handle additional files
//     //         const finalAdditionalFiles = [];
//     //         let fileIndex = 1;
//     //         // Upload new files
//     //         const newFilesToUpload = additionalFiles.filter(file => !file.public_id && file.file && !file.markedForDeletion);
//     //         // .filter(file => file.isNew && !file.public_id);
//     //         if (newFilesToUpload.length > 0) {
//     //             const formData = new FormData();
//     //             newFilesToUpload.forEach(fileObj => {
//     //                 formData.append('files', fileObj.file);
//     //             });
//     //             console.log(`Uploading ${newFilesToUpload.length} additional files...`);
//     //             const filesResponse = await fetch(`${baseUrl}/save-videos`, {
//     //                 method: 'POST',
//     //                 body: formData
//     //             });
//     //             if (filesResponse.ok) {
//     //                 const savedFiles = await filesResponse.json();
//     //                 savedFiles.forEach(file => {
//     //                     console.log(`Additional file ${fileIndex} URL:`, file.url);
//     //                     fileIndex++;
//     //                     finalAdditionalFiles.push({
//     //                         url: file.url,
//     //                         public_id: file.public_id,
//     //                         type: file.type
//     //                     });
//     //                 });
//     //             }
//     //             else {
//     //                 console.error('Failed to upload additional files');
//     //             }
//     //         }

//     //         // Add existing files that aren't marked for deletion
//     //         additionalFiles.forEach(file => {
//     //             if (file.public_id && !file.markedForDeletion) {
//     //                 console.log(`Using existing additional file URL:`, file.url);

//     //                 finalAdditionalFiles.push({
//     //                     url: file.url,
//     //                     public_id: file.public_id,
//     //                     type: file.type
//     //                 });
//     //             }
//     //         });

//     //         // Step 3: Delete any files marked for deletion
//     //         const filesToDelete = additionalFiles.filter(file => file.markedForDeletion && file.public_id);
//     //         for (const file of filesToDelete) {
//     //             try {
//     //                 console.log("Deleting file with public_id:", file.public_id);
//     //                 await fetch(`${baseUrl}/delete-video`, {
//     //                     method: 'POST',
//     //                     headers: { 'Content-Type': 'application/json' },
//     //                     body: JSON.stringify({
//     //                         public_id: file.public_id,
//     //                         resource_type: file.type
//     //                     })
//     //                 });
//     //             } catch (deleteError) {
//     //                 console.error('Error deleting file:', deleteError);
//     //             }
//     //         }

//     //         const response = await fetch(url, {
//     //             method: method,
//     //             headers: {
//     //                 'Content-Type': 'application/json',
//     //             },
//     //             body: JSON.stringify({
//     //                 name: productName,
//     //                 // description: "Sample", // Update if you use
//     //                 price: productAmount,
//     //                 printingCost: productPrintingCost,
//     //                 mountingCost: productMountingCost,
//     //                 image: cloudinaryUrl,
//     //                 imagePublicId: cloudinaryPublicId, // Store public_id for future deletion
//     //                 additionalFiles: finalAdditionalFiles,
//     //                 prodCode: productID,
//     //                 lighting: prodLighting,
//     //                 from: productFrom,
//     //                 to: productTo,
//     //                 rating: prodRating,
//     //                 width: prodwidth,
//     //                 height: prodheight,
//     //                 fixedAmount: productFixedAmount,
//     //                 fixedOffer: productFixedAmountOffer,
//     //                 mediaType: prodType,
//     //                 visible: true,
//     //                 productsquareFeet: ProdSquareFeet(),
//     //                 location: {
//     //                     state: selectedState,
//     //                     district: selectedDistrict
//     //                 },
//     //                 similarProducts: selectedSimilarProducts.map(prod => ({
//     //                     Prodname: prod.name,
//     //                     ProdCode: prod.prodCode,
//     //                     image: prod.image,
//     //                     ProdPrice: prod.price,
//     //                     ProdPrintingCost: prod.printingCost,
//     //                     ProdMountingCost: prod.mountingCost
//     //                 })),
//     //                 Latitude: prodLatitude,
//     //                 Longitude: prodLongitude,
//     //                 LocationLink: prodLocationLink,
//     //             }),
//     //         });
//     //         //  console.log("Submitting product data to MongoDB:", productData);
//     //         const result = await response.json();
//     //         console.log(result);
//     //         if (!editProduct) {
//     //             // setProductsData([...productsData, result]);
//     //             setProductsData(prev => [...prev, result]);
//     //             alert("Product added successfully!");
//     //         }
//     //         else {
//     //             // setProductsData(productsData.map((product) => (product._id === result._id ? result : product)));  // Update task
//     //             setProductsData(prev =>
//     //                 prev.map((product) =>
//     //                     product._id === result._id ? result : product
//     //                 )
//     //             );
//     //             alert("Product updated successfully!");
//     //             // Force reload or update parent state if needed
//     //             window.location.reload();
//     //         }
//     //         // Reset form
//     //         resetForm();
//     //     }
//     //     catch (error) {
//     //         console.error(error);
//     //         alert("An error occurred while saving the product.");
//     //     }
//     //     finally {
//     //         setUploading(false);
//     //     }
//     // };



//     // // Add this helper function
//     // const resetForm = () => {
//     //     setProductName('');
//     //     setImage('');
//     //     setProductAmount('');
//     //     setProductFixedAmount('999');
//     //     setProductFixedAmountOffer('5');
//     //     setProductMountingCost('');
//     //     setProductPrintingCost('');
//     //     setProductId('');
//     //     setProdLighting('');
//     //     setProductFrom('');
//     //     setProductTo('');
//     //     setProdRating(0);
//     //     setProdWidth('');
//     //     setProdHeight('');
//     //     setProdType('');
//     //     setSelectedSimilarProducts([]);
//     //     setProdLatitude('');
//     //     setProdLongitude('');
//     //     setProdLocationLink('');
//     //     setAdditionalFiles([]);
//     //     setEditProduct(null);
//     // };

//     // // Clean up preview URLs
//     // useEffect(() => {
//     //     return () => {
//     //         if (image && !image.startsWith('http')) {
//     //             URL.revokeObjectURL(image);
//     //         }
//     //         additionalFiles.forEach(file => {
//     //             if (file.previewUrl) {
//     //                 URL.revokeObjectURL(file.previewUrl);
//     //             }
//     //         });
//     //     };
//     // }, [image, additionalFiles]);






//     // //FETCH STATE AND DISTRICTS IN CATEGORY SECTION
//     // const [stateDistricts, setStateDistricts] = useState({});

//     // useEffect(() => {
//     //     const fetchCategoryData = async () => {
//     //         try {
//     //             const res = await fetch(`${baseUrl}/category`);
//     //             const data = await res.json();

//     //             // Convert to { "Tamil Nadu": ["Chennai", "Coimbatore"], ... }
//     //             const mappedData = {};
//     //             data.forEach(({ state, districts }) => {
//     //                 mappedData[state] = districts;
//     //             });

//     //             setStateDistricts(mappedData);
//     //         } catch (err) {
//     //             console.error("Failed to fetch category data:", err);
//     //         }
//     //     };

//     //     fetchCategoryData();
//     // }, []);

//     // //FETCH MEDIA TYPES FROM THE DATABASE
//     // const [mediaTypesData, setMediaTypesData] = useState([]);
//     // const fetchMediaTypes = async () => {
//     //     try {
//     //         const res = await fetch(`${baseUrl}/mediatype`);
//     //         const data = await res.json();
//     //         setMediaTypesData(data);
//     //     } catch (err) {
//     //         alert('Failed to fetch media types: ' + err.message);
//     //     }
//     // };

//     // useEffect(() => {
//     //     fetchMediaTypes();
//     // }, []);



//     //RICH TEXT CONTENTS
//     const [richTextContent, setRichTextContent] = useState('');
//     // Define toolbar modules
//     const modules = {
//         toolbar: [
//             [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
//             [{ font: [] }],
//             [{ size: [] }],
//             [{ 'align': [] }],
//             ['bold', 'italic', 'underline', 'strike', 'blockquote'],
//             [{ 'list': 'ordered' }, { 'list': 'bullet' },
//             ],
//             ['link', 'image', 'video'],
//         ]
//     };
//     const formats = ['header', 'font', 'size', 'align', 'bold', 'italic', 'underline', 'strike', 'blockquote', 'list', 'bullet', 'list', 'ordered', 'link', 'image', 'video'];

//     return (
//         <div>
//             <form
//             // onSubmit={handleSaveProduct}
//             >
//                 <div className='adManageMain'>
//                     {/* Left side section  */}
//                     <div className='adManageContentLeft'>
//                         <div className='clientDetailHeading'> Primary Image</div>

//                         <div className='ManageLeftImg1'><img src={image} className='ManageLeftImg1' alt="Product_Image"></img></div>

//                         {/* ADDED DEMO PRODUCT IMAGES/VIDEOS  */}
//                         <div className='manageprodMain manageProdSideContents'>
//                             <div className='manageprodSideHeading'>Additional Images</div>
//                             <div className='adminProductVideoLeft'>
//                                 <div className='videoPreviewMain'>
//                                     {additionalFiles
//                                         .filter(file => !file.markedForDeletion)
//                                         .slice(0, 5)
//                                         .map((file, index) => (
//                                             <div key={file.id || file.public_id} className={`videoPreview ${index + 1}`}>
//                                                 <div className="videoPreviewContainer">
//                                                     {file.type === 'video'
//                                                         || (file.url && file.url.match(/\.(mp4|mov|avi|mkv)$/i))
//                                                         ? (
//                                                             <video controls>
//                                                                 <source src={file.url || file.previewUrl} type="video/mp4" />
//                                                             </video>
//                                                         ) : (
//                                                             <img
//                                                                 src={file.url || file.previewUrl}
//                                                                 alt="Preview"
//                                                                 style={{ objectFit: 'cover', height: '100%', width: '100%' }}
//                                                             />
//                                                         )}
//                                                     <button
//                                                         className="deleteButton"
//                                                         onClick={() => handleDeleteAdded(file)}
//                                                         disabled={uploading}
//                                                     >
//                                                         ×
//                                                     </button>
//                                                 </div>
//                                             </div>
//                                         ))}

//                                     {Array.from({ length: 5 - additionalFiles.filter(f => !f.markedForDeletion).length }).map((_, index) => (
//                                         <div key={`empty_${index}`} className={`videoPreview ${index + 1}`}>
//                                             <div className="emptyPreview">No file</div>
//                                         </div>
//                                     ))}

//                                 </div>
//                             </div>
//                         </div>

//                         {/* Product details section  */}
//                         <div className='manageprodMain'>
//                             <div className="ManageProdDetails">
//                                 <div className='ManageProdLeftHeading'>Name</div>
//                                 <div className='ManageProdRightContent'>{vehicleName}</div>
//                             </div>
//                             <div className="ManageProdDetails">
//                                 <div className='ManageProdLeftHeading'>Price</div>
//                                 <div className='ManageProdRightContent'>₹ {vehicleAmount} Per Day </div>
//                             </div>
//                             <div className="ManageProdDetails">
//                                 <div className='ManageProdLeftHeading'>LED Screen Size</div>
//                                 <div className='ManageProdRightContent'>{vehicleWidth} X {vehicleHeight} | {ProdSquareFeet()} Sq.ft </div>
//                             </div>
//                             <div className="ManageProdDetails">
//                                 <div className='ManageProdLeftHeading'>Delivery</div>
//                                 <div className='ManageProdRightContent'>{vehicleDeliveryDay} - Day</div>
//                             </div> <div className="ManageProdDetails">
//                                 <div className='ManageProdLeftHeading'>Audio</div>
//                                 <div className='ManageProdRightContent'>{vehicleAudio}</div>
//                             </div> <div className="ManageProdDetails">
//                                 <div className='ManageProdLeftHeading'>Branding</div>
//                                 <div className='ManageProdRightContent'>{vehicleBranding}</div>
//                             </div> <div className="ManageProdDetails">
//                                 <div className='ManageProdLeftHeading'>Power</div>
//                                 <div className='ManageProdRightContent'>{vehiclePower}</div>
//                             </div>

//                             <div className="ManageProdDetails">
//                                 <div className='ManageProdLeftHeading'>Rating</div>
//                                 <div className='ManageProdRightContent'>
//                                     <span className='Product-star-main'>
//                                         <span><img src='./images/rating_board.png' className='Product-rate-board1'></img></span>
//                                         <span><RatingStars rating={vehicleRating} /> </span>
//                                     </span>
//                                 </div>
//                             </div>
//                         </div>


//                         {/* Select Category  section  */}
//                         {/* <div className='manageprodMain manageProdSideContents'>
//                             <div className='manageprodSideHeading'>Selected Category</div>
//                             <div className="ManageProdDetails">
//                                 <div className='ManageProdLeftHeading'>Location</div>
//                                 <div className='ManageProdRightContent'>
//                                     {selectedState && selectedDistrict ? `${selectedState}, ${selectedDistrict}` : "Select a location"}
//                                 </div>
//                             </div>
//                             <div className="ManageProdDetails">
//                                 <div className='ManageProdLeftHeading'>Media Type</div>
//                                 <div className='ManageProdRightContent'>{prodType}</div>
//                             </div>
//                         </div> */}

//                         {/* PRODUCT LOCATION LINK  */}
//                         {/* <div className='manageprodMain'>
//                             <div className='manageprodSideHeading'>Product Location Link</div>
//                             <div className='ManageProductLocationLink'>
//                                 {prodLocationLink && (
//                                     <div style={{ marginTop: '20px' }}>
//                                         <a href={prodLocationLink}
//                                             target="_blank" rel="noopener noreferrer" style={{ wordBreak: 'break-all' }} >
//                                             {prodLocationLink}
//                                         </a>
//                                     </div>
//                                 )}
//                             </div>
//                         </div> */}


//                         {/* Similar Product Section  */}
//                         {/* <div className='manageprodMain'>
//                             <div className='manageprodSideHeading'>Selected Similar products</div>
//                             {selectedSimilarProducts.length > 0 ? (
//                                 selectedSimilarProducts.map((product, index) => (
//                                     <div className='manageSimilarprod' key={index}>
//                                         <div className='manageSimilarImg'>
//                                             <img src={product.image} className='manageSimilarImg'></img>
//                                         </div>
//                                         <div>
//                                             <div className='ManageProdRightContent1'>{product.name}</div>
//                                             <div className='manageSimilarProdCode'>{product.prodCode}</div>
//                                         </div>
//                                         <div className='similarProdClose' onClick={() => handleRemoveProduct(product.prodCode)}>
//                                             <i className="fa-solid fa-xmark"></i>
//                                         </div>
//                                     </div>
//                                 ))
//                             ) : (
//                                 <p className='smilarProdError'>No Similar Products Selected</p>
//                             )
//                             }
//                         </div> */}
//                     </div>

//                     {/* Right section  */}
//                     <div>
//                         {/* Primary Image Upload section for Vehicle */}
//                         <div className='manageClientSection'>
//                             <div className='clientDetailHeading'> Primary Image </div>
//                             <div className="upload-section">
//                                 <input type="file" accept="image/*" id='fileInput' onChange={handleImageUpload} hidden />
//                                 <label htmlFor="fileInput" className={`file-upload-box ${errors.image ? 'AdminProdinput-error' : ''}`}>
//                                     <center>
//                                         <img src="./images/FileUpload.svg" height={50} width={50} alt="Upload Icon" />
//                                     </center>
//                                     <div className="upload-text">
//                                         <div className="FileHeading">Drag and Drop an Image or Choose File</div>
//                                         <span className="file-info">1600 x 1200 (4:3) recommended. PNG, JPG and GIF files are allowed</span>
//                                     </div>
//                                 </label>
//                                 {errors.image && <div className="AdminProderror-message">Vehicle Main image is required</div>}
//                             </div>
//                         </div>




//                         {/* ADDITIONAL VEHICLE IMAGES/VIDEOS  */}
//                         <div className='manageClientSection'>
//                             <div className='clientDetailHeading'> Additional Images </div>
//                             <div className='adminProductVideoRight'>
//                                 <center>
//                                     <img src="./images/FileUpload.svg" height={50} width={50} alt="Upload Icon" />
//                                 </center>
//                                 <input
//                                     type='file'
//                                     accept='video/*,image/*'
//                                     onChange={handleFileChangeAdded}
//                                     multiple
//                                     disabled={uploading
//                                         || additionalFiles.filter(f => !f.markedForDeletion).length >= 5
//                                         //    || additionalFiles.length >= 3
//                                     }
//                                 />
//                                 <p>
//                                     {uploading ? 'Uploading...' :
//                                         isSubmitted ? 'Files saved' :
//                                             `Upload ${5 - additionalFiles.filter(f => !f.markedForDeletion).length} or more files`}
//                                 </p>

//                                 {errors.additionalFiles && (
//                                     <div className="AdminProderror-message">
//                                                                                   //NEWLY ADDED 2

//                                         Maximum 3 files allowed

//                                     </div>
//                                 )}
//                             </div>
//                         </div>



//                         {/* Product Section  */}
//                         <div className='manageClientSection'>
//                             <div className='manageRightSideHeading'>Vehicle Management</div>
//                             <div className='d-flex manageClientInformation'>

//                                 <div className='manageClientInfoLeft'>


//                                     <div className='clientDetailSection'>
//                                         <div className='clientDetailHeading'>Vehicle Name</div>
//                                         <input type='text' placeholder='Enter Product Name' value={vehicleName}
//                                             onChange={(e) => {
//                                                 setVehicleName(e.target.value);
//                                                 setErrors(prev => ({ ...prev, vehicleName: false }));

//                                             }}
//                                             className={`clientDetailsInput ${errors.vehicleName ? 'AdminProdinput-error' : ''}`}>

//                                         </input>
//                                         {errors.vehicleName && <div className="AdminProderror-message ">Vehicle name is required</div>}
//                                     </div>


//                                     <div className='clientDetailSection'>
//                                         <div className='clientDetailHeading'>Price</div>
//                                         <input type='number' placeholder='Enter Price' value={vehicleAmount}
//                                             onChange={(e) => {
//                                                 setVehicleAmount(e.target.value);
//                                                 setErrors(prev => ({ ...prev, vehicleAmount: false }));
//                                             }}
//                                             className={`clientDetailsInput ${errors.vehicleAmount ? 'AdminProdinput-error' : ''}`}></input>
//                                         {errors.vehicleAmount && <div className="AdminProderror-message ">Vehicle Amount is required</div>}
//                                     </div>

//                                     {/* <div className='clientDetailHeading'> Day </div>

//                                     <select className='clientDetailsInput ratingInput' value={prodRating}
//                                         onChange={(e) => handleRatingChange(e.target.value)}>
//                                         <option value="1">1</option>
//                                         <option value="2">2</option>
//                                         <option value="3">3</option>
//                                         <option value="4">4</option>
//                                         <option value="5">5</option>
//                                         <option value="6">6</option>
//                                         <option value="7">7</option>
//                                         <option value="8">8</option>
//                                         <option value="9">9</option>

//                                     </select> */}

//                                     {/* VEHICLE DELIVERY DAY COUNT  */}
//                                     <div className='clientDetailSection'>
//                                         <div className='clientDetailHeading'>Delivery Day</div>
//                                         <select className='clientDetailsInput ratingInput' value={vehicleDeliveryDay}
//                                             onChange={(e) => setVehicleDeliveryDay(e.target.value)}>
//                                             <option value="Select">Select</option>
//                                             <option value="1">1</option>
//                                             <option value="2">2</option>
//                                             <option value="3">3</option>
//                                             <option value="4">4</option>
//                                             <option value="5">5</option>
//                                             <option value="6">6</option>
//                                             <option value="7">7</option>
//                                             <option value="8">8</option>
//                                             <option value="9">9</option>
//                                         </select>
//                                         {errors.vehicleDeliveryDay && <div className="AdminProderror-message ">Vehicle Deliver Day is required</div>}
//                                     </div>

//                                     {/* VEHICLE BRANDING  */}
//                                     <div className='clientDetailSection'>
//                                         <div className='clientDetailHeading'>Branding</div>
//                                         <input type='text' placeholder='Enter Branding' value={vehicleBranding}
//                                             onChange={(e) => {
//                                                 setVehicleBranding(e.target.value);
//                                                 setErrors(prev => ({ ...prev, vehicleBranding: false }));

//                                             }}
//                                             className={`clientDetailsInput ${errors.vehicleBranding ? 'AdminProdinput-error' : ''}`}>

//                                         </input>
//                                         {errors.vehicleBranding && <div className="AdminProderror-message ">Vehicle Branding is required</div>}
//                                     </div>

//                                     {/* 
//                                     <div className='clientDetailSection'>
//                                         <div className='clientDetailHeading'>Lighting Type</div>
//                                         <select className={`clientDetailsInput ${errors.prodLighting ? 'AdminProdinput-error' : ''}`} value={prodLighting}
//                                             onChange={(e) => {
//                                                 setProdLighting(e.target.value);
//                                                 setErrors(prev => ({ ...prev, prodLighting: false }));
//                                             }}>
//                                             <option value="Select">Select</option>
//                                             <option value="Not-Lit">Not-Lit</option>
//                                             <option value="Front-Lit">Front-Lit</option>
//                                             <option value="Back-Lit">Back-Lit</option>
//                                         </select>
//                                         {errors.prodLighting && <div className="AdminProderror-message ">Product Lighting is required</div>}
//                                     </div> */}


//                                     {/* 
//                                     <div className='clientDetailSection'>
//                                         <div className='clientDetailHeading'>Printing Cost</div>
//                                         <input type='number' placeholder='Enter Price' value={productPrintingCost}
//                                             onChange={(e) => {
//                                                 setProductPrintingCost(e.target.value);
//                                                 setErrors(prev => ({ ...prev, productPrintingCost: false }));
//                                             }}
//                                             className={`clientDetailsInput ${errors.productPrintingCost ? 'AdminProdinput-error' : ''}`}></input>
//                                         {errors.productPrintingCost && <div className="AdminProderror-message ">Printing Cost is required</div>}
//                                     </div> */}
//                                 </div>
//                                 <div className='manageClientInfoRight'>
//                                     {/* VEHICLE ID  */}
//                                     <div className='clientDetailSection'>
//                                         <div className='clientDetailHeading'>Vehicle ID</div>
//                                         <input type='text' placeholder='Enter Product ID' value={vehicleID}
//                                             onChange={(e) => {
//                                                 setVehicleId(e.target.value);
//                                                 setErrors(prev => ({ ...prev, vehicleID: false }));
//                                             }} className={`clientDetailsInput ${errors.vehicleID ? 'AdminProdinput-error' : ''}`}></input>
//                                         {errors.vehicleID && <div className="AdminProderror-message ">Vehicle ID is required</div>}

//                                     </div>

//                                     {/* VEHICLE SIZE  */}
//                                     <div className='clientDetailSection'>
//                                         <div className='clientDetailHeading'>Size</div>
//                                         <div className='sizeWidthValues'>
//                                             W : <input type='number' value={vehicleWidth}
//                                                 onChange={(e) => {
//                                                     setVehicleWidth(e.target.value);
//                                                     setErrors(prev => ({ ...prev, vehicleWidth: false }));
//                                                 }} className={`sizeWidthInput ${errors.vehicleWidth ? 'AdminProdinput-error' : ''}`}  ></input><span className='sizeMultiply'> X </span>H : <input type='number' value={vehicleHeight}
//                                                     onChange={(e) => {
//                                                         setVehicleHeight(e.target.value);
//                                                         setErrors(prev => ({ ...prev, vehicleHeight: false }));
//                                                     }} className={`sizeWidthInput ${errors.vehicleHeight ? 'AdminProdinput-error' : ''}`}></input> <span className='sizeWidthSlash'> | </span> <label> {ProdSquareFeet()} </label>Sq.ft
//                                             {errors.vehicleWidth && errors.vehicleHeight && <div className="AdminProderror-message ">Vehicle Height & Width is required</div>}
//                                         </div>
//                                     </div>
//                                     {/* VEHICLE AUDIO  */}
//                                     <div className='clientDetailSection'>
//                                         <div className='clientDetailHeading'>Audio</div>
//                                         <input type='text' placeholder='Enter Audio' value={vehicleAudio}
//                                             onChange={(e) => {
//                                                 setVehicleAudio(e.target.value);
//                                                 setErrors(prev => ({ ...prev, vehicleAudio: false }));

//                                             }}
//                                             className={`clientDetailsInput ${errors.vehicleAudio ? 'AdminProdinput-error' : ''}`}>

//                                         </input>
//                                         {errors.vehicleAudio && <div className="AdminProderror-message ">Vehicle Audio is required</div>}
//                                     </div>
//                                     {/* VEHICLE POWER  */}
//                                     <div className='clientDetailSection'>
//                                         <div className='clientDetailHeading'>Power</div>
//                                         <input type='text' placeholder='Enter Power' value={vehiclePower}
//                                             onChange={(e) => {
//                                                 setVehiclePower(e.target.value);
//                                                 setErrors(prev => ({ ...prev, vehiclePower: false }));

//                                             }}
//                                             className={`clientDetailsInput ${errors.vehiclePower ? 'AdminProdinput-error' : ''}`}>

//                                         </input>
//                                         {errors.vehiclePower && <div className="AdminProderror-message ">Vehicle Power is required</div>}
//                                     </div>
//                                     {/* 
//                                     <div className='clientDetailSection'>
//                                         <div className='clientDetailHeading'>Location</div>
//                                         <label className='locationFromLabel'>From <label style={{ float: 'right' }}>-</label></label>
//                                         <input type='text' placeholder='Enter From' value={productFrom}
//                                             onChange={(e) => {
//                                                 setProductFrom(e.target.value);
//                                                 setErrors(prev => ({ ...prev, productFrom: false }));
//                                             }} className={`clientDetailsInput locationInput ${errors.productFrom ? 'AdminProdinput-error' : ''}`}></input>
//                                         {errors.productFrom && <div className="AdminProderror-message ">Product From is required</div>}

//                                         <br></br>
//                                         <label className='locationFromLabel'>To<label style={{ float: 'right' }}>-</label></label>
//                                         <input type='text' placeholder='Enter To' value={productTo}
//                                             onChange={(e) => {
//                                                 setProductTo(e.target.value);
//                                                 setErrors(prev => ({ ...prev, productTo: false }));
//                                             }} className={`clientDetailsInput locationInput ${errors.productTo ? 'AdminProdinput-error' : ''}`}></input>
//                                         {errors.productTo && <div className="AdminProderror-message ">Product To is required</div>}
//                                     </div> */}

//                                     {/* 
//                                     <div className='clientDetailSection'>
//                                         <div className='clientDetailHeading'>Mounting Cost</div>
//                                         <input type='number' placeholder='Enter Price' value={productMountingCost}
//                                             onChange={(e) => {
//                                                 setProductMountingCost(e.target.value);
//                                                 setErrors(prev => ({ ...prev, productMountingCost: false }));
//                                             }}
//                                             className={`clientDetailsInput ${errors.productMountingCost ? 'AdminProdinput-error' : ''}`}></input>
//                                         {errors.productMountingCost && <div className="AdminProderror-message ">Mouting Cost is required</div>}

//                                     </div> */}


//                                 </div>
//                             </div>
//                         </div>

//                         {/* Rating section  with OFFER */}
//                         <div style={{ display: 'flex', gap: '10px' }}>
//                             <div className='manageClientSection' style={{ width: '40%' }}>
//                                 <div className='clientDetailHeading'>Ratings</div>
//                                 <div className='ProductRatingMain'>
//                                     <div >
//                                         <div>
//                                             {/* <span><img src='./images/rating_board.png' className='Product-rate-board1'></img></span> */}
//                                             <span className='Product-star-main' >
//                                                 <RatingStars1 rating={parseFloat(vehicleRating) || 0} />
//                                             </span>
//                                         </div>
//                                     </div>
//                                     <div>
//                                         {/* <input type='number' step='0.1' min='0' max='5' placeholder='Rating' value={prodRating}
//                                     onChange={(e) => handleRatingChange(e.target.value)} className='clientDetailsInput ratingInput'></input> */}
//                                         <select className='clientDetailsInput ratingInput' value={vehicleRating}
//                                             onChange={(e) => handleRatingChange(e.target.value)}>
//                                             <option value="1">1</option>
//                                             <option value="1.5">1.5</option>
//                                             <option value="2">2</option>
//                                             <option value="2.5">2.5</option>
//                                             <option value="3">3</option>
//                                             <option value="3.5">3.5</option>
//                                             <option value="4">4</option>
//                                             <option value="4.5">4.5</option>
//                                             <option value="5">5</option>
//                                         </select>
//                                     </div>
//                                 </div>
//                             </div>
//                             {/* <div className='manageClientSection' style={{ width: '60%' }}>
//                                 <div className='clientDetailHeading'>Offers</div>
//                                 <div className='ProductRatingMain'>
//                                     <div className='AdminOfferDetails' >Pay ₹<input type='number' value={productFixedAmount} onChange={(e) => setProductFixedAmount(e.target.value)} className='sizeWidthInput adminOfferAmountInput' readOnly></input> and Get <input type='number' value={productFixedAmountOffer} onChange={(e) => setProductFixedAmountOffer(e.target.value)} className='sizeWidthInput adminOfferAmountPercentage' readOnly></input>% Off <span className='adminOfferRefundDetails'> 100% Refundable </span>
//                                     </div>

//                                 </div>
//                             </div> */}
//                         </div>
//                         {/* Select Category section   */}
//                         {/* <div className='manageClientSection'>
//                             <div className='clientDetailHeading'>Select Category</div>
//                             <div className='d-flex manageClientInformation'>
//                                 <div className='manageClientInfoLeft'>
//                                     <div className='clientDetailHeading'>Location</div>
//                                     <div className="location-container11">
//                                             <input
//                                                 type="text"
//                                                 className="clientDetailsInput locationSelectInput"
//                                                 value={selectedState && selectedDistrict ? `${selectedState}, ${selectedDistrict}` : ""}
//                                                 placeholder="Select Location"
//                                                 readOnly />
//                                             <i className={`fa-solid ${showStates ? "fa-chevron-up" : "fa-chevron-down"} dropdown-arrow11`} style={{ fontSize: '10px' }}></i>
//                                         </div>
//                                         <div className="dropdown-container11">
//                                             {showStates && (
//                                                 <div className="dropdown11">
//                                                     <ul className="dropdown-list11">
//                                                         {Object.keys(stateDistricts).map((state) => (
//                                                             <li
//                                                                 key={state}
//                                                                 onClick={() => handleStateClick(state)}
//                                                                 className={selectedState === state ? "selected" : ""}
//                                                             >
//                                                                 {state}
//                                                             </li>
//                                                         ))}
//                                                     </ul>
//                                                 </div>
//                                             )}

//                                             {showDistricts && selectedState && (
//                                                 <div className="dropdown11">
//                                                     <ul className="dropdown-list11">
//                                                         {stateDistricts[selectedState].map((district) => (
//                                                             <li
//                                                                 key={district}
//                                                                 onClick={() => handleDistrictClick(district)}
//                                                                 className={selectedDistrict === district ? "selected" : ""} >
//                                                                 {district}
//                                                             </li>
//                                                         ))}
//                                                     </ul>
//                                                 </div>
//                                             )}
//                                         </div>
//                                     </div>
//                                 </div>
//                                 <div className='manageClientInfoRight'>
//                                     <div className='clientDetailHeading'>Media Type</div>
//                                     <select className='clientDetailsInput' value={prodType} onChange={(e) => setProdType(e.target.value)} >
//                                         <option value="">Select Media Type</option>
//                                         {mediaTypesData.map((media, id) => (
//                                             <option key={media._id} value={media.type}>
//                                                 {media.type}
//                                             </option>
//                                         ))}
//                                     </select>

//                                 </div>
//                             </div>

//                         </div> */}

//                         {/* SELECT LOGITUDE AND LATITUDE FROM MAP */}
//                         {/* <div className='manageClientSection'>
//                             <div className='clientDetailHeading'>Generate Location</div>
//                             <div className='ProdLocationLinkMain'>
//                                 <div className='clientDetailSection'>
//                                     <div className='clientDetailHeading'>Product Latitude</div>
//                                     <input type='text' placeholder='Enter Product Name' value={prodLatitude}
//                                         onChange={(e) => {
//                                             setProdLatitude(e.target.value);
//                                             setErrors(prev => ({ ...prev, prodLatitude: false }));

//                                         }}
//                                         className={`clientDetailsInput ${errors.prodLatitude ? 'AdminProdinput-error' : ''}`}>

//                                     </input>
//                                     {errors.prodLatitude && <div className="AdminProderror-message ">Product Latitude is required</div>}
//                                 </div>
//                                 <div className='clientDetailSection'>
//                                     <div className='clientDetailHeading'>Product Longitude</div>
//                                     <input type='text' placeholder='Enter Product Name' value={prodLongitude}
//                                         onChange={(e) => {
//                                             setProdLongitude(e.target.value);
//                                             setErrors(prev => ({ ...prev, prodLongitude: false }));

//                                         }}
//                                         className={`clientDetailsInput ${errors.prodLongitude ? 'AdminProdinput-error' : ''}`}>
//                                     </input>
//                                     {errors.prodLongitude && <div className="AdminProderror-message ">Product Longitude is required</div>}
//                                 </div>
//                             </div>
//                             <div
//                                 //  onClick={generateGoogleMapsLink}
//                                 style={{ padding: '10px 15px', backgroundColor: '#4285F4', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }} > Generate Link </div>
//                         </div> */}





//                         {/* Similar Products section  */}
//                         {/* <div className='manageClientSection'>
//                             <div className='clientDetailHeading'>Similar Products</div>
//                             <div className='manageClientInformation'>
//                                 <div className='manageClientInfoLeft' style={{ position: 'relative' }}>
//                                     <input type='text' placeholder='Product Code' value={similarProdId}
//                                         onChange={(e) => {
//                                             setSimilarProdId(e.target.value);
//                                             // Show suggestions only when there's input
//                                             if (e.target.value.trim()) {
//                                                 const normalizedInput = normalizeCode(e.target.value);
//                                                 const selectedCodes = selectedSimilarProducts.map(p => normalizeCode(p.prodCode));

//                                                 const matches = products.filter(product => {
//                                                     const isMatch =
//                                                         (normalizeCode(product.prodCode).includes(normalizedInput) ||
//                                                             product.name.toLowerCase().includes(e.target.value.toLowerCase()
//                                                             ));
//                                                     const notSelected = !selectedCodes.includes(normalizeCode(product.prodCode));
//                                                     return isMatch && notSelected;
//                                                 }).slice(0, 5);
//                                                 setSearchSuggestions(matches);
//                                             } else {
//                                                 setSearchSuggestions([]);
//                                             }

//                                         }}


//                                         className='clientDetailsInput'></input>


//                                     {searchSuggestions.length > 0 && (
//                                         <div className="suggestions-dropdown">
//                                             {searchSuggestions.map((product) => (
//                                                 <div
//                                                     key={product.prodCode}
//                                                     className="suggestion-item"
//                                                     onClick={() => {
//                                                         setSelectedSimilarProducts(prev => [...prev, product]);
//                                                         setSimilarProdId('');
//                                                         setSearchSuggestions([]);
//                                                     }} >
//                                                     <div className="suggestion-code">{product.prodCode}</div>
//                                                     <div className="suggestion-name">{product.name}</div>
//                                                     <div className="suggestion-image">
//                                                         <img src={product.image} alt={product.name} />
//                                                     </div>
//                                                 </div>
//                                             ))}
//                                         </div>
//                                     )}
//                                 </div>
//                                 <div className='manageClientInfoRight'>
//                                     <div className='manageProductSelectBtn' onClick={handleSelectProduct} >Select</div>
//                                 </div>
//                             </div>
//                         </div> */}
//                     </div>
//                 </div>


//                 {/* RICH TEXT FIELDS  */}
//                 <div className='richTextEditorMain'>
//                     <div className='BlogContentEditorMain'>
//                         <div className='BlogContentEditor'>
//                             <ReactQuill
//                                 theme="snow"
//                                 value={richTextContent}
//                                 onChange={setRichTextContent}
//                                 modules={modules}
//                                 formats={formats}
//                                 className='BlogContentEditor-frame'
//                             />
//                             {errors.richTextContent && (
//                                 <div className="AdminProderror-message">Rich text content is required</div>
//                             )}
//                         </div>
//                         <div className='BlogContentPreview'>
//                             <h4 className="text-center">Content Preview</h4>
//                             <div
//                                 className='preview-content'
//                                 dangerouslySetInnerHTML={{ __html: richTextContent }} />
//                         </div>
//                     </div>
//                 </div>


//                 <button className="calendarSaveBtn" type='submit'
//                     disabled={uploading}>
//                     {uploading ? 'Processing...' : (editProduct ? 'Update' : 'Save')}
//                 </button>
//             </form>
//         </div>
//     )
// }
// export default ClientSection;





















// import React, { useState, useContext, useEffect } from 'react';
// import { useLocation, useNavigate, useParams } from 'react-router-dom';
// import './ad1Manage.css';
// import './ad1VehicleUpload.css';
// import './ad1VehicleUploadVideos.css';
// // import { useSpot } from '../components/B0SpotContext';
// import { ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import { toast } from 'react-toastify';
// import { baseUrl } from '../Authentication/BASE_URL';
// import './RichText.css';
// import ReactQuill from 'react-quill';
// import 'react-quill/dist/quill.snow.css';

// function VehicleUpload() {
//     const { state } = useLocation();
//     const { id } = useParams();
//     const navigate = useNavigate();
//     //Start rating board
//     const RatingStars = ({ rating }) => {
//         const fullStars = Math.floor(rating);
//         const halfStar = rating % 1 !== 0;
//         const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
//         return (
//             <div className='Product-rating-star'>
//                 {[...Array(fullStars)].map((_, index) => (
//                     <span key={index} className="fa-solid fa-star Product-stars1"></span>
//                 ))}
//                 {halfStar && <span className="fa-solid fa-star-half-alt Product-stars1"></span>}
//                 {[...Array(emptyStars)].map((_, index) => (
//                     <span key={index} className="fa-solid fa-star Product-empty-star1 Product-stars1"></span>
//                 ))}
//             </div>
//         );
//     };
//     // PRODUCT RATING SECTION 
//     const RatingStars1 = ({ rating }) => {
//         const fullStars = Math.floor(rating);
//         const halfStar = rating % 1 !== 0;
//         const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
//         return (
//             <div>
//                 <div className='Product-rating-star1'>
//                     {[...Array(fullStars)].map((_, index) => (
//                         <span key={index} className="fa-solid fa-star Product-stars1"></span>
//                     ))}
//                     {halfStar && <span className="fa-solid fa-star-half-alt Product-stars1"></span>}
//                     {[...Array(emptyStars)].map((_, index) => (
//                         <span key={index} className="fa-solid fa-star Product-empty-star1 Product-stars1"></span>
//                     ))}
//                 </div>
//                 <div>

//                 </div>
//             </div>

//         );
//     };
//     //HANDLING ERRORS
//     const [errors, setErrors] = useState({
//         vehicleName: false,
//         vehicleAmount: false,
//         vehicleID: false,
//         vehicleDeliveryDay: false,
//         vehicleAudio: false,
//         vehicleBranding: false,
//         vehiclePower: false,
//         vehicleRating: false,
//         vehicleHeight: false,
//         vehicleWidth: false,
//         image: false,
//         // additionalFiles: false
//     });

//     const validateForm = () => {
//         const validAdditionalFiles = additionalFiles.filter(file => !file.markedForDeletion);
//         const newErrors = {
//             vehicleName: !vehicleName,
//             vehicleAmount: !vehicleAmount,
//             vehicleID: !vehicleID,
//             vehicleDeliveryDay: !vehicleDeliveryDay,
//             vehicleAudio: !vehicleAudio,
//             vehicleBranding: !vehicleBranding,
//             vehiclePower: !vehiclePower,
//             vehicleRating: !vehicleRating,
//             vehicleHeight: !vehicleHeight,
//             vehicleWidth: !vehicleWidth,
//             image: !image || image === " ",
//             // additionalFiles: validAdditionalFiles.length > 5 // Add validation for additional files
//         };
//         setErrors(newErrors);
//         return !Object.values(newErrors).some(error => error);
//     }; 

//     const [vehicleName, setVehicleName] = useState("");
//     const [vehicleAmount, setVehicleAmount] = useState("");
//     const [vehicleID, setVehicleId] = useState("");
//     const [vehicleDeliveryDay, setVehicleDeliveryDay] = useState("");
//     const [vehicleAudio, setVehicleAudio] = useState("");
//     const [vehicleBranding, setVehicleBranding] = useState("");
//     const [vehiclePower, setVehiclePower] = useState("");
//     // Rating section 
//     const [vehicleRating, setVehicleRating] = useState(4.5);
//     // Vehicle Size calculation 
//     const [vehicleWidth, setVehicleWidth] = useState('');
//     const [vehicleHeight, setVehicleHeight] = useState('');
//     const ProdSquareFeet = () => {
//         const squareFeet = vehicleWidth * vehicleHeight;
//         return squareFeet;
//     };
//     const [vehicleFixedAmount, setVehicleFixedAmount] = useState('999');
//     const [vehicleFixedAmountOffer, setVehicleFixedAmountOffer] = useState('5');


//     const handleRatingChange = (value) => {
//         // Convert the value to a valid number, ensuring it remains within 0-5 range
//         let newRating = parseFloat(value);
//         if (newRating >= 0 && newRating <= 5) {
//             setVehicleRating(newRating);
//         }
//     };
//     //IMAGE UPLOADED & ADDED SUB IMAGES/VIDEOS
//     const [imageFile, setImageFile] = useState(null); // Store the File object
//     const [image, setImage] = useState(""); // Store the preview URL or existing image URL

//     const [localFiles, setLocalFiles] = useState([]);
//     const [uploadedFiles, setUploadedFiles] = useState([]);
//     const [additionalFiles, setAdditionalFiles] = useState([]);

//     const [uploading, setUploading] = useState(false);
//     const [isSubmitted, setIsSubmitted] = useState(false);

//     // Modified handleImageUpload to only create a preview
//     const handleImageUpload = (event) => {
//         const file = event.target.files[0];
//         if (file) {
//             // Create a preview URL
//             const previewUrl = URL.createObjectURL(file);
//             setImage(previewUrl);
//             setImageFile(file);
//         }
//         // console.log(`Vehicle Main image URL: `, image);
//     };

//     console.log(`Vehicle Main image URL: `, image);

//     const handleFileChangeAdded = (e) => {
//         if (!e.target.files || e.target.files.length === 0) return;
//         const files = Array.from(e.target.files).filter(file =>
//             file.type.startsWith('video/') ||
//             file.type.startsWith('image/') ||
//             ['.mp4', '.mov', '.avi', '.mkv', '.jpg', '.jpeg', '.png', '.gif'].some(ext =>
//                 file.name.toLowerCase().endsWith(ext))
//         );
//         if (files.length === 0) {
//             alert('Please select valid video or image files');
//             return;
//         }
//         // Count only non-deleted files
//         const currentNonDeletedFiles = additionalFiles.filter(f => !f.markedForDeletion).length;
//         if (currentNonDeletedFiles + files.length > 5) {
//             alert(`Maximum 5 files allowed. You already have ${currentNonDeletedFiles} files.`);
//             return;
//         }

//         const newFiles = files.map(file => ({
//             file,
//             previewUrl: URL.createObjectURL(file),
//             id: `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
//             type: file.type.startsWith('video/') ? 'video' : 'image',
//             isNew: true // Mark as new for upload handling

//         }));
//         setAdditionalFiles(prev => [...prev, ...newFiles]);
//         e.target.value = '';
//     };


//     const handleDeleteAdded = async (fileToDelete) => {
//         if (!window.confirm('Delete this file?')) return;
//         try {
//             // If it's an uploaded file, delete from Cloudinary
//             if (fileToDelete.public_id) {
//                 setAdditionalFiles(prev =>
//                     prev.map(file =>
//                         file.public_id === fileToDelete.public_id
//                             ? { ...file, markedForDeletion: true }
//                             : file
//                     )
//                 );

//             } else {
//                 setAdditionalFiles(prev =>
//                     prev.filter(file => file.id !== fileToDelete.id)
//                 );
//             }
//         } catch (error) {
//             console.error('Delete error:', error);
//             alert('Failed to delete file');
//         }
//     };



//     const [productsData, setProductsData] = useState([]);
//     const [editVehicle, setEditVehicle] = useState(null);

//     // 👇 Prefill form if state has editProduct
//     useEffect(() => {
//          console.log("Location state:", state);
//         if (state?.editVehicle) {
//             const vehicle = state.editVehicle;
//             console.log("Editing vehicle:", vehicle);
//             setEditVehicle(vehicle);
//             // Set form fields from vehicle data
//             if (vehicle.vehicleDetails) {
//                 const details = vehicle.vehicleDetails;
//             setVehicleId(details.vehicleID || '');
//             setVehicleName(details.name || '');
//             setVehicleAmount(details.amount || '');
//             setVehicleDeliveryDay(details.deliveryDay || '');
//             setVehicleAudio(details.audio || '');
//             setVehicleBranding(details.branding || '');
//             setVehiclePower(details.power || '');
//             setVehicleRating(details. rating|| '');
//             setVehicleWidth(details.vehicleSize.width || '');
//             setVehicleHeight(details.vehicleSize.height || '');
//             setImage(details.image || '');
//             setAdditionalFiles([]);
//             setRichTextContent(details.vehicleDescription || '');
//              // Set additional files if they exist
//                 if (details.additionalFiles && details.additionalFiles.length > 0) {
//                     setAdditionalFiles(details.additionalFiles.map(file => ({
//                         ...file,
//                         previewUrl: file.url, // Use the actual URL for preview
//                         id: file.public_id // Use public_id as identifier
//                     })));
//                 }
//                 }
//            // Set similar products if they exist - FIXED THIS SECTION
//     if (vehicle.similarProducts && vehicle.similarProducts.length > 0) {
//       const normalizedSimilarProducts = normalizeSimilarProducts(vehicle.similarProducts);
//       setSelectedSimilarProducts(normalizedSimilarProducts);
//     }
//             // setSelectedState(prod.location?.state || '');
//             // setSelectedDistrict(prod.location?.district || '');
//             // setImage(prod.image || '');
//             // // setSelectedSimilarProducts(prod.similarProducts || []);
//             // setSelectedSimilarProducts(normalizeSimilarProducts(prod.similarProducts || []));
//             // setProdLatitude(prod.Latitude || '');
//             // setProdLongitude(prod.Longitude || '');
//             // setProdLocationLink(prod.LocationLink || '');
//             // // Set additional files if they exist
//             // if (prod.additionalFiles && prod.additionalFiles.length > 0) {
//             //     setAdditionalFiles(prod.additionalFiles);
//             // }
//         }
//     }, [state]);

//     const fetchProduct = async () => {
//         const response = await fetch(`${baseUrl}/vehicles`);
//         const data = await response.json();
//         setProductsData(data);
//         console.log(data);
//         // setEditProduct(data[0]);   
//     }
//     useEffect(
//         () => {
//             fetchProduct();
//         },
//         []
//     );



//     const [similarProdId, setSimilarProdId] = useState('');
//     const [selectedSimilarProducts, setSelectedSimilarProducts] = useState([]); // Store selected products
//     // Optional: Add typeahead search
//     const [searchSuggestions, setSearchSuggestions] = useState([]);
//     // SIMILAR PRODUCTS 
//     const [vehiclesData, setVehiclesData] = useState([]);
//     //Fetch/get  products from data
//     useEffect(() => {
//         fetch(`${baseUrl}/vehicles`)
//             .then((response) => response.json())
//             .then((data) => {
//                 const productsWithVisibility = data.map((vehicle) => ({
//                     ...vehiclesData,
//                     visible: vehicle.vehicleDetails.visible !== false, // fallback to true
//                 }));
//                 setVehiclesData(productsWithVisibility.sort((a, b) => b.vehicleDetails.visible - a.vehicleDetails.visible));
//             }).catch(error => console.error('Error fetching vehicles:', error));

//     }, []);

//     // const normalizeSimilarProducts = (products) =>
//     //     products.map(p => ({
//     //         ...p,
//     //         prodCode: p.ProdCode, // for UI consistency
//     //         name: p.Prodname
//     //     }));
//     // Add this function to normalize similar products
// const normalizeSimilarProducts = (products) => {
//   if (!products) return [];
//   return products.map(p => ({
//     ...p,
//     vehicleID: p.vehicleID,
//     vehicleName: p.vehicleDetails?.name,
//     vehicleImage: p.vehicleDetails?.image
//   }));
// };

// const normalizeCode = (code) => {
//         return code ? code.toString().toLowerCase().trim().replace(/\s+/g, '') : '';
//     };


//     const handleSelectProduct = () => {
//         const enteredId = similarProdId.trim();
//         if (!enteredId) return;

//         // // Find matches using fuzzy search
//         // const matches = products.filter(product => {
//         //     const matchCode = normalizeCode(product.prodCode) === normalizeCode(enteredId);
//         //     const matchName = product.name.toLowerCase().includes(enteredId.toLowerCase());
//         //     return matchCode || matchName;
//         // });
// // Find matches using safe search
//     const matches = vehiclesData.filter(product => {
//         const productName = product.vehicleDetails?.name ;
//         const productCode = product.vehicleDetails?.vehicleID ;

//         const matchCode = normalizeCode(productCode) === normalizeCode(enteredId);
//         const matchName = productName.toLowerCase().includes(enteredId.toLowerCase());
//         return matchCode || matchName;
//     });


//         if (matches.length === 0) {
//             // toast.error("No matching products found");
//             alert("No matching products found");
//             return;
//         }

//         if (matches.length > 1) {
//            alert("Multiple matches found - please select from suggestions");

//           //  toast.info("Multiple matches found - please select from suggestions");
//             return;
//         }

//         const productToAdd = matches[0];

//         // if (selectedSimilarProducts.some(p => normalizeCode(p.prodCode) === normalizeCode(productToAdd.prodCode))) {
//         //     toast.warning("Product already added");
//         //     return;
//         // }
//         // Check if already selected using safe comparison
//     const isAlreadySelected = selectedSimilarProducts.some(p => {
//         const selectedCode = p.vehicleDetails?.vehicleID || p.prodCode || p.ProdCode;
//         const newCode = productToAdd.vehicleDetails?.vehicleID || productToAdd.prodCode || productToAdd.ProdCode;
//         return normalizeCode(selectedCode) === normalizeCode(newCode);
//     });

//     if (isAlreadySelected) {
//         alert("Vehicle already added");
//         return;
//     }

//         setSelectedSimilarProducts(prev => [...prev, productToAdd]);
//         setSimilarProdId('');
//         setSearchSuggestions([]);
//     };

//     const handleRemoveProduct = (prodCode) => {
//         if (!window.confirm("Are you sure you want to delete this product?")) return;

//         // Normalize code for comparison
//         // const normalize = code => code.replace(/^#/, '').trim().toLowerCase();
// const normalize = code => code ? code.toString().toLowerCase().trim().replace(/\s+/g, '') : '';
//         const targetCode = normalize(prodCode);

//         setSelectedSimilarProducts(prev =>
//             prev.filter(product =>{
//                 // normalize(product.prodCode) !== targetCode
//                 const productCode = normalize(product.prodCode || product.ProdCode);
//       return productCode !== targetCode;

//     })
//         );
//     };




// // Safe search suggestions handler
// const handleSearchChange = (e) => {
//     const value = e.target.value;
//     setSimilarProdId(value);

//     if (!value.trim()) {
//         setSearchSuggestions([]);
//         return;
//     }

//     const normalizedInput = normalizeCode(value);
//     const selectedCodes = selectedSimilarProducts.map(p => 
//         normalizeCode(p.vehicleDetails?.vehicleID || p.prodCode || p.ProdCode)
//     );

//     const matches = vehiclesData.filter(product => {
//         const productName = product.vehicleDetails?.name || product.name || '';
//         const productCode = product.vehicleDetails?.vehicleID || product.prodCode || product.ProdCode || '';

//         const isMatch = 
//             normalizeCode(productCode).includes(normalizedInput) ||
//             productName.toLowerCase().includes(value.toLowerCase());

//         const notSelected = !selectedCodes.includes(normalizeCode(productCode));
//         return isMatch && notSelected;
//     }).slice(0, 5);

//     setSearchSuggestions(matches);
// };






//     const handleSaveProduct = async (e) => {
//         e.preventDefault();
//         // Validate form first
//         if (!validateForm()) {
//             alert("Please fill all required fields correctly");
//             return;
//         }
//         // Validate additional files
//         const validAdditionalFiles = additionalFiles.filter(file => !file.markedForDeletion);
//         // if (validAdditionalFiles.length < 3) {
//         //     alert(`Please upload ${3 - validAdditionalFiles.length} more file(s)`);
//         //     return;
//         // }
//         if (validAdditionalFiles.length > 5) {
//             alert(`Maximum 5 additional files allowed. You have ${validAdditionalFiles.length} files.`);
//             return;
//         }

//         // // Validate location link
//         // if (!prodLocationLink) {
//         //     alert("Please generate location link");
//         //     return;
//         // }

//         // // First check similar products count
//         // if (selectedSimilarProducts.length < 4) {
//         //     alert("Please add at least 4 similar products");
//         //     return;
//         // }
//         console.log("Save product");
//         // Optional warning (but still allows submission)
//         if (selectedSimilarProducts.length === 0) {
//             if (!window.confirm("You haven't added any similar products. Continue anyway?")) {
//                 return;
//             }
//         }

//         // Show confirmation for products without additional files NEWLY ADDED 2 
//         if (validAdditionalFiles.length === 0) {
//             if (!window.confirm("You haven't added any additional files. Continue without additional files?")) {
//                 return;
//             }
//         }
//         setUploading(true);
//         // Save product to database
//         const method = editVehicle ? 'PUT' : 'POST';
//         const url = editVehicle ? `${baseUrl}/vehicles/${editVehicle._id}` :
//             `${baseUrl}/vehicles`;
//         try {
//             // STEP 1: Upload main image if it's a new file
//             let cloudinaryUrl = image; // Use existing URL if editing
//             // let additionalFiles = [...uploadedFiles];
//             let cloudinaryPublicId = editVehicle?.vehicleDetails.imagePublicId || null;

//             // Only upload if we have a new file
//             if (imageFile && !image.startsWith('http')) {
//                 const formData = new FormData();
//                 formData.append("file", imageFile);
//                 const uploadResponse = await fetch(`${baseUrl}/upload`, {
//                     method: "POST",
//                     body: formData
//                 });
//                 if (!uploadResponse.ok) {
//                     throw new Error('Failed to upload main image');
//                 }
//                 const uploadData = await uploadResponse.json();
//                 cloudinaryUrl = uploadData.imageUrl;
//                 cloudinaryPublicId = uploadData.public_id;
//                 console.log("Main image URL:", cloudinaryUrl);

//             }
//             else if (image.startsWith('http')) {
//                 console.log("Using existing main image URL:", image);
//             }
//             else {
//                 throw new Error('Main image is required');
//             }
//             // Step 2: Handle additional files
//             const finalAdditionalFiles = [];
//             let fileIndex = 1;
//             // Upload new files
//             const newFilesToUpload = additionalFiles.filter(file => !file.public_id && file.file && !file.markedForDeletion);
//             // .filter(file => file.isNew && !file.public_id);
//             if (newFilesToUpload.length > 0) {
//                 const formData = new FormData();
//                 newFilesToUpload.forEach(fileObj => {
//                     formData.append('files', fileObj.file);
//                 });
//                 console.log(`Uploading ${newFilesToUpload.length} additional files...`);
//                 const filesResponse = await fetch(`${baseUrl}/save-videos`, {
//                     method: 'POST',
//                     body: formData
//                 });
//                 if (!filesResponse.ok) {
//                 const errorText = await filesResponse.text();
//                     console.error('Upload failed:', errorText);
//                     throw new Error('Failed to upload additional files');
//                 }
//                     const savedFiles = await filesResponse.json();
//                                     console.log('Additional files uploaded:', savedFiles);

//                     savedFiles.forEach(file => {
//                         console.log(`Additional file ${fileIndex} URL:`, file.url);
//                         fileIndex++;
//                         finalAdditionalFiles.push({
//                             url: file.url,
//                             public_id: file.public_id,
//                             type: file.type
//                         });
//                     });
//             }

//             // Add existing files that aren't marked for deletion
//             additionalFiles.forEach(file => {
//                 if (file.public_id && !file.markedForDeletion) {
//                     console.log(`Using existing additional file URL:`, file.url);
//                     finalAdditionalFiles.push({
//                         url: file.url,
//                         public_id: file.public_id,
//                         type: file.type
//                     });
//                 }
//             });
//             console.log('Final additional files:', finalAdditionalFiles);

//             // Step 3: Delete any files marked for deletion
//             const filesToDelete = additionalFiles.filter(file => file.markedForDeletion && file.public_id);
//             for (const file of filesToDelete) {
//                 try {
//                     console.log("Deleting file with public_id:", file.public_id);
//                     await fetch(`${baseUrl}/delete-video`, {
//                         method: 'POST',
//                         headers: { 'Content-Type': 'application/json' },
//                         body: JSON.stringify({
//                             public_id: file.public_id,
//                             resource_type: file.type
//                         })
//                     });
//                 } catch (deleteError) {
//                     console.error('Error deleting file:', deleteError);
//                 }
//             }

//             const response = await fetch(url, {
//                 method: method,
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({
//                     vehicleDetails: {
//                         vehicleID: vehicleID,
//                         name: vehicleName,
//                         amount: parseFloat(vehicleAmount),
//                         deliveryDay: parseInt(vehicleDeliveryDay),
//                         audio: vehicleAudio,
//                         branding: vehicleBranding,
//                         power: vehiclePower,
//                         rating: vehicleRating,
//                         vehicleSize: {
//                             width: vehicleWidth,
//                             height: vehicleHeight,
//                             VehicleSizeSquareFeet: ProdSquareFeet(),
//                         },
//                         image: cloudinaryUrl,
//                         imagePublicId: cloudinaryPublicId, // Store public_id for future deletion
//                         additionalFiles: finalAdditionalFiles,
//                         vehicleDescription : richTextContent,
//                         visible: true,
//                     },
//                     // similarVehicles: selectedSimilarProducts.map(vehicle => ({
//                     //     Name: vehicle.vehicleName,
//                     //     VehicleID: vehicle.vehicleID,
//                     //     image: vehicle.cloudinaryUrl,
//                     //     vehiclePrice: vehicle.vehicleAmount,

//                     // })),
// similarVehicles: selectedSimilarProducts.map(vehicle => {
//     const vehicleDetails = vehicle.vehicleDetails || vehicle;
//     return {
//         Name: vehicleDetails.name,
//         VehicleID: vehicleDetails.vehicleID,
//         image: vehicleDetails.image,
//         vehiclePrice: vehicleDetails.amount
//     };
// }),

//                     // productsquareFeet: ProdSquareFeet(),
//                     // location: {
//                     //     state: selectedState,
//                     //     district: selectedDistrict
//                     // },
//                     // similarProducts: selectedSimilarProducts.map(prod => ({
//                     //     Prodname: prod.name,
//                     //     ProdCode: prod.prodCode,
//                     //     image: prod.image,
//                     //     ProdPrice: prod.price,
//                     //     ProdPrintingCost: prod.printingCost,
//                     //     ProdMountingCost: prod.mountingCost
//                     // })),
//                     // Latitude: prodLatitude,
//                     // Longitude: prodLongitude,
//                     // LocationLink: prodLocationLink,
//                 }),
//             });
//              if (!response.ok) {
//                 const errorText = await response.text();
//                 console.error('Server response error:', errorText);
//                 throw new Error('Failed to save vehicle data');
//             }
//             //  console.log("Submitting product data to MongoDB:", productData);
//             const result = await response.json();
//             console.log('Vehicle saved successfully:', result);

// //             if (!editVehicle) {
// //                 // setProductsData([...productsData, result]);
// //                 setProductsData(prev => [...prev, result]);
// //                 alert("Vehicle added successfully!");
// //             }
// //             else {
// //                 // setProductsData(productsData.map((product) => (product._id === result._id ? result : product)));  // Update task
// //                 setProductsData(prev =>
// //                     prev.map((product) =>
// //                         product._id === result._id ? result : product
// //                     )
// //                 );
// //                 alert("Vehicle updated successfully!");
// //                 // Force reload or update parent state if needed
// //                 window.location.reload();
// //             }
// //  resetForm();


//               if (!editVehicle) {
//                 alert("Vehicle added successfully!");
//             } else {
//                 alert("Vehicle updated successfully!");
//                 // Navigate back to vehicles list after successful update
//                 setTimeout(() => {
//                     navigate('/admin#vehicles');
//                 }, 1500);
//                 resetForm();

//             }
//            // Reset form only for new vehicles
//             if (!editVehicle) {
//                 resetForm();
//             }
//         }
//         catch (error) {
//             console.error('Error saving vehicle:', error);
//             alert("An error occurred while saving the product.");
//         }
//         finally {
//             setUploading(false);
//         }
//     };



//     // Add this helper function
//     const resetForm = () => {
//              setVehicleId('');
//             setVehicleName('');
//             setVehicleAmount('');
//             setVehicleDeliveryDay('');
//             setVehicleAudio('');
//             setVehicleBranding('');
//             setVehiclePower('');
//             setVehicleRating('');
//             setVehicleWidth('');
//             setVehicleHeight('');
//             setImage('');
//             setAdditionalFiles([]);
//             setRichTextContent('');
//             setEditVehicle(null);
//             setImageFile(null);
//             // setSelectedSimilarProducts([]);
//             // setProductFixedAmount('999');
//             // setProductFixedAmountOffer('5');
//     };

//     // Clean up preview URLs
//     useEffect(() => {
//         return () => {
//             if (image && !image.startsWith('http')) {
//                 URL.revokeObjectURL(image);
//             }
//             additionalFiles.forEach(file => {
//                 if (file.previewUrl) {
//                     URL.revokeObjectURL(file.previewUrl);
//                 }
//             });
//         };
//     }, [image, additionalFiles]);

//     // //FETCH STATE AND DISTRICTS IN CATEGORY SECTION
//     // const [stateDistricts, setStateDistricts] = useState({});
//     // useEffect(() => {
//     //     const fetchCategoryData = async () => {
//     //         try {
//     //             const res = await fetch(`${baseUrl}/category`);
//     //             const data = await res.json();

//     //             // Convert to { "Tamil Nadu": ["Chennai", "Coimbatore"], ... }
//     //             const mappedData = {};
//     //             data.forEach(({ state, districts }) => {
//     //                 mappedData[state] = districts;
//     //             });

//     //             setStateDistricts(mappedData);
//     //         } catch (err) {
//     //             console.error("Failed to fetch category data:", err);
//     //         }
//     //     };

//     //     fetchCategoryData();
//     // }, []);

//     // //FETCH MEDIA TYPES FROM THE DATABASE
//     // const [mediaTypesData, setMediaTypesData] = useState([]);
//     // const fetchMediaTypes = async () => {
//     //     try {
//     //         const res = await fetch(`${baseUrl}/mediatype`);
//     //         const data = await res.json();
//     //         setMediaTypesData(data);
//     //     } catch (err) {
//     //         alert('Failed to fetch media types: ' + err.message);
//     //     }
//     // };

//     // useEffect(() => {
//     //     fetchMediaTypes();
//     // }, []);



//     //RICH TEXT CONTENTS
//     const [richTextContent, setRichTextContent] = useState('');
//     // Define toolbar modules
//     const modules = {
//         toolbar: [
//             [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
//             [{ font: [] }],
//             [{ size: [] }],
//             [{ 'align': [] }],
//             ['bold', 'italic', 'underline', 'strike', 'blockquote'],
//             [{ 'list': 'ordered' }, { 'list': 'bullet' },
//             ],
//             ['link', 'image', 'video'],
//         ]
//     };
//     const formats = ['header', 'font', 'size', 'align', 'bold', 'italic', 'underline', 'strike', 'blockquote', 'list', 'bullet', 'list', 'ordered', 'link', 'image', 'video'];

//     return (
//         <div>
//             <form
//            onSubmit={handleSaveProduct}
//             >
//                 <div className='adManageMain'>
//                     {/* Left side section  */}
//                     <div className='adManageContentLeft'>
//                         <div className='clientDetailHeading'> Primary Image</div>

//                         <div className='ManageLeftImg1'><img src={image} className='ManageLeftImg1' alt="Product_Image"></img></div>

//                         {/* ADDED DEMO PRODUCT IMAGES/VIDEOS  */}
//                         <div className='manageprodMain manageProdSideContents'>
//                             <div className='manageprodSideHeading'>Additional Images</div>
//                             <div className='adminProductVideoLeft'>
//                                 <div className='videoPreviewMain'>
//                                     {additionalFiles
//                                         .filter(file => !file.markedForDeletion)
//                                         .slice(0, 5)
//                                         .map((file, index) => (
//                                             <div key={file.id || file.public_id} className={`videoPreview ${index + 1}`}>
//                                                 <div className="videoPreviewContainer">
//                                                     {file.type === 'video'
//                                                         || (file.url && file.url.match(/\.(mp4|mov|avi|mkv)$/i))
//                                                         ? (
//                                                             <video controls>
//                                                                 <source src={file.url || file.previewUrl} type="video/mp4" />
//                                                             </video>
//                                                         ) : (
//                                                             <img
//                                                                 src={file.url || file.previewUrl}
//                                                                 alt="Preview"
//                                                                 style={{ objectFit: 'cover', height: '100%', width: '100%' }}
//                                                             />
//                                                         )}
//                                                     <button
//                                                         className="deleteButton"
//                                                         onClick={() => handleDeleteAdded(file)}
//                                                         disabled={uploading}
//                                                     >
//                                                         ×
//                                                     </button>
//                                                 </div>
//                                             </div>
//                                         ))}

//                                     {Array.from({ length: 5 - additionalFiles.filter(f => !f.markedForDeletion).length }).map((_, index) => (
//                                         <div key={`empty_${index}`} className={`videoPreview ${index + 1}`}>
//                                             <div className="emptyPreview">No file</div>
//                                         </div>
//                                     ))}

//                                 </div>
//                             </div>
//                         </div>

//                         {/* Product details section  */}
//                         <div className='manageprodMain'>
//                             <div className="ManageProdDetails">
//                                 <div className='ManageProdLeftHeading'>Name</div>
//                                 <div className='ManageProdRightContent'>{vehicleName}</div>
//                             </div>
//                             <div className="ManageProdDetails">
//                                 <div className='ManageProdLeftHeading'>Price</div>
//                                 <div className='ManageProdRightContent'>₹ {vehicleAmount} Per Day </div>
//                             </div>
//                             <div className="ManageProdDetails">
//                                 <div className='ManageProdLeftHeading'>LED Screen Size</div>
//                                 <div className='ManageProdRightContent'>{vehicleWidth} X {vehicleHeight} | {ProdSquareFeet()} Sq.ft </div>
//                             </div>
//                             <div className="ManageProdDetails">
//                                 <div className='ManageProdLeftHeading'>Delivery</div>
//                                 <div className='ManageProdRightContent'>{vehicleDeliveryDay} - Day</div>
//                             </div> <div className="ManageProdDetails">
//                                 <div className='ManageProdLeftHeading'>Audio</div>
//                                 <div className='ManageProdRightContent'>{vehicleAudio}</div>
//                             </div> <div className="ManageProdDetails">
//                                 <div className='ManageProdLeftHeading'>Branding</div>
//                                 <div className='ManageProdRightContent'>{vehicleBranding}</div>
//                             </div> <div className="ManageProdDetails">
//                                 <div className='ManageProdLeftHeading'>Power</div>
//                                 <div className='ManageProdRightContent'>{vehiclePower}</div>
//                             </div>

//                             <div className="ManageProdDetails">
//                                 <div className='ManageProdLeftHeading'>Rating</div>
//                                 <div className='ManageProdRightContent'>
//                                     <span className='Product-star-main'>
//                                         <span><img src='./images/rating_board.png' className='Product-rate-board1'></img></span>
//                                         <span><RatingStars rating={vehicleRating} /> </span>
//                                     </span>
//                                 </div>
//                             </div>
//                         </div>

//                         {/* Similar Product Section  */}
//                         <div className='manageprodMain'>
//                             <div className='manageprodSideHeading'>Selected Similar products</div>
//                             {selectedSimilarProducts.length > 0 ? (
//                                 selectedSimilarProducts.map((vehicle, index) => (
//                                     <div className='manageSimilarprod' key={index}>
//                                         <div className='manageSimilarImg'>
//                                             <img src={vehicle.vehicleDetails.image} className='manageSimilarImg'></img>
//                                         </div>
//                                         <div>
//                                             <div className='ManageProdRightContent1'>{vehicle.vehicleDetails.vehicleName}</div>
//                                             <div className='manageSimilarProdCode'>{vehicle.vehicleDetails.vehicleID}</div>
//                                         </div>
//                                         <div className='similarProdClose' onClick={() => handleRemoveProduct(vehicle.vehicleDetails.vehicleID)}>
//                                             <i className="fa-solid fa-xmark"></i>
//                                         </div>
//                                     </div>
//                                 ))
//                             ) : (
//                                 <p className='smilarProdError'>No Similar Products Selected</p>
//                             )
//                             }
//                         </div>
//                     </div>

//                     {/* Right section  */}
//                     <div>
//                         {/* Primary Image Upload section for Vehicle */}
//                         <div className='manageClientSection'>
//                             <div className='clientDetailHeading'> Primary Image </div>
//                             <div className="upload-section">
//                                 <input type="file" accept="image/*" id='fileInput' onChange={handleImageUpload} hidden />
//                                 <label htmlFor="fileInput" className={`file-upload-box ${errors.image ? 'AdminProdinput-error' : ''}`}>
//                                     <center>
//                                         <img src="./images/FileUpload.svg" height={50} width={50} alt="Upload Icon" />
//                                     </center>
//                                     <div className="upload-text">
//                                         <div className="FileHeading">Drag and Drop an Image or Choose File</div>
//                                         <span className="file-info">1600 x 1200 (4:3) recommended. PNG, JPG and GIF files are allowed</span>
//                                     </div>
//                                 </label>
//                                 {errors.image && <div className="AdminProderror-message">Vehicle Main image is required</div>}
//                             </div>
//                         </div>

//                         {/* ADDITIONAL VEHICLE IMAGES/VIDEOS  */}
//                         <div className='manageClientSection'>
//                             <div className='clientDetailHeading'> Additional Images </div>
//                             <div className='adminProductVideoRight'>
//                                 <center>
//                                     <img src="./images/FileUpload.svg" height={50} width={50} alt="Upload Icon" />
//                                 </center>
//                                 <input
//                                     type='file'
//                                     accept='video/*,image/*'
//                                     onChange={handleFileChangeAdded}
//                                     multiple
//                                     disabled={uploading
//                                         || additionalFiles.filter(f => !f.markedForDeletion).length >= 5
//                                         //    || additionalFiles.length >= 3
//                                     }
//                                 />
//                                 <p>
//                                     {uploading ? 'Uploading...' :
//                                         isSubmitted ? 'Files saved' :
//                                             `Upload ${5 - additionalFiles.filter(f => !f.markedForDeletion).length} or more files`}
//                                 </p>

//                                 {/* {errors.additionalFiles && (
//                                     <div className="AdminProderror-message">
//                                         Maximum 4 files allowed
//                                     </div>
//                                 )} */}
//                             </div>
//                         </div>

//                         {/* Vehicle Section  */}
//                         <div className='manageClientSection'>
//                             <div className='manageRightSideHeading'>Vehicle Management</div>
//                             <div className='d-flex manageClientInformation'>

//                                 <div className='manageClientInfoLeft'>
//                                     {/* VEHICLE NAME  */}
//                                     <div className='clientDetailSection'>
//                                         <div className='clientDetailHeading'>Vehicle Name</div>
//                                         <input type='text' placeholder='Enter Product Name' value={vehicleName}
//                                             onChange={(e) => {
//                                                 setVehicleName(e.target.value);
//                                                 setErrors(prev => ({ ...prev, vehicleName: false }));

//                                             }}
//                                             className={`clientDetailsInput ${errors.vehicleName ? 'AdminProdinput-error' : ''}`}>

//                                         </input>
//                                         {errors.vehicleName && <div className="AdminProderror-message ">Vehicle name is required</div>}
//                                     </div>

//                                     {/* VEHICLE AMOUNT / PRICE  */}
//                                     <div className='clientDetailSection'>
//                                         <div className='clientDetailHeading'>Price</div>
//                                         <input type='number' placeholder='Enter Price' value={vehicleAmount}
//                                             onChange={(e) => {
//                                                 setVehicleAmount(e.target.value);
//                                                 setErrors(prev => ({ ...prev, vehicleAmount: false }));
//                                             }}
//                                             className={`clientDetailsInput ${errors.vehicleAmount ? 'AdminProdinput-error' : ''}`}></input>
//                                         {errors.vehicleAmount && <div className="AdminProderror-message ">Vehicle Amount is required</div>}
//                                     </div>

//                                     {/* VEHICLE DELIVERY DAY COUNT  */}
//                                     <div className='clientDetailSection'>
//                                         <div className='clientDetailHeading'>Delivery Day</div>
//                                         <select className='clientDetailsInput ratingInput' value={vehicleDeliveryDay}
//                                             onChange={(e) => setVehicleDeliveryDay(e.target.value)}>
//                                             <option value="Select">Select</option>
//                                             <option value="1">1</option>
//                                             <option value="2">2</option>
//                                             <option value="3">3</option>
//                                             <option value="4">4</option>
//                                             <option value="5">5</option>
//                                             <option value="6">6</option>
//                                             <option value="7">7</option>
//                                             <option value="8">8</option>
//                                             <option value="9">9</option>
//                                         </select>
//                                         {errors.vehicleDeliveryDay && <div className="AdminProderror-message ">Vehicle Deliver Day is required</div>}
//                                     </div>

//                                     {/* VEHICLE BRANDING  */}
//                                     <div className='clientDetailSection'>
//                                         <div className='clientDetailHeading'>Branding</div>
//                                         <input type='text' placeholder='Enter Branding' value={vehicleBranding}
//                                             onChange={(e) => {
//                                                 setVehicleBranding(e.target.value);
//                                                 setErrors(prev => ({ ...prev, vehicleBranding: false }));

//                                             }}
//                                             className={`clientDetailsInput ${errors.vehicleBranding ? 'AdminProdinput-error' : ''}`}>

//                                         </input>
//                                         {errors.vehicleBranding && <div className="AdminProderror-message ">Vehicle Branding is required</div>}
//                                     </div>
//                                 </div>
//                                 <div className='manageClientInfoRight'>
//                                     {/* VEHICLE ID  */}
//                                     <div className='clientDetailSection'>
//                                         <div className='clientDetailHeading'>Vehicle ID</div>
//                                         <input type='text' placeholder='Enter Product ID' value={vehicleID}
//                                             onChange={(e) => {
//                                                 setVehicleId(e.target.value);
//                                                 setErrors(prev => ({ ...prev, vehicleID: false }));
//                                             }} className={`clientDetailsInput ${errors.vehicleID ? 'AdminProdinput-error' : ''}`}></input>
//                                         {errors.vehicleID && <div className="AdminProderror-message ">Vehicle ID is required</div>}

//                                     </div>
//                                     {/* VEHICLE SIZE  */}
//                                     <div className='clientDetailSection'>
//                                         <div className='clientDetailHeading'>Size</div>
//                                         <div className='sizeWidthValues'>
//                                             W : <input type='number' value={vehicleWidth}
//                                                 onChange={(e) => {
//                                                     setVehicleWidth(e.target.value);
//                                                     setErrors(prev => ({ ...prev, vehicleWidth: false }));
//                                                 }} className={`sizeWidthInput ${errors.vehicleWidth ? 'AdminProdinput-error' : ''}`}  ></input><span className='sizeMultiply'> X </span>H : <input type='number' value={vehicleHeight}
//                                                     onChange={(e) => {
//                                                         setVehicleHeight(e.target.value);
//                                                         setErrors(prev => ({ ...prev, vehicleHeight: false }));
//                                                     }} className={`sizeWidthInput ${errors.vehicleHeight ? 'AdminProdinput-error' : ''}`}></input> <span className='sizeWidthSlash'> | </span> <label> {ProdSquareFeet()} </label>Sq.ft
//                                             {errors.vehicleWidth && errors.vehicleHeight && <div className="AdminProderror-message ">Vehicle Height & Width is required</div>}
//                                         </div>
//                                     </div>
//                                     {/* VEHICLE AUDIO  */}
//                                     <div className='clientDetailSection'>
//                                         <div className='clientDetailHeading'>Audio</div>
//                                         <input type='text' placeholder='Enter Audio' value={vehicleAudio}
//                                             onChange={(e) => {
//                                                 setVehicleAudio(e.target.value);
//                                                 setErrors(prev => ({ ...prev, vehicleAudio: false }));

//                                             }}
//                                             className={`clientDetailsInput ${errors.vehicleAudio ? 'AdminProdinput-error' : ''}`}>

//                                         </input>
//                                         {errors.vehicleAudio && <div className="AdminProderror-message ">Vehicle Audio is required</div>}
//                                     </div>
//                                     {/* VEHICLE POWER  */}
//                                     <div className='clientDetailSection'>
//                                         <div className='clientDetailHeading'>Power</div>
//                                         <input type='text' placeholder='Enter Power' value={vehiclePower}
//                                             onChange={(e) => {
//                                                 setVehiclePower(e.target.value);
//                                                 setErrors(prev => ({ ...prev, vehiclePower: false }));

//                                             }}
//                                             className={`clientDetailsInput ${errors.vehiclePower ? 'AdminProdinput-error' : ''}`}>

//                                         </input>
//                                         {errors.vehiclePower && <div className="AdminProderror-message ">Vehicle Power is required</div>}
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>

//                         {/* Rating section  with OFFER */}
//                         <div style={{ display: 'flex', gap: '10px' }}>
//                             <div className='manageClientSection' style={{ width: '40%' }}>
//                                 <div className='clientDetailHeading'>Ratings</div>
//                                 <div className='ProductRatingMain'>
//                                     <div >
//                                         <div>
//                                             {/* <span><img src='./images/rating_board.png' className='Product-rate-board1'></img></span> */}
//                                             <span className='Product-star-main' >
//                                                 <RatingStars1 rating={parseFloat(vehicleRating) || 0} />
//                                             </span>
//                                         </div>
//                                     </div>
//                                     <div>
//                                         <select className='clientDetailsInput ratingInput' value={vehicleRating}
//                                             onChange={(e) => handleRatingChange(e.target.value)}>
//                                             <option value="1">1</option>
//                                             <option value="1.5">1.5</option>
//                                             <option value="2">2</option>
//                                             <option value="2.5">2.5</option>
//                                             <option value="3">3</option>
//                                             <option value="3.5">3.5</option>
//                                             <option value="4">4</option>
//                                             <option value="4.5">4.5</option>
//                                             <option value="5">5</option>
//                                         </select>
//                                     </div>
//                                 </div>
//                             </div>
//                             {/* <div className='manageClientSection' style={{ width: '60%' }}>
//                                 <div className='clientDetailHeading'>Offers</div>
//                                 <div className='ProductRatingMain'>
//                                     <div className='AdminOfferDetails' >Pay ₹<input type='number' value={productFixedAmount} onChange={(e) => setProductFixedAmount(e.target.value)} className='sizeWidthInput adminOfferAmountInput' readOnly></input> and Get <input type='number' value={productFixedAmountOffer} onChange={(e) => setProductFixedAmountOffer(e.target.value)} className='sizeWidthInput adminOfferAmountPercentage' readOnly></input>% Off <span className='adminOfferRefundDetails'> 100% Refundable </span>
//                                     </div>

//                                 </div>
//                             </div> */}
//                         </div>

//                         {/* Similar Products section  */}
//                         <div className='manageClientSection'>
//                             <div className='clientDetailHeading'>Similar Vehicles</div>
//                             <div className='manageClientInformation'>
//                                 <div className='manageClientInfoLeft' style={{ position: 'relative' }}>
//                                     <input type='text' placeholder='Product ID or Name' value={similarProdId}
//                                         onChange={(e) => {
//                                             setSimilarProdId(e.target.value);
//                                             // Show suggestions only when there's input
//                                             if (e.target.value.trim()) {
//                                                 const normalizedInput = normalizeCode(e.target.value);
//                                                 const selectedCodes = selectedSimilarProducts.map(p => normalizeCode(p.vehicleDetails.vehicleID));

//                                                 const matches = vehiclesData.filter(vehicle => {
//                                                     const isMatch =
//                                                         (normalizeCode(vehicle.vehicleDetails.vehicleID).includes(normalizedInput) ||
//                                                             vehicle.vehicleDetails.name.toLowerCase().includes(e.target.value.toLowerCase()
//                                                             ));
//                                                     const notSelected = !selectedCodes.includes(normalizeCode(vehicle.vehicleDetails.vehicleID));
//                                                     return isMatch && notSelected;
//                                                 }).slice(0, 5);
//                                                 setSearchSuggestions(matches);
//                                             } else {
//                                                 setSearchSuggestions([]);
//                                             }

//                                         }}

//                                         // onChange={handleSearchChange} 
//                                         className='clientDetailsInput'></input>
//                                     {searchSuggestions.length > 0 && (
//                                         <div className="suggestions-dropdown">
//                                             {searchSuggestions.map((vehicle) => (
//                                                 <div
//                             key={vehicle._id || vehicle.vehicleDetails?.vehicleID}
//                                                     className="suggestion-item"
//                                                     onClick={() => {
//                                                         setSelectedSimilarProducts(prev => [...prev, vehicle]);
//                                                         setSimilarProdId('');
//                                                         setSearchSuggestions([]);
//                                                     }} >
//                                                     <div className="suggestion-code">{vehicle.vehicleDetails?.vehicleID}</div>
//                                                     <div className="suggestion-name">{vehicle.vehicleDetails?.name}</div>
//                                                     <div className="suggestion-image">
//                                                         {/* <img src={product.image} alt={product.name} /> */}
//                                                     <img 
//                                     src={vehicle.vehicleDetails?.image } 
//                                     alt={vehicle.vehicleDetails?.name } 
//                                 />
//                                                     </div>
//                                                 </div>
//                                             ))}
//                                         </div>
//                                     )}
//                                 </div>
//                                 <div className='manageClientInfoRight'>
//                                     <div className='manageProductSelectBtn' onClick={handleSelectProduct} >Select</div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>


//                 {/* RICH TEXT FIELDS  */}
//                 <div className='richTextEditorMain'>
//                     <div className='BlogContentEditorMain'>
//                         <div className='BlogContentEditor'>
//                             <ReactQuill
//                                 theme="snow"
//                                 value={richTextContent}
//                                 onChange={setRichTextContent}
//                                 modules={modules}
//                                 formats={formats}
//                                 className='BlogContentEditor-frame'
//                             />
//                             {errors.richTextContent && (
//                                 <div className="AdminProderror-message">Rich text content is required</div>
//                             )}
//                         </div>
//                         <div className='BlogContentPreview'>
//                             <h4 className="text-center">Product Description</h4>
//                             <div
//                                 className='preview-content'
//                                 dangerouslySetInnerHTML={{ __html: richTextContent }} />
//                         </div>
//                     </div>
//                 </div>
//                 <button className="calendarSaveBtn" type='submit'
//                     disabled={uploading}>
//                     {uploading ? 'Processing...' : (editVehicle ? 'Update' : 'Save')}
//                 </button>
//             </form>
//         </div>
//     )
// }
// export default VehicleUpload;








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

    // Rating Stars Components (keep your existing code)
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
    const [vehicleRating, setVehicleRating] = useState(4.5);
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

    const handleRatingChange = (value) => {
        let newRating = parseFloat(value);
        if (newRating >= 0 && newRating <= 5) {
            setVehicleRating(newRating);
        }
    };

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
                                        <span><img src='./images/rating_board.png' className='Product-rate-board1' alt="Rating" style={{ width: 'max-content' }} /></span>
                                        <span><RatingStars rating={vehicleRating} /> </span>
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








                        {/* AVAILABLE VEHICLE COUNT ADD SECTION   */}
                        <div>
                            <div className='manageClientSection' style={{ width: '90%' }}>
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
                        </div>














                        {/* Rating Section */}
                        <div style={{ display: 'flex', gap: '10px' }}>
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
                                            <option value="1">1.0</option>
                                            <option value="1.5">1.5</option>
                                            <option value="2">2.0</option>
                                            <option value="2.5">2.5</option>
                                            <option value="3">3.0</option>
                                            <option value="3.5">3.5</option>
                                            <option value="4">4.0</option>
                                            <option value="4.5">4.5</option>
                                            <option value="5">5.0</option>
                                        </select>
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