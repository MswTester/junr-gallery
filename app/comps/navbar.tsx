'use client';

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Home } from "lucide-react";

export default function Navbar(props:{}){
    return <motion.nav
        initial={{x: -100}}
        animate={{x: 0}}
        transition={{duration: 0.5}}
        className="h-full p-2 absolute left-0 top-0 bg-neutral-700"
    >
        <Button><Home className="w-8 h-8" /></Button>
    </motion.nav>
}