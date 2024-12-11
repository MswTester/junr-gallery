'use client'

import { HTMLAttributes, useEffect, useRef, useState } from 'react';

interface VideoPlayerProps extends HTMLAttributes<HTMLDivElement> {
    src: string;
    width?: number;
    height?: number;
}

const VideoPlayer = ({src, className, width, height}:VideoPlayerProps) => {
    const [once, setOnce] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isPlaying, setIsPlaying] = useState(true);
    const [speedRate, setSpeedRate] = useState(1);
    const [volume, setVolume] = useState(1);
    const [isMuted, setIsMuted] = useState(false);
    const [time, setTime] = useState(0);

    useEffect(() => setOnce(true), []);

    const play = () => {
        if(videoRef.current) {
            videoRef.current.play();
            setIsPlaying(true);
        }
    }

    const pause = () => {
        if(videoRef.current) {
            videoRef.current.pause();
            setIsPlaying(false);
        }
    }

    const togglePlay = () => {
        if(isPlaying) {
            pause();
        } else {
            play();
        }
    }

    const setSpeed = (speed: number) => {
        if(videoRef.current) {
            videoRef.current.playbackRate = speed;
            setSpeedRate(speed);
        }
    }

    const setVolumeRate = (volume: number) => {
        if(videoRef.current) {
            videoRef.current.volume = volume;
            setVolume(volume);
        }
    }

    const toggleMute = () => {
        if(videoRef.current) {
            videoRef.current.muted = !videoRef.current.muted;
            setIsMuted(videoRef.current.muted);
        }
    }

    const seek = (time: number) => {
        if(videoRef.current) {
            videoRef.current.currentTime = time;
            setTime(time);
        }
    }

    const onTimeUpdate = () => {
        if(videoRef.current) {
            setTime(videoRef.current.currentTime);
        }
    }

    return once && <div className={"relative flex flex-col items-center rounded-md bg-[#000] -z-20 " + className} style={{width: `${width || 1200}px`, height: `${height || 900}px`}} onClick={togglePlay}>
        <video src={src} className='absolute top-0 left-0 -z-10 w-full h-full' autoPlay={true} muted={isMuted} onTimeUpdate={onTimeUpdate} />
        <div></div>
    </div>
}

export default VideoPlayer;