"use client";

import ShimmerButton from "@/components/ui/shimmer-button";

import { ArrowRightIcon, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";

import Image from "next/image";
import { BorderBeam } from "@/components/ui/border-beam";
import AnimationContainer from "@/components/animation-container";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import MaxWidthWrapper from "@/components/max-width-wrapper";
import Particles from "../ui/particles";
import AnimatedShinyText from "../ui/animated-shiny-text";

export function Hero() {
  const router = useRouter();

  return (
    <MaxWidthWrapper>
      <div className="flex flex-col items-center justify-center w-full text-center bg-gradient-to-t from-background">
        <AnimationContainer className="flex flex-col items-center justify-center w-full text-center">
          <div className="group relative grid overflow-hidden rounded-full px-4 py-1 transition-colors duration-200 shadow-[#FD366E] shadow-sm">
            <AnimatedShinyText className="inline-flex items-center justify-center px-4 py-1 transition ease-out hover:text-white hover:duration-300 hover:dark:text-white">
              <span>#AppwriteHackathon</span>
            </AnimatedShinyText>{" "}
          </div>
          <h1 className="text-white text-center py-6 text-5xl font-bold tracking-normal text-balance sm:text-6xl md:text-7xl lg:text-8xl !leading-[1.15] w-full font-heading">
            Play Games{" "}
            <span className="text-transparent bg-gradient-to-r from-[#FD366E] to-pink-700 bg-clip-text inline-bloc">
              In The Cloud
            </span>
          </h1>
          <p className="mb-12 text-lg tracking-tight text-white md:text-xl text-balance">
            Experience seamless multiplayer gaming
            <br className="md:block" />
            <span className="md:block">
              with our Backend-as-a-Service platform.
            </span>
          </p>
          <div className="flex items-center justify-center whitespace-nowrap gap-4 z-50">
            <Button asChild>
              <Link
                href={
                  "https://docs.google.com/forms/d/e/1FAIpQLSet2OxNsCdiiDH-U512SJlDNXjHxsLrfaoO1Hh7-9DpFJz01Q/viewform"
                }
                className="flex items-center"
              >
                Explore Games
                <ArrowRightIcon className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </AnimationContainer>

        <AnimationContainer
          delay={0.2}
          className="relative pt-20 pb-20 md:py-32 px-2 bg-transparent w-full"
        >
          <div className="absolute md:top-[10%] left-1/2 gradient w-3/4 -translate-x-1/2 h-1/4 md:h-1/3 inset-0 blur-[5rem] animate-image-glow"></div>
          <div className="-m-2 rounded-xl p-2 ring-1 ring-inset ring-foreground/20 lg:-m-4 lg:rounded-2xl bg-opacity-50 backdrop-blur-3xl">
            <BorderBeam
              size={250}
              duration={12}
              delay={9}
              colorFrom="#FD366E"
              colorTo="#FD366E"
            />
            <Image
              className=" relative w-full h-full object-contain"
              src={
                "https://res.cloudinary.com/dcwsgwsfw/image/upload/v1730113822/dashboard_qlegt8.png"
              }
              height={500}
              width={500}
              alt="hero"
            ></Image>
            <div className="absolute -bottom-4 inset-x-0 w-full h-1/2 bg-gradient-to-t from-background z-40"></div>
            <div className="absolute bottom-0 md:-bottom-8 inset-x-0 w-full h-1/4 bg-gradient-to-t from-background z-50"></div>
          </div>
        </AnimationContainer>
        <Particles
          className=" absolute inset-0 -z-10 h-full"
          quantity={100}
          ease={70}
          size={0.05}
          staticity={40}
          color="#ffffff"
        />
      </div>
    </MaxWidthWrapper>
  );
}
