// import { useEffect } from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';
// import { useLogin } from './LoginContext';

// export const AdminAuthWrapper = ({ children }) => {
//     const { user, isAdmin } = useLogin();
//     const navigate = useNavigate();
//     const location = useLocation();

//     // useEffect(() => {
//     //     if (!user || !isAdmin) {
//     //         navigate('/adminLogin', {
//     //             state: { from: location.pathname },
//     //             replace: true
//     //         });
//     //     }
//     // }, [user, isAdmin, navigate, location]);


//     useEffect(() => {
//         // Only redirect if not on login page and not authenticated as admin
//         if (location.pathname !== '/adminLogin' && (!user || !isAdmin)) {
//             navigate('/adminLogin', {
//                 state: { from: location.pathname },
//                 replace: true
//             });
//         }
//     }, [user, isAdmin, navigate, location]);


//     return children;
// };



import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLogin } from './LoginContext';

export const AdminAuthWrapper = ({ children }) => {
    const { user, isAdmin } = useLogin();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        // This is just an additional safety check
        if (location.pathname.startsWith('/admin') && (!user || !isAdmin)) {
            navigate('/adminLogin', {
                state: { from: location.pathname },
                replace: true
            });
        }
    }, [user, isAdmin, navigate, location]);

    return children;
};