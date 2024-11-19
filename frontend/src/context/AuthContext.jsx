import React, { createContext, useState, useEffect } from "react";
import Cookies from 'js-cookie';
import getUserFromToken from "../components/utils/getUserFromToken";
export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({ isAuthenticated: false, user: null });
  const [loading, setLoading] = useState(true);


  const token = Cookies.get("jwt");
  const user = getUserFromToken()
  useEffect(() => {
    // fetchAuth();
    if (token && user) {
      setAuth({ isAuthenticated: true, user });
    } else {
      setAuth({ isAuthenticated: false, user: null });
    }
    setLoading(false);
  }, []);

  return (
    <AuthContext.Provider value={{ auth, setAuth,setLoading, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
