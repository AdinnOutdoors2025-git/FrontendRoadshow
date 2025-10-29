// import React, { useState, useEffect } from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';
// import { useLogin } from './LoginContext';
// import './LoginContext';
// import { baseUrl } from './BASE_URL';
// import './creativelogin.css';

// const AdminAuth = () => {
//     const [isRegistering, setIsRegistering] = useState(false);
//     const [formData, setFormData] = useState({
//         username: '',
//         password: '',
//         secretCode: ''
//     });
//     const [showPassword, setShowPassword] = useState(false);
//     const [showSecretCode, setShowSecretCode] = useState(false);
//     const [error, setError] = useState('');
//     const [successMessage, setSuccessMessage] = useState('');
//     const [rememberMe, setRememberMe] = useState(false);
//     const [isLoading, setIsLoading] = useState(false);
//     const { loginUser, closeLogin } = useLogin();
//     const navigate = useNavigate();
//     const location = useLocation();
//     const [authField, setAuthField] = useState('password'); // New state for auth method
//     useEffect(() => {
//         if (location.state?.registrationSuccess) {
//             setIsRegistering(false);
//             setSuccessMessage('Registration successful! Please login.');
//         }
//     }, [location.state]);

//     const handleChange = (e) => {
//         setFormData({
//             ...formData,
//             [e.target.name]: e.target.value
//         });
//         // Clear errors when user starts typing
//         if (error) setError('');
//     };

//     const handleAuthMethodChange = (method) => {
//         setAuthField(method);
//         setFormData({
//             ...formData,
//             password: method === 'password' ? formData.password : '',
//             secretCode: method === 'secretCode' ? formData.secretCode : ''
//         });
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         // console.log('Submitting with:', formData);  // Add this line

//         console.log('Submitting form:', {
//             isRegistering,
//             formData,
//             authField
//         });
//         setError('');
//         setIsLoading(true);
//         const endpoint = isRegistering
//             ? `${baseUrl}/adminUserLogin/register-admin`
//             : `${baseUrl}/adminUserLogin/admin`;

//         try {
//             // For registration, send all fields
//             // For login, only send username and password
//             // const payload = isRegistering
//             //     ? formData
//             //     : {
//             //         username: formData.username,
//             //         [authField]: formData[authField]
//             //     };
//             // Prepare payload based on registration or login
//             let payload;
//             if (isRegistering) {
//                 payload = {
//                     username: formData.username.trim(),
//                     password: formData.password,
//                     secretCode: formData.secretCode
//                 };
//             } else {
//                 payload = {
//                     username: formData.username.trim(),
//                     [authField]: formData[authField]
//                 };
//             }

//             console.log('Sending request to:', endpoint);
//             console.log('Payload:', payload);

//             const response = await fetch(endpoint, {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify(payload),
//             });

//             const data = await response.json();
//             console.log('Response received:', data);

//             if (response.ok) {
//                 if (isRegistering) {
//                     setSuccessMessage('Registration successful! Please login.');
//                     setIsRegistering(false);
//                     // Clear form except username
//                     setFormData({
//                         // ...formData,
//                         // password: '',
//                         // secretCode: ''
//                         username: formData.username,
//                         password: '',
//                         secretCode: ''
//                     });
//                     setError('');
//                 } else {
//                     loginUser({
//                         username: data.user.username,
//                         role: data.user.role,
//                         token: data.token,
//                         _id: data.user.id
//                     }, rememberMe);
//                     // closeLogin();
//                     // navigate('/admin');
//                     // Redirect to the originally requested page or admin dashboard
//                     const from = location.state?.from || '/admin';
//                     navigate(from, { replace: true });
//                 }
//             } else {
//                 // setError(data.message || (isRegistering ? "Registration Failed!" : "Authentication Failed!"));
//                 const errorMsg = data.message || (isRegistering ? "Registration Failed!" : "Authentication Failed!");
//                 setError(errorMsg);
//                 console.error('Server error:', errorMsg);
//             }
//         } catch (err) {
//             // setError('Network error. Please try again.');
//             // console.error(isRegistering ? 'Registration error:' : 'Login error:', err);
//             console.error('Network error:', err);
//             setError('Network error. Please check your connection and try again.');
//         }
//         finally {
//             setIsLoading(false);
//         }
//     };

//     const toggleAuthMode = () => {
//         setIsRegistering(!isRegistering);
//         setError('');
//         setSuccessMessage('');
//         setFormData({
//             username: '',
//             password: '',
//             secretCode: ''
//         });
//         setAuthField('password');
//     };

//     return (
//         <div className="admin-user-auth-container">
//             <div className="admin-user-auth-card">
//                 <h2 className="auth-title">
//                     {isRegistering ? 'Admin Registration' : 'Admin Login'}
//                 </h2>
//                 <p className="auth-subtitle">
//                     {isRegistering ? 'Create your admin account' : 'Access the admin dashboard'}
//                 </p>

