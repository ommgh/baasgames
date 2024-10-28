"use client";

import { useState, useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import * as THREE from "three";
import Image from "next/image";

interface ShapeProps {
  geometry: JSX.Element;
  position: [number, number, number];
  color: string;
}

const Shape: React.FC<ShapeProps> = ({ geometry, position, color }) => {
  const mesh = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state, delta) => {
    if (mesh.current) {
      mesh.current.rotation.x += delta * 0.5;
      mesh.current.rotation.y += delta * 0.5;
      mesh.current.scale.setScalar(
        THREE.MathUtils.lerp(mesh.current.scale.x, hovered ? 1.2 : 1, 0.1)
      );
    }
  });

  return (
    <mesh
      ref={mesh}
      position={position}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {geometry}
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.5}
      />
    </mesh>
  );
};

interface XShapeProps {
  position: [number, number, number];
  color: string;
}

const XShape: React.FC<XShapeProps> = ({ position, color }) => {
  const geometry = useMemo(() => {
    const xShape = new THREE.Group();

    const barGeometry = new THREE.BoxGeometry(0.2, 1, 0.2);
    const bar1 = new THREE.Mesh(barGeometry);
    bar1.rotation.z = Math.PI / 4;
    const bar2 = new THREE.Mesh(barGeometry);
    bar2.rotation.z = -Math.PI / 4;

    xShape.add(bar1, bar2);
    return xShape;
  }, []);

  const group = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state, delta) => {
    if (group.current) {
      group.current.rotation.x += delta * 0.5;
      group.current.rotation.y += delta * 0.5;
      group.current.scale.setScalar(
        THREE.MathUtils.lerp(group.current.scale.x, hovered ? 1.2 : 1, 0.1)
      );
    }
  });

  return (
    <group
      ref={group}
      position={position}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <primitive object={geometry} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.5}
      />
    </group>
  );
};

const Scene: React.FC = () => {
  const { camera } = useThree();
  const colors = ["#FD366E", "#FFFFFF", "#FD366E", "#FFBE0B"];

  useEffect(() => {
    camera.position.set(0, 0, 6);
  }, [camera]);

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <Shape
        geometry={<sphereGeometry args={[0.55, 32, 32]} />}
        position={[-1.5, 1.5, 0]}
        color={colors[0]}
      />
      <Shape
        geometry={<boxGeometry args={[1.1, 1.1, 1.1]} />}
        position={[1.5, 1.5, 0]}
        color={colors[1]}
      />
      <Shape
        geometry={<coneGeometry args={[0.55, 1.1, 3]} />}
        position={[-1.5, -1.5, 0]}
        color={colors[2]}
      />
      <XShape position={[1.5, -1.5, 0]} color={colors[3]} />
      <Stars
        fade
        depth={50}
        count={300}
        factor={4}
        saturation={0}
        speed={0.5}
      />
      <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
    </>
  );
};

const Component: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="flex flex-col md:flex-row h-screen bg-black text-white">
      <div className="w-full md:w-1/2 p-4 md:p-8 flex flex-col items-center justify-center min-h-screen md:min-h-0">
        <Image
          src={"/logo.png"}
          height={400}
          width={400}
          alt="logo"
          className="mb-10 p-5"
        ></Image>
        <Tabs defaultValue="login" className="w-full max-w-[400px]">
          <TabsList className="grid w-full grid-cols-2 mb-8 bg-background">
            <TabsTrigger value="login" onClick={() => setIsLogin(true)}>
              Login
            </TabsTrigger>
            <TabsTrigger value="register" onClick={() => setIsLogin(false)}>
              Register
            </TabsTrigger>
          </TabsList>
          <TabsContent value="login">
            <form className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-lg">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  className="text-lg py-6 bg-background border-gray-700 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-lg">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  required
                  className="text-lg py-6 bg-background border-gray-700 text-white"
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-[#FD366E] hover:bg-[#FD366E]/90 text-white text-lg py-6"
              >
                Login
              </Button>
            </form>
          </TabsContent>
          <TabsContent value="register">
            <form className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-lg">
                  Name
                </Label>
                <Input
                  id="name"
                  type="text"
                  required
                  className="text-lg py-6 bg-background border-gray-700 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-lg">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  className="text-lg py-6 bg-background border-gray-700 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-lg">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  required
                  className="text-lg py-6 bg-background border-gray-700 text-white"
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-[#FD366E] hover:bg-[#FD366E]/90 text-white text-lg py-6"
              >
                Register
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </div>
      <div className="hidden md:block w-1/2">
        <Canvas>
          <Scene />
        </Canvas>
      </div>
    </div>
  );
};

export default Component;
