"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const router = useRouter();
  return (
    <div className="sticky top-0 left-0 w-full z-[99999] border-b border-primary/10 backdrop-blur p-5">
      <div className="flex wrapper justify-between gap-4">
        <Link href="/" className="items-center font-bold text-primary text-2xl">
          <Image src="/logo.png" alt="Logo" height={200} width={200}></Image>
        </Link>
        <div className="flex items-centre justify-center gap-5">
          <Button
            variant="outline"
            onClick={() => router.push("/auth")}
            className=" text-white"
          >
            LogIn
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
