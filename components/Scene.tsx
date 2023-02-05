import { Suspense, useState } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import {
  OrbitControls,
  AccumulativeShadows,
  RandomizedLight,
  Html,
} from "@react-three/drei";
import { BlendFunction } from "postprocessing";
import { Bloom, Vignette, EffectComposer } from "@react-three/postprocessing";
import { useControls } from "leva";
import Tree from "./Tree";
import Ground from "./Ground";
import { useBearStore } from "../utils/store";

export default function Scene() {
  const { backgroundColor } = useControls("Scene", {
    backgroundColor: "#d8efec",
  });

  const treeProps = useBearStore((state) => state.treeProps);
  const rootProps = useBearStore((state) => state.rootProps);
  const tick = useBearStore((state) => state.tick);

  const minBloomIntensity = 0.1;
  const maxBloomIntensity = 0.3;
  const [bloomIntensity, setBloomIntensity] = useState(maxBloomIntensity);

  useFrame(({ clock }, deltaTime) => {
    tick(deltaTime);
  });

  return (
    <>
      <color attach="background" args={[backgroundColor]} />
      <fog color={backgroundColor} near={50} far={75} attach="fog" />

      <OrbitControls
        makeDefault
        minDistance={1}
        maxDistance={10}
        minPolarAngle={Math.PI * 0.25}
        maxPolarAngle={Math.PI * 0.75}
        enableDamping
        // enablePan={false}
        onChange={({ target }) => {
          if (target.object.position.y > 0) {
            setBloomIntensity(maxBloomIntensity);
          } else {
            setBloomIntensity(minBloomIntensity);
          }
        }}
      />

      <Suspense fallback={null}>
        <directionalLight position={[5, 5, 10]} />
        <Ground />
        <group>
          <Tree tree={treeProps} root={rootProps} />
          {/* @ts-ignore */}
          <AccumulativeShadows
            temporal
            frames={100}
            color="black"
            colorBlend={1}
            toneMapped
            alphaTest={0.9}
            opacity={1}
            scale={100}
          >
            {/* @ts-ignore */}
            <RandomizedLight
              amount={8}
              radius={10}
              ambient={0.5}
              intensity={1}
              position={[5, 5, 10]}
              bias={0.001}
            />
          </AccumulativeShadows>
        </group>
      </Suspense>
      <EffectComposer>
        <Vignette
          offset={0.3}
          darkness={0.9}
          blendFunction={BlendFunction.NORMAL}
        />
        <Bloom mipmapBlur intensity={bloomIntensity} luminanceThreshold={0} />
      </EffectComposer>
    </>
  );
}
