'use client'

import { HTMLAttributes, useRef, useState } from 'react';

interface VideoPlayerProps extends HTMLAttributes<HTMLDivElement> {
    src: string;
}

const VideoPlayer = ({src, className}:VideoPlayerProps) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [speedRate, setSpeedRate] = useState(1);
    const [volume, setVolume] = useState(1);
    const [isMuted, setIsMuted] = useState(false);
    const [time, setTime] = useState(0);

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

    return <div className={"relative flex flex-col items-center rounded-md " + className} >
        <video src={src} className='absolute top-0 left-0 -z-10' autoPlay={true} muted={isMuted} onTimeUpdate={onTimeUpdate}></video>
    </div>
}

export default VideoPlayer;