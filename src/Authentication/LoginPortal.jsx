import React from 'react';
import { createPortal } from 'react-dom';
function LoginPortal({ children, isOpen }) {
    if (!isOpen) return null;
    
    return createPortal(
        <div className="login-overlay">
            {children}
        </div>,
        document.body
    );
}
export default LoginPortal;