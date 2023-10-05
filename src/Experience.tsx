import { Canvas } from "@react-three/fiber"
import { OrbitControls } from "@react-three/drei"
import { useGLTF } from "@react-three/drei"
import { GLTF } from "three-stdlib"
import FBOMesh from "./FBOMesh"
import * as THREE from "three"

type earthGLTFResult = GLTF & {
  nodes: {
    uploads_files_220341_Earth_Longi_Alti002: THREE.Mesh
    uploads_files_220341_Earth_Longi_Alti002_1: THREE.Mesh
  }
  materials: {
    Default: THREE.MeshStandardMaterial
  }
}

type rocketGLTFResult = GLTF & {
  nodes: {
    RING: THREE.Mesh
  }
  materials: {}
}

function Experience() {
  const earth = useGLTF("earth.glb") as earthGLTFResult
  const rocket = useGLTF("rocket-v2.glb") as rocketGLTFResult

  const meshes = [
    earth.nodes.uploads_files_220341_Earth_Longi_Alti002_1,
    rocket.nodes.RING,
  ]

  return (
    <>
      <Canvas
        className="main-canvas"
        gl={{
          powerPreference: "high-performance",
          toneMapping: THREE.NoToneMapping,
        }}
        dpr={[1, 2]}
      >
        <OrbitControls />
        <FBOMesh modelsArray={meshes} baseColor="#ff0000" />
      </Canvas>
    </>
  )
}

export default Experience
