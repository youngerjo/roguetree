import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useTexture } from '@react-three/drei'
import ProcTree from '../lib/proctree'
import { ProcTreeProps, DefaultTreePartProps, DefaultRootPartProps } from '../lib/proctree-types'
// @ts-ignore
import twig1Texture from '../assets/twig-1.png'

export interface TreeProps extends ProcTreeProps {
  tree?: ProcTreeProps
  root?: ProcTreeProps
  treeColor?: THREE.Color | string | number
  twigColor?: THREE.Color | string | number
  rootColor?: THREE.Color | string | number
}

function createFloatAttribute(array, itemSize) {
  const typedArray = new Float32Array(ProcTree.flattenArray(array))
  return new THREE.BufferAttribute(typedArray, itemSize)
}

function createIntAttribute(array, itemSize) {
  const typedArray = new Uint16Array(ProcTree.flattenArray(array))
  return new THREE.BufferAttribute(typedArray, itemSize)
}

function normalizeAttribute(attribute) {
  var v = new THREE.Vector3()
  for (var i = 0; i < attribute.count; i++) {
    v.set(attribute.getX(i), attribute.getY(i), attribute.getZ(i))
    v.normalize()
    attribute.setXYZ(i, v.x, v.y, v.z)
  }
  return attribute
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
  } = props

  const treeData = useMemo(() => new ProcTree(tree), [tree])
  const rootData = useMemo(() => new ProcTree(root), [root])

  const twigTexture = useTexture(twig1Texture)

  const treeMesh = useRef<THREE.Mesh>()
  const twigMesh = useRef<THREE.Mesh>()
  const rootMesh = useRef<THREE.Mesh>()

  useEffect(() => {
    if (!treeMesh.current) {
      return
    }

    treeMesh.current.geometry.setAttribute('position', createFloatAttribute(treeData.verts, 3))
    treeMesh.current.geometry.setAttribute('normal', normalizeAttribute(createFloatAttribute(treeData.normals, 3)))
    treeMesh.current.geometry.setAttribute('uv', createFloatAttribute(treeData.UV, 2))
    treeMesh.current.geometry.setIndex(createIntAttribute(treeData.faces, 1))

    treeMesh.current.geometry.attributes.position.needsUpdate = true
    treeMesh.current.geometry.attributes.normal.needsUpdate = true
    treeMesh.current.geometry.attributes.uv.needsUpdate = true
    treeMesh.current.geometry.index.needsUpdate = true
  }, [treeMesh.current, treeData])

  useEffect(() => {
    if (!twigMesh.current) {
      return
    }

    twigMesh.current.geometry.setAttribute('position', createFloatAttribute(treeData.vertsTwig, 3))
    twigMesh.current.geometry.setAttribute('normal', normalizeAttribute(createFloatAttribute(treeData.normalsTwig, 3)))
    twigMesh.current.geometry.setAttribute('uv', createFloatAttribute(treeData.uvsTwig, 2))
    twigMesh.current.geometry.setIndex(createIntAttribute(treeData.facesTwig, 1))

    twigMesh.current.geometry.attributes.position.needsUpdate = true
    twigMesh.current.geometry.attributes.normal.needsUpdate = true
    twigMesh.current.geometry.attributes.uv.needsUpdate = true
    twigMesh.current.geometry.index.needsUpdate = true
  }, [twigMesh.current, treeData])

  useEffect(() => {
    if (!rootMesh.current) {
      return
    }

    rootMesh.current.geometry.setAttribute('position', createFloatAttribute(rootData.verts, 3))
    rootMesh.current.geometry.setAttribute('normal', normalizeAttribute(createFloatAttribute(rootData.normals, 3)))
    rootMesh.current.geometry.setAttribute('uv', createFloatAttribute(rootData.UV, 2))
    rootMesh.current.geometry.setIndex(createIntAttribute(rootData.faces, 1))

    rootMesh.current.geometry.attributes.position.needsUpdate = true
    rootMesh.current.geometry.attributes.normal.needsUpdate = true
    rootMesh.current.geometry.attributes.uv.needsUpdate = true
    rootMesh.current.geometry.index.needsUpdate = true
  }, [rootMesh.current, rootData])

  return (
    <group {...otherProps}>
      <mesh ref={treeMesh} castShadow frustumCulled={false}>
        <bufferGeometry />
        <meshStandardMaterial color={treeColor} roughness={1.0} metalness={0.0} />
      </mesh>
      <mesh ref={twigMesh} castShadow frustumCulled={false}>
        <bufferGeometry />
        <meshStandardMaterial color={twigColor} roughness={1.0} metalness={0.0} map={twigTexture} alphaTest={0.9} />
      </mesh>
      <mesh ref={rootMesh} rotation-z={Math.PI} frustumCulled={false}>
        <bufferGeometry />
        <meshStandardMaterial color={rootColor} roughness={1.0} metalness={0.0} />
      </mesh>
      {children}
    </group>
  )
}
