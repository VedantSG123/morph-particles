import { useFrame } from "@react-three/fiber"
import { useGLTF } from "@react-three/drei"
import { GLTF } from "three-stdlib"
import { useControls } from "leva"
import { bezier } from "@leva-ui/plugin-bezier"
import { useRef, useState, useEffect, useMemo } from "react"
import { R3FPointsFX, R3FPointsFXRefType } from "r3f-points-fx"
import FBOMesh, { FBOMeshRefTypes } from "./FBOMesh"
import fragFunctions from "./fragFunctions"
import vertFunctions from "./vertFunctions"
import * as THREE from "three"

type earthGLTFResult = GLTF & {
  nodes: {
    earth: THREE.Mesh
  }
  materials: {}
}

type threejsGLTFResult = GLTF & {
  nodes: {
    threejs: THREE.Mesh
  }
  materials: {}
}

type mobiusGLTFResult = GLTF & {
  nodes: {
    Cube002: THREE.Mesh
  }
  materials: {}
}

type properties = {
  current: number
}

function Scene({ current }: properties) {
  const earth = useGLTF("earth.glb") as earthGLTFResult
  const threejs = useGLTF("threejs.glb") as threejsGLTFResult
  const mobius = useGLTF("mobius_strip.glb") as mobiusGLTFResult

  const meshes = [
    earth.nodes.earth,
    threejs.nodes.threejs,
    mobius.nodes.Cube002,
  ]

  const startTime = useRef(0)
  const progress = useRef(0)
  const FBORef = useRef<FBOMeshRefTypes>(null)
  const [modelA, setModelA] = useState<number | null>(null)
  const [modelB, setModelB] = useState<number | null>(null)
  const [modelAFlag, setModelAFlag] = useState(false)

  const generateRandomnArray = (size: number) => {
    const length = size * size * 3
    const data = new Float32Array(length)

    for (let i = 0; i < length; i++) {
      const stride = i * 3

      data[stride] = Math.random() * 3 - 1
      data[stride + 1] = Math.random() * 3 - 1
      data[stride + 2] = Math.random() * 3 - 1
    }
    return data
  }

  const randomArray = useMemo(() => {
    return generateRandomnArray(128)
  }, [])

  const { duration, curve } = useControls({
    duration: {
      value: 2,
      min: 0,
      max: 5,
      step: 0.1,
    },
    curve: bezier([0.16, 1, 0.3, 1]),
  })

  const changeModel = () => {
    startTime.current = 0
    setModelB(current)
  }

  useEffect(() => {
    changeModel()
  }, [current])

  useFrame((state) => {
    if (startTime.current === 0) {
      startTime.current = state.clock.elapsedTime
      setModelAFlag(false)
    }

    const elapsed = state.clock.elapsedTime - startTime.current

    progress.current = curve.evaluate(Math.min(elapsed / duration, 1))
    if (progress.current >= 1 && !modelAFlag) {
      setModelA(modelB)
      setModelAFlag(true)
    }

    FBORef.current?.updateProgress(progress.current)
    FBORef.current?.updateTime(state.clock.getElapsedTime())
  })

  return (
    <>
      <FBOMesh
        modelsArray={meshes}
        baseColor="#ff0000"
        modelA={modelA}
        modelB={modelB}
        ref={FBORef}
        alpha={1}
        uniforms={{
          uColor1: new THREE.Color("#D0BFFF"),
          uColor2: new THREE.Color("#FF4B91"),
          uColor3: new THREE.Color("#FFCD4B"),
        }}
        attributes={[
          {
            name: "aRandom",
            array: randomArray,
            itemSize: 3,
          },
        ]}
        pointsVertFunctions={vertFunctions}
        pointsFragFunctions={fragFunctions}
      />
    </>
  )
}

export default Scene
