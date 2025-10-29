// import React,{useState} from 'react';
// import { useLogin } from './LoginContext';
// import LoginPageMain from './C1LoginMain';
// import LoginPortal from './LoginPortal';
// import '../components/MainLayout.css';
// export const MainLayout = ({ children, onClose }) => {
//     // const { closeLogin,  } = useLogin();
//        const { isLoginOpen, closeLogin, loginMode} = useLogin();
    
//      const handleClose = () => {
//         closeLogin();
//       //  if (onClose) onClose(); // Call the additional close handler if provided
//     };

    
//        return (
//         <div className={`main-layout ${isLoginOpen ? 'login-open' : ''}`}>
//             {children}
//             <LoginPortal isOpen={isLoginOpen}>
//                 <LoginPageMain onClose={handleClose} loginMode={loginMode} />
//             </LoginPortal>
//         </div>
//     );
// };







import React from 'react';
import { useLogin } from './LoginContext';
import LoginPageMain from './C1LoginMain';
import LoginPortal from './LoginPortal';
import './MainLayout.css';

export const MainLayout = ({ children, onClose }) => {
    const { isLoginOpen, closeLogin, loginMode, loginType } = useLogin();
    
    const handleClose = () => {
        closeLogin();
    };

    return (
        <div className={`main-layout ${isLoginOpen ? 'login-open' : ''}`}>
            {children}
            <LoginPortal isOpen={isLoginOpen}>
                <LoginPageMain onClose={handleClose} loginMode={loginMode} />
            </LoginPortal>
        </div>
    );
};