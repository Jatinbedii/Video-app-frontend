"use client";
import { Button } from "@/components/ui/button";

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
    <div className=" bg-[#333333]">
      <div class="bg-[#333333] flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
        <div class="sm:mx-auto sm:w-full sm:max-w-sm">
          <img class="mx-auto h-10 w-auto" src="/logo.png" alt="Your Company" />
          <h2 class="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-[#99cc33]">
            Create a new Account
          </h2>
        </div>

        <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form
            onSubmit={handleSubmit}
            class="w-fit mx-auto space-y-6"
            action="#"
            method="POST"
          >
            <div>
              <label htmlFor="username" className="text-white">
                Username
              </label>
              <input
                type="text"
                id="username"
                className="rounded-lg ml-1"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="email" className="text-white">
                Email
              </label>
              <input
                className="rounded-lg ml-1"
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="text-white">
                Password
              </label>
              <input
                className="rounded-lg ml-1"
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {error ? (
              <div className="w-full">
                <div className="bg-red-500 text-white p-1 rounded-lg w-fit mx-auto">
                  {error}
                </div>
              </div>
            ) : (
              <div></div>
            )}
            <div className="w-full text-center">
              <Button type="submit" className="bg-[#7CA529] text-white">
                Register
              </Button>
            </div>
          </form>

          <p class="mt-10 text-center text-sm text-white">
            Already a User?
            <a
              href="/"
              class="font-semibold leading-6 text-[#99cc33] hover:text-[#7ca529]"
            >
              Go to Home
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default RegistrationPage;
