// import React, { useState, useEffect } from 'react';
// import './c1login.css';
// import './c2login.css';
// import { useNavigate } from 'react-router-dom';
// import { useLogin } from './LoginContext';
// import axios from 'axios';
// import { baseUrl } from '../Adminpanel/BASE_URL';

// function LoginPageMain({ closeLoginPage, onClose, loginMode }) {
//     //keep me signed checkbox section
//     const [keepSignedIn, setKeepSignedIn] = useState(false); // Add this line
//     const navigate = useNavigate();
//     //SIGN UP DETAILS
//     const { loginUser } = useLogin();
//     // Replace the useState for isSignUp with:
//     const [isSignUp, setIsSignUp] = useState(loginMode === 'signup');
//     const [userName, setUserName] = useState('');
//     const [userPhone, setUserPhone] = useState('');
//     const [email, setEmail] = useState('');
//     // Enter OTP to target next value 
//     const [enterOtp, setEnterOtp] = useState(new Array(4).fill(""));
//     //UI states
//     const [otp, setOtp] = useState('');
//     const [otpSent, setOtpSent] = useState(false);
//     const [verified, setVerified] = useState(false);
//     const [errorMessage, setErrorMessage] = useState('');
//     const [resendTimer, setResendTimer] = useState(30);
//     const [status, setStatus] = useState('');
//     const [otpError, setOtpError] = useState(false); // State for OTP error
//     const [userExists, setUserExists] = useState(false);
//     const [usePhoneOTP, setUsePhoneOTP] = useState(false);
//     // Function to check if input is email or phone
//     const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
//     const validatePhone = (phone) => /^\d{10}$/.test(phone);

//     // Add useEffect to update when loginMode changes
//     useEffect(() => {
//         setIsSignUp(loginMode === 'signup');
//         // Reset form when mode changes
//         setOtpSent(false);
//         setErrorMessage('');
//         setEnterOtp(new Array(4).fill(""));
//     }, [loginMode]);

//     const sendOtp = async () => {
//         setErrorMessage('');
//         setStatus('Validating...');
//         // For login
//         if (!isSignUp) {
//             const identifier = userPhone || email;

//             if (!identifier) {
//                 setErrorMessage('Please enter your email or phone number');
//                 return;
//             }
//             // Determine if it's a phone or email and clean the input
//             let isPhone = /^\d{10}$/.test(identifier);
//             let cleanedIdentifier = identifier;

//             if (isPhone) {
//                 cleanedIdentifier = identifier.replace(/\D/g, '');
//                 if (cleanedIdentifier.length !== 10) {
//                     setErrorMessage('Please enter a valid 10-digit phone number');
//                     return;
//                 }
//             } else if (!validateEmail(identifier)) {
//                 setErrorMessage('Please enter a valid email address');
//                 return;
//             }

//             // Update state immediately before proceeding
//             if (isPhone) {
//                 setUsePhoneOTP(true);
//                 setUserPhone(cleanedIdentifier);
//                 setEmail('');
//             } else {
//                 setUsePhoneOTP(false);
//                 setEmail(cleanedIdentifier);
//                 setUserPhone('');
//             }

//             // Use the cleaned identifier for the API call
//             const loginIdentifier = isPhone ? cleanedIdentifier : cleanedIdentifier;

//             try {
//                 setStatus('Checking user...');
//                 // Check if user exists
//                 const checkEndpoint = 'check-user';
//                 const checkResponse = await fetch(`${baseUrl}/login/${checkEndpoint}`, {
//                     method: 'POST',
//                     headers: { 'Content-Type': 'application/json' },
//                     body: JSON.stringify(isPhone ? { phone: loginIdentifier } : { email: loginIdentifier })
//                 });
//                 const checkData = await checkResponse.json();

//                 if (!checkData.exists) {
//                     setErrorMessage('User not found. Please sign up.');
//                     return;
//                 }
//                 // Send OTP
//                 await sendOtpRequest(isPhone, loginIdentifier, '');

//             } catch (error) {
//                 console.error(error);
//                 setStatus('Failed');
//                 setErrorMessage("Error checking user. Try again later.");
//             }
//         } else {
//             // For signup - this part remains mostly the same
//             if (!userName) {
//                 setErrorMessage('Please enter your name');
//                 return;
//             }

//             // Clean and validate phone number
//             const cleanedPhone = userPhone.replace(/\D/g, '');
//             if (cleanedPhone.length !== 10) {
//                 setErrorMessage('Please enter a valid 10-digit phone number');
//                 return;
//             }

//             if (!email || !validateEmail(email)) {
//                 setErrorMessage('Please enter a valid email address');
//                 return;
//             }

//             setUsePhoneOTP(false); // For signup, we'll use email by default

//             try {
//                 setStatus('Checking user...');
//                 // Check if user exists
//                 const checkEndpoint = 'check-user-exists';
//                 const checkResponse = await fetch(`${baseUrl}/login/${checkEndpoint}`, {
//                     method: 'POST',
//                     headers: { 'Content-Type': 'application/json' },
//                     body: JSON.stringify({ email, phone: cleanedPhone })
//                 });

//                 const checkData = await checkResponse.json();

//                 if (checkData.emailExists) {
//                     setErrorMessage('Email already registered. Please login.');
//                     return;
//                 }
//                 if (checkData.phoneExists) {
//                     setErrorMessage('Phone already registered. Please login.');
//                     return;
//                 }
//                 // Send OTP via email for signup
//                 await sendOtpRequest(false, email, userName);

//             } catch (error) {
//                 console.error(error);
//                 setStatus('Failed');
//                 setErrorMessage("Error checking user. Try again later.");
//             }
//         }
//     };

//     // Helper function to send OTP
//     const sendOtpRequest = async (isPhone, identifier, userName) => {
//         try {
//             setStatus('Sending OTP...');

//             const otpResponse = await fetch(`${baseUrl}/login/send-otp`, {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({
//                     ...(isPhone ? { phone: identifier } : { email: identifier }),
//                     userName: userName
//                 })
//             });

//             const otpData = await otpResponse.json();

//             if (otpData.success) {
//                 setOtpSent(true);
//                 startResendTimer();
//                 setStatus('OTP Sent!');
//             } else {
//                 setStatus('Failed');
//                 setErrorMessage(otpData.message || "Failed to send OTP. Try again.");
//             }
//         } catch (error) {
//             console.error(error);
//             setStatus('Failed');
//             setErrorMessage("Error sending OTP. Try again later.");
//         }
//     };

//     const verifyOtp = async () => {
//         const finalOtp = enterOtp.join('');
//         if (finalOtp.length !== 4) {
//             setErrorMessage("Enter a valid 4-digit OTP");
//             setOtpError(true);
//             return;
//         }
//         try {
//             setStatus("Verifying...");
//             const verifyResponse = await fetch(`${baseUrl}/login/verify-otp`, {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({
//                     [usePhoneOTP ? 'phone' : 'email']: usePhoneOTP ? userPhone : email,
//                     otp: finalOtp,

//                 })
//             });

//             if (!verifyResponse.ok) {
//                 const errorData = await verifyResponse.json();
//                 throw new Error(errorData.message || "Verification failed");
//             }

//             const verifyData = await verifyResponse.json();

//             if (!verifyData.verified) {
//                 throw new Error("Invalid OTP");
//             }
//             if (verifyData.verified) {
//                 // For signup, create user account
//                 if (isSignUp) {
//                     const userResponse = await fetch(`${baseUrl}/login/create-user`, {
//                         method: 'POST',
//                         headers: { 'Content-Type': 'application/json' },
//                         body: JSON.stringify({ userName, userEmail: email, userPhone })
//                     });

