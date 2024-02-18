"use client";
import { useUserContext } from "@/app/context/UserContext";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

function page({ params }) {
  const router = useRouter();
  const { user, setuser } = useUserContext();
  const [video, setvideo] = useState();
  const [mycomment, setmycomment] = useState("");
  const [isLiked, setisLiked] = useState(false);
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
          ...prevVideo.comments,
          { user: res.data.user, comment: res.data.comment },
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
      setvideo(res.data);
    }
  }
  useEffect(() => {
    getvideo();
  }, [user]);
  return (
    <div>
      {video ? (
        <div>
          <video height={"500px"} width={"500px"} controls>
            <source src={video.url} type="video/mp4"></source>
          </video>
          {video.title}
          {video.description}
          {video.likes?.length}
          <button onClick={LikeHandler}>
            {isLiked ? <div>Remove Like</div> : <div>Like</div>}
          </button>
          <br />
          comments
          <div></div>
          {video ? (
            <div>
              {video.comments?.map((comment) => {
                return (
                  <div key={comment._id}>
                    {comment.user} : {comment.comment}
                  </div>
                );
              })}
            </div>
          ) : (
            <div></div>
          )}
          <input
            value={mycomment}
            placeholder="Your comment"
            onChange={(e) => setmycomment(e.target.value)}
          />
          <button onClick={commentHandler}>comment</button>
        </div>
      ) : (
        <div>Loading</div>
      )}
    </div>
  );
}

export default page;
