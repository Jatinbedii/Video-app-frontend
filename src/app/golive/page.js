"use client";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/components/ui/use-toast";
import { io } from "socket.io-client";
import axios from "axios";
function page() {
  const [socket, setsocket] = useState();
  const [islive, setisLive] = useState(false);
  const [userdetails, setuserdetails] = useState();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const { toast } = useToast();
  const router = useRouter();

  async function sendFrame() {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    const canvasContext = canvas.getContext("2d");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    canvasContext.drawImage(video, 0, 0, canvas.width, canvas.height);

    const CompressedSize = canvas.toDataURL("image/jpeg", 0.5);

    socket.emit("videoframe", { frame: CompressedSize, room: userdetails._id });
  }
  async function getuserDetails() {
    const res = await axios(`${process.env.NEXT_PUBLIC_BACKEND}/api/user`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
      },
    });
    if (res.data.error) {
      return router.push("/");
    }
    setuserdetails(res.data);
  }
  useEffect(() => {
    if (!localStorage.getItem("jwt")) {
      return router.push("/");
    }
    getuserDetails();
  }, []);
  useEffect(() => {
    let intervalid;
    if (socket) {
      socket.on("getuserid", () => {
        socket.emit("getuserid", { userID: userdetails._id });
      });
      socket.on("joinedroom", () => {
        setisLive(true);
        intervalid = setInterval(sendFrame, 100);
      });
    }
    return () => {
      if (intervalid) {
        clearInterval(intervalid);
      }
    };
  }, [socket]);

  useEffect(() => {
    return () => {
      if (socket) {
        socket.disconnect();
      }
      setisLive(false);
    };
  }, []);
  async function startlive() {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((res) => {
        videoRef.current.srcObject = res;
        const mysocket = io(`${process.env.NEXT_PUBLIC_BACKEND}`);
        setsocket(mysocket);
      })
      .catch((err) =>
        toast({
          title: "Permission Required",
          description: "Please Grant Camera Permission",
        })
      );
  }
  return (
    <div>
      <div className="w-full mt-7 flex justify-center">
        <button
          className="text-center bg-red-500 p-3 w-fit h-fit rounded-3xl text-white hover:bg-red-700"
          onClick={startlive}
        >
          Start Live Stream
        </button>
      </div>

      {videoRef ? (
        <div>
          <div className="w-full">
            <video
              ref={videoRef}
              className="mx-auto mt-3 rounded-lg border-white border-2 max-w-full"
              autoPlay
              playsInline
            />
          </div>
          <div>
            <div className="w-full text-center text-gray-400 pt-2 pb-1">
              Status
            </div>
            {islive ? (
              <div className="w-full flex justify-center ">
                <span className="pr-2 text-white ">You are Live</span>
                <div className="h-[20px] w-[20px] bg-green-500 rounded-full"></div>
              </div>
            ) : (
              <div className="w-full flex justify-center">
                <span className=" text-white  pr-2">Not Broadcasting</span>
                <div className="h-[20px] w-[20px] bg-red-500 rounded-full"></div>
              </div>
            )}
          </div>
          <canvas ref={canvasRef} style={{ display: "none" }} />
        </div>
      ) : (
        <div></div>
      )}

      <Toaster />
    </div>
  );
}

export default page;
