import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserDataContext } from "../context/UserContext.jsx";
import axios from "axios";

const UserProtectWrapper = ({ children }) => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const [ isLoading, setIsLoading ] = useState(true)
  const { setUser } = React.useContext(UserDataContext);

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }

    axios.get(`${import.meta.env.VITE_BASE_URL}/users/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => {
        if(response.status === 200){
            setUser(response.data.user)
            setIsLoading(false)
        }
    })
    .catch((error) => {
        console.error('Error fetching user profile:', error);
        localStorage.removeItem('token')
        navigate('/login')
    })
  }, [token, navigate]);



  return <>{children}</>;
};

export default UserProtectWrapper;
