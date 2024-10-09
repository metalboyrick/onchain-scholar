"use client";

import { redirect } from "next/navigation";
import type { NextPage } from "next";

const Home: NextPage = () => {
  return redirect("/onchain-scholar-app");
};

export default Home;