//                     if (!userResponse.ok) {
//                         const errorData = await userResponse.json();
//                         throw new Error(errorData.error || "Failed to create user");
//                     }
//                     const userData = await userResponse.json();
//                     loginUser(userData.user, keepSignedIn);
//                     alert("Account created successfully!");
//                 } else {
//                     // For login, use verified user data
//                     loginUser(verifyData.user, keepSignedIn);
//                     alert("Logged in successfully!");
//                 }
//             }
//             onClose();
//             // navigate("/book1");
//         } catch (error) {
//             console.error("Verification error:", error);
//             setOtpError(true);
//             setErrorMessage(error.message || "Verification failed. Try again.");
//         }
//     };

//     // Toggle between login and signup
//     const toggleAuthMode = () => {
//         const newMode = isSignUp ? 'login' : 'signup';
//         setIsSignUp(!isSignUp);
//         setOtpSent(false);
//         setErrorMessage('');
//         setEnterOtp(new Array(4).fill(""));
//         // Reset fields only when switching to login
//         if (!isSignUp) {
//             setUserName('');
//             setUserPhone('');
//             setEmail('');
//         }
//     };
//     const startResendTimer = () => {
//         setResendTimer(60);
//         const interval = setInterval(() => {
//             setResendTimer(prev => prev > 0 ? prev - 1 : 0);
//             if (resendTimer === 0) clearInterval(interval);
//         }, 1000);
//     };
//     //Check if the user exists are not
//     const checkUserExists = async (email) => {
//         try {
//             const response = await axios.post(`${baseUrl}/login/check-user`, { email });
//             return response.data.exists;
//         }
//         catch (error) {
//             console.log("Error Checking User:", error);
//             return false;
//         }
//     };

//     // Enter OTP to target next value 
//     function handleOtpChange(e, index) {
//         if (!/^\d*$/.test(e.target.value)) return; // Only allow numbers
//         let otpArray = [...enterOtp];
//         otpArray[index] = e.target.value;
//         setEnterOtp(otpArray);
//         setOtp(otpArray.join('')); // Store OTP correctly
//         setOtpError(false); // Remove red border when user starts typing
//         if (e.target.value && e.target.nextSibling) {
//             e.target.nextSibling.focus();
//         }
//         // If the user deletes a digit, move back to the previous input field
//         if (!e.target.value && e.target.previousSibling) {
//             e.target.previousSibling.focus();
//         }
//     }
//     return (
//         <div className="container login-mainn">
//             <div className="login-upper">
//                 <div className="close-button" onClick={onClose}>
//                     <i className="fa-regular fa-circle-xmark"></i>
//                 </div>
//                 <div className="login-message">
//                     {otpSent ? "Verify OTP" : isSignUp ? "Sign Up" : "Log In"}
//                 </div>
//             </div>

//             <div className='login-lower'>
//                 {!otpSent ? (
//                     <>
//                         {isSignUp ? (
//                             <>
//                                 <input
//                                     type="text"
//                                     placeholder="Your Full Name"
//                                     className='login-input-phone'
//                                     value={userName}
//                                     onChange={e => setUserName(e.target.value)}
//                                 /><br />

//                                 <input
//                                     type="tel"
//                                     placeholder="Mobile number"
//                                     className='login-input-phone'
//                                     value={userPhone}
//                                     onChange={e => setUserPhone(e.target.value)}
//                                 /><br />
//                                 <input
//                                     type="email"
//                                     placeholder="Enter Your Email"
//                                     className='login-input-phone'
//                                     value={email}
//                                     onChange={e => setEmail(e.target.value)}
//                                 /><br />
//                             </>
//                         ) : (
//                             // LOGIN FORM - Show single input field
//                             <input
//                                 type="text"
//                                 placeholder="Enter Email ID or Phone number"
//                                 className='login-input-phone'
//                                 value={usePhoneOTP ? userPhone : email}
//                                 onChange={e =>
//                                     usePhoneOTP
//                                         ? setUserPhone(e.target.value)
//                                         : setEmail(e.target.value)
//                                 }
//                             />
//                         )}
//                         {errorMessage && <div className="error-message-login">{errorMessage}</div>}

//                         {!isSignUp && (
//                             <div>
//                                 <label className="checkbox-container">
//                                     <input type="checkbox"
//                                         checked={keepSignedIn}
//                                         onChange={(e) => setKeepSignedIn(e.target.checked)} />
//                                     <span className="checkmark">&#x2714;</span>
//                                     <span className='check-content'>Keep me signed in</span>
//                                 </label>
//                             </div>
//                         )}

//                         <button type='submit' className="continue-btn" onClick={sendOtp}>
//                             {isSignUp ? "Get OTP" : "Send OTP"}
//                         </button>
//                         <div className='otp_signInUp'>
//                             {isSignUp ? "Already have an account? " : "Don't have an account? "}
//                             <span className='otp_signInUpSpan' onClick={toggleAuthMode}>
//                                 {isSignUp ? "Log In" : "Sign Up"}
//                             </span>
//                         </div>
//                         <div className='login_otpSentStatus'> {status}</div>
//                     </>
//                 ) : (
//                     <>
//                         <div className='verifyOtp'>VERIFY WITH OTP</div>
//                         <div className='verifySent'>Sent to {usePhoneOTP ? userPhone : email}</div>
//                         <div className='otpBox'>
//                             {enterOtp.map((data, i) => (
//                                 <input
//                                     key={i}
//                                     type="tel"
//                                     maxLength={1}
//                                     className={`otpBox-content ${otpError ? "otp-error" : ""}`}
//                                     value={data}
//                                     onChange={(e) => handleOtpChange(e, i)}
//                                     onKeyDown={(e) => {
//                                         if (e.key === "Backspace" && !enterOtp[i] && e.target.previousSibling) {
//                                             e.target.previousSibling.focus();
//                                         }
//                                     }} />))}
//                         </div>
//                         {otpError && <div className="error-message-login">Enter a correct code</div>}
//                         <div className='otpTime'>
//                             {resendTimer > 0 ? (
//                                 `Resend OTP in: ${resendTimer} sec`
//                             ) : (
//                                 <div className='otpResend'>
//                                     Didn't receive your OTP?{' '}
//                                     <span className='ResendHighlight' onClick={sendOtp}>Resend OTP</span>
//                                 </div>
//                             )}
//                         </div>
//                         <button className="Submit-btn" onClick={verifyOtp}>Submit OTP</button>
//                         {/* Show login/signup toggle in OTP verification too */}
//                         <div className='otp_signInUp'>
//                             {isSignUp ? "Already have an Account? " : "Don't have an Account? "}
//                             <span
//                                 className='otp_signInUpSpan'
//                                 onClick={() => {
//                                     toggleAuthMode();
//                                 }} >
//                                 {isSignUp ? "Log In" : "Sign Up"}
//                             </span>
//                         </div>
//                     </>
//                 )}
//             </div>
//         </div>
//     );
// }
// export default LoginPageMain;






// import React, { useState, useEffect } from 'react';
// import './c1login.css';
// import './c2login.css';
// import { useNavigate } from 'react-router-dom';
// import { useLogin } from './LoginContext';
// // import axios from 'axios';
// import { baseUrl } from './BASE_URL';

// function LoginPageMain({ closeLoginPage, onClose, loginMode }) {
//     const [keepSignedIn, setKeepSignedIn] = useState(false);
//     const navigate = useNavigate();
//     const { loginUser, loginEmployee, loginType } = useLogin();
    
//     const [isSignUp, setIsSignUp] = useState(loginMode === 'signup');
//     const [userName, setUserName] = useState('');
//     const [userPhone, setUserPhone] = useState('');
//     const [email, setEmail] = useState('');
//     const [secretCode, setSecretCode] = useState('');
    
