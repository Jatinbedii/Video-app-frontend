"use client";
import ClipLoader from "react-spinners/ClipLoader";
import Video from "@/components/Video";
import axios from "axios";
import React, { useEffect, useState } from "react";
import Search from "@/components/Search";

function page({ params }) {
  const [videos, setvideos] = useState();
  const [searching, setsearching] = useState(true);

  async function getVideos() {
    try {
      const res = await axios(`${process.env.NEXT_PUBLIC_BACKEND}/api/videos`);
      setvideos(res.data.filter((vid) => vid.tags?.includes(params.keyword)));
    } catch (error) {
      console.log(error);
    }
    setsearching(false);
  }
  useEffect(() => {
    getVideos();
  }, []);
  return (
    <>
      <div className="bg-[#333333]">
        <div className="pt-3">
          <Search />
        </div>
        <div className="pt-2 pl-2 text-white font-medium w-full text-center">
          Search result for "{params.keyword}"
        </div>
        {videos && videos.length > 0 ? (
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
            {searching ? (
              <ClipLoader
                color={"#ffffff"}
                loading={true}
                className="mt-10"
                size={50}
                aria-label="Loading Spinner"
                data-testid="loader"
              />
            ) : (
              <div className="text-gray-400 text-3xl font-semibold pt-3">
                No Video Found
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}

export default page;
