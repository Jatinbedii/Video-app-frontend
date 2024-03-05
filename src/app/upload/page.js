"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import ClipLoader from "react-spinners/ClipLoader";

function page() {
  const router = useRouter();
  const [video, setvideo] = useState();
  const [error, setError] = useState();
  const [title, settitle] = useState("");
  const [description, setdescription] = useState("");
  const [thumbnail, setthumbnail] = useState(null);
  const [isLoading, setloading] = useState(false);
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
    setloading(true);
    e.preventDefault();
    setError("");
    if (!title || !description || !video || !thumbnail) {
      setError("Fill all the Fields");
      setloading(false);
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
      setloading(false);
      return setError("Video not Uploaded");
    }
    let thumbnailresponse;
    if (thumbnail != null) {
      const thumbnaildata = new FormData();
      thumbnaildata.append("file", thumbnail);
      thumbnaildata.append("upload_preset", "videoapp");

      thumbnailresponse = await axios.post(
        "https://api.cloudinary.com/v1_1/dur15pcjs/image/upload",
        thumbnaildata
      );
    }
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND}/api/upload`,
      {
        title: title,
        description: description,
        url: videouploaded.data.secure_url,
        thumbnail: thumbnailresponse.data.secure_url,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
      }
    );
    if (res.status == 201) {
      setloading(false);
      router.push("/");
    } else {
      setloading(false);
      setError(res.data.error);
    }
  }
  return (
    <div>
      <div className="text-3xl text-[#99cc33] w-full text-center font-semibold mt-7">
        Upload Video
      </div>

      <div className="w-full flex justify-center mt-6">
        <div className="bg-[#99cc33] p-3 rounded-2xl">
          <div className="flex flex-col gap-3">
            <input
              type="text"
              placeholder="title"
              value={title}
              className="w-[200px] p-1 rounded-3xl border-2 border-[#99cc33]"
              onChange={(e) => settitle(e.target.value)}
            />
            <input
              className="w-[200px] p-1 rounded-3xl border-2 border-[#99cc33]"
              type="text"
              placeholder="description"
              value={description}
              onChange={(e) => setdescription(e.target.value)}
            />

            <div className="bg-black w-[200px]  pb-1 pt-1 rounded-lg">
              <div className=" text-white pl-3">Thumbnail</div>
              <Input
                className="bg-white rounded-lg w-[200px]"
                id="picture"
                type="file"
                accept="image/*"
                onChange={(e) => setthumbnail(e.target.files[0])}
              />
            </div>

            <div className="bg-black w-[200px]  pb-1 pt-1 rounded-lg">
              <div className=" text-white pl-3">Video</div>

              <input
                type="file"
                accept="video/*"
                onChange={VideoSetHanlder}
                className="bg-white rounded-lg w-[200px]"
              />
            </div>
          </div>

          <div className="w-full flex justify-center">
            {" "}
            {isLoading ? (
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
            ) : (
              <button
                onClick={uploadhandler}
                className="w-fit pr-3 pl-3 pt-1 pb-1 bg-black text-white rounded-3xl mt-3"
              >
                Upload
              </button>
            )}
          </div>
        </div>
      </div>

      {error ? (
        <div className="w-full flex justify-center text-white rounded-3xl mt-3">
          <div className="bg-red-600 w-fit mt-3 p-2 rounded-3xl">{error}</div>
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
}

export default page;