//                 {successMessage && (
//                     <div className="admin-user-success-message">
//                         {successMessage}
//                     </div>
//                 )}

//                 {error && <div className="admin-user-error-message">{error}</div>}

//                 <form onSubmit={handleSubmit} className="auth-form">
//                     {/* USER NAME FOR BOTH REGISTER AND LOGIN  */}
//                     <div className="admin-user-form-group">
//                         <label>Username</label>
//                         <input
//                             type="text"
//                             name="username"
//                             value={formData.username}
//                             onChange={handleChange}
//                             required
//                             minLength={isRegistering ? "4" : undefined}
//                             maxLength={isRegistering ? "20" : undefined}
//                             pattern={isRegistering ? "[a-zA-Z0-9]+" : undefined}
//                             title={isRegistering ? "Only alphanumeric characters (4-20)" : undefined}
//                             className="auth-input"
//                               placeholder="Enter username"
//                             disabled={isLoading}
//                         />
//                     </div>


//                     {isRegistering ? (
//                         /* REGISTRATION FIELDS */
//                         <>
//                             <div className="admin-user-form-group password-group">
//                                 <label>
//                                     Password {isRegistering && '(min 6 characters)'}
//                                 </label>
//                                 <div className="password-input-container">
//                                     <input
//                                         type={showPassword ? "text" : "password"}
//                                         name="password"
//                                         value={formData.password}
//                                         onChange={handleChange}
//                                         required
//                                         minLength={isRegistering ? "6" : undefined}
//                                         className="auth-input"
//                                         placeholder={isRegistering ? "Required" : "Optional (use password or secret code)"}
//                                     />
//                                     <button
//                                         type="button"
//                                         className="password-toggle"
//                                         onClick={() => setShowPassword(!showPassword)}
//                                     >
//                                         {showPassword ? '👁️' : '👁️‍🗨️'}
//                                     </button>
//                                 </div>
//                             </div>

//                             <div className="admin-user-form-group password-group">
//                                 <label>Admin Secret Code</label>
//                                 <div className="password-input-container">
//                                     <input
//                                         type={showSecretCode ? "text" : "password"}
//                                         name="secretCode"
//                                         value={formData.secretCode}
//                                         onChange={handleChange}
//                                         required
//                                         className="auth-input"
//                                         placeholder={isRegistering ? "Required" : "Optional (use password or secret code)"}
//                                                                                 disabled={isLoading}

//                                     />
//                                     <button
//                                         type="button"
//                                         className="password-toggle"
//                                         onClick={() => setShowSecretCode(!showSecretCode)}
//                                                                                 disabled={isLoading}
//                                     >
//                                         {showSecretCode ? '👁️' : '👁️‍🗨️'}
//                                     </button>
//                                 </div>
//                             </div>

//                         </>
//                     ) : (
//                         /* LOGIN FIELDS */
//                         <>
//                             <div className="admin-user-form-group">
//                                 <div className="auth-method-selector">
//                                     <button
//                                         type="button"
//                                         className={`auth-method-btn ${authField === 'password' ? 'active' : ''}`}
//                                         onClick={() => handleAuthMethodChange('password')}
//                                                                                 disabled={isLoading}
//                                     >
//                                         Password
//                                     </button>
//                                     <button
//                                         type="button"
//                                         className={`auth-method-btn ${authField === 'secretCode' ? 'active' : ''}`}
//                                         onClick={() => handleAuthMethodChange('secretCode')}
//                                                                                 disabled={isLoading}
//                                     >
//                                         Secret Code
//                                     </button>
//                                 </div>

//                                 <div className="password-input-container">
//                                     <input
//                                         type={authField === 'password' ?
//                                             (showPassword ? "text" : "password") :
//                                             (showSecretCode ? "text" : "password")
//                                         }
//                                         name={authField}
//                                         value={formData[authField]}
//                                         onChange={handleChange}
//                                         className="auth-input"
//                                         placeholder={
//                                             authField === 'password' ?
//                                                 "Enter your password" :
//                                                 "Enter secret code"
//                                         }
//                                         required
//                                                                                 disabled={isLoading}

//                                     />
//                                     <button
//                                         type="button"
//                                         className="password-toggle"
//                                         onClick={() =>
//                                             authField === 'password' ?
//                                                 setShowPassword(!showPassword) :
//                                                 setShowSecretCode(!showSecretCode)
//                                         }
//                                                                                 disabled={isLoading}

