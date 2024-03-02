"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import axios from "axios";
import changedate from "@/utils/ConvertDate";
export default function page({ params }) {
  const [allvideos, setallvideos] = useState();
  const [users, setusers] = useState(null);
  async function getVideos() {
    try {
      const res = await axios("http://localhost:3001/api/videos");
      setallvideos(res.data);
      console.log(res.data);
    } catch (error) {
      console.log(error);
    }
  }

  async function getUsers() {
    try {
      const res = await axios("http://localhost:3001/api/users");
      for (let i = 0; i < res.data.length; i++) {
        if (res.data[i]._id == params.id) {
          setusers(res.data[i]);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    getUsers();
  }, []);
  return (
    <div>
      {
        <div>
          {users ? (
            <div className="w-full pt-4">
              <div className=" pl-2 flex  flex-col md:pl-0 md:flex-row md:justify-around">
                <div>
                  <Image
                    className="rounded-full"
                    src={users.profile}
                    height={80}
                    width={80}
                    alt="image"
                  />
                </div>
                <div className="text-white font-medium text-2xl">
                  {users.username}{" "}
                  <span className="text-gray-400 text-base">(username)</span>
                </div>
              </div>
              <div className="pl-2 font-medium pt-2">
                <div className="text-white text-xl">About</div>
                <div className="text-sm text-gray-300">
                  Created on{" "}
                  <span className="text-gray-400 ">
                    {changedate(users.createdAt)}
                  </span>
                </div>
                <div className="text-sm text-gray-300">
                  Videos Posted <span className="text-gray-400 "></span>
                </div>
                <div className="text-sm text-gray-300">
                  Shorts Posted <span className="text-gray-400 "></span>
                </div>
              </div>
            </div>
          ) : (
            <div></div>
          )}
        </div>
      }
    </div>
  );
}
