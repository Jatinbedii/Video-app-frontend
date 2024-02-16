"use client";
import axios from "axios";
import Link from "next/link";
import React, { useEffect, useState } from "react";

function Navbar() {
  const [user, setuser] = useState();
  async function getuserinfo() {
    const res = await axios("http://localhost:3001/api/user", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
      },
    });
    if (res.data.error) {
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
    <div className="w-full bg-yellow-400">
      <div className="flex justify-between">
        <div>Video</div>
        <div>
          {user ? (
            <div>{user.username}</div>
          ) : (
            <Link href={"/login"}>
              {" "}
              <div>Login</div>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default Navbar;
