'use client'

import React, { createContext, HTMLAttributes, useContext, useEffect, useRef, useState } from 'react';
import { Progress } from './ui/progress';
import { ChevronsLeft, ChevronsRight, Fullscreen, Pause, Play, Volume1, Volume2, VolumeOff } from 'lucide-react';
import { motion } from 'framer-motion';

interface VideoPlayerProps extends HTMLAttributes<HTMLDivElement> {
    src: string;
    width?: number;
    height?: number;
    borderRadius?: number;
    onEnd?: () => void;
    useMobile?: boolean;
}

interface VideoContextProps {
    togglePlay: () => void;
    setSpeed: (speed: number) => void;
    setVolume: React.Dispatch<React.SetStateAction<number>>;
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

const VideoPlayer = ({src, className, width, height, borderRadius = 10, onEnd, useMobile = false}:VideoPlayerProps) => {
    const [once, setOnce] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [speedRate, setSpeedRate] = useState(1);
    const [volume, setVolume] = useState(.5);
    const [isMuted, setIsMuted] = useState(false);
    const [time, setTime] = useState(0);
    const [duration, setDuration] = useState(0);

    useEffect(() => setOnce(true), []);

    useEffect(() => {
        if(videoRef.current) {
            if(isPlaying) {
                videoRef.current.play();
            } else {
                videoRef.current.pause();
            }
        }
    }, [isPlaying]);

    useEffect(() => {
        if(videoRef.current) {
            videoRef.current.volume = volume;
        }
    }, [volume]);

    const togglePlay = () => {
        setIsPlaying(!isPlaying);
    }

    const setSpeed = (speed: number) => {
        if(videoRef.current) {
            videoRef.current.playbackRate = speed;
            setSpeedRate(speed);
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

    useEffect(() => {
        setIsPlaying(true)
    }, [src])

    if (!once) return null;

    return <div className={"relative flex flex-col items-center bg-[#000] " + className}
        style={{
            width: width ? `${width}px` : '100%',
            height: height ? `${height}px` : '100%',
            borderRadius: `${borderRadius}px`
        }}>
        <video src={src} ref={videoRef} className='w-full h-full' autoPlay={true} muted={isMuted} onTimeUpdate={onTimeUpdate} onEnded={onEnd} onLoadedMetadata={() => {
            if(videoRef.current) {
                setIsPlaying(true)
                setDuration(videoRef.current.duration);
            }
        }}>
            <source src={src} type="video/mp4" />
            Your browser does not support the video tag.
        </video>
        <VideoContext.Provider value={{togglePlay, setSpeed, setVolume, toggleMute, seek, isPlaying, speedRate, volume, isMuted, time, duration}}>
            <Controller useMobile={useMobile} video={videoRef.current} />
        </VideoContext.Provider>
    </div>
}

const Controller:React.FC<{useMobile?: boolean; video: HTMLVideoElement | null}> = (props) => {
    const context = useContext(VideoContext);
    if (!context) {
        return null; // or handle the null case appropriately
    }
    const {isPlaying, isMuted, volume, togglePlay, time, duration, toggleMute, seek, setSpeed, speedRate} = context;
    const [show, setShow] = useState(false);

    useEffect(() => {
        if(show){
            const timer = setTimeout(() => setShow(false), 3000);
            return () => clearTimeout(timer);
        }
    }, [show]);

    return <motion.div className="absolute top-0 left-0 w-full h-full p-2 gap-2 flex flex-col justify-end items-center tet-el" onPointerDown={e => {
            e.stopPropagation();
            if(e.target === e.currentTarget) togglePlay();
    }}
        onPointerEnter={() => setShow(true)}
        initial={{opacity: 0, y: 20}}
        animate={{opacity: show ? 1 : 0, y: show ? 0 : 20}}
    >
        <Progress value={time/duration*100} max={100} className="w-full cursor-pointer" onClick={(e: React.MouseEvent<HTMLDivElement>) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const percent = x / rect.width;
            console.log(percent);
            seek(duration * percent);
        }} />
        <div className='text-white flex justify-between w-full'>
            <div className='flex gap-2'>
                {isPlaying ? <Pause className='cursor-pointer' size={24} fill='#fff' onClick={togglePlay} />
                : <Play className='cursor-pointer' size={24} fill='#fff' onClick={togglePlay} />}
                {isMuted ? <VolumeOff className='cursor-pointer' size={24} fill='#fff' onClick={toggleMute} />
                : volume >= 0.5 ? <Volume2 className='cursor-pointer' size={24} fill='#fff' onClick={toggleMute} />
                : <Volume1 className='cursor-pointer' size={24} fill='#fff' onClick={toggleMute} />}
            </div>
            <div className='flex gap-2'>
                <ChevronsRight className='cursor-pointer' size={24} onClick={() => setSpeed(Math.min(2, speedRate + 0.25))} />
                {props.useMobile && <Fullscreen size={24} className='cursor-pointer' onClick={() => {
                    if(props.video) props.video.requestFullscreen()
                }} />}
            </div>
        </div>
    </motion.div>
}

export default VideoPlayer;