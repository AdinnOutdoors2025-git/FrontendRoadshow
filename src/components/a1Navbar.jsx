import React, { useState, useEffect, useRef } from 'react'
import './a1Navbar.css'
import { useNavigate } from 'react-router-dom';
import { useLogin } from '../Authentication/LoginContext';
import BottomNavMenu from './BottomNavMenu';

// Stand-alone navigate placeholder (removed dependency)
const navigate = (path) => console.log(`Navigating to: ${path}`);

function Navbar() {
    const navigate = useNavigate();
    const [isMenuOpen, setMenuOpen] = useState(false);
    const toggleMenu = () => { setMenuOpen(!isMenuOpen); };
    
    const [isOpen, setIsOpen] = useState(false);
    const { openLogin, closeLogin, isLoginOpen, user, logoutUser, employeeUser, logoutEmployee } = useLogin();
    
    const [isMobile, setIsMobile] = useState(window.innerWidth < 480);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 480);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            if (isOpen) {
                setIsOpen(false);
            }
            if (isMenuOpen && isMobile) {
                setMenuOpen(false);
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [isOpen, isMenuOpen, isMobile]);

    const toggleNavOpen = () => {
        setIsOpen(!isOpen);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleEmployeeLogin = () => {
        if (employeeUser) {
            // If employee is already logged in, show logout option
            logoutEmployee();
            window.confirm('Employee logged out successfully!');
        } else {
            // Open employee login
            openLogin('login', 'employee');
        }
        setIsOpen(false);
    };

    const handleCustomerLogin = () => {
        if (user) {
            // If customer is logged in, show logout option
            logoutUser();
            window.confirm('Logged out successfully!');
        } else {
            // Show message that customer login is disabled
            alert('Customer login is currently disabled. Please contact administrator.');
        }
        setIsOpen(false);
    };

    const handleLogout = () => {
        if (employeeUser) {
            logoutEmployee();
            alert('Employee logged out successfully!');
        } else if (user) {
            logoutUser();
            alert('Logged out successfully!');
        } else {
            alert('No user is currently logged in.');
        }
        setIsOpen(false);
    };

    const isLoggedIn = employeeUser || user;

    return (
        <div>
            {/* ⚪ Desktop / Tablet Navbar */}
            <div className='rdshowNavMain container'>
                <div className='NavRoadShowLogo' onClick={() => navigate('/')}> 
                    <img src='/images/RoadShowLogo.png' className='NavRoadShowLogo' alt='Logo' /> 
                </div>

                <nav className="rdNavContentMain">
                    <ul>
                        <li className='rdNavContentInside' onClick={() => navigate('/')} style={{ cursor: 'pointer' }}> 
                            <img src='/images/NavbarIcon1.png' className='NavbarIcon1' alt='Home' /> 
                            <a>Home</a>
                        </li>
                        <li className="rdNavContentInside" onClick={() => navigate('/aboutUs')} style={{ cursor: 'pointer' }}>
                            <img src='/images/NavbarIcon2.png' className='NavbarIcon1' alt='About Us' />
                            <a>About Us</a>
                        </li>
                        <li className='rdNavContentInside' onClick={() => navigate('/')} style={{ cursor: 'pointer' }}> 
                            <img src='/images/NavbarIcon3.png' className='NavbarIcon1' alt='Projects' /> 
                            <a>Projects</a>
                        </li>
                    </ul>
                </nav>

                <div className='nav_container' ref={dropdownRef}>
                    <div className='NavbarIcon1 hamburger-icon'>
                        <img 
                            src='/images/NavbarIcon4Hamburger.png' 
                            className='NavbarIcon1' 
                            alt='Menu'
                            onClick={toggleNavOpen}
                        />

                        <div className={`nav_user-content ${isOpen ? 'open' : ''}`}>
                            <div className='navUserMain'>
                                <div className='navUserImg'> 
                                    <img src='/images/NavUserImg1.png' className='navUserImg' alt='Bookings' />
                                </div>
                                <div> My Bookings </div>
                            </div>
                            <div className='navUserMain'>
                                <div className='navUserImg'> 
                                    <img src='/images/NavUserImg2.png' className='navUserImg' alt='Profile' />
                                </div>
                                <div> Profile & Settings </div>
                            </div>

                            <div className='navUserMain' onClick={handleEmployeeLogin}>
                                <div className='navUserImg'> 
                                    <img src='/images/NavUserImg3.png' className='navUserImg' alt='Employee' />
                                </div>
                                <div> 
                                    {employeeUser ? (
                                        <>
                                            <div>Hello {employeeUser.userName}</div>
                                            <div>{employeeUser.email}</div>
                                        </>
                                    ) : 'Employee Log In / Sign Up'}
                                </div>
                            </div>
                            
                            {/* Customer Login/Logout */}
                            <div className='navUserMain' onClick={handleCustomerLogin}>
                                <div className='navUserImg'> 
                                    <img src='/images/NavUserImg4.png' className='navUserImg' alt='Login' />
                                </div>
                                <div> 
                                    {/* {user ? 'Log Out' : 'Log In / Sign Up'} 
                                    {user && <span style={{fontSize: '12px', color: 'green'}}> ✓</span>} */}
                                     {user ? (
                                        <>
                                            <div>Hello {user.userName}</div>
                                            <div>{user.userEmail}</div>
                                        </>
                                    ) : 'Customer Log In / Sign Up'}
                                </div>
                            </div>

                            {isLoggedIn && (
                                <div className='navUserMain' onClick={handleLogout}>
                                    <div className='navUserImg'> 
                                        <img src='/images/NavUserImg5.png' className='navUserImg' alt='Logout' />
                                    </div>
                                    <div style={{ color: '#ff4444', fontWeight: 'bold' }}>
                                        Log Out {employeeUser ? '(Employee)' : '(Customer)'}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* ⚪ Secondary Navigation */}
            <div className='rdshowNavMain1 container'>
                <div onClick={() => navigate('/vehicleTypes')} style={{ cursor: 'pointer' }}> Vehicle Types </div>
                <div onClick={() => navigate('/vehicleTypes')} style={{ cursor: 'pointer' }}> Packages </div>
                <div onClick={() => navigate('/vehicleTypes')} style={{ cursor: 'pointer' }}> Offers </div>
            </div>

            {/* 🟢 NEW: Mobile / Tablet Navbar */}
            <header className="mobile-navbar">
                {/* 🟢 NEW: Left Logo */}
                <div className="mobile-navbar-left" onClick={() => navigate('/')}>
                    <img src="/images/RoadShowLogo.png" alt="Logo" className="NavRoadShowLogo" />
                </div>

                {/* 🟢 NEW: Capsule Center */}
                <div className="mobile-navbar-center">
                    <div className="mobile-navbar-center-capsule">
                        <div onClick={() => navigate('/vehicleTypes')}>Vehicles</div>
                        <div onClick={() => navigate('/vehicleTypes')}>Packages</div>
                        <div onClick={() => navigate('/vehicleTypes')}>Offers</div>
                    </div>
                </div>

                {/* 🟢 NEW: Right Menu */}
                <div className="mobile-navbar-right" ref={dropdownRef}>
                    <img
                        src="/images/NavbarIcon4Hamburger.png"
                        alt="Menu"
                        className="NavbarIcon1"
                        onClick={() => setIsOpen(!isOpen)}
                    />
                    <div className={`nav_user-content ${isOpen ? 'open' : ''}`}>
                        <div className='navUserMain'>
                            <div className='navUserImg'> 
                                <img src='/images/NavUserImg1.png' className='navUserImg' alt='Bookings' />
                            </div>
                            <div>My Bookings</div>
                        </div>
                        <div className='navUserMain'>
                            <div className='navUserImg'> 
                                <img src='/images/NavUserImg2.png' className='navUserImg' alt='Profile' />
                            </div>
                            <div>Profile & Settings</div>
                        </div>
                        <div className='navUserMain' onClick={handleEmployeeLogin}>
                            <div className='navUserImg'> 
                                <img src='/images/NavUserImg3.png' className='navUserImg' alt='Employee' />
                            </div>
                            <div>{employeeUser ? `Hello ${employeeUser.userName}` : 'Employee Log In'}</div>
                        </div>
                        <div className='navUserMain' onClick={handleCustomerLogin}>
                            <div className='navUserImg'> 
                                <img src='/images/NavUserImg4.png' className='navUserImg' alt='Login' />
                            </div>
                            <div>{user ? `Hello ${user.userName}` : 'Customer Log In'}</div>
                        </div>
                        {isLoggedIn && (
                            <div className='navUserMain' onClick={handleLogout}>
                                <div className='navUserImg'> 
                                    <img src='/images/NavUserImg5.png' className='navUserImg' alt='Logout' />
                                </div>
                                <div style={{ color: '#ff4444', fontWeight: 'bold' }}>Log Out</div>
                            </div>
                        )}
                    </div>
                </div>
            </header>
             {/* Mobile Bottom Navigation */}
      <BottomNavMenu />
        </div>
    )
}

export default Navbar;
