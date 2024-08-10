import React from "react";

const AllUserMainPage = () => {
  return (
    <div className="m-0 pb-12 ">
      <ul id="messages"></ul>
      <form
        id="form"
        action=""
        className="bg-[rgba(0,0,0,0.15)] pb-1 fixed bottom-0 left-0 right-0 flex h-12 box-border backdrop-blur-md"
      >
        <input
          id="input"
          autoComplete="off"
          className="border-none py-0 px-4 flex-grow rounded-3xl m-1 focus:outline-none"
        />
        <button className="bg-[#333] border-none py-0 px-4 m-1 rounded-sm outline-none text-white">
          Send
        </button>
      </form>
    </div>
  );
};

export default AllUserMainPage;
