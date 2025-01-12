import { Center, useTexture } from "@react-three/drei";
import gsap from "gsap";
import { useCallback, useRef, useEffect } from "react";

const Rings = ({ position }) => {
  const refList = useRef([]);
  const getRef = useCallback((mesh) => {
    if (mesh && !refList.current.includes(mesh)) {
      refList.current.push(mesh);
    }
  }, []);

  const texture = useTexture("textures/rings.png");

  useEffect(() => {
    if (refList.current.length === 0) return;

    // Set initial positions for all rings
    refList.current.forEach((r) => {
      r.position.set(position[0], position[1], position[2]);
    });

    // Animate the rings
    const timeline = gsap.timeline({
      repeat: -1,
      repeatDelay: 0.5,
    });

    timeline.to(
      refList.current.map((r) => r.rotation),
      {
        y: `+=${Math.PI * 2}`,
        x: `-=${Math.PI * 2}`,
        duration: 2.5,
        stagger: {
          each: 0.15,
        },
      }
    );

    return () => {
      timeline.kill(); // Clean up the animation
    };
  }, [position]);

  return (
    <Center>
      <group scale={0.5}>
        {Array.from({ length: 4 }, (_, index) => (
          <mesh key={index} ref={getRef}>
            <torusGeometry args={[(index + 1) * 0.5, 0.1]}></torusGeometry>
            <meshMatcapMaterial matcap={texture} toneMapped={false} />
          </mesh>
        ))}
      </group>
    </Center>
  );
};

export default Rings;
