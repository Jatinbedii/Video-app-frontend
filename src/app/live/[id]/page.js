"use client";
import axios from "axios";
import React, { useEffect, useReducer, useRef, useState } from "react";
import { io } from "socket.io-client";
function page({ params }) {
  const canvasref = useRef(null);
  const [isonline, setisOnline] = useState(false);
  const [socket, setsocket] = useState();
  const [userdetails, setuserdetails] = useState();

  function drawframe(frame) {
    const canvas = canvasref.current;
    const ctx = canvas.getContext("2d");

    const video = new Image();
    video.onload = () => {
      canvas.width = video.width;
      canvas.height = video.height;
      ctx.drawImage(video, 0, 0);
    };
    video.src = frame;
  }
  async function getuser() {
    const { data } = await axios(
      `${process.env.NEXT_PUBLIC_BACKEND}/api/users`
    );
    for (let i = 0; i < data.length; i++) {
      if (data[i]._id == params.id) {
        setuserdetails(data[i]);
        if (data[i].isLive == true) {
          setisOnline(true);
        }
      }
    }
  }
  useEffect(() => {
    if (isonline) {
      const mysocket = io(`${process.env.NEXT_PUBLIC_BACKEND}`);
      mysocket.emit("joinRoomToWatchStream", { room: params.id });
      setsocket(mysocket);
    }
  }, [isonline]);

  useEffect(() => {
    socket?.on("frameRecieved", ({ frame }) => {
      drawframe(frame);
    });
  }, [socket]);
  useEffect(() => {
    getuser();
  }, []);
  return (
    <div>
      <div>
        {isonline ? (
          <div>
            <div className="flex justify-center mt-6">
              <canvas
                ref={canvasref}
                className="rounded-lg border-2 border-white "
              />
            </div>
          </div>
        ) : (
          <div>
            <div className="w-full flex justify-center mt-6">
              <div className=" max-w-screen w-[300px] h-[300px] bg-white rounded-lg border-2 border-black">
                <div className="flex flex-col ">
                  <div className="w-full text-center mt-10">:-/</div>
                  <div className="w-full text-center">Not Currently Live</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {userdetails ? (
        <div>
          <div className="w-full pl-2 mt-5 text-white text-2xl">
            {userdetails.username} 's Live Stream
          </div>
          <div className="bg-[#99cc33] w-fit ml-2 text-green-900 text-sm p-1 rounded-3xl">
            Broadcasting Live
          </div>

          <a
            className="flex flex-row gap-2 pl-1 mt-3 "
            href={`/user/${userdetails._id}`}
          >
            <img
              className="rounded-full"
              src={userdetails.profile}
              height={"40px"}
              width={"40px"}
            />
            <div className="text-white text-base font-medium pt-2 hover:text-[#99cc33]">
              {" "}
              {userdetails.username}
            </div>{" "}
            <div className="pt-2.5 text-gray-400 text-sm">(creator)</div>
          </a>
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
}

export default page;
