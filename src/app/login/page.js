"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";

function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    if (!username || !password) {
      setError("fill all the fields");
      return;
    }

    axios
      .post("http://localhost:3001/api/login", {
        username,
        password,
      })
      .then((res) => {
        if (res.status == 201) {
          localStorage.setItem("jwt", res.data.jwt);
          router.push("/");
        } else {
          console.log(setError(res.data.error));
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <div>
      <h2>Login</h2>
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
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {error ? <div>{error}</div> : <div></div>}
        <Button className="bg-slate-600" type="submit">
          Login
        </Button>
      </form>
    </div>
  );
}

export default LoginPage;
