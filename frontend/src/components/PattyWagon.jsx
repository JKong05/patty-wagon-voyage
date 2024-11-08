import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import { motion } from 'framer-motion';
import krabbyPattyModel from '../assets/patty_wagon.glb';

function KrabbyPattyModel() {
    const { scene } = useGLTF(krabbyPattyModel);
    return <primitive object={scene} scale={2.0} rotation={[0, Math.PI, 0]}/>;
}

export default function PattyWagon() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.75, ease: "easeOut" }}
      className="w-full h-full flex"
    >
      <Canvas
        camera={{ position: [0, 2, 8], fov: 67 }}
      >
        <Suspense fallback={null}>
          <KrabbyPattyModel />
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            autoRotate={true}
            autoRotateSpeed={2.0} />
          <ambientLight intensity={0.5} />
          <directionalLight position={[5, 5, 5]} intensity={1} />
        </Suspense>
      </Canvas>
    </motion.div>
  );
}
