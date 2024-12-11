'use client';

import { useState } from "react";
import Components from "./test";

const Main = () => {
    const [list, setList] = useState<number[]>([58, 493, 392]);

    return <>
        <div id="container">
            {list.map((item, index) => <div key={index}>{item}</div>)}
        </div>
        <Components.Button type="button" onClick={() => {
            setList(prev => [...prev, Math.floor(Math.random() * 1000) + 1]);
        }}>Add me</Components.Button>
    </>
}

export default Main;