'use client';

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Home } from "lucide-react";

export default function Navbar(props:{}){
    return <motion.nav
        transition={{duration: 0.5}}
        className="lg:h-full sm:h-min lg:w-min sm:w-full bg-neutral-900"
    >
        <Button><Home className="w-8 h-8" /></Button>
    </motion.nav>
}