/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Login from "./Login";
import Signup from "./Signup";
import PublicShortener from "./PublicShortener";
import { BASE_API_URL } from '../utils/constants';

const AuthRouter = ({ type }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch(`${BASE_API_URL}/api/auth/check-auth`, {
          credentials: "include",
        });

        const data = await res.json();

        if (res.ok && data.user) {
          setIsLoggedIn(true);
          navigate("/dashboard");
        } else {
          setIsLoggedIn(false);
        }
      } catch (err) {
        console.error("Auth check failed:", err);
        setIsLoggedIn(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [navigate]);

  if (loading) return <div className="text-center mt-10">Loading...</div>;

  if (type === "login") return <Login />;
  if (type === "signup") return <Signup />;
  return <PublicShortener />;
};

export default AuthRouter;
