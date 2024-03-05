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
import Image from "next/image";
import { MdLogout } from "react-icons/md";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import Link from "next/link";
import { FaUserEdit } from "react-icons/fa";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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
      .post(`${process.env.NEXT_PUBLIC_BACKEND}/api/login`, {
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
    const res = await axios(`${process.env.NEXT_PUBLIC_BACKEND}/api/user`, {
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
    <div className="w-full bg-black">
      <div className="flex justify-between pr-1 pl-1 md:pr-0 md:pl-0 md:justify-around pt-2">
        <div className="text-[#99cc33] mt-1 font-bold text-3xl flex flex-row gap-1 hover:text-[#7ca529]">
          <a href={"/"}>MP4</a>
          <Image
            src="/logo.png"
            width={30}
            className="max-h-[32px]"
            height={30}
            alt="logo"
          />
        </div>

        <div>
          {user ? (
            <div>
              <Sheet>
                <SheetTrigger>
                  <img
                    src={user.profile}
                    width={"40px"}
                    className="rounded-full"
                  />
                </SheetTrigger>
                <SheetContent className="bg-[#333333]">
                  <SheetHeader>
                    <SheetTitle className="w-full text-[#99cc33] text-center">
                      {user.username}
                    </SheetTitle>
                    <SheetDescription></SheetDescription>
                  </SheetHeader>
                  <div className="w-full">
                    <img
                      src={user.profile}
                      className="max-w-[100px] rounded-full mx-auto"
                    />
                    <div className="w-full text-center pt-2 text-gray-400">
                      {user.email}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <a href={`/golive`} className="w-fit mx-auto">
                      <Button className="bg-red-600">Go Live !</Button>
                    </a>

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Link href={`/user/${user._id}`}>
                            {" "}
                            <Button className="bg-[#7ca529] w-fit mx-auto">
                              <FaUserEdit />
                            </Button>
                          </Link>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Profile : Edit data or upload videos</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Button
                            onClick={LogoutHandler}
                            className="bg-red-800 text-white w-fit mx-auto"
                          >
                            <MdLogout />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Log out</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          ) : (
            <div>
              <Sheet>
                <SheetTrigger>
                  <span className="text-white font-semibold text-md hover:text-[#99cc33]">
                    LOGIN
                  </span>
                </SheetTrigger>
                <SheetContent className={"bg-[#333333]"}>
                  <SheetHeader>
                    <SheetTitle>
                      <span className="text-[#99cc33]">Login</span>
                    </SheetTitle>
                    <SheetDescription></SheetDescription>
                  </SheetHeader>
                  <form onSubmit={handleSubmit}>
                    <div>
                      <label
                        htmlFor="username"
                        className="text-white font-semibold"
                      >
                        Username
                      </label>
                      <input
                        type="text"
                        id="username"
                        value={username}
                        className="rounded-md ml-1"
                        onChange={(e) => setUsername(e.target.value)}
                      />
                    </div>

                    <div className="pt-2">
                      <label
                        htmlFor="password"
                        className="text-white font-semibold"
                      >
                        Password
                      </label>
                      <input
                        className="rounded-lg ml-2"
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>
                    {error ? (
                      <div className="w-full flex justify-center mt-2">
                        <span className="bg-red-600 text-white pr-2 pl-2 rounded">
                          {error}
                        </span>
                      </div>
                    ) : (
                      <div></div>
                    )}
                    <div className="w-full  flex justify-center mt-3">
                      <Button className="bg-[#7ca529] mx-auto" type="submit">
                        Login
                      </Button>
                    </div>

                    <div className="mt-3 text-[#99cc33]">
                      <span className="text-white">New User?</span>
                      <a href={"/register"}> Create Account</a>
                    </div>
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
