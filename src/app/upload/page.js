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
  const [thumbnail, setthumbnail] = useState(null);
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
      router.push("/");
    } else {
      setError(res.data.error);
    }
  }
  return (
    <div>
      <input
        type="text"
        placeholder="title"
        value={title}
        onChange={(e) => settitle(e.target.value)}
      />
      <input
        type="text"
        placeholder="description"
        value={description}
        onChange={(e) => setdescription(e.target.value)}
      />
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setthumbnail(e.target.files[0])}
      />
      <input type="file" accept="video/*" onChange={VideoSetHanlder} />
      {error ? <div>{error}</div> : <div></div>}
      <button onClick={uploadhandler}>Upload</button>
    </div>
  );
}

export default page;
