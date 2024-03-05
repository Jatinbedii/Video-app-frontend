"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { IoMdSearch } from "react-icons/io";
import { ClipLoader } from "react-spinners";
function Search() {
  const router = useRouter();
  const [search, setsearch] = useState("");
  const [loading, setisloading] = useState(false);
  function searchHanlder() {
    if (!search) {
      return;
    }
    setisloading(true);

    setTimeout(() => {
      router.push(`/search/${search}`);
      setisloading(false);
    }, 500);
  }
  return (
    <div className="w-full  flex justify-center pt-3 pb-5 border-[#72a529]">
      <div className="bg-[#99cc33] flex flex-row p-1 rounded-lg">
        <input
          value={search}
          onChange={(e) => setsearch(e.target.value)}
          placeholder=" Search Video"
          className="rounded-lg border-4  md:w-[350px] lg:w-[400px]"
          type="text"
        />
        {loading ? (
          <ClipLoader
            color={"#ffffff"}
            loading={true}
            size={30}
            className="ml-1"
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        ) : (
          <IoMdSearch onClick={searchHanlder} className="text-black text-3xl" />
        )}
      </div>
    </div>
  );
}

export default Search;
