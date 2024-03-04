"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { ClipLoader } from "react-spinners";

function LiveUsers() {
  const [loading, setloading] = useState(true);
  const [users, setusers] = useState([]);
  async function getusers() {
    const res = await axios(`${process.env.NEXT_PUBLIC_BACKEND}/api/users`);

    setusers(res.data.filter((obj) => obj.isLive == true));
    setloading(false);
  }
  useEffect(() => {
    getusers();
  }, []);
  return (
    <div>
      <div className="text-[#99cc33] text-xl md:text-2xl text-center w-full font-semibold">
        Live Channels
      </div>
      <div>
        {loading ? (
          <div className="w-full text-center">
            <ClipLoader
              color={"#ffffff"}
              loading={true}
              className="mt-10"
              size={50}
              aria-label="Loading Spinner"
              data-testid="loader"
            />
          </div>
        ) : (
          <div className="w-screen mt-3">
            {users.length > 0 ? (
              <div className="w-fit grid mx-auto gap-7 grid-cols-2 lg:grid-cols-4">
                {users.map((user) => {
                  return (
                    <a href={`/live/${user._id}`} key={user._id}>
                      <img
                        src={user.profile}
                        height={70}
                        width={70}
                        className="rounded-full border-4 border-red-500"
                      />
                      <div className="w-full text-center ">
                        {" "}
                        <span className="bg-red-500 w-fit pt-2 pr-2 pl-2 rounded-lg text-white text-xs pb-1">
                          LIVE
                        </span>
                      </div>

                      <div className="w-full text-center mt-1  text-white">
                        {user.username}
                      </div>
                    </a>
                  );
                })}
              </div>
            ) : (
              <div className="w-full text-center text-3xl md:text-6xl font-semibold text-gray-400 mt-[60px]">
                No channels are currently broadcasting
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default LiveUsers;