//     const [enterOtp, setEnterOtp] = useState(new Array(4).fill(""));
//     const [otp, setOtp] = useState('');
//     const [otpSent, setOtpSent] = useState(false);
//     const [verified, setVerified] = useState(false);
//     const [errorMessage, setErrorMessage] = useState('');
//     const [resendTimer, setResendTimer] = useState(30);
//     const [status, setStatus] = useState('');
//     const [otpError, setOtpError] = useState(false);
//     const [userExists, setUserExists] = useState(false);
//     const [usePhoneOTP, setUsePhoneOTP] = useState(false);

//     const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
//     const validatePhone = (phone) => /^\d{10}$/.test(phone);
//     const validateEmployeeEmail = (email) => /^[^\s@]+@adinn\.co\.in$/.test(email);

//     useEffect(() => {
//         setIsSignUp(loginMode === 'signup');
//         setOtpSent(false);
//         setErrorMessage('');
//         setEnterOtp(new Array(4).fill(""));
//         setSecretCode('');
//     }, [loginMode, loginType]);

//     // Employee Login Handler
//     const handleEmployeeLogin = async () => {
//         setErrorMessage('');
        
//         if (!email) {
//             setErrorMessage('Please enter your email');
//             return;
//         }
        
//         if (!validateEmployeeEmail(email)) {
//             setErrorMessage('Please use your company email (@adinn.co.in)');
//             return;
//         }
        
//         if (!secretCode) {
//             setErrorMessage('Please enter the secret code');
//             return;
//         }
        
//         if (secretCode !== "AdinnRdShowAdmin@2025") {
//             setErrorMessage('Invalid secret code');
//             return;
//         }

//         try {
//             setStatus('Logging in...');
            
//             // Simulate employee login - you can replace this with actual API call
//             const employeeData = {
//                 email: email,
//                 userName: email.split('@')[0], // Use email prefix as username
//                 employeeId: `EMP${Date.now()}`,
//                 role: 'employee',
//                 loginTime: new Date().toISOString()
//             };
            
//             // Successfully logged in
//             loginEmployee(employeeData, true);
//             setStatus('Login successful!');
            
//             // Close modal after successful login
//             setTimeout(() => {
//                 onClose();
//             }, 1000);
            
//         } catch (error) {
//             console.error(error);
//             setStatus('Failed');
//             setErrorMessage("Login failed. Please try again.");
//         }
//     };

//     const sendOtp = async () => {
//         // If employee login, use different flow
//         if (loginType === 'employee') {
//             await handleEmployeeLogin();
//             return;
//         }

//         setErrorMessage('');
//         setStatus('Validating...');
        
//         // Existing customer login/signup logic remains the same
//         if (!isSignUp) {
//             const identifier = userPhone || email;

//             if (!identifier) {
//                 setErrorMessage('Please enter your email or phone number');
//                 return;
//             }
            
//             let isPhone = /^\d{10}$/.test(identifier);
//             let cleanedIdentifier = identifier;

//             if (isPhone) {
//                 cleanedIdentifier = identifier.replace(/\D/g, '');
//                 if (cleanedIdentifier.length !== 10) {
//                     setErrorMessage('Please enter a valid 10-digit phone number');
//                     return;
//                 }
//             } else if (!validateEmail(identifier)) {
//                 setErrorMessage('Please enter a valid email address');
//                 return;
//             }

//             if (isPhone) {
//                 setUsePhoneOTP(true);
//                 setUserPhone(cleanedIdentifier);
//                 setEmail('');
//             } else {
//                 setUsePhoneOTP(false);
//                 setEmail(cleanedIdentifier);
//                 setUserPhone('');
//             }

//             const loginIdentifier = isPhone ? cleanedIdentifier : cleanedIdentifier;

//             try {
//                 setStatus('Checking user...');
//                 const checkEndpoint = 'check-user';
//                 const checkResponse = await fetch(`${baseUrl}/login/${checkEndpoint}`, {
//                     method: 'POST',
//                     headers: { 'Content-Type': 'application/json' },
//                     body: JSON.stringify(isPhone ? { phone: loginIdentifier } : { email: loginIdentifier })
//                 });
//                 const checkData = await checkResponse.json();

//                 if (!checkData.exists) {
//                     setErrorMessage('User not found. Please sign up.');
//                     return;
//                 }
                
//                 await sendOtpRequest(isPhone, loginIdentifier, '');

//             } catch (error) {
//                 console.error(error);
//                 setStatus('Failed');
//                 setErrorMessage("Error checking user. Try again later.");
//             }
//         } else {
//             // For signup - this part remains the same
//             if (!userName) {
//                 setErrorMessage('Please enter your name');
//                 return;
//             }

//             const cleanedPhone = userPhone.replace(/\D/g, '');
//             if (cleanedPhone.length !== 10) {
//                 setErrorMessage('Please enter a valid 10-digit phone number');
//                 return;
//             }

//             if (!email || !validateEmail(email)) {
//                 setErrorMessage('Please enter a valid email address');
//                 return;
//             }

//             setUsePhoneOTP(false);

//             try {
//                 setStatus('Checking user...');
//                 const checkEndpoint = 'check-user-exists';
//                 const checkResponse = await fetch(`${baseUrl}/login/${checkEndpoint}`, {
//                     method: 'POST',
//                     headers: { 'Content-Type': 'application/json' },
//                     body: JSON.stringify({ email, phone: cleanedPhone })
//                 });

//                 const checkData = await checkResponse.json();

//                 if (checkData.emailExists) {
//                     setErrorMessage('Email already registered. Please login.');
//                     return;
//                 }
//                 if (checkData.phoneExists) {
//                     setErrorMessage('Phone already registered. Please login.');
//                     return;
//                 }
                
//                 await sendOtpRequest(false, email, userName);

//             } catch (error) {
//                 console.error(error);
//                 setStatus('Failed');
//                 setErrorMessage("Error checking user. Try again later.");
//             }
//         }
//     };

//     // Helper function to send OTP (for customers only)
//     const sendOtpRequest = async (isPhone, identifier, userName) => {
//         try {
//             setStatus('Sending OTP...');

//             const otpResponse = await fetch(`${baseUrl}/login/send-otp`, {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({
//                     ...(isPhone ? { phone: identifier } : { email: identifier }),
//                     userName: userName
//                 })
//             });

//             const otpData = await otpResponse.json();

//             if (otpData.success) {
//                 setOtpSent(true);
//                 startResendTimer();
//                 setStatus('OTP Sent!');
//             } else {
//                 setStatus('Failed');
//                 setErrorMessage(otpData.message || "Failed to send OTP. Try again.");
//             }
//         } catch (error) {
//             console.error(error);
//             setStatus('Failed');
//             setErrorMessage("Error sending OTP. Try again later.");
//         }
//     };

//     const verifyOtp = async () => {
//         const finalOtp = enterOtp.join('');
//         if (finalOtp.length !== 4) {
//             setErrorMessage("Enter a valid 4-digit OTP");
//             setOtpError(true);
//             return;
//         }
//         try {
//             setStatus("Verifying...");
//             const verifyResponse = await fetch(`${baseUrl}/login/verify-otp`, {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({
//                     [usePhoneOTP ? 'phone' : 'email']: usePhoneOTP ? userPhone : email,
//                     otp: finalOtp,
//                 })
//             });

//             if (!verifyResponse.ok) {
//                 const errorData = await verifyResponse.json();
//                 throw new Error(errorData.message || "Verification failed");
//             }

//             const verifyData = await verifyResponse.json();

//             if (!verifyData.verified) {
//                 throw new Error("Invalid OTP");
//             }
//             if (verifyData.verified) {
//                 if (isSignUp) {
//                     const userResponse = await fetch(`${baseUrl}/login/create-user`, {
//                         method: 'POST',
//                         headers: { 'Content-Type': 'application/json' },
//                         body: JSON.stringify({ userName, userEmail: email, userPhone })
//                     });

