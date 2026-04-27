// import React, { createContext, useState, useContext, useEffect, useRef } from 'react';
// const LoginContext = createContext();
// export const LoginProvider = ({ children }) => {
//     const [isLoginOpen, setIsLoginOpen] = useState(false);
//     const [user, setUser] = useState(() => {
//         const savedUser = localStorage.getItem('user') || sessionStorage.getItem('user');
//         return savedUser ? JSON.parse(savedUser) : null;
//     });


//     // Using useRef for timer to ensure stability across re-renders
//     const inactivityTimer = useRef(null);
//     const lastActivityTime = useRef(Date.now());
   
//     //const INACTIVITY_TIMEOUT = 5 * 1000; // 5 seconds for testing
//     const INACTIVITY_TIMEOUT = 2 * 60 * 60 * 1000; // 2hours for production (if the user not used that site then automatically logged out)




//     // In LoginContext.js (or wherever your context is defined)
//     const [loginMode, setLoginMode] = useState('login'); // 'login' or 'signup'
//     const toggleLogin = () => setIsLoginOpen(!isLoginOpen);
//     const closeLogin = () => setIsLoginOpen(false);
//     // const openLogin = () => setIsLoginOpen(true);




//     const openLogin = (mode = 'login', redirectPath = null) => {
//         setLoginMode(mode);
//         setIsLoginOpen(true);
//          // Store the path where login was triggered
//     if (redirectPath) {
//         sessionStorage.setItem('loginRedirect', redirectPath);
//     }
//     };




//     const loginUser = (userData, rememberMe = false) => {
//         const userWithId = {
//             ...userData,
//             _id: userData._id || userData.id,
//                         isAdmin: userData.role === 'admin' // Add admin flag


//         };
//         setUser(userWithId);
//         if (rememberMe) {
//             localStorage.setItem('user', JSON.stringify(userWithId));
//             sessionStorage.removeItem('user');
//         } else {
//             sessionStorage.setItem('user', JSON.stringify(userWithId));
//             localStorage.removeItem('user');
//             // startInactivityTimer();
//              if (!userWithId.isAdmin) {
//                 startInactivityTimer();
//             }
//         }
//        // For admin users, don't start inactivity timer
//         if (userWithId.isAdmin) {
//             clearInactivityTimer();
//         }


//         // Handle redirect
//   const redirectPath = sessionStorage.getItem('loginRedirect');
//   if (redirectPath) {
//     sessionStorage.removeItem('loginRedirect');
//     window.location.href = redirectPath; // Full refresh to ensure cart loads
//   }
//     };


//     const logoutUser = () => {
//         console.log('Logging out due to inactivity');
//         setUser(null);
//         localStorage.removeItem('user');
//         sessionStorage.removeItem('user');
//         localStorage.removeItem('cartItems');
//         clearInactivityTimer();
//     };


//     const startInactivityTimer = () => {
//         clearInactivityTimer();
//         inactivityTimer.current = setTimeout(() => {
//             // Only logout if no recent activity
//             if (Date.now() - lastActivityTime.current >= INACTIVITY_TIMEOUT) {
//                 logoutUser();
//             }
//         }, INACTIVITY_TIMEOUT);
//     };


//     const clearInactivityTimer = () => {
//         if (inactivityTimer.current) {
//             clearTimeout(inactivityTimer.current);
//             inactivityTimer.current = null;
//         }
//     };


//     const handleUserActivity = () => {
//         console.log('User activity detected at', new Date().toISOString());
//         lastActivityTime.current = Date.now();
//         if (user && !localStorage.getItem('user')) {
//             startInactivityTimer();
//         }
//     };


//     useEffect(() => {
//         // Set up activity listeners
//         const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];


//         events.forEach(event => {
//             window.addEventListener(event, handleUserActivity, { passive: true });
//         });


//         // Initialize timer if needed
//         if (user && !localStorage.getItem('user')) {
//             startInactivityTimer();
//         }


//         return () => {
//             events.forEach(event => {
//                 window.removeEventListener(event, handleUserActivity);
//             });
//             clearInactivityTimer();
//         };
//     }, [user]);


//     // Check for existing user on initial load
//     useEffect(() => {
//         const savedUser = localStorage.getItem('user') || sessionStorage.getItem('user');
//         if (savedUser) {
//             const parsedUser = JSON.parse(savedUser);
//             setUser(parsedUser);
//         }
//     }, []);




//     // const isAdmin = () => {
//     //     return user?.role === 'admin';
//     // };
//     // In your LoginContext provider value
// const isAdmin = user?.role === 'admin';




//     return (
//         <LoginContext.Provider value={{
//             isLoginOpen, toggleLogin, closeLogin, openLogin,
//             loginUser, logoutUser, user, loginMode, isAdmin


//         }}>
//             {children}
//         </LoginContext.Provider>
//     );
// };

// // export const useLogin = () => useContext(LoginContext);

// export const useLogin = () => {
//   const context = useContext(LoginContext);
//   if (!context) {
//     throw new Error('useLogin must be used within a LoginProvider');
//   }
//   return context;
// };



import React, { createContext, useState, useContext, useEffect, useRef } from 'react';

const LoginContext = createContext();

