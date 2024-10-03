"use client";
import Link from "next/link";
import React from "react";

const ChatLinkComponent = ({
  id,
  name,
  path,
}: {
  id: string;
  name: string;
  path: string;
}) => {
  return <Link href={`/dashboard/${path}/${id}`}>{name}</Link>;
};

export default ChatLinkComponent;
