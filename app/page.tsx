import Image from "next/image";
import Gallery from "./comps/main";
import Navbar from "./comps/navbar";

export default function Home() {
  return (<main
  className="flex justify-start items-center lg:flex-row sm:flex-col"
  >
    <Navbar />
    <Gallery />
  </main>);
}
