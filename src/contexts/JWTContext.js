import PropTypes from 'prop-types';
import { createContext, useEffect, useReducer, useState } from 'react';
import jwtDecode from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

// reducer - state management
import { LOGIN, LOGOUT } from 'store/actions';
import accountReducer from 'store/accountReducer';

// project imports
import Loader from 'ui-component/Loader';
import axios from 'utils/axios';

const API_URL = process.env.REACT_APP_LOCAL_API_URL;

// initial state
const initialState = {
  isLoggedIn: false,
  isInitialized: false,
  user: null
};

// verify JWT token
const verifyToken = (token) => {
  if (!token) return false;
  const decoded = jwtDecode(token);
  return decoded.exp > Date.now() / 1000;
};

// set JWT token in Axios headers
const setSession = (token) => {
  if (token) {
    localStorage.setItem('jwttoken', token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    localStorage.removeItem('jwttoken');
    delete axios.defaults.headers.common['Authorization'];
  }
};

// create context
const JWTContext = createContext(null);

export const JWTProvider = ({ children }) => {
  const [state, dispatch] = useReducer(accountReducer, initialState);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // initialize auth state
  useEffect(() => {
    const init = async () => {
      try {
        const token = localStorage.getItem('jwttoken');
        console.log("dongonhognoasnoasifhnhoisansf,",token)
        if (token && verifyToken(token)) {
      console.log("tpkenfoundd")
          setSession(token);
          const decoded = jwtDecode(token);
          dispatch({
            type: LOGIN,
            payload: { isLoggedIn: true, user: decoded.email,userid: decoded.id }
          });
        } else {
            console.log("tpken_not_foundd")
          dispatch({ type: LOGOUT });
        }
      } catch (err) {
         console.log("Cathceroorr_foundd",err.message)
        dispatch({ type: LOGOUT });
      }
    };
    init();
  }, []);

  // login function
  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}login`, { email, password });
      const { token, userid } = response.data;
      console.log("JWTciuhdfiuhgsToken:", token);
      console.log("ussssss",userid)
      localStorage.setItem('userid', userid)
      setSession(token);
       dispatch({
         type: LOGIN,
         payload: { isLoggedIn: true, user: email,  }
       });
       navigate('/apsara-pages/category')
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Login failed';
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // logout function
  const logout = () => {
    setSession(null);
    dispatch({ type: LOGOUT });
    window.location.href = '/login';
  };

  // register function (optional)
  const register = async (email, password, firstName, lastName) => {
    await axios.post(`${API_URL}dev/register`, { email, password, firstName, lastName });
  };

  if (!state.isInitialized || loading) return <Loader />;

  return (
    <JWTContext.Provider value={{ ...state, login, logout, register }}>
      {children}
    </JWTContext.Provider>
  );
};

JWTProvider.propTypes = {
  children: PropTypes.node
};

export default JWTContext;


