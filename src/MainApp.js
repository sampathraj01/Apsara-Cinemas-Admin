// MainApp.js
import { useEffect, useContext } from 'react';
import { setupInterceptors } from 'utils/axios';
import Routes from 'routes'; // You can optimize routing if needed


import JWTContext from 'contexts/JWTContext'; // JWT Context

const MainApp = () => {
  const { logout } = useContext(JWTContext);

  // Set up interceptors once when the app loads
  useEffect(() => {
    if (logout) {
      setupInterceptors(logout);
    }
  }, [logout]);

  return (
    <>
        <Routes /> {/* Routes  only  used once here */}
    </>
  );
};

export default MainApp;
