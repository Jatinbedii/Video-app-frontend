"use client";
import Link from "next/link";
import { Toaster } from "@/components/ui/toaster";
import { BiSolidSend } from "react-icons/bi";
import React, { useEffect, useRef, useState } from "react";
import { BsEyeFill } from "react-icons/bs";
import { AiFillLike, AiOutlineLike } from "react-icons/ai";
import { useUserContext } from "@/app/context/UserContext";
import axios from "axios";
import { FaRegComment } from "react-icons/fa";
import { Dialog, DialogContent, DialogTrigger } from "@radix-ui/react-dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { InView } from "react-intersection-observer";
import { useToast } from "@/components/ui/use-toast";
function Short(props) {
  const { toast } = useToast();
  const videoref = useRef(null);
  const { user, setuser } = useUserContext();
  const [isLiked, SetIsLiked] = useState(false);
  const [NoOfLikes, setNoOfLikes] = useState();
  const [comments, setComments] = useState();
  const [playing, setplaying] = useState(false);
  async function increaseView() {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND}/api/shorts/increaseview`,
        {
          short: props.short._id,
        }
      );
    } catch (error) {
      console.log(error);
    }
  }
  function videoClickHandler() {
    if (playing == false) {
      setplaying(true);
      videoref.current.play();
    } else {
      setplaying(false);
      videoref.current.pause();
    }
  }
  const [comment, setcomment] = useState("");
  async function SubmitComment(e) {
    e.preventDefault();
    if (!comment) {
      return;
    }
    if (!localStorage.getItem("jwt")) {
      return toast({
        title: "Login Required",
        description: "Login Required to comment on this short",
      });
    }
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND}/api/shorts/comment`,
      {
        comment: comment,
        short: props.short._id,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
      }
    );

    if (res.status == 201) {
      setcomment("");
      setComments((prevcomments) => [
        { user: res.data.user, comment: res.data.comment },
        ...prevcomments,
      ]);
    } else {
      return toast({
        title: "Login Required",
        description: "Login Required to comment on this short",
      });
    }
  }
  async function Likehandler(e) {
    e.preventDefault();
    if (!localStorage.getItem("jwt")) {
      return toast({
        title: "Login Required",
        description: "Login Required to like this short",
      });
    }

    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND}/api/shorts/like`,
      {
        short: props.short._id,
      },

      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
      }
    );

    if (res.status == 201 && res.data.message == "liked") {
      SetIsLiked(true);
      setNoOfLikes(NoOfLikes + 1);
    } else if (res.status == 201) {
      SetIsLiked(false);
      setNoOfLikes(NoOfLikes - 1);
    } else {
      return toast({
        title: "Login Required",
        description: "Login Required to like this short",
      });
    }
  }
  useEffect(() => {
    setNoOfLikes(props.short.likes.length);
    if (user) {
      const index = props.short.likes.indexOf(user._id);
      if (index != -1) {
        SetIsLiked(true);
      }
    }

    setComments(props.short.comments);
  }, [props.short, user]);
  return (
    <div
      className="max-w-lg bg-black snap-start mx-auto relative"
      style={{ height: "calc(100vh - 93px)" }}
    >
      <Toaster />
      <video
        onClick={videoClickHandler}
        ref={videoref}
        className=" w-full h-full object-cover"
        src={props.short.url}
        style={{ objectFit: "contain" }}
      ></video>

      <div className="absolute bottom-3 left-1 text-white">
        <div>
          {props.users.map((eachuser) => {
            if (eachuser._id == props.short.createdBy) {
              return (
                <Link href={`/user/${eachuser._id}`}>
                  <div
                    className="flex flex-row gap-2 backdrop-blur-md w-fit pr-2   rounded-3xl"
                    key={eachuser._id}
                  >
                    <img
                      src={eachuser.profile}
                      height={30}
                      width={30}
                      className="rounded-full"
                    />
                    <div className="text-white mt-[3px] font-medium">
                      {eachuser.username}
                    </div>
                  </div>
                </Link>
              );
            }
          })}
        </div>
        <InView
          triggerOnce={false}
          onChange={(inView, entry) => {
            if (inView) {
              videoref.current.play();
              setplaying(true);
              increaseView();
            } else {
              videoref.current.pause();
              setplaying(false);
            }
          }}
        >
          <div className="font-semibold">{props.short.title}</div>
        </InView>
        <div>{props.short.description}</div>

        <div className=" flex flex-row gap-2">
          {props.short.views}
          <BsEyeFill />
        </div>
      </div>

      <div className="absolute text-white top-6 left-1">
        <div className="text-white text-3xl" onClick={Likehandler}>
          {isLiked ? <AiFillLike /> : <AiOutlineLike />}
          {NoOfLikes ? (
            <div className="pl-3 text-xl">{NoOfLikes}</div>
          ) : (
            <div className="pl-3 text-xl">0</div>
          )}
        </div>
        <div className="text-white text-3xl mt-4">
          <Dialog>
            <DialogTrigger>
              <FaRegComment />
            </DialogTrigger>
            <DialogContent className="h-[400px] max-w-full rounded-md bg-[#333333] border text-sm">
              <div>
                <div>
                  <ScrollArea className="mx-auto w-full h-[360px]">
                    {comments ? (
                      <div>
                        {comments.map((eachcomment) => {
                          return (
                            <div key={eachcomment._id}>
                              {props.users.map((eachuser) => {
                                if (eachuser._id == eachcomment.user) {
                                  return (
                                    <div className="flex flex-row gap-1 pt-1">
                                      <img
                                        src={eachuser.profile}
                                        height={20}
                                        width={20}
                                        className="rounded-full max-h-[20px]"
                                      />
                                      <div className="pr-1 font-medium text-gray-300">
                                        {eachuser.username}
                                      </div>
                                      <div>{eachcomment.comment}</div>
                                    </div>
                                  );
                                }
                              })}
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div></div>
                    )}
                  </ScrollArea>
                </div>
                <div className="mx-auto">
                  <input
                    className="text-black max-w-[250px] rounded-lg ml-1"
                    value={comment}
                    onChange={(e) => setcomment(e.target.value)}
                  />
                  <button onClick={SubmitComment} className="pl-1">
                    <BiSolidSend className="text-white  text-xl " />
                  </button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}

export default Short;
