// App.js
import { useState, useEffect } from 'react';
import ThemeCustomization from 'themes';
import RTLLayout from 'ui-component/RTLLayout';
import Locales from 'ui-component/Locales';
import NavigationScroll from 'layout/NavigationScroll';
import Loader from 'ui-component/Loader';
import { dispatch } from 'store';
import { getMenu } from 'store/slices/menu';

import Notistack from 'ui-component/third-party/Notistack';
import NetworkListener from 'Networkconnection';

import { JWTProvider as AuthProvider } from 'contexts/JWTContext';
import MainApp from './MainApp'; // ✅ is a component which contains Routes and the jwttoken checker.
import Snackbar from 'ui-component/extended/Snackbar';

const App = () => {
  const [loading, setLoading] = useState(false);

  // Fetch menus once, when app starts
  useEffect(() => {
    dispatch(getMenu()).then(() => {
      setLoading(true);
    });
  }, []);

  if (!loading) return <Loader />;

  return (
    <ThemeCustomization>
      <RTLLayout>
        <Locales>
          <NavigationScroll>
            {/* Wrap everything inside the AuthProvider only once */}
            <AuthProvider>
              <>
              <Notistack>
              <NetworkListener/>
              <MainApp /> {/*Routes is in the mainapp- */}
              <Snackbar />
              </Notistack> 
              </>
            </AuthProvider>
          </NavigationScroll>
        </Locales>
      </RTLLayout>
    </ThemeCustomization>
  );
};

export default App;
