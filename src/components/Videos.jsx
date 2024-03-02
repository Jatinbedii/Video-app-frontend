"use client";
import ClipLoader from "react-spinners/ClipLoader";
import Video from "./Video";
import React, { useEffect, useState } from "react";
import axios from "axios";

function Videos() {
  const [videos, setvideos] = useState();

  async function getVideos() {
    try {
      const res = await axios(`${process.env.NEXT_PUBLIC_BACKEND}/api/videos`);
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
      <div className="bg-[#333333]">
        {videos ? (
          <div className="  grid gap-3 md:grid-cols-2 lg:grid-cols-3 w-fit mx-auto lg:gap-10">
            {videos.map((data) => {
              return (
                <div key={data._id}>
                  <Video data={data} />
                </div>
              );
            })}
          </div>
        ) : (
          <div className="w-full text-center">
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
    </>
  );
}

export default Videos;