//                     if (!userResponse.ok) {
//                         const errorData = await userResponse.json();
//                         throw new Error(errorData.error || "Failed to create user");
//                     }
//                     const userData = await userResponse.json();
//                     loginUser(userData.user, keepSignedIn);
//                     alert("Account created successfully!");
//                 } else {
//                     loginUser(verifyData.user, keepSignedIn);
//                     alert("Logged in successfully!");
//                 }
//             }
//             onClose();
//         } catch (error) {
//             console.error("Verification error:", error);
//             setOtpError(true);
//             setErrorMessage(error.message || "Verification failed. Try again.");
//         }
//     };

//     const toggleAuthMode = () => {
//         const newMode = isSignUp ? 'login' : 'signup';
//         setIsSignUp(!isSignUp);
//         setOtpSent(false);
//         setErrorMessage('');
//         setEnterOtp(new Array(4).fill(""));
//         if (!isSignUp) {
//             setUserName('');
//             setUserPhone('');
//             setEmail('');
//             setSecretCode('');
//         }
//     };

//     const startResendTimer = () => {
//         setResendTimer(60);
//         const interval = setInterval(() => {
//             setResendTimer(prev => prev > 0 ? prev - 1 : 0);
//             if (resendTimer === 0) clearInterval(interval);
//         }, 1000);
//     };

//     // const checkUserExists = async (email) => {
//     //     try {
//     //         const response = await axios.post(`${baseUrl}/login/check-user`, { email });
//     //         return response.data.exists;
//     //     } catch (error) {
//     //         console.log("Error Checking User:", error);
//     //         return false;
//     //     }
//     // };

//     function handleOtpChange(e, index) {
//         if (!/^\d*$/.test(e.target.value)) return;
//         let otpArray = [...enterOtp];
//         otpArray[index] = e.target.value;
//         setEnterOtp(otpArray);
//         setOtp(otpArray.join(''));
//         setOtpError(false);
//         if (e.target.value && e.target.nextSibling) {
//             e.target.nextSibling.focus();
//         }
//         if (!e.target.value && e.target.previousSibling) {
//             e.target.previousSibling.focus();
//         }
//     }

//     return (
//         <div className="container login-mainn">
//             <div className="login-upper">
//                 <div className="close-button" onClick={onClose}>
//                     <i className="fa-regular fa-circle-xmark"></i>
//                 </div>
//                 <div className="login-message">
//                     {loginType === 'employee' ? "Employee Login" : 
//                      otpSent ? "Verify OTP" : 
//                      isSignUp ? "Sign Up" : "Log In"}
//                 </div>
//             </div>

//             <div className='login-lower'>
//                 {loginType === 'employee' ? (
//                     // EMPLOYEE LOGIN FORM
//                     <>
//                         <div className="employee-login-notice">
//                             Access restricted to Adinn employees only
//                         </div>
                        
//                         <input
//                             type="email"
//                             placeholder="Enter your company email"
//                             className='login-input-phone'
//                             value={email}
//                             onChange={e => setEmail(e.target.value)}
//                         /><br />
                        
//                         <input
//                             type="password"
//                             placeholder="Enter secret code"
//                             className='login-input-phone'
//                             value={secretCode}
//                             onChange={e => setSecretCode(e.target.value)}
//                         /><br />
                        
//                         {errorMessage && <div className="error-message-login">{errorMessage}</div>}
                        
//                         <div>
//                             <label className="checkbox-container">
//                                 <input 
//                                     type="checkbox"
//                                     checked={keepSignedIn}
//                                     onChange={(e) => setKeepSignedIn(e.target.checked)} 
//                                 />
//                                 <span className="checkmark">&#x2714;</span>
//                                 <span className='check-content'>Keep me signed in</span>
//                             </label>
//                         </div>

//                         <button type='submit' className="continue-btn" onClick={handleEmployeeLogin}>
//                             {status === 'Logging in...' ? 'Logging in...' : 'Login as Employee'}
//                         </button>
                        
//                         <div className='login_otpSentStatus'>{status}</div>
//                     </>
//                 ) : !otpSent ? (
//                     // CUSTOMER LOGIN/SIGNUP FORM
//                     <>
//                         {isSignUp ? (
//                             <>
//                                 <input
//                                     type="text"
//                                     placeholder="Your Full Name"
//                                     className='login-input-phone'
//                                     value={userName}
//                                     onChange={e => setUserName(e.target.value)}
//                                 /><br />

//                                 <input
//                                     type="tel"
//                                     placeholder="Mobile number"
//                                     className='login-input-phone'
//                                     value={userPhone}
//                                     onChange={e => setUserPhone(e.target.value)}
//                                 /><br />
//                                 <input
//                                     type="email"
//                                     placeholder="Enter Your Email"
//                                     className='login-input-phone'
//                                     value={email}
//                                     onChange={e => setEmail(e.target.value)}
//                                 /><br />
//                             </>
//                         ) : (
//                             <input
//                                 type="text"
//                                 placeholder="Enter Email ID or Phone number"
//                                 className='login-input-phone'
//                                 value={usePhoneOTP ? userPhone : email}
//                                 onChange={e =>
//                                     usePhoneOTP
//                                         ? setUserPhone(e.target.value)
//                                         : setEmail(e.target.value)
//                                 }
//                             />
//                         )}
//                         {errorMessage && <div className="error-message-login">{errorMessage}</div>}

//                         {!isSignUp && (
//                             <div>
//                                 <label className="checkbox-container">
//                                     <input type="checkbox"
//                                         checked={keepSignedIn}
//                                         onChange={(e) => setKeepSignedIn(e.target.checked)} />
//                                     <span className="checkmark">&#x2714;</span>
//                                     <span className='check-content'>Keep me signed in</span>
//                                 </label>
//                             </div>
//                         )}

//                         <button type='submit' className="continue-btn" onClick={sendOtp}>
//                             {isSignUp ? "Get OTP" : "Send OTP"}
//                         </button>
//                         <div className='otp_signInUp'>
//                             {isSignUp ? "Already have an account? " : "Don't have an account? "}
//                             <span className='otp_signInUpSpan' onClick={toggleAuthMode}>
//                                 {isSignUp ? "Log In" : "Sign Up"}
//                             </span>
//                         </div>
//                         <div className='login_otpSentStatus'> {status}</div>
//                     </>
//                 ) : (
//                     // OTP VERIFICATION (Customers only)
//                     <>
//                         <div className='verifyOtp'>VERIFY WITH OTP</div>
//                         <div className='verifySent'>Sent to {usePhoneOTP ? userPhone : email}</div>
//                         <div className='otpBox'>
//                             {enterOtp.map((data, i) => (
//                                 <input
//                                     key={i}
//                                     type="tel"
//                                     maxLength={1}
//                                     className={`otpBox-content ${otpError ? "otp-error" : ""}`}
//                                     value={data}
//                                     onChange={(e) => handleOtpChange(e, i)}
//                                     onKeyDown={(e) => {
//                                         if (e.key === "Backspace" && !enterOtp[i] && e.target.previousSibling) {
//                                             e.target.previousSibling.focus();
//                                         }
//                                     }} />))}
//                         </div>
//                         {otpError && <div className="error-message-login">Enter a correct code</div>}
//                         <div className='otpTime'>
//                             {resendTimer > 0 ? (
//                                 `Resend OTP in: ${resendTimer} sec`
//                             ) : (
//                                 <div className='otpResend'>
//                                     Didn't receive your OTP?{' '}
//                                     <span className='ResendHighlight' onClick={sendOtp}>Resend OTP</span>
//                                 </div>
//                             )}
//                         </div>
//                         <button className="Submit-btn" onClick={verifyOtp}>Submit OTP</button>
//                         <div className='otp_signInUp'>
//                             {isSignUp ? "Already have an Account? " : "Don't have an Account? "}
//                             <span
//                                 className='otp_signInUpSpan'
//                                 onClick={() => {
//                                     toggleAuthMode();
//                                 }} >
//                                 {isSignUp ? "Log In" : "Sign Up"}
//                             </span>
//                         </div>
//                     </>
//                 )}
//             </div>
//         </div>
//     );
// }