export const LoginProvider = ({ children }) => {
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('user') || sessionStorage.getItem('user');
        return savedUser ? JSON.parse(savedUser) : null;
    });

    const [employeeUser, setEmployeeUser] = useState(() => {
        const savedEmployee = localStorage.getItem('employeeUser');
        return savedEmployee ? JSON.parse(savedEmployee) : null;
    });

    // Using useRef for timer to ensure stability across re-renders
    const inactivityTimer = useRef(null);
    const lastActivityTime = useRef(Date.now());
   
    const INACTIVITY_TIMEOUT = 2 * 60 * 60 * 1000; // 2 hours

    const [loginMode, setLoginMode] = useState('login'); // 'login' or 'signup'
    const [loginType, setLoginType] = useState('customer'); // 'customer' or 'employee'

    const toggleLogin = () => setIsLoginOpen(!isLoginOpen);
    const closeLogin = () => setIsLoginOpen(false);

    const openLogin = (mode = 'login', type = 'customer', redirectPath = null) => {
        setLoginMode(mode);
        setLoginType(type);
        setIsLoginOpen(true);
        
        if (redirectPath) {
            sessionStorage.setItem('loginRedirect', redirectPath);
        }
    };

  

const loginUser = (userData, rememberMe = false) => {
    const userWithId = {
        ...userData,
        _id: userData._id || userData.id,
        isAdmin: userData.role === 'admin',
        // userType: 'customer'
    };

    setUser(userWithId);

   
    const token = userData.token;

    if (rememberMe) {
        localStorage.setItem('user', JSON.stringify(userWithId));
        localStorage.setItem('authToken', token);       
        sessionStorage.removeItem('user');
        sessionStorage.removeItem('authToken');         
    } else {
        sessionStorage.setItem('user', JSON.stringify(userWithId));
        sessionStorage.setItem('authToken', token);     
        localStorage.removeItem('user');
        localStorage.removeItem('authToken');           
        if (!userWithId.isAdmin) {
            startInactivityTimer();
        }
    }

    if (userWithId.isAdmin) {
        clearInactivityTimer();
    }

    const redirectPath = sessionStorage.getItem('loginRedirect');
    if (redirectPath) {
        sessionStorage.removeItem('loginRedirect');
        window.location.href = redirectPath;
    }
};

    const loginEmployee = (employeeData, rememberMe = false) => {
        const employeeWithType = {
            ...employeeData,
            userType: 'employee',
            loginTime: new Date().toISOString()
        };
        
        setEmployeeUser(employeeWithType);
        localStorage.setItem('employeeUser', JSON.stringify(employeeWithType));
        
        // Close login modal
        closeLogin();
        
        // Handle redirect for employees
        const redirectPath = sessionStorage.getItem('loginRedirect');
        if (redirectPath) {
            sessionStorage.removeItem('loginRedirect');
            window.location.href = redirectPath;
        }
    };

    // const logoutUser = () => {
    //     console.log('Logging out due to inactivity');
    //     setUser(null);
    //     localStorage.removeItem('user');
    //     sessionStorage.removeItem('user');
    //     localStorage.removeItem('cartItems');
    //     clearInactivityTimer();
    // };

    const logoutUser = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');       
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('authToken');     
    localStorage.removeItem('cartItems');
    clearInactivityTimer();
};

    const logoutEmployee = () => {
        console.log('Logging out employee');
        setEmployeeUser(null);
        localStorage.removeItem('employeeUser');
    };

    const startInactivityTimer = () => {
        clearInactivityTimer();
        inactivityTimer.current = setTimeout(() => {
            if (Date.now() - lastActivityTime.current >= INACTIVITY_TIMEOUT) {
                logoutUser();
            }
        }, INACTIVITY_TIMEOUT);
    };

    const clearInactivityTimer = () => {
        if (inactivityTimer.current) {
            clearTimeout(inactivityTimer.current);
            inactivityTimer.current = null;
        }
    };

    const handleUserActivity = () => {
        // console.log('User activity detected at', new Date().toISOString());
        lastActivityTime.current = Date.now();
        if (user && !localStorage.getItem('user')) {
            startInactivityTimer();
        }
    };

    useEffect(() => {
        // Set up activity listeners
        const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];
        events.forEach(event => {
            window.addEventListener(event, handleUserActivity, { passive: true });
        });

        // Initialize timer if needed
        if (user && !localStorage.getItem('user')) {
            startInactivityTimer();
        }

        return () => {
            events.forEach(event => {
                window.removeEventListener(event, handleUserActivity);
            });
            clearInactivityTimer();
        };
    }, [user]);

    // Check for existing user on initial load
    useEffect(() => {
        const savedUser = localStorage.getItem('user') || sessionStorage.getItem('user');
        if (savedUser) {
            const parsedUser = JSON.parse(savedUser);
            setUser(parsedUser);
        }

        const savedEmployee = localStorage.getItem('employeeUser');
        if (savedEmployee) {
            setEmployeeUser(JSON.parse(savedEmployee));
        }
    }, []);

    const isAdmin = () => user?.role === 'admin';
    const isEmployee = () => !!employeeUser;




    // Add this to your existing LoginContext
const openEmployeeLogin = (mode = 'login') => {
    setLoginType('employee');
    setLoginMode(mode);
    setIsLoginOpen(true);
};

    return (
        <LoginContext.Provider value={{
            isLoginOpen, toggleLogin, closeLogin, openLogin, openEmployeeLogin,
            loginUser, logoutUser, user, loginMode, isAdmin,
            loginEmployee, logoutEmployee, employeeUser, isEmployee,
            loginType, setLoginType
        }}>
            {children}
        </LoginContext.Provider>
    );
};

export const useLogin = () => {
    const context = useContext(LoginContext);
    if (!context) {
        throw new Error('useLogin must be used within a LoginProvider');
    }
    return context;
};



export const useAuth = () => {
    const context = useContext(LoginContext);
    if (!context) {
        throw new Error('useAuth must be used within a LoginProvider');
    }


    const getToken = () => {
        return localStorage.getItem('authToken') 
            || sessionStorage.getItem('authToken') 
            || null;
    };

    // Protected API calls ready-made headers
    const getAuthHeaders = () => ({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`
    });

    return {
        ...context,
        getToken,
        getAuthHeaders,
    };
};