//                                     >
//                                         {authField === 'password' ?
//                                             (showPassword ? '👁️' : '👁️‍🗨️') :
//                                             (showSecretCode ? '👁️' : '👁️‍🗨️')
//                                         }
//                                     </button>
//                                 </div>
//                             </div>
//                             <div className="admin-user-remember-me">
//                                 <input
//                                     type="checkbox"
//                                     id="rememberMe"
//                                     checked={rememberMe}
//                                     onChange={(e) => setRememberMe(e.target.checked)}
//                                     className="remember-checkbox"
//                                                                             disabled={isLoading}

//                                 />
//                                 <label htmlFor="rememberMe" style={{ marginBottom: '0px' }}>Remember me</label>
//                             </div>
//                         </>
//                     )}
//                     <button
//                         type="submit"
//                         className="admin-user-auth-button"
//                         disabled={isLoading} >
//                         {isLoading
//                             ? (isRegistering ? 'Registering...' : 'Logging in...')
//                             : (isRegistering ? 'Register Admin' : 'Login as Admin')}
//                     </button>

//                     <div className="auth-footer">
//                         {isRegistering ? 'Already have an account?' : 'Need an admin account?'}
//                         <button
//                             type="button"
//                             className="auth-switch-button"
//                             onClick={toggleAuthMode}
//                         >
//                             {isRegistering ? 'Login here' : 'Register here'}
//                         </button>
//                     </div>
//                 </form>
//             </div>
//         </div>
//     );
// };
// export default AdminAuth;











import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLogin } from './LoginContext';
import './LoginContext';
import { baseUrl } from './BASE_URL';
import './creativelogin.css';