// export default LoginPageMain;




// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useLogin } from './LoginContext';
// import { baseUrl } from './BASE_URL';
// import './c1login.css';
// // import './c2login.css';

// function LoginPageMain({ closeLoginPage, onClose, loginMode }) {
//     const [keepSignedIn, setKeepSignedIn] = useState(false);
//     const navigate = useNavigate();
//     const { loginUser, loginEmployee, loginType, user } = useLogin();
    
//     const [isSignUp, setIsSignUp] = useState(loginMode === 'signup');
//     const [userName, setUserName] = useState('');
//     const [userPhone, setUserPhone] = useState('');
//     const [email, setEmail] = useState('');
//     const [secretCode, setSecretCode] = useState('');
//     const [showSecretCode, setShowSecretCode] = useState(false);
    
//     const [enterOtp, setEnterOtp] = useState(new Array(4).fill(""));
//     const [otp, setOtp] = useState('');
//     const [otpSent, setOtpSent] = useState(false);
//     const [errorMessage, setErrorMessage] = useState('');
//     const [resendTimer, setResendTimer] = useState(30);
//     const [status, setStatus] = useState('');
//     const [otpError, setOtpError] = useState(false);
//     const [usePhoneOTP, setUsePhoneOTP] = useState(false);

//     const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
//     const validatePhone = (phone) => /^\d{10}$/.test(phone);
//     const validateEmployeeEmail = (email) => /^[^\s@]+@adinn\.co\.in$/.test(email);

//     useEffect(() => {
//         setIsSignUp(loginMode === 'signup');
//         setOtpSent(false);
//         setErrorMessage('');
//         setEnterOtp(new Array(4).fill(""));
//         setSecretCode('');
//         setUserName('');
//         setUserPhone('');
//         setEmail('');
//     }, [loginMode, loginType]);

//     // Employee Register Handler
//     const handleEmployeeRegister = async () => {
//         setErrorMessage('');
        
//         if (!userName) {
//             setErrorMessage('Please enter your full name');
//             return;
//         }
        
//         if (!email) {
//             setErrorMessage('Please enter your email');
//             return;
//         }
        
//         if (!validateEmployeeEmail(email)) {
//             setErrorMessage('Please use your company email (@adinn.co.in)');
//             return;
//         }
        
//         if (!secretCode) {
//             setErrorMessage('Please enter the secret code');
//             return;
//         }

//         try {
//             setStatus('Registering...');
            
//             const response = await fetch(`${baseUrl}/EmployeeLogin/employee/register`, {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({
//                     employeeName: userName,
//                     employeeEmail: email,
//                     secretCode: secretCode
//                 })
//             });

//             const data = await response.json();

//             if (!data.success) {
//                 throw new Error(data.message || "Registration failed");
//             }
            
//             // Successfully registered and logged in
//             const employeeData = {
//                 email: data.employee.employeeEmail,
//                 userName: data.employee.employeeName,
//                 employeeId: data.employee.employeeId,
//                 role: data.employee.role,
//                 loginTime: new Date().toISOString()
//             };
            
//             loginEmployee(employeeData, keepSignedIn);
//             setStatus('Registration successful!');
            
//             // Close modal after successful registration
//             setTimeout(() => {
//                 onClose();
//             }, 1000);
            
//         } catch (error) {
//             console.error(error);
//             setStatus('Failed');
//             setErrorMessage(error.message || "Registration failed. Please try again.");
//         }
//     };

//     // Employee Login Handler
//     const handleEmployeeLogin = async () => {
//         setErrorMessage('');
        
//         if (!email) {
//             setErrorMessage('Please enter your email');
//             return;
//         }
        
//         if (!validateEmployeeEmail(email)) {
//             setErrorMessage('Please use your office email');
//             return;
//         }

//         try {
//             setStatus('Logging in...');
            
//             const response = await fetch(`${baseUrl}/EmployeeLogin/employee/login`, {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({
//                     employeeEmail: email
//                 })
//             });

//             const data = await response.json();

//             if (!data.success) {
//                 throw new Error(data.message || "Login failed");
//             }
            
//             // Successfully logged in
//             const employeeData = {
//                 email: data.employee.employeeEmail,
//                 userName: data.employee.employeeName,
//                 employeeId: data.employee.employeeId,
//                 role: data.employee.role,
//                 loginTime: new Date().toISOString()
//             };
            
//             loginEmployee(employeeData, keepSignedIn);
//             setStatus('Login successful!');
            
//             // Close modal after successful login
//             setTimeout(() => {
//                 onClose();
//             }, 1000);
            
//         } catch (error) {
//             console.error(error);
//             setStatus('Failed');
//             setErrorMessage(error.message || "Login failed. Please try again.");
//         }
//     };

//     // Customer OTP Functions (keep existing)
//     const sendOtp = async () => {
//         // If employee login, use different flow
//         if (loginType === 'employee') {
//             if (isSignUp) {
//                 await handleEmployeeRegister();
//             } else {
//                 await handleEmployeeLogin();
//             }
//             return;
//         }

//         // ... keep existing customer OTP logic ...
//         setErrorMessage('');
//         setStatus('Validating...');
        
//         // Existing customer login/signup logic
//         if (!isSignUp) {
//             const identifier = userPhone || email;

//             if (!identifier) {
//                 setErrorMessage('Please enter your email or phone number');
//                 return;
//             }
            
//             let isPhone = /^\d{10}$/.test(identifier);
//             let cleanedIdentifier = identifier;

//             if (isPhone) {
//                 cleanedIdentifier = identifier.replace(/\D/g, '');
//                 if (cleanedIdentifier.length !== 10) {
//                     setErrorMessage('Please enter a valid 10-digit phone number');
//                     return;
//                 }
//             } else if (!validateEmail(identifier)) {
//                 setErrorMessage('Please enter a valid email address');
//                 return;
//             }

//             if (isPhone) {
//                 setUsePhoneOTP(true);
//                 setUserPhone(cleanedIdentifier);
//                 setEmail('');
//             } else {
//                 setUsePhoneOTP(false);
//                 setEmail(cleanedIdentifier);
//                 setUserPhone('');
//             }

//             const loginIdentifier = isPhone ? cleanedIdentifier : cleanedIdentifier;

//             try {
//                 setStatus('Checking user...');
//                 const checkEndpoint = 'check-user';
//                 const checkResponse = await fetch(`${baseUrl}/login/${checkEndpoint}`, {
//                     method: 'POST',
//                     headers: { 'Content-Type': 'application/json' },
//                     body: JSON.stringify(isPhone ? { phone: loginIdentifier } : { email: loginIdentifier })
//                 });
//                 const checkData = await checkResponse.json();

//                 if (!checkData.exists) {
//                     setErrorMessage('User not found. Please sign up.');
//                     return;
//                 }
                
//                 await sendOtpRequest(isPhone, loginIdentifier, '');

//             } catch (error) {
//                 console.error(error);
//                 setStatus('Failed');
//                 setErrorMessage("Error checking user. Try again later.");
//             }
//         } else {
//             // For customer signup
//             if (!userName) {
//                 setErrorMessage('Please enter your name');
//                 return;
//             }

//             const cleanedPhone = userPhone.replace(/\D/g, '');
//             if (cleanedPhone.length !== 10) {
//                 setErrorMessage('Please enter a valid 10-digit phone number');
//                 return;
//             }

