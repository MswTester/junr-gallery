'use client'

import { createContext, HTMLAttributes, useContext, useEffect, useRef, useState } from 'react';
import { Progress } from './ui/progress';
import { Pause, Play, Volume1, Volume2, VolumeOff } from 'lucide-react';

interface VideoPlayerProps extends HTMLAttributes<HTMLDivElement> {
    src: string;
    width?: number;
    height?: number;
    borderRadius?: number;
    onEnd?: () => void;
}

interface VideoContextProps {
    play: () => void;
    pause: () => void;
    togglePlay: () => void;
    setSpeed: (speed: number) => void;
    setVolumeRate: (volume: number) => void;
    toggleMute: () => void;
    seek: (time: number) => void;
    isPlaying: boolean;
    speedRate: number;
    volume: number;
    isMuted: boolean;
    time: number;
    duration: number;
}

const VideoContext = createContext<VideoContextProps|null>(null);

const VideoPlayer = ({src, className, width:w, height:h, borderRadius = 10, onEnd}:VideoPlayerProps) => {
    const [once, setOnce] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isPlaying, setIsPlaying] = useState(true);
    const [speedRate, setSpeedRate] = useState(1);
    const [volume, setVolume] = useState(.5);
    const [isMuted, setIsMuted] = useState(false);
    const [time, setTime] = useState(0);
    const [duration, setDuration] = useState(0);

    const width = w || 640;
    const height = h || 360;

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

    return once && <div className={"relative flex flex-col items-center bg-[#000] " + className} style={{width: `${width}px`, height: `${height}px`, borderRadius: `${borderRadius}px`}} onPointerDown={e => {
        e.stopPropagation();
        togglePlay();
    }}>
        <video ref={videoRef} className='w-full h-full' autoPlay={true} muted={isMuted} onTimeUpdate={onTimeUpdate} onEnded={onEnd} onDurationChange={e => {
            if(videoRef.current) {
                setDuration(videoRef.current.duration);
            }
        }}>
            <source src={src} type="video/mp4" />
            Your browser does not support the video tag.
        </video>
        <VideoContext.Provider value={{play, pause, togglePlay, setSpeed, setVolumeRate, toggleMute, seek, isPlaying, speedRate, volume, isMuted, time, duration}}>
            <Controller />
        </VideoContext.Provider>
    </div>
}

const Controller = () => {
    const context = useContext(VideoContext);
    if (!context) {
        return null; // or handle the null case appropriately
    }
    const {isPlaying, isMuted, volume, togglePlay} = context;

    return <div className="absolute top-0 left-0 w-full h-full p-2 gap-2 flex flex-col justify-end items-center">
        <Progress value={0} max={100} className="w-full" />
        <div className='text-white flex justify-between'>
            <div className='flex gap-2'>
                {isPlaying ? <Pause size={24} fill='#fff' /> : <Play size={24} fill='#fff' />}
                {isMuted ? <VolumeOff size={24} fill='#fff' /> : volume >= 0.5 ? <Volume2 size={24} fill='#fff' /> : <Volume1 size={24} fill='#fff' />}
            </div>
        </div>
    </div>
}

export default VideoPlayer;