"use client";
import Video from "./Video";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { data } from "./temp";

function Videos() {
  const temp = data;
  const [videos, setvideos] = useState();

  async function getVideos() {
    try {
      const res = await axios("http://localhost:3001/api/videos");
      setvideos(res.data);
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    getVideos();
  }, []);
  return (
    <>
      <div className="w-full">
        {videos ? (
          <div className="w-full  grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {videos.map((data) => {
              return (
                <div key={data._id}>
                  <Video data={data} />
                </div>
              );
            })}
          </div>
        ) : (
          <div>Loading</div>
        )}
      </div>
    </>
  );
}

export default Videos;