//             if (!email || !validateEmail(email)) {
//                 setErrorMessage('Please enter a valid email address');
//                 return;
//             }

//             setUsePhoneOTP(false);

//             try {
//                 setStatus('Checking user...');
//                 const checkEndpoint = 'check-user-exists';
//                 const checkResponse = await fetch(`${baseUrl}/login/${checkEndpoint}`, {
//                     method: 'POST',
//                     headers: { 'Content-Type': 'application/json' },
//                     body: JSON.stringify({ email, phone: cleanedPhone })
//                 });

//                 const checkData = await checkResponse.json();

//                 if (checkData.emailExists) {
//                     setErrorMessage('Email already registered. Please login.');
//                     return;
//                 }
//                 if (checkData.phoneExists) {
//                     setErrorMessage('Phone already registered. Please login.');
//                     return;
//                 }
                
//                 await sendOtpRequest(false, email, userName);

//             } catch (error) {
//                 console.error(error);
//                 setStatus('Failed');
//                 setErrorMessage("Error checking user. Try again later.");
//             }
//         }
//     };

//     // Helper function to send OTP (for customers only)
//     const sendOtpRequest = async (isPhone, identifier, userName) => {
//         try {
//             setStatus('Sending OTP...');

//             const otpResponse = await fetch(`${baseUrl}/login/send-otp`, {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({
//                     ...(isPhone ? { phone: identifier } : { email: identifier }),
//                     userName: userName
//                 })
//             });

//             const otpData = await otpResponse.json();

//             if (otpData.success) {
//                 setOtpSent(true);
//                 startResendTimer();
//                 setStatus('OTP Sent!');
//             } else {
//                 setStatus('Failed');
//                 setErrorMessage(otpData.message || "Failed to send OTP. Try again.");
//             }
//         } catch (error) {
//             console.error(error);
//             setStatus('Failed');
//             setErrorMessage("Error sending OTP. Try again later.");
//         }
//     };

//     const verifyOtp = async () => {
//         const finalOtp = enterOtp.join('');
//         if (finalOtp.length !== 4) {
//             setErrorMessage("Enter a valid 4-digit OTP");
//             setOtpError(true);
//             return;
//         }
//         try {
//             setStatus("Verifying...");
//             const verifyResponse = await fetch(`${baseUrl}/login/verify-otp`, {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({
//                     [usePhoneOTP ? 'phone' : 'email']: usePhoneOTP ? userPhone : email,
//                     otp: finalOtp,
//                 })
//             });

//             if (!verifyResponse.ok) {
//                 const errorData = await verifyResponse.json();
//                 throw new Error(errorData.message || "Verification failed");
//             }

//             const verifyData = await verifyResponse.json();

//             if (!verifyData.verified) {
//                 throw new Error("Invalid OTP");
//             }
//             if (verifyData.verified) {
//                 if (isSignUp) {
//                     const userResponse = await fetch(`${baseUrl}/login/create-user`, {
//                         method: 'POST',
//                         headers: { 'Content-Type': 'application/json' },
//                         body: JSON.stringify({ userName, userEmail: email, userPhone })
//                     });

//                     if (!userResponse.ok) {
//                         const errorData = await userResponse.json();
//                         throw new Error(errorData.error || "Failed to create user");
//                     }
//                     const userData = await userResponse.json();
//                     loginUser(userData.user, keepSignedIn);
//                     alert("Account created successfully!");
//                 } else {
//                     loginUser(verifyData.user, keepSignedIn);
//                     alert("Logged in successfully!");
//                 }
//             }
//             onClose();
//         } catch (error) {
//             console.error("Verification error:", error);
//             setOtpError(true);
//             setErrorMessage(error.message || "Verification failed. Try again.");
//         }
//     };

//     const toggleAuthMode = () => {
//         const newMode = isSignUp ? 'login' : 'signup';
//         setIsSignUp(!isSignUp);
//         setOtpSent(false);
//         setErrorMessage('');
//         setEnterOtp(new Array(4).fill(""));
//         if (!isSignUp) {
//             setUserName('');
//             setUserPhone('');
//             setEmail('');
//             setSecretCode('');
//         }
//     };

//     const startResendTimer = () => {
//         setResendTimer(60);
//         const interval = setInterval(() => {
//             setResendTimer(prev => prev > 0 ? prev - 1 : 0);
//             if (resendTimer === 0) clearInterval(interval);
//         }, 1000);
//     };

//     function handleOtpChange(e, index) {
//         if (!/^\d*$/.test(e.target.value)) return;
//         let otpArray = [...enterOtp];
//         otpArray[index] = e.target.value;
//         setEnterOtp(otpArray);
//         setOtp(otpArray.join(''));
//         setOtpError(false);
//         if (e.target.value && e.target.nextSibling) {
//             e.target.nextSibling.focus();
//         }
//         if (!e.target.value && e.target.previousSibling) {
//             e.target.previousSibling.focus();
//         }
//     }

//     // If employee is already logged in, show their info
//     if (user && user.role === 'employee' && loginType === 'employee') {
//         return (
//             <div className="employee-login-container">
//                 <div className="employee-login-header">
//                     <div className="close-button" onClick={onClose}>
//                         <i className="fa-regular fa-circle-xmark"></i>
//                     </div>
//                     <div className="employee-login-title">
//                         Employee Account
//                     </div>
//                 </div>

//                 <div className='employee-login-form'>
//                     <div className="employee-logged-in-info">
//                         <div className="employee-welcome">Welcome!</div>
//                         <div className="employee-email">{user.email}</div>
//                         <div className="employee-name">{user.userName}</div>
//                         <div className="employee-id">ID: {user.employeeId}</div>
                        
//                         <button 
//                             className="employee-logout-btn" 
//                             onClick={() => {
//                                 // You'll need to add logoutEmployee function to your context
//                                 onClose();
//                             }}
//                         >
//                             Logout
//                         </button>
//                     </div>
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <div className="employee-login-container">
//             {/* Header */}
//             <div className="employee-login-header">
//                 <div className="close-button" onClick={onClose}>
//                     <i className="fa-regular fa-circle-xmark"></i>
//                 </div>
//                 <div className="employee-login-title">
//                     {loginType === 'employee' ? 
//                         `Employee ${isSignUp ? 'Sign Up' : 'Log In'}` : 
//                         otpSent ? 'Verify OTP' : 
//                         isSignUp ? 'Customer Sign Up' : 'Customer Log In'
//                     }
//                 </div>
//             </div>

//             {/* Form */}
//             <div className='employee-login-form'>
//                 {loginType === 'employee' ? (
//                     // EMPLOYEE LOGIN/SIGNUP FORM
//                     <>
//                         {isSignUp && (
//                             <div className="input-group">
//                                 <label className="input-label">Full Name</label>
//                                 <input
//                                     type="text"
//                                     placeholder="Enter your full name"
//                                     className='employee-input'
//                                     value={userName}
//                                     onChange={e => setUserName(e.target.value)}
//                                 />
//                             </div>
//                         )}
                        
//                         <div className="input-group">
//                             <label className="input-label">Email</label>
//                             <input
//                                 type="email"
//                                 placeholder="user@adinn.co.in"
//                                 className='employee-input'
//                                 value={email}
//                                 onChange={e => setEmail(e.target.value)}
//                             />
//                         </div>
                        
//                         {isSignUp && (
//                             <div className="input-group">
//                                 <label className="input-label">Secret Code</label>
//                                 <div className="secret-code-input-container">
//                                     <input
//                                         type={showSecretCode ? "text" : "password"}
//                                         placeholder="Enter secret code"
//                                         className='employee-input secret-code-input'
//                                         value={secretCode}
//                                         onChange={e => setSecretCode(e.target.value)}
//                                     />
//                                     <span 
//                                         className="secret-code-toggle"
//                                         onClick={() => setShowSecretCode(!showSecretCode)}
//                                     >
//                                         {showSecretCode ? '🙈' : '👁️'}
//                                     </span>
//                                 </div>
//                             </div>
//                         )}
                        
