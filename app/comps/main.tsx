'use client';

import {Canvas, useLoader, useThree} from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import { FBXLoader } from 'three/examples/jsm/Addons.js';

const Main:React.FC<{}> = () => {
    const orbitControlRef = useRef();
    const bodyfbx = useLoader(FBXLoader, '/models/body.fbx');
    useEffect(() => {
        // orbitControlRef.current.addEventListener('change', invalidate);
        // return () => orbitControlRef.current.removeEventListener('change', invalidate);
    }, []);
    return <>
        <Canvas className='w-full h-full' camera={{ position: [0, 1, 6], fov: 25, near: 1, far: 20 }}>
            <ambientLight />
            <pointLight position={[10, 10, 10]} />
            <pointLight position={[-10, -10, -10]} />
            <primitive object={bodyfbx} />
            <mesh>
                <boxGeometry args={[1, 1, 1]} />
                <meshLambertMaterial color="hotpink" />
            </mesh>
            {/* <orbitControls ref={orbitControlRef} args={[camera, gl.domElement]} /> */}
        </Canvas>
    </>
}

export default Main;