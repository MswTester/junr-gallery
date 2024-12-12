'use client'

import VideoPlayer from "@/components/VideoPlayer";
import DesktopScreen from "@/screens/DesktopScreen";
import MobileScreen from "@/screens/MobileScreen";
import useMediaQuery from "./hooks/useMediaQuery";

export default function Home() {
  const isLargeScreen = useMediaQuery("(min-width: 1000px)");

  return isLargeScreen ?
  <DesktopScreen /> :
  <MobileScreen />
}