const AdminAuth = () => {
    const [isRegistering, setIsRegistering] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        secretCode: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showSecretCode, setShowSecretCode] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { loginUser, closeLogin } = useLogin();
    const navigate = useNavigate();
    const location = useLocation();
    const [authField, setAuthField] = useState('password');

    useEffect(() => {
        if (location.state?.registrationSuccess) {
            setIsRegistering(false);
            setSuccessMessage('Registration successful! Please login.');
        }
    }, [location.state]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        if (error) setError('');
    };

    const handleAuthMethodChange = (method) => {
        setAuthField(method);
        setFormData({
            ...formData,
            password: method === 'password' ? formData.password : '',
            secretCode: method === 'secretCode' ? formData.secretCode : ''
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        console.log('Submitting form:', {
            isRegistering,
            formData,
            authField
        });
        
        setError('');
        setIsLoading(true);

        // Validate form
        if (!formData.username.trim()) {
            setError('Username is required');
            setIsLoading(false);
            return;
        }

        if (isRegistering) {
            if (!formData.password || !formData.secretCode) {
                setError('All fields are required for registration');
                setIsLoading(false);
                return;
            }
        } else {
            if (!formData[authField]) {
                setError(`${authField === 'password' ? 'Password' : 'Secret code'} is required`);
                setIsLoading(false);
                return;
            }
        }

        const endpoint = isRegistering
            ? `${baseUrl}/adminUserLogin/register-admin`
            : `${baseUrl}/adminUserLogin/admin`;

        try {
            let payload;
            if (isRegistering) {
                payload = {
                    username: formData.username.trim(),
                    password: formData.password,
                    secretCode: formData.secretCode
                };
            } else {
                payload = {
                    username: formData.username.trim(),
                    [authField]: formData[authField]
                };
            }

            console.log('Sending request to:', endpoint);
            console.log('Payload:', { ...payload, password: '***', secretCode: '***' });

            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json();
            console.log('Response received:', data);

            if (response.ok) {
                if (isRegistering) {
                    setSuccessMessage('Registration successful! Please login.');
                    setIsRegistering(false);
                    setFormData({
                        username: formData.username,
                        password: '',
                        secretCode: ''
                    });
                    setError('');
                } else {
                    loginUser({
                        username: data.user.username,
                        role: data.user.role,
                        token: data.token,
                        _id: data.user.id
                    }, rememberMe);
                    
                    const from = location.state?.from || '/admin';
                    navigate(from, { replace: true });
                }
            } else {
                const errorMsg = data.message || (isRegistering ? "Registration failed!" : "Authentication failed!");
                setError(errorMsg);
                console.error('Server error:', errorMsg);
            }
        } catch (err) {
            console.error('Network error:', err);
            if (err.name === 'TypeError' && err.message.includes('Failed to fetch')) {
                setError('Cannot connect to server. Please check if the backend is running.');
            } else {
                setError('Network error. Please check your connection and try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const toggleAuthMode = () => {
        setIsRegistering(!isRegistering);
        setError('');
        setSuccessMessage('');
        setFormData({
            username: '',
            password: '',
            secretCode: ''
        });
        setAuthField('password');
    };

    return (
        <div className="admin-user-auth-container">
            <div className="admin-user-auth-card">
                <h2 className="auth-title">
                    {isRegistering ? 'Admin Registration' : 'Admin Login'}
                </h2>
                <p className="auth-subtitle">
                    {isRegistering ? 'Create your admin account' : 'Access the admin dashboard'}
                </p>

                {successMessage && (
                    <div className="admin-user-success-message">
                        {successMessage}
                    </div>
                )}

                {error && <div className="admin-user-error-message">{error}</div>}

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="admin-user-form-group">
                        <label>Username</label>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                            minLength={isRegistering ? "4" : undefined}
                            maxLength={isRegistering ? "20" : undefined}
                            pattern={isRegistering ? "[a-zA-Z0-9]+" : undefined}
                            title={isRegistering ? "Only alphanumeric characters (4-20)" : undefined}
                            className="auth-input"
                            placeholder="Enter username"
                            disabled={isLoading}
                        />
                    </div>

                    {isRegistering ? (
                        <>
                            <div className="admin-user-form-group password-group">
                                <label>
                                    Password {isRegistering && '(min 6 characters)'}
                                </label>
                                <div className="password-input-container">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                        minLength={isRegistering ? "6" : undefined}
                                        className="auth-input"
                                        placeholder="Required"
                                        disabled={isLoading}
                                    />
                                    <button
                                        type="button"
                                        className="password-toggle"
                                        onClick={() => setShowPassword(!showPassword)}
                                        disabled={isLoading}
                                    >
                                        {showPassword ? '👁️' : '👁️‍🗨️'}
                                    </button>
                                </div>
                            </div>

                            <div className="admin-user-form-group password-group">
                                <label>Admin Secret Code</label>
                                <div className="password-input-container">
                                    <input
                                        type={showSecretCode ? "text" : "password"}
                                        name="secretCode"
                                        value={formData.secretCode}
                                        onChange={handleChange}
                                        required
                                        className="auth-input"
                                        placeholder="Required"
                                        disabled={isLoading}
                                    />
                                    <button
                                        type="button"
                                        className="password-toggle"
                                        onClick={() => setShowSecretCode(!showSecretCode)}
                                        disabled={isLoading}
                                    >
                                        {showSecretCode ? '👁️' : '👁️‍🗨️'}
                                    </button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="admin-user-form-group">
                                <div className="auth-method-selector">
                                    <button
                                        type="button"
                                        className={`auth-method-btn ${authField === 'password' ? 'active' : ''}`}
                                        onClick={() => handleAuthMethodChange('password')}
                                        disabled={isLoading}
                                    >
                                        Password
                                    </button>
                                    <button
                                        type="button"
                                        className={`auth-method-btn ${authField === 'secretCode' ? 'active' : ''}`}
                                        onClick={() => handleAuthMethodChange('secretCode')}
                                        disabled={isLoading}
                                    >
                                        Secret Code
                                    </button>
                                </div>

                                <div className="password-input-container">
                                    <input
                                        type={authField === 'password' ?
                                            (showPassword ? "text" : "password") :
                                            (showSecretCode ? "text" : "password")
                                        }
                                        name={authField}
                                        value={formData[authField]}
                                        onChange={handleChange}
                                        className="auth-input"
                                        placeholder={
                                            authField === 'password' ?
                                                "Enter your password" :
                                                "Enter secret code"
                                        }
                                        required
                                        disabled={isLoading}
                                    />
                                    <button
                                        type="button"
                                        className="password-toggle"
                                        onClick={() =>
                                            authField === 'password' ?
                                                setShowPassword(!showPassword) :
                                                setShowSecretCode(!showSecretCode)
                                        }
                                        disabled={isLoading}
                                    >
                                        {authField === 'password' ?
                                            (showPassword ? '👁️' : '👁️‍🗨️') :
                                            (showSecretCode ? '👁️' : '👁️‍🗨️')
                                        }
                                    </button>
                                </div>
                            </div>
                            <div className="admin-user-remember-me">
                                <input
                                    type="checkbox"
                                    id="rememberMe"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                    className="remember-checkbox"
                                    disabled={isLoading}
                                />
                                <label htmlFor="rememberMe" style={{ marginBottom: '0px' }}>Remember me</label>
                            </div>
                        </>
                    )}
                    <button
                        type="submit"
                        className="admin-user-auth-button"
                        disabled={isLoading} >
                        {isLoading
                            ? (isRegistering ? 'Registering...' : 'Logging in...')
                            : (isRegistering ? 'Register Admin' : 'Login as Admin')}
                    </button>

                    <div className="auth-footer">
                        {isRegistering ? 'Already have an account?' : 'Need an admin account?'}
                        <button
                            type="button"
                            className="auth-switch-button"
                            onClick={toggleAuthMode}
                            disabled={isLoading}
                        >
                            {isRegistering ? 'Login here' : 'Register here'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdminAuth;