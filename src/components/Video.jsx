import Link from "next/link";
import { FaClock, FaEye } from "react-icons/fa6";
import React from "react";

function Video({ data }) {
  return (
    <Link href={`/video/${data._id}`}>
      <div className="max-w-[350px] h-[250px] text-white bg-[#1f1f1f] rounded-lg  m-1">
        <div className="w-full">
          {data.thumbnail ? (
            <div className="m-2">
              <img
                src={data.thumbnail}
                height={"100"}
                width={"300"}
                className="mx-auto pt-2 rounded-lg"
              />
            </div>
          ) : (
            <div>
              {/*
              <div className="pt-2">
              <video height={"100"} width={"300"} className="mx-auto">
                <source src={data.url} type="video/mp4"></source>
              </video>{" "}
            </div>
          */}
            </div>
          )}
        </div>
        <div className="pl-1">{data.title}</div>
        <div className="flex justify-between pr-1 pl-1">
          <div className="flex flex-row gap-1">
            <span className="text-[#99cc33]">
              {" "}
              <FaClock />
            </span>
            <div>{parseInt(data.duration)}s</div>
          </div>
          <div className="flex flex-row gap-1">
            {data.views}{" "}
            <span className="text-[#99cc33]">
              <FaEye />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default Video;
