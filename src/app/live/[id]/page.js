"use client";
import axios from "axios";
import React, { useEffect, useReducer, useRef, useState } from "react";
import { io } from "socket.io-client";
function page({ params }) {
  const canvasref = useRef(null);
  const [isonline, setisOnline] = useState(false);
  const [socket, setsocket] = useState();

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

      <div>{}</div>
    </div>
  );
}

export default page;
