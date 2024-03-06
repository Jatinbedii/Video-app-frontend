"use client";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/components/ui/use-toast";
import { io } from "socket.io-client";
import axios from "axios";
import { ScrollArea } from "@/components/ui/scroll-area";
function page() {
  const [socket, setsocket] = useState();
  const [chat, setchat] = useState([]);
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

    const CompressedSize = canvas.toDataURL("image/jpeg", 0.3);

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
        intervalid = setInterval(sendFrame, 300);
      });
      socket.on("MESSAGE", ({ user, message }) => {
        setchat((prevChat) => [{ user, message }, ...prevChat]);
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
      <div className="w-full mt-2 flex justify-center bg-[#222222]">
        {islive ? (
          <a href="/">
            <button className="text-center bg-[#99cc33] p-3 w-fit h-fit rounded-3xl text-green-900 hover:bg-green-700 ">
              Finish Live Stream
            </button>
          </a>
        ) : (
          <button
            className="text-center bg-red-500 p-3 w-fit h-fit rounded-3xl text-white hover:bg-red-700"
            onClick={startlive}
          >
            Start Live Stream
          </button>
        )}
      </div>
      <div className="w-full h-[20px] bg-[#222222] rounded-b-3xl"></div>

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
            <div className="w-full flex justify-center mt-1 mb-1 ">
              <div className="bg-[#111111] w-fit pr-4 pl-4 rounded-3xl">
                <div className="w-full text-center text-gray-400 pt-1 pb-1">
                  Status
                </div>
                {islive ? (
                  <div className="w-full">
                    <div className="w-full flex justify-center ">
                      <span className="pr-2 text-white ">You are Live</span>
                      <div className="h-[20px] w-[20px] bg-green-500 rounded-full"></div>
                    </div>
                  </div>
                ) : (
                  <div className="w-full flex justify-center">
                    <span className=" text-white  pr-2">Not Broadcasting</span>
                    <div className="h-[20px] w-[20px] bg-red-500 rounded-full"></div>
                  </div>
                )}
              </div>
            </div>
          </div>
          <canvas ref={canvasRef} style={{ display: "none" }} />
          <div className="bg-[#222222] h-[25px] rounded-t-3xl"></div>
          <div className="bg-[#222222]">
            <div className=" text-xl text-center w-full pt-2 mb-2 font-medium text-gray-300 ">
              Live Chat
            </div>
            <div>
              {chat ? (
                <div className="w-full">
                  <ScrollArea className="h-[400px] max-w-[400px] rounded-md border bg-[#1f1f1f1] overflow-auto mx-auto">
                    {chat ? (
                      <div>
                        {chat.map((singlechat) => {
                          return (
                            <div>
                              <div className="flex row gap-1 pl-1 pt-2 bg-[#0f0f0f] m-2 p-1 rounded-md max-w-[400px] mx-auto">
                                <div className="text-[#99cc33] text-base font-semibold pt-2">
                                  {singlechat.user}
                                </div>
                                <div className="pt-2.5 text-gray-300 text-sm">
                                  {singlechat.message}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div></div>
                    )}
                  </ScrollArea>
                </div>
              ) : (
                <div></div>
              )}
            </div>
          </div>
          <div className="bg-[#222222] h-[25px] rounded-b-3xl"></div>
        </div>
      ) : (
        <div></div>
      )}

      <Toaster />
    </div>
  );
}

export default page;
