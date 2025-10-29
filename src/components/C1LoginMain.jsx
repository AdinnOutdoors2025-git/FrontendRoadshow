import React, { useState, useEffect } from 'react';
import './c1login.css';
import './c2login.css';
import { useNavigate } from 'react-router-dom';
import { useLogin } from './LoginContext';
import axios from 'axios';
import { baseUrl } from '../Adminpanel/BASE_URL';

function LoginPageMain({ closeLoginPage, onClose, loginMode }) {
    //keep me signed checkbox section
    const [keepSignedIn, setKeepSignedIn] = useState(false); // Add this line
    const navigate = useNavigate();
    //SIGN UP DETAILS
    const { loginUser } = useLogin();
    // Replace the useState for isSignUp with:
    const [isSignUp, setIsSignUp] = useState(loginMode === 'signup');
    const [userName, setUserName] = useState('');
    const [userPhone, setUserPhone] = useState('');
    const [email, setEmail] = useState('');
    // Enter OTP to target next value 
    const [enterOtp, setEnterOtp] = useState(new Array(4).fill(""));
    //UI states
    const [otp, setOtp] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [verified, setVerified] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [resendTimer, setResendTimer] = useState(30);
    const [status, setStatus] = useState('');
    const [otpError, setOtpError] = useState(false); // State for OTP error
    const [userExists, setUserExists] = useState(false);
    const [usePhoneOTP, setUsePhoneOTP] = useState(false);
    // Function to check if input is email or phone
    const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const validatePhone = (phone) => /^\d{10}$/.test(phone);

    // Add useEffect to update when loginMode changes
    useEffect(() => {
        setIsSignUp(loginMode === 'signup');
        // Reset form when mode changes
        setOtpSent(false);
        setErrorMessage('');
        setEnterOtp(new Array(4).fill(""));
    }, [loginMode]);

    const sendOtp = async () => {
        setErrorMessage('');
        setStatus('Validating...');
        // For login
        if (!isSignUp) {
            const identifier = userPhone || email;

            if (!identifier) {
                setErrorMessage('Please enter your email or phone number');
                return;
            }
            // Determine if it's a phone or email and clean the input
            let isPhone = /^\d{10}$/.test(identifier);
            let cleanedIdentifier = identifier;

            if (isPhone) {
                cleanedIdentifier = identifier.replace(/\D/g, '');
                if (cleanedIdentifier.length !== 10) {
                    setErrorMessage('Please enter a valid 10-digit phone number');
                    return;
                }
            } else if (!validateEmail(identifier)) {
                setErrorMessage('Please enter a valid email address');
                return;
            }

            // Update state immediately before proceeding
            if (isPhone) {
                setUsePhoneOTP(true);
                setUserPhone(cleanedIdentifier);
                setEmail('');
            } else {
                setUsePhoneOTP(false);
                setEmail(cleanedIdentifier);
                setUserPhone('');
            }

            // Use the cleaned identifier for the API call
            const loginIdentifier = isPhone ? cleanedIdentifier : cleanedIdentifier;

            try {
                setStatus('Checking user...');
                // Check if user exists
                const checkEndpoint = 'check-user';
                const checkResponse = await fetch(`${baseUrl}/login/${checkEndpoint}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(isPhone ? { phone: loginIdentifier } : { email: loginIdentifier })
                });
                const checkData = await checkResponse.json();

                if (!checkData.exists) {
                    setErrorMessage('User not found. Please sign up.');
                    return;
                }
                // Send OTP
                await sendOtpRequest(isPhone, loginIdentifier, '');

            } catch (error) {
                console.error(error);
                setStatus('Failed');
                setErrorMessage("Error checking user. Try again later.");
            }
        } else {
            // For signup - this part remains mostly the same
            if (!userName) {
                setErrorMessage('Please enter your name');
                return;
            }

            // Clean and validate phone number
            const cleanedPhone = userPhone.replace(/\D/g, '');
            if (cleanedPhone.length !== 10) {
                setErrorMessage('Please enter a valid 10-digit phone number');
                return;
            }

            if (!email || !validateEmail(email)) {
                setErrorMessage('Please enter a valid email address');
                return;
            }

            setUsePhoneOTP(false); // For signup, we'll use email by default

            try {
                setStatus('Checking user...');
                // Check if user exists
                const checkEndpoint = 'check-user-exists';
                const checkResponse = await fetch(`${baseUrl}/login/${checkEndpoint}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, phone: cleanedPhone })
                });

                const checkData = await checkResponse.json();

                if (checkData.emailExists) {
                    setErrorMessage('Email already registered. Please login.');
                    return;
                }
                if (checkData.phoneExists) {
                    setErrorMessage('Phone already registered. Please login.');
                    return;
                }
                // Send OTP via email for signup
                await sendOtpRequest(false, email, userName);

            } catch (error) {
                console.error(error);
                setStatus('Failed');
                setErrorMessage("Error checking user. Try again later.");
            }
        }
    };

    // Helper function to send OTP
    const sendOtpRequest = async (isPhone, identifier, userName) => {
        try {
            setStatus('Sending OTP...');

            const otpResponse = await fetch(`${baseUrl}/login/send-otp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...(isPhone ? { phone: identifier } : { email: identifier }),
                    userName: userName
                })
            });

            const otpData = await otpResponse.json();

            if (otpData.success) {
                setOtpSent(true);
                startResendTimer();
                setStatus('OTP Sent!');
            } else {
                setStatus('Failed');
                setErrorMessage(otpData.message || "Failed to send OTP. Try again.");
            }
        } catch (error) {
            console.error(error);
            setStatus('Failed');
            setErrorMessage("Error sending OTP. Try again later.");
        }
    };

    const verifyOtp = async () => {
        const finalOtp = enterOtp.join('');
        if (finalOtp.length !== 4) {
            setErrorMessage("Enter a valid 4-digit OTP");
            setOtpError(true);
            return;
        }
        try {
            setStatus("Verifying...");
            const verifyResponse = await fetch(`${baseUrl}/login/verify-otp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    [usePhoneOTP ? 'phone' : 'email']: usePhoneOTP ? userPhone : email,
                    otp: finalOtp,

                })
            });

            if (!verifyResponse.ok) {
                const errorData = await verifyResponse.json();
                throw new Error(errorData.message || "Verification failed");
            }

            const verifyData = await verifyResponse.json();

            if (!verifyData.verified) {
                throw new Error("Invalid OTP");
            }
            if (verifyData.verified) {
                // For signup, create user account
                if (isSignUp) {
                    const userResponse = await fetch(`${baseUrl}/login/create-user`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ userName, userEmail: email, userPhone })
                    });

                    if (!userResponse.ok) {
                        const errorData = await userResponse.json();
                        throw new Error(errorData.error || "Failed to create user");
                    }
                    const userData = await userResponse.json();
                    loginUser(userData.user, keepSignedIn);
                    alert("Account created successfully!");
                } else {
                    // For login, use verified user data
                    loginUser(verifyData.user, keepSignedIn);
                    alert("Logged in successfully!");
                }
            }
            onClose();
            // navigate("/book1");
        } catch (error) {
            console.error("Verification error:", error);
            setOtpError(true);
            setErrorMessage(error.message || "Verification failed. Try again.");
        }
    };

    // Toggle between login and signup
    const toggleAuthMode = () => {
        const newMode = isSignUp ? 'login' : 'signup';
        setIsSignUp(!isSignUp);
        setOtpSent(false);
        setErrorMessage('');
        setEnterOtp(new Array(4).fill(""));
        // Reset fields only when switching to login
        if (!isSignUp) {
            setUserName('');
            setUserPhone('');
            setEmail('');
        }
    };
    const startResendTimer = () => {
        setResendTimer(60);
        const interval = setInterval(() => {
            setResendTimer(prev => prev > 0 ? prev - 1 : 0);
            if (resendTimer === 0) clearInterval(interval);
        }, 1000);
    };
    //Check if the user exists are not
    const checkUserExists = async (email) => {
        try {
            const response = await axios.post(`${baseUrl}/login/check-user`, { email });
            return response.data.exists;
        }
        catch (error) {
            console.log("Error Checking User:", error);
            return false;
        }
    };

    // Enter OTP to target next value 
    function handleOtpChange(e, index) {
        if (!/^\d*$/.test(e.target.value)) return; // Only allow numbers
        let otpArray = [...enterOtp];
        otpArray[index] = e.target.value;
        setEnterOtp(otpArray);
        setOtp(otpArray.join('')); // Store OTP correctly
        setOtpError(false); // Remove red border when user starts typing
        if (e.target.value && e.target.nextSibling) {
            e.target.nextSibling.focus();
        }
        // If the user deletes a digit, move back to the previous input field
        if (!e.target.value && e.target.previousSibling) {
            e.target.previousSibling.focus();
        }
    }
    return (
        <div className="container login-mainn">
            <div className="login-upper">
                <div className="close-button" onClick={onClose}>
                    <i className="fa-regular fa-circle-xmark"></i>
                </div>
                <div className="login-message">
                    {otpSent ? "Verify OTP" : isSignUp ? "Sign Up" : "Log In"}
                </div>
            </div>

            <div className='login-lower'>
                {!otpSent ? (
                    <>
                        {isSignUp ? (
                            <>
                                <input
                                    type="text"
                                    placeholder="Your Full Name"
                                    className='login-input-phone'
                                    value={userName}
                                    onChange={e => setUserName(e.target.value)}
                                /><br />

                                <input
                                    type="tel"
                                    placeholder="Mobile number"
                                    className='login-input-phone'
                                    value={userPhone}
                                    onChange={e => setUserPhone(e.target.value)}
                                /><br />
                                <input
                                    type="email"
                                    placeholder="Enter Your Email"
                                    className='login-input-phone'
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                /><br />
                            </>
                        ) : (
                            // LOGIN FORM - Show single input field
                            <input
                                type="text"
                                placeholder="Enter Email ID or Phone number"
                                className='login-input-phone'
                                value={usePhoneOTP ? userPhone : email}
                                onChange={e =>
                                    usePhoneOTP
                                        ? setUserPhone(e.target.value)
                                        : setEmail(e.target.value)
                                }
                            />
                        )}
                        {errorMessage && <div className="error-message-login">{errorMessage}</div>}

                        {!isSignUp && (
                            <div>
                                <label className="checkbox-container">
                                    <input type="checkbox"
                                        checked={keepSignedIn}
                                        onChange={(e) => setKeepSignedIn(e.target.checked)} />
                                    <span className="checkmark">&#x2714;</span>
                                    <span className='check-content'>Keep me signed in</span>
                                </label>
                            </div>
                        )}

                        <button type='submit' className="continue-btn" onClick={sendOtp}>
                            {isSignUp ? "Get OTP" : "Send OTP"}
                        </button>
                        <div className='otp_signInUp'>
                            {isSignUp ? "Already have an account? " : "Don't have an account? "}
                            <span className='otp_signInUpSpan' onClick={toggleAuthMode}>
                                {isSignUp ? "Log In" : "Sign Up"}
                            </span>
                        </div>
                        <div className='login_otpSentStatus'> {status}</div>
                    </>
                ) : (
                    <>
                        <div className='verifyOtp'>VERIFY WITH OTP</div>
                        <div className='verifySent'>Sent to {usePhoneOTP ? userPhone : email}</div>
                        <div className='otpBox'>
                            {enterOtp.map((data, i) => (
                                <input
                                    key={i}
                                    type="tel"
                                    maxLength={1}
                                    className={`otpBox-content ${otpError ? "otp-error" : ""}`}
                                    value={data}
                                    onChange={(e) => handleOtpChange(e, i)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Backspace" && !enterOtp[i] && e.target.previousSibling) {
                                            e.target.previousSibling.focus();
                                        }
                                    }} />))}
                        </div>
                        {otpError && <div className="error-message-login">Enter a correct code</div>}
                        <div className='otpTime'>
                            {resendTimer > 0 ? (
                                `Resend OTP in: ${resendTimer} sec`
                            ) : (
                                <div className='otpResend'>
                                    Didn't receive your OTP?{' '}
                                    <span className='ResendHighlight' onClick={sendOtp}>Resend OTP</span>
                                </div>
                            )}
                        </div>
                        <button className="Submit-btn" onClick={verifyOtp}>Submit OTP</button>
                        {/* Show login/signup toggle in OTP verification too */}
                        <div className='otp_signInUp'>
                            {isSignUp ? "Already have an Account? " : "Don't have an Account? "}
                            <span
                                className='otp_signInUpSpan'
                                onClick={() => {
                                    toggleAuthMode();
                                }} >
                                {isSignUp ? "Log In" : "Sign Up"}
                            </span>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
export default LoginPageMain;