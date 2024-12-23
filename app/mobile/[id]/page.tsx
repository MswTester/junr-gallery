'use client'

import MobileScreen from '@/screens/MobileScreen'
import useMediaQuery from '@/app/hooks/useMediaQuery';
import DesktopScreen from '@/screens/DesktopScreen';

export default function VideoPage({ params }: { params: { id: string } }) {
  const isLargeScreen = useMediaQuery("(min-width: 1000px)");
  const id = params.id

  return isLargeScreen ?
  <DesktopScreen inputId={id} /> :
  <MobileScreen inputId={id} />
}