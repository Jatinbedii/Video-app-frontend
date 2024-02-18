"use client";
import { useUserContext } from "@/app/context/UserContext";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
function Navbar() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { user, setuser } = useUserContext();
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
          getuserinfo();
          router.push("/");
        } else {
          console.log(setError(res.data.error));
        }
      })
      .catch((err) => console.log(err));
  };

  async function LogoutHandler() {
    localStorage.removeItem("jwt");
    setuser(null);
  }
  async function getuserinfo() {
    const res = await axios("http://localhost:3001/api/user", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
      },
    });
    if (res.data.error) {
      localStorage.removeItem("jwt");
    } else {
      setuser(res.data);
    }
  }
  useEffect(() => {
    if (localStorage.getItem("jwt")) {
      getuserinfo();
    }
  }, []);
  return (
    <div className="w-full bg-[#333333]">
      <div className="flex justify-around">
        <div>Video</div>
        <div>
          {user ? (
            <div>
              <Sheet>
                <SheetTrigger>{user.username}</SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>{user.username}</SheetTitle>
                    <SheetDescription></SheetDescription>
                  </SheetHeader>
                  <Button onClick={LogoutHandler}>Logout</Button>
                </SheetContent>
              </Sheet>
            </div>
          ) : (
            <div>
              <Sheet>
                <SheetTrigger>Login</SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Login</SheetTitle>
                    <SheetDescription></SheetDescription>
                  </SheetHeader>
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
                </SheetContent>
              </Sheet>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Navbar;
