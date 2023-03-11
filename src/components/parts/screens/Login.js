import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../../firebase";
import { NavLink, useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onLogin = (e) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        navigate("/");
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  return (
    <div style={{textAlign: 'center',paddingTop: '10vh'}}>
      <h1> Weather App Sign In</h1>
      <form>
        <div>
          Email address
          <br></br>
          <input
            type="email"
            required
            placeholder="Email address"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          Password
          <br></br>
          <input
            type="password"
            required
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <br></br>
        <div>
          <button onClick={onLogin}>Login</button>
        </div>
      </form>
      <br></br>
      <br></br>
      <NavLink to="/register">Sign up</NavLink>
    </div>
  );
};

export default Login;
