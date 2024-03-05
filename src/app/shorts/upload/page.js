"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
function page() {
  const router = useRouter();
  const [video, setvideo] = useState();
  const [error, setError] = useState();
  const [title, settitle] = useState("");
  const [description, setdescription] = useState("");

  useEffect(() => {
    if (localStorage.getItem("jwt")) {
    } else {
      router.push("/login");
    }
  }, []);
  function VideoSetHanlder(e) {
    setvideo(e.target.files[0]);
  }
  async function uploadhandler(e) {
    e.preventDefault();
    setError("");
    if (!title || !description || !video) {
      setError("Fill all the Fields");
      return;
    }
    const data = new FormData();
    data.append("file", video);
    data.append("upload_preset", "videoapp");

    const videouploaded = await axios.post(
      "https://api.cloudinary.com/v1_1/dur15pcjs/video/upload",
      data
    );

    if (!videouploaded) {
      return setError("Video not Uploaded");
    }

    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND}/api/shorts/upload`,
      {
        title: title,
        description: description,
        url: videouploaded.data.secure_url,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
      }
    );
    if (res.status == 201) {
      router.push("/");
    } else {
      setError(res.data.error);
    }
  }
  return (
    <div>
      <div className="text-3xl text-[#99cc33] w-full text-center font-semibold mt-7">
        Upload Short
      </div>
      <div className="w-full flex justify-center mt-6">
        <div className="bg-[#99cc33] p-3 rounded-2xl">
          <div className="flex flex-col gap-3">
            <input
              type="text"
              className="w-full p-1 rounded-3xl border-2 border-[#99cc33]"
              placeholder="title"
              value={title}
              onChange={(e) => settitle(e.target.value)}
            />
            <input
              type="text"
              className="w-full p-1 rounded-3xl border-2 border-[#99cc33]"
              placeholder="description"
              value={description}
              onChange={(e) => setdescription(e.target.value)}
            />

            <div className="bg-black w-full  pb-1 pt-1 rounded-lg">
              <div className=" text-white pl-3">Video</div>
              <input
                type="file"
                accept="video/*"
                onChange={VideoSetHanlder}
                className="text-white w-full"
              />
            </div>

            <div className="w-full flex justify-center">
              <button
                className="w-fit pr-3 pl-3 pt-1 pb-1 bg-black text-white rounded-3xl mt-3"
                onClick={uploadhandler}
              >
                Upload
              </button>
            </div>
          </div>
        </div>
      </div>

      {error ? (
        <div>
          <div className="w-full flex justify-center text-white rounded-3xl mt-3">
            <div className="bg-red-600 w-fit mt-3 p-2 rounded-3xl">{error}</div>
          </div>
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
}

export default page;
