import Image from "next/image";
import Gallery from "./comps/main";
import Navbar from "./comps/navbar";

export default function Home() {
  return (<main className="flex flex-col">
    <Navbar />
    <Gallery />
  </main>);
}
