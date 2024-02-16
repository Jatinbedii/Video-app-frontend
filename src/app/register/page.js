"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

function RegistrationPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    if (!username || !email || !password) {
      setError("fill all the fields");
      return;
    }

    axios
      .post("http://localhost:3001/api/register", {
        username,
        email,
        password,
      })
      .then((res) => {
        if (res.status == 201) {
          router.push("/login");
        } else {
          console.log(setError(res.data.error));
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <div>
      <h2>Registration</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {error ? <div>{error}</div> : <div></div>}
        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default RegistrationPage;
