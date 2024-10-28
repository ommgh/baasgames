"use client";
import React from "react";
import { Github, Linkedin, Instagram } from "lucide-react";
import Image from "next/image";

import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-background text-white p-8 mt-10">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start">
          <div className="mb-8 md:mb-0">
            <div className="text-2xl font-bold mb-4">
              <Image
                src="/logo.png"
                alt="Logo"
                height={200}
                width={200}
              ></Image>
            </div>
            <p className="max-w-xs mb-4">play . learn . explore</p>
            <div className="flex space-x-4">
              <Link href={"https://www.linkedin.com/"}>
                <Linkedin size={20} />
              </Link>
              <Link href={"https://github.com/ommgh"}>
                <Github size={20} />
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-semibold mb-2">Product</h3>
              <ul className="space-y-2">
                <li>Registry</li>
                <li>Pricing</li>
                <li>Sign in ↗</li>
                <li>Docs ↗</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Company</h3>
              <ul className="space-y-2">
                <li>Blog</li>
                <li>About us</li>
                <li>Careers</li>
                <li>Contact</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Legal</h3>
              <ul className="space-y-2">
                <li>Refrences</li>
                <li>Telemetry Compliance</li>
                <li>Terms & Conditions</li>
                <li>Privacy</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
