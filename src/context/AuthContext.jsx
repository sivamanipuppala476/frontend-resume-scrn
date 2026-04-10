import { createContext, useContext, useReducer, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: true,
  error: null
};

function authReducer(state, action) {
  switch (action.type) {
    case 'AUTH_INIT':
      return { ...state, loading: true };
    case 'AUTH_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        loading: false,
        error: null
      };
    case 'AUTH_FAILURE':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
        error: action.payload
      };
    case 'AUTH_LOGOUT':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
        error: null
      };
    case 'AUTH_LOADED':
      return { ...state, loading: false };
    case 'UPDATE_USER':
      return { ...state, user: { ...state.user, ...action.payload } };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    default:
      return state;
  }
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check for saved session on mount
  useEffect(() => {
    const savedToken = localStorage.getItem('hireflow_token');
    const savedUser = localStorage.getItem('hireflow_user');
    if (savedToken && savedUser) {
      try {
        dispatch({
          type: 'AUTH_SUCCESS',
          payload: { user: JSON.parse(savedUser), token: savedToken }
        });
      } catch {
        localStorage.removeItem('hireflow_token');
        localStorage.removeItem('hireflow_user');
        dispatch({ type: 'AUTH_LOADED' });
      }
    } else {
      dispatch({ type: 'AUTH_LOADED' });
    }
  }, []);

  const login = async (email, password) => {
    dispatch({ type: 'AUTH_INIT' });
    try {
      const result = await authAPI.login(email, password);
      localStorage.setItem('hireflow_token', result.token);
      localStorage.setItem('hireflow_user', JSON.stringify(result.user));
      dispatch({ type: 'AUTH_SUCCESS', payload: result });
      return result;
    } catch (error) {
      dispatch({ type: 'AUTH_FAILURE', payload: error.message });
      throw error;
    }
  };

  const register = async (userData) => {
    dispatch({ type: 'AUTH_INIT' });
    try {
      const result = await authAPI.register(userData);
      localStorage.setItem('hireflow_token', result.token);
      localStorage.setItem('hireflow_user', JSON.stringify(result.user));
      dispatch({ type: 'AUTH_SUCCESS', payload: result });
      return result;
    } catch (error) {
      dispatch({ type: 'AUTH_FAILURE', payload: error.message });
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('hireflow_token');
    localStorage.removeItem('hireflow_user');
    dispatch({ type: 'AUTH_LOGOUT' });
  };

  const updateUser = (updates) => {
    const updatedUser = { ...state.user, ...updates };
    localStorage.setItem('hireflow_user', JSON.stringify(updatedUser));
    dispatch({ type: 'UPDATE_USER', payload: updates });
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  return (
    <AuthContext.Provider value={{
      ...state,
      login,
      register,
      logout,
      updateUser,
      clearError
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}

export default AuthContext;
