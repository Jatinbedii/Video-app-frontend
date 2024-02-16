"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";

function page({ params }) {
  const [video, setvideo] = useState();
  async function getvideo() {
    const res = await axios.post("http://localhost:3001/api/video", {
      id: params.id,
    });
    if (!res.data.error) {
      setvideo(res.data);
    }
  }
  useEffect(() => {
    getvideo();
  }, []);
  return (
    <div>
      {video ? (
        <div>
          <video height={"500px"} width={"500px"} controls>
            <source src={video.url} type="video/mp4"></source>
          </video>
          {video.title}
          {video.description}
        </div>
      ) : (
        <div>Loading</div>
      )}
    </div>
  );
}

export default page;
