"use client";
import { BiSolidSend } from "react-icons/bi";
import React, { useEffect, useState } from "react";
import { BsEyeFill } from "react-icons/bs";
import { AiFillLike, AiOutlineLike } from "react-icons/ai";
import { useUserContext } from "@/app/context/UserContext";
import axios from "axios";
import { FaRegComment } from "react-icons/fa";
import { Dialog, DialogContent, DialogTrigger } from "@radix-ui/react-dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

function Short(props) {
  const { user, setuser } = useUserContext();
  const [isLiked, SetIsLiked] = useState(false);
  const [NoOfLikes, setNoOfLikes] = useState();
  const [comments, setComments] = useState();

  const [comment, setcomment] = useState("");
  async function SubmitComment(e) {
    e.preventDefault();
    if (!localStorage.getItem("jwt")) {
      return router.push("/login");
    }
    const res = await axios.post(
      "http://localhost:3001/api/shorts/comment",
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
    }
  }
  async function Likehandler(e) {
    e.preventDefault();
    if (!localStorage.getItem("jwt")) {
      return router.push("/login");
    }

    const res = await axios.post(
      "http://localhost:3001/api/shorts/like",
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
      <video
        className=" w-full h-full object-cover"
        src={props.short.url}
        style={{ objectFit: "contain" }}
      ></video>
      <div className="absolute bottom-3 left-1 text-white">
        <div>
          {props.users.map((eachuser) => {
            if (eachuser._id == props.short.createdBy) {
              return (
                <div className="flex flex-row gap-2" key={eachuser._id}>
                  <img
                    src={eachuser.profile}
                    height={30}
                    width={30}
                    className="rounded-full"
                  />
                  <div className="text-gray-300 font-medium">
                    {eachuser.username}
                  </div>
                </div>
              );
            }
          })}
        </div>

        <div className="font-semibold">{props.short.title}</div>
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
