"use client";
import { FaShareSquare } from "react-icons/fa";
import { IoIosArrowDroprightCircle } from "react-icons/io";
import { AiOutlineLike } from "react-icons/ai";
import { useUserContext } from "@/app/context/UserContext";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { AiFillLike } from "react-icons/ai";
import { ScrollArea } from "@/components/ui/scroll-area";

function page({ params }) {
  const router = useRouter();
  const { user, setuser } = useUserContext();
  const [video, setvideo] = useState();
  const [mycomment, setmycomment] = useState("");
  const [isLiked, setisLiked] = useState(false);
  const [usersData, setusersData] = useState();
  async function LikeHandler() {
    if (!localStorage.getItem("jwt")) {
      return router.push("/login");
    }

    const res = await axios.post(
      "http://localhost:3001/api/like",
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
      console.log(res);
    }
  }
  async function commentHandler() {
    if (!localStorage.getItem("jwt")) {
      return router.push("/login");
    }
    const res = await axios.post(
      "http://localhost:3001/api/comment",
      { comment: mycomment, video: params.id },

      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
      }
    );
    if (res.data.error) {
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
    const res = await axios.post("http://localhost:3001/api/video", {
      id: params.id,
    });
    if (!res.data.error) {
      if (user) {
        if (res.data.likes.indexOf(user._id) !== -1) {
          setisLiked(true);
        }
      }
      res.data.comments.reverse();
      setvideo(res.data);
    }

    axios("http://localhost:3001/api/users")
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
              className="mx-auto mt-5 p-1"
            >
              {
                // <source src={video.url} type="video/mp4"></source>
              }
            </video>
          </div>
          <div className="text-white pl-1 font-semibold text-lg md:text-2xl">
            {video.title}
          </div>
          <div className="pl-1 text-gray-300">{video.views} views</div>
          <div className="flex justify-around pt-2 pb-2">
            <div>
              <button onClick={LikeHandler} className="text-white text-3xl">
                {isLiked ? (
                  <div className="text-[#99cc33]">
                    <AiFillLike />
                  </div>
                ) : (
                  <div>
                    <AiOutlineLike />
                  </div>
                )}
              </button>
              <div className="text-gray-300 pl-3"> {video.likes?.length}</div>
            </div>
            <div className="text-white text-2xl">
              <FaShareSquare />
              <div className="text-white text-base">Share</div>
            </div>
          </div>
          <div>
            {" "}
            {usersData && video ? (
              <div>
                {usersData.map((data) => {
                  if (data._id == video.createdBy) {
                    return (
                      <div className="flex flex-row gap-2 pl-1">
                        <img
                          className="rounded-full"
                          src={data.profile}
                          height={"40px"}
                          width={"40px"}
                        />
                        <div className="text-white text-base font-medium pt-2">
                          {" "}
                          {data.username}
                        </div>{" "}
                        <div className="pt-2.5 text-gray-400 text-sm">
                          (creator)
                        </div>
                      </div>
                    );
                  }
                })}
              </div>
            ) : (
              <div>Loading</div>
            )}
          </div>
          <div className="pl-1 text-gray-300 pt-2 font-medium mt-2">
            {" "}
            Description
          </div>
          <div className="text-white pl-1 text-sm">{video.description}</div>
          <div className="pl-1 text-gray-300 pt-2 font-medium mt-2 w-full ">
            <div className="mx-auto w-fit"> Comments</div>
          </div>
          <div className="w-full">
            <ScrollArea className="h-[400px] max-w-[400px] rounded-md border overflow-auto mx-auto">
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
          <div className="w-fit mx-auto">
            <input
              value={mycomment}
              className="rounded-lg pb-3"
              placeholder="Your comment"
              onChange={(e) => setmycomment(e.target.value)}
            />

            <button
              onClick={commentHandler}
              className="bg-[#99cc33] mt-2 rounded-full ml-2"
            >
              <IoIosArrowDroprightCircle className="w-[30px] h-[30px] " />
            </button>
          </div>
        </div>
      ) : (
        <div>Loading</div>
      )}
    </div>
  );
}

export default page;
