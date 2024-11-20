'use client';

import {Canvas} from '@react-three/fiber';

const Main:React.FC<{}> = () => {
    return <>
        <h1>test</h1>
        <Canvas>
            <scene>
                <ambientLight />
                <pointLight position={[10, 10, 10]} />
            </scene>
            <camera position={[0, 0, 5]} />
        </Canvas>
    </>
}

export default Main;