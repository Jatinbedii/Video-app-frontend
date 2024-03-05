"use client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useUserContext } from "@/app/context/UserContext";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { IoMdSend } from "react-icons/io";
import { io } from "socket.io-client";
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";
function page({ params }) {
  const { toast } = useToast();
  const { user, setuser } = useUserContext();
  const canvasref = useRef(null);
  const [isonline, setisOnline] = useState(false);
  const [chat, setchat] = useState([]);
  const [socket, setsocket] = useState();
  const [mychat, setmychat] = useState("");
  const [userdetails, setuserdetails] = useState();
  function sendMessageHandler() {
    if (!isonline) {
      return toast({
        title: "Streamer is Offline",
        description: "You cannot send chat when streamer is offline",
      });
    }
    if (!user) {
      return toast({
        title: "Login Required",
        description: "Login Required to comment here",
      });
    }

    if (!mychat) {
      return;
    }
    socket.emit("sendchat", {
      user: user.username,
      message: mychat,
      room: params.id,
    });
  }
  function drawframe(frame) {
    const canvas = canvasref.current;
    if (canvas != null) {
      const ctx = canvas.getContext("2d");

      const video = new Image();
      video.onload = () => {
        canvas.width = video.width;
        canvas.height = video.height;
        ctx.drawImage(video, 0, 0);
      };
      video.src = frame;
    }
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

    socket?.on("MESSAGE", ({ room, user, message }) => {
      if (room == params.id) {
        setchat((prevChat) => [{ user, message }, ...prevChat]);
      }
    });
  }, [socket]);
  useEffect(() => {
    getuser();
  }, []);
  return (
    <div>
      <div>
        <Toaster />
        {isonline ? (
          <div>
            <div className="flex justify-center mt-6 max-w-full">
              <canvas
                ref={canvasref}
                className="rounded-lg border-2 border-white max-w-full"
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
          <div className=" text-xl text-center w-full mt-2 mb-2 font-medium text-gray-300 ">
            Live Chat
          </div>
          <div>
            {chat ? (
              <div className="w-full">
                <ScrollArea className="h-[400px] max-w-[400px] rounded-md border overflow-auto mx-auto">
                  {chat ? (
                    <div>
                      {chat.map((singlechat) => {
                        return (
                          <div>
                            <div className="flex row gap-1 pl-1 pt-2 bg-[#1f1f1f] m-2 p-1 rounded-md max-w-[400px] mx-auto">
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
          <div className="mt-3">
            <div className="w-full flex justify-center pt-3 pb-5">
              <input
                value={mychat}
                onChange={(e) => setmychat(e.target.value)}
                placeholder="Live Chat"
                className="rounded-lg border-4 border-[#72a529] md:w-[350px] lg:w-[400px]"
                type="text"
              />
              <IoMdSend
                onClick={sendMessageHandler}
                className="text-[#99cc33] text-3xl"
              />
            </div>
          </div>
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
}

export default page;
