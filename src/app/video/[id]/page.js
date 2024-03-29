"use client";
import Link from "next/link";

import ClipLoader from "react-spinners/ClipLoader";
import { FaShareSquare } from "react-icons/fa";
import { IoIosArrowDroprightCircle } from "react-icons/io";
import { AiOutlineLike } from "react-icons/ai";
import { useUserContext } from "@/app/context/UserContext";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { AiFillLike } from "react-icons/ai";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";
import changedate from "@/utils/ConvertDate";
function page({ params }) {
  const { toast } = useToast();
  const { user, setuser } = useUserContext();
  const [video, setvideo] = useState();
  const [mycomment, setmycomment] = useState("");
  const [isLiked, setisLiked] = useState(false);
  const [usersData, setusersData] = useState();
  async function shareHandler() {
    navigator.clipboard.writeText(window.location.href).then((res) => {
      return toast({
        title: "Copied to ClipBoard",
        description: "Video Link copied to ClpBoard",
      });
    });
  }
  async function LikeHandler(e) {
    e.preventDefault();
    if (!localStorage.getItem("jwt")) {
      return toast({
        title: "Login in",
        description: "Kindly Log into your Account to Like this video",
      });
    }

    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND}/api/like`,
      {
        video: params.id,
      },

      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
      }
    );

    if (res.status == 201) {
      setisLiked(true);
      setvideo((prevVideo) => ({
        ...prevVideo,
        likes: [...prevVideo.likes, user._id],
      }));
    } else if (res.data.message == "removed") {
      setvideo((prevVideo) => ({
        ...prevVideo,
        likes: prevVideo.likes.filter((userId) => userId !== user._id),
      }));
      setisLiked(false);
    } else {
      return toast({
        title: "Login in",
        description: "Kindly Log into your Account to Like this video",
      });
    }
  }
  async function commentHandler() {
    if (!mycomment) {
      return;
    }
    if (!localStorage.getItem("jwt")) {
      return toast({
        title: "Login Required",
        description: "Log into your Account to Comment here",
      });
    }
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND}/api/comment`,
      { comment: mycomment, video: params.id },

      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
      }
    );
    if (res.data.error) {
      return toast({
        title: "Login Required",
        description: "Log into your Account to Comment here",
      });
    } else {
      setmycomment("");
      setvideo((prevVideo) => ({
        ...prevVideo,
        comments: [
          { user: res.data.user, comment: res.data.comment },
          ...prevVideo.comments,
        ],
      }));
    }
  }

  async function getvideo() {
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND}/api/video`,
      {
        id: params.id,
      }
    );
    if (!res.data.error) {
      if (user) {
        if (res.data.likes.indexOf(user._id) !== -1) {
          setisLiked(true);
        }
      }
      res.data.comments.reverse();
      setvideo(res.data);
    }

    axios(`${process.env.NEXT_PUBLIC_BACKEND}/api/users`)
      .then((res) => setusersData(res.data))
      .catch((err) => console.log(err));
  }
  useEffect(() => {
    getvideo();
  }, [user]);
  return (
    <div className="bg-[#333333]">
      {video ? (
        <div>
          <div className="w-full">
            <video
              height={"800px"}
              width={"800px"}
              controls
              className="mx-auto mt-5 mb-6 border-black border-2"
            >
              {<source src={video.url} type="video/mp4"></source>}
            </video>
          </div>
          <Toaster />
          <div className="bg-[#222222]  h-[35px] md:h-[55px] w-full rounded-t-3xl"></div>
          <div className="bg-[#222222]">
            <div className="text-white pl-1 font-semibold text-lg md:text-2xl pt-1 ">
              {video.title}
            </div>
            <div className="pl-1 text-gray-300">{video.views} views</div>

            <div className="flex justify-around pt-6 pb-2">
              <div>
                <button onClick={LikeHandler} className="text-white text-3xl">
                  {isLiked ? (
                    <div className="text-[#99cc33]">
                      <AiFillLike />
                    </div>
                  ) : (
                    <div className="hover:text-[#99cc33]">
                      <AiOutlineLike />
                    </div>
                  )}
                </button>
                <div className="text-gray-300 pl-3"> {video.likes?.length}</div>
              </div>
              <div
                className="text-white text-2xl hover:text-[#99cc33] "
                onClick={shareHandler}
              >
                <FaShareSquare />
                <div className="text-white text-base"></div>
              </div>
            </div>
            <div>
              {" "}
              {usersData && video ? (
                <div>
                  {usersData.map((data) => {
                    if (data._id == video.createdBy) {
                      return (
                        <div>
                          <div className="w-fit bg-[#111111] pt-1 pb-1 pr-3 rounded-3xl mb-3 ml-1">
                            <Link
                              className="flex flex-row gap-2 pl-1 "
                              href={`/user/${video.createdBy}`}
                            >
                              <img
                                className="rounded-full"
                                src={data.profile}
                                height={"40px"}
                                width={"40px"}
                              />
                              <div className="text-white text-base font-medium pt-2 hover:text-[#99cc33]">
                                {" "}
                                {data.username}
                              </div>{" "}
                              <div className="pt-2.5 text-gray-400 text-sm">
                                (creator)
                              </div>
                            </Link>
                          </div>
                        </div>
                      );
                    }
                  })}
                </div>
              ) : (
                <div>
                  {" "}
                  <ClipLoader
                    color={"#ffffff"}
                    loading={true}
                    className="mt-10"
                    size={50}
                    aria-label="Loading Spinner"
                    data-testid="loader"
                  />
                </div>
              )}
            </div>
            <div className="bg-[#111111] m-1 rounded-lg p-1 md:m-3">
              <div className="pl-1 text-center pb-2 text-gray-300 pt-2 font-medium text-sm mt-2">
                DESCRIPTION
              </div>

              <div className="text-white pl-1 text-sm">{video.description}</div>
              <div className="pl-1 flex flex-wrap items-center gap-1 w-full mt-2">
                <div className="text-gray-300 text-sm w-fit">TAGS</div>{" "}
                {video.tags.map((tag) => {
                  return (
                    <div className="text-green-900 w-fit bg-green-300 text-sm pr-1 pl-1 rounded-md">
                      {tag}
                    </div>
                  );
                })}
              </div>
              {video.createdAt ? (
                <div className=" pl-1 text-gray-300 text-sm mt-2">
                  Uploaded on {changedate(video.createdAt)}
                </div>
              ) : (
                <div></div>
              )}
            </div>
            <div className="bg-[#111111] m-1 md:m-3 rounded-lg">
              <div className="pl-1 text-gray-300 pt-2 font-medium mt-2 w-full ">
                <div className="md:mx-auto w-fit text-sm"> COMMENTS</div>
              </div>
              <div className="w-full">
                <ScrollArea className="min-h-[10px] max-h-[400px] max-w-[400px] rounded-md border overflow-auto mx-auto">
                  {video && usersData ? (
                    <div>
                      {video.comments?.map((comment) => {
                        return (
                          <div key={comment._id}>
                            {usersData.map((usersdata) => {
                              if (usersdata._id == comment.user) {
                                return (
                                  <div className="flex row gap-1 pl-1 pt-2 bg-[#1f1f1f] m-2 p-1 rounded-md max-w-[400px] mx-auto">
                                    <img
                                      className="rounded-full max-h-[40px] max-w-[40px]"
                                      src={usersdata.profile}
                                      height={"40px"}
                                      width={"40px"}
                                    />
                                    <div className="text-white text-base font-medium pt-2">
                                      {usersdata.username}
                                    </div>
                                    <div className="pt-2.5 text-gray-300 text-sm">
                                      {comment.comment}
                                    </div>
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
              <div className="w-fit mx-auto flex flex-row mt-3 mb-3">
                <input
                  value={mycomment}
                  className="rounded-lg pb-3 border-solid border-2 border-black"
                  placeholder="Your comment"
                  onChange={(e) => setmycomment(e.target.value)}
                />
                <div className="pb-3">
                  <div
                    onClick={commentHandler}
                    className="bg-[#99cc33] mt-2 rounded-full ml-2"
                  >
                    <IoIosArrowDroprightCircle className="w-[30px] h-[30px] " />
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-[#222222] h-[30px] w-full"></div>
          </div>
        </div>
      ) : (
        <div className="w-full mt-10 text-center">
          <ClipLoader
            color={"#ffffff"}
            loading={true}
            className="mt-10"
            size={50}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        </div>
      )}
    </div>
  );
}

export default page;