//                         {errorMessage && <div className="employee-error-message">{errorMessage}</div>}
                        
//                         <div className="remember-me">
//                             <label className="checkbox-container">
//                                 <input 
//                                     type="checkbox"
//                                     checked={keepSignedIn}
//                                     onChange={(e) => setKeepSignedIn(e.target.checked)} 
//                                 />
//                                 <span className="checkmark">&#x2714;</span>
//                                 <span className='check-content'>Keep me signed in</span>
//                             </label>
//                         </div>

//                         <button 
//                             type='submit' 
//                             className="employee-continue-btn" 
//                             onClick={isSignUp ? handleEmployeeRegister : handleEmployeeLogin}
//                             disabled={status === 'Logging in...' || status === 'Registering...'}
//                         >
//                             {status === 'Logging in...' ? 'Logging in...' : 
//                              status === 'Registering...' ? 'Registering...' :
//                              isSignUp ? 'Register' : 'Continue'}
//                         </button>
                        
//                         <div className='auth-toggle'>
//                             {isSignUp ? "Already have an Account? " : "Don't have an Account? "}
//                             <span 
//                                 className='auth-toggle-link' 
//                                 onClick={toggleAuthMode}
//                             >
//                                 {isSignUp ? "Log In" : "Sign Up"}
//                             </span>
//                         </div>
                        
//                         <div className='terms-text'>
//                             By continuing you agree to Affim Roadshows Terms & Privacy Policy
//                         </div>
                        
//                         {status && <div className='status-message'>{status}</div>}
//                     </>
//                 ) : !otpSent ? (
//                     // CUSTOMER LOGIN/SIGNUP FORM (keep existing)
//                     <>
//                         {isSignUp ? (
//                             <>
//                                 <div className="input-group">
//                                     <label className="input-label">Full Name</label>
//                                     <input
//                                         type="text"
//                                         placeholder="Your Full Name"
//                                         className='employee-input'
//                                         value={userName}
//                                         onChange={e => setUserName(e.target.value)}
//                                     />
//                                 </div>

//                                 <div className="input-group">
//                                     <label className="input-label">Mobile Number</label>
//                                     <input
//                                         type="tel"
//                                         placeholder="Mobile number"
//                                         className='employee-input'
//                                         value={userPhone}
//                                         onChange={e => setUserPhone(e.target.value)}
//                                     />
//                                 </div>
                                
//                                 <div className="input-group">
//                                     <label className="input-label">Email</label>
//                                     <input
//                                         type="email"
//                                         placeholder="Enter Your Email"
//                                         className='employee-input'
//                                         value={email}
//                                         onChange={e => setEmail(e.target.value)}
//                                     />
//                                 </div>
//                             </>
//                         ) : (
//                             <div className="input-group">
//                                 <label className="input-label">Email or Phone Number</label>
//                                 <input
//                                     type="text"
//                                     placeholder="Enter Email ID or Phone number"
//                                     className='employee-input'
//                                     value={usePhoneOTP ? userPhone : email}
//                                     onChange={e =>
//                                         usePhoneOTP
//                                             ? setUserPhone(e.target.value)
//                                             : setEmail(e.target.value)
//                                     }
//                                 />
//                             </div>
//                         )}
                        
//                         {errorMessage && <div className="employee-error-message">{errorMessage}</div>}

//                         {!isSignUp && (
//                             <div className="remember-me">
//                                 <label className="checkbox-container">
//                                     <input 
//                                         type="checkbox"
//                                         checked={keepSignedIn}
//                                         onChange={(e) => setKeepSignedIn(e.target.checked)} 
//                                 />
//                                     <span className="checkmark">&#x2714;</span>
//                                     <span className='check-content'>Keep me signed in</span>
//                                 </label>
//                             </div>
//                         )}

//                         <button 
//                             type='submit' 
//                             className="employee-continue-btn" 
//                             onClick={sendOtp}
//                         >
//                             {isSignUp ? "Get OTP" : "Send OTP"}
//                         </button>
                        
//                         <div className='auth-toggle'>
//                             {isSignUp ? "Already have an account? " : "Don't have an account? "}
//                             <span 
//                                 className='auth-toggle-link' 
//                                 onClick={toggleAuthMode}
//                             >
//                                 {isSignUp ? "Log In" : "Sign Up"}
//                             </span>
//                         </div>
                        
//                         {status && <div className='status-message'>{status}</div>}
//                     </>
//                 ) : (
//                     // OTP VERIFICATION (Customers only)
//                     <>
//                         <div className='verify-otp-header'>VERIFY WITH OTP</div>
//                         <div className='verify-sent-to'>Sent to {usePhoneOTP ? userPhone : email}</div>
                        
//                         <div className='otp-input-group'>
//                             {enterOtp.map((data, i) => (
//                                 <input
//                                     key={i}
//                                     type="tel"
//                                     maxLength={1}
//                                     className={`otp-input ${otpError ? "otp-error" : ""}`}
//                                     value={data}
//                                     onChange={(e) => handleOtpChange(e, i)}
//                                     onKeyDown={(e) => {
//                                         if (e.key === "Backspace" && !enterOtp[i] && e.target.previousSibling) {
//                                             e.target.previousSibling.focus();
//                                         }
//                                     }}
//                                 />
//                             ))}
//                         </div>
                        
//                         {otpError && <div className="employee-error-message">Enter a correct code</div>}
                        
//                         <div className='otp-timer'>
//                             {resendTimer > 0 ? (
//                                 `Resend OTP in: ${resendTimer} sec`
//                             ) : (
//                                 <div className='otp-resend'>
//                                     Didn't receive your OTP?{' '}
//                                     <span className='resend-link' onClick={sendOtp}>Resend OTP</span>
//                                 </div>
//                             )}
//                         </div>
                        
//                         <button 
//                             className="employee-continue-btn" 
//                             onClick={verifyOtp}
//                         >
//                             Submit OTP
//                         </button>
                        
//                         <div className='auth-toggle'>
//                             {isSignUp ? "Already have an Account? " : "Don't have an Account? "}
//                             <span
//                                 className='auth-toggle-link'
//                                 onClick={() => {
//                                     toggleAuthMode();
//                                 }}
//                             >
//                                 {isSignUp ? "Log In" : "Sign Up"}
//                             </span>
//                         </div>
//                     </>
//                 )}
//             </div>
//         </div>
//     );
// }

// export default LoginPageMain;









import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLogin } from './LoginContext';
import { baseUrl } from './BASE_URL';
import './c1login.css';
import './c2login.css';

