import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../../firebase";
import { getDatabase, ref, child, get, set } from "firebase/database";
const Signup = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    await createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const db = getDatabase();
        console.log(userCredential.user);
        set(ref(db, "users/" + userCredential.user.uid + "/email"), email).then(
          () => {
            navigate("/");
          }
        );
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  return (
    <div style={{textAlign: 'center',paddingTop: '10vh'}}>
      <h1> Weather App Sign Up</h1>
      <form>
        <div>
          Email address
          <br></br>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Email address"
          />
        </div>

        <div>
          Password
          <br></br>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Password"
          />
        </div>
        <br></br>
        <button type="submit" onClick={onSubmit}>
          Sign up
        </button>
      </form>
      <br></br>
      <br></br>
      
      <NavLink to="/login">Sign in</NavLink>
    </div>
  );
};

export default Signup;
