"use client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { IoMdSearch } from "react-icons/io";
function Search() {
  const router = useRouter();
  const [search, setsearch] = useState("");

  function searchHanlder() {
    if (!search) return;

    router.push(`/search/${search}`);
  }
  return (
    <div className="w-full flex justify-center pt-3 pb-5">
      <input
        value={search}
        onChange={(e) => setsearch(e.target.value)}
        placeholder=" Search Video"
        className="rounded-lg border-4 border-[#72a529] md:w-[350px] lg:w-[400px]"
        type="text"
      />
      <IoMdSearch onClick={searchHanlder} className="text-[#99cc33] text-3xl" />
    </div>
  );
}

export default Search;