function LoginPageMain({ closeLoginPage, onClose, loginMode }) {
    const [keepSignedIn, setKeepSignedIn] = useState(false);
    const navigate = useNavigate();
    const { loginUser, loginEmployee, loginType, user, employeeUser, logoutEmployee } = useLogin();
    
    const [isSignUp, setIsSignUp] = useState(loginMode === 'signup');
    const [userName, setUserName] = useState('');
    const [email, setEmail] = useState('');
    const [secretCode, setSecretCode] = useState('');
    const [showSecretCode, setShowSecretCode] = useState(false);
    
    const [errorMessage, setErrorMessage] = useState('');
    const [status, setStatus] = useState('');

    const validateEmployeeEmail = (email) => /^[^\s@]+@adinn\.co\.in$/.test(email);

    useEffect(() => {
        setIsSignUp(loginMode === 'signup');
        setErrorMessage('');
        setSecretCode('');
        setUserName('');
        setEmail('');
    }, [loginMode, loginType]);

    // Employee Register Handler
    const handleEmployeeRegister = async () => {
        setErrorMessage('');
        
        if (!userName) {
            setErrorMessage('Please enter your full name');
            return;
        }
        
        if (!email) {
            setErrorMessage('Please enter your email');
            return;
        }
        
        if (!validateEmployeeEmail(email)) {
            setErrorMessage('Please use your company email (@adinn.co.in)');
            return;
        }
        
        if (!secretCode) {
            setErrorMessage('Please enter the secret code');
            return;
        }

        try {
            setStatus('Registering...');
            
            const response = await fetch(`${baseUrl}/EmployeeLogin/employee/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    employeeName: userName,
                    employeeEmail: email,
                    secretCode: secretCode
                })
            });

            const data = await response.json();

            if (!data.success) {
                throw new Error(data.message || "Registration failed");
            }
            
            // Successfully registered and logged in
            const employeeData = {
                email: data.employee.employeeEmail,
                userName: data.employee.employeeName,
                secretCode : data.employee.secretCode,
                employeeId: data.employee.employeeId,
                role: data.employee.role,
                loginTime: new Date().toISOString()
            };
            
            loginEmployee(employeeData, keepSignedIn);
            setStatus('Registration successful!');
            
            // Close modal after successful registration
            setTimeout(() => {
                onClose();
            }, 1000);
            
        } catch (error) {
            console.error(error);
            setStatus('Failed');
            setErrorMessage(error.message || "Registration failed. Please try again.");
        }
    };

    // Employee Login Handler
    const handleEmployeeLogin = async () => {
        setErrorMessage('');
        
        if (!email) {
            setErrorMessage('Please enter your email');
            return;
        }
        
        if (!validateEmployeeEmail(email)) {
            setErrorMessage('Please use your office email');
            return;
        }

        try {
            setStatus('Logging in...');
            
            const response = await fetch(`${baseUrl}/EmployeeLogin/employee/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    employeeEmail: email
                })
            });

            const data = await response.json();

            if (!data.success) {
                throw new Error(data.message || "Login failed");
            }
            
            // Successfully logged in
            const employeeData = {
                email: data.employee.employeeEmail,
                userName: data.employee.employeeName,
                secretCode : data.employee.secretCode,
                employeeId: data.employee.employeeId,
                role: data.employee.role,
                loginTime: new Date().toISOString()
            };
            
            loginEmployee(employeeData, keepSignedIn);
            setStatus('Login successful!');
            
            // Close modal after successful login
            setTimeout(() => {
                onClose();
            }, 1000);
            
        } catch (error) {
            console.error(error);
            setStatus('Failed');
            setErrorMessage(error.message || "Login failed. Please try again.");
        }
    };

    const toggleAuthMode = () => {
        const newMode = isSignUp ? 'login' : 'signup';
        setIsSignUp(!isSignUp);
        setErrorMessage('');
        if (!isSignUp) {
            setUserName('');
            setEmail('');
            setSecretCode('');
        }
    };

    // If employee is already logged in, show their info
    if (employeeUser && loginType === 'employee') {
        return (
            <div className="employee-login-container">
                <div className="employee-login-header">
                    <div className="close-button" onClick={onClose}>
                        <i className="fa-regular fa-circle-xmark"></i>
                    </div>
                    <div className="employee-login-title">
                        Employee Account
                    </div>
                </div>

                <div className='employee-login-form'>
                    <div className="employee-logged-in-info">
                        <div className="employee-welcome">Welcome!</div>
                        <div className="employee-email">{employeeUser.email}</div>
                        <div className="employee-name">{employeeUser.userName}</div>
                        <div className="employee-name">{employeeUser.secretCode}</div>

                        <div className="employee-id">ID: {employeeUser.employeeId}</div>
                        
                        <button 
                            className="employee-logout-btn" 
                            onClick={() => {
                                logoutEmployee();
                                onClose();
                            }}
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="employee-login-container">
            {/* Header */}
            <div className="employee-login-header">
                <div className="close-button" onClick={onClose}>
                    <i className="fa-regular fa-circle-xmark"></i>
                </div>
                <div className="employee-login-title">
                    {loginType === 'employee' ? 
                        `Employee ${isSignUp ? 'Sign Up' : 'Log In'}` : 
                        'Customer Authentication'
                    }
                </div>
            </div>

            {/* Form */}
            <div className='employee-login-form'>
                {loginType === 'employee' ? (
                    // EMPLOYEE LOGIN/SIGNUP FORM
                    <>
                        {isSignUp && (
                            <div className="input-group">
                                <label className="input-label">Full Name</label>
                                <input
                                    type="text"
                                    placeholder="Enter your full name"
                                    className='employee-input'
                                    value={userName}
                                    onChange={e => setUserName(e.target.value)}
                                />
                            </div>
                        )}
                        
                        <div className="input-group">
                            <label className="input-label">Email</label>
                            <input
                                type="email"
                                placeholder="user@adinn.co.in"
                                className='employee-input'
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                            />
                        </div>
                        
                        {isSignUp && (
                            <div className="input-group">
                                <label className="input-label">Secret Code</label>
                                <div className="secret-code-input-container">
                                    <input
                                        type={showSecretCode ? "text" : "password"}
                                        placeholder="Enter secret code"
                                        className='employee-input secret-code-input'
                                        value={secretCode}
                                        onChange={e => setSecretCode(e.target.value)}
                                    />
                                    <span 
                                        className="secret-code-toggle"
                                        onClick={() => setShowSecretCode(!showSecretCode)}
                                    >
                                        {showSecretCode ? '🙈' : '👁️'}
                                    </span>
                                </div>
                            </div>
                        )}
                        
                        {errorMessage && <div className="employee-error-message">{errorMessage}</div>}
                        
                        <div className="remember-me">
                            <label className="checkbox-container">
                                <input 
                                    type="checkbox"
                                    checked={keepSignedIn}
                                    onChange={(e) => setKeepSignedIn(e.target.checked)} 
                                />
                                <span className="checkmark">&#x2714;</span>
                                <span className='check-content'>Keep me signed in</span>
                            </label>
                        </div>

                        <button 
                            type='submit' 
                            className="employee-continue-btn" 
                            onClick={isSignUp ? handleEmployeeRegister : handleEmployeeLogin}
                            disabled={status === 'Logging in...' || status === 'Registering...'}
                        >
                            {status === 'Logging in...' ? 'Logging in...' : 
                             status === 'Registering...' ? 'Registering...' :
                             isSignUp ? 'Register' : 'Continue'}
                        </button>
                        
                        <div className='auth-toggle'>
                            {isSignUp ? "Already have an Account? " : "Don't have an Account? "}
                            <span 
                                className='auth-toggle-link' 
                                onClick={toggleAuthMode}
                            >
                                {isSignUp ? "Log In" : "Sign Up"}
                            </span>
                        </div>
                        
                        <div className='terms-text'>
                            By continuing you agree to Affim Roadshows Terms & Privacy Policy
                        </div>
                        
                        {status && <div className='status-message'>{status}</div>}
                    </>
                ) : (
                    // CUSTOMER AUTHENTICATION (Simplified - showing only message)
                    <>
                        <div className="customer-auth-message">
                            <h3>Customer Authentication</h3>
                            <p>Customer login/signup with OTP functionality has been disabled.</p>
                            <p>Please use Employee login for administrative access.</p>
                        </div>
                        
                        <div className='auth-toggle'>
                            Looking for employee access?{' '}
                            <span 
                                className='auth-toggle-link' 
                                onClick={() => {
                                    setIsSignUp(false);
                                    // You might want to add a way to switch to employee login
                                }}
                            >
                                Employee Login
                            </span>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default LoginPageMain;