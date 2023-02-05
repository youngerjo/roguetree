import { forwardRef, useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import ProcTree from "../lib/proctree";
import {
  ProcTreeProps,
  DefaultTreePartProps,
  DefaultRootPartProps,
} from "../lib/proctree-types";
// @ts-ignore
import twig1Texture from "../assets/twig-1.png";

export interface TreeProps extends ProcTreeProps {
  tree?: ProcTreeProps;
  root?: ProcTreeProps;
  treeColor?: THREE.Color | string | number;
  twigColor?: THREE.Color | string | number;
  rootColor?: THREE.Color | string | number;
}

function createFloatAttribute(array, itemSize) {
  const typedArray = new Float32Array(ProcTree.flattenArray(array));
  return new THREE.BufferAttribute(typedArray, itemSize);
}

function createIntAttribute(array, itemSize) {
  const typedArray = new Uint16Array(ProcTree.flattenArray(array));
  return new THREE.BufferAttribute(typedArray, itemSize);
}

function normalizeAttribute(attribute) {
  var v = new THREE.Vector3();
  for (var i = 0; i < attribute.count; i++) {
    v.set(attribute.getX(i), attribute.getY(i), attribute.getZ(i));
    v.normalize();
    attribute.setXYZ(i, v.x, v.y, v.z);
  }
  return attribute;
}

export default function Tree(props: TreeProps & React.PropsWithChildren) {
  const {
    tree = DefaultTreePartProps,
    root = DefaultRootPartProps,
    treeColor = 0x9d7362,
    twigColor = 0xf16950,
    rootColor = 0x9d7362,
    children,
    ...otherProps
  } = props;

  const treeData = useMemo(() => new ProcTree(tree), [tree]);
  const rootData = useMemo(() => new ProcTree(root), [root]);

  const twigTexture = useTexture(twig1Texture);

  const treeGeometry = useRef<THREE.BufferGeometry>();
  const twigGeometry = useRef<THREE.BufferGeometry>();
  const rootGeometry = useRef<THREE.BufferGeometry>();

  useEffect(() => {
    if (!treeGeometry.current) {
      return;
    }

    treeGeometry.current.setAttribute(
      "position",
      createFloatAttribute(treeData.verts, 3)
    );
    treeGeometry.current.setAttribute(
      "normal",
      normalizeAttribute(createFloatAttribute(treeData.normals, 3))
    );
    treeGeometry.current.setAttribute(
      "uv",
      createFloatAttribute(treeData.UV, 2)
    );
    treeGeometry.current.setIndex(createIntAttribute(treeData.faces, 1));

    treeGeometry.current.attributes.position.needsUpdate = true;
    treeGeometry.current.attributes.normal.needsUpdate = true;
    treeGeometry.current.attributes.uv.needsUpdate = true;
    treeGeometry.current.index.needsUpdate = true;
  }, [treeGeometry.current, treeData]);

  useEffect(() => {
    if (!twigGeometry.current) {
      return;
    }

    twigGeometry.current.setAttribute(
      "position",
      createFloatAttribute(treeData.vertsTwig, 3)
    );
    twigGeometry.current.setAttribute(
      "normal",
      normalizeAttribute(createFloatAttribute(treeData.normalsTwig, 3))
    );
    twigGeometry.current.setAttribute(
      "uv",
      createFloatAttribute(treeData.uvsTwig, 2)
    );
    twigGeometry.current.setIndex(createIntAttribute(treeData.facesTwig, 1));

    twigGeometry.current.attributes.position.needsUpdate = true;
    twigGeometry.current.attributes.normal.needsUpdate = true;
    twigGeometry.current.attributes.uv.needsUpdate = true;
    twigGeometry.current.index.needsUpdate = true;
  }, [twigGeometry.current, treeData]);

  useEffect(() => {
    if (!rootGeometry.current) {
      return;
    }

    rootGeometry.current.setAttribute(
      "position",
      createFloatAttribute(rootData.verts, 3)
    );
    rootGeometry.current.setAttribute(
      "normal",
      normalizeAttribute(createFloatAttribute(rootData.normals, 3))
    );
    rootGeometry.current.setAttribute(
      "uv",
      createFloatAttribute(rootData.UV, 2)
    );
    rootGeometry.current.setIndex(createIntAttribute(rootData.faces, 1));

    rootGeometry.current.attributes.position.needsUpdate = true;
    rootGeometry.current.attributes.normal.needsUpdate = true;
    rootGeometry.current.attributes.uv.needsUpdate = true;
    rootGeometry.current.index.needsUpdate = true;
  }, [rootGeometry.current, rootData]);

  useFrame((_, deltaTime) => {});

  return (
    <group {...otherProps}>
      <mesh castShadow>
        <bufferGeometry ref={treeGeometry} />
        <meshStandardMaterial
          color={treeColor}
          roughness={1.0}
          metalness={0.0}
        />
      </mesh>
      <mesh castShadow>
        <bufferGeometry ref={twigGeometry} />
        <meshStandardMaterial
          color={twigColor}
          roughness={1.0}
          metalness={0.0}
          map={twigTexture}
          alphaTest={0.9}
        />
      </mesh>
      <mesh rotation-z={Math.PI}>
        <bufferGeometry ref={rootGeometry} />
        <meshStandardMaterial
          color={rootColor}
          roughness={1.0}
          metalness={0.0}
        />
      </mesh>
      {children}
    </group>
  );
}
