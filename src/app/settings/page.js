"use client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import axios from "axios";
function page() {
  const router = useRouter();
  const [image, setimage] = useState();
  async function uploadhandler(e) {
    e.preventDefault();

    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", "videoapp");

    const imageuploaded = await axios.post(
      "https://api.cloudinary.com/v1_1/dur15pcjs/image/upload",
      data
    );

    if (!imageuploaded) {
      return;
    }

    const res = await axios.patch(
      `${process.env.NEXT_PUBLIC_BACKEND}/api/changeimage`,
      {
        url: imageuploaded.data.secure_url,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
      }
    );
    if (res.status == 201) {
      router.push("/");
    }
  }

  useEffect(() => {
    if (localStorage.getItem("jwt")) {
    } else {
      router.push("/login");
    }
  }, []);
  return (
    <div>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setimage(e.target.files[0])}
      />
      <button onClick={uploadhandler}>Upload</button>
    </div>
  );
}

export default page;
