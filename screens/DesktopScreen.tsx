import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from "@/components/ui/command";
import { Separator } from "@/components/ui/separator";
import VideoPlayer from "@/components/VideoPlayer";
import { ChevronLeft, ChevronRight, User, Users, Users2 } from "lucide-react";
import { useEffect, useState } from "react";
import styled from "styled-components";

const ScreenContainer = styled.div`
    width: 100%;
    height: 100%;
    padding: 20px;

    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    overflow: hidden;
`;
const Overlay = styled.div<{ $isSearching: boolean }>`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
    background-color: ${({ $isSearching }) => $isSearching ? 'rgba(0, 0, 0, 0.5)' : 'transparent'};
`;

const Row = styled.div<{ $width?: string, $height?: string }>`
    width: ${({ $width = 'auto' }) => $width};
    height: ${({ $height = 'auto' }) => $height};
    display: flex;
    flex-direction: row;
    align-items: center;
`;
const Column = styled.div<{ $width?: string, $height?: string }>`
    width: ${({ $width = 'auto' }) => $width};
    height: ${({ $height = 'auto' }) => $height};
    display: flex;
    flex-direction: column;
    justify-content: center;
`;
const Spacing = styled.div<{ $horizontal?: string, $vertical?: string }>`
    width: ${({ $horizontal = '0px' }) => $horizontal};
    height: ${({ $vertical = '0px' }) => $vertical};
`;

const TextView = styled.div<{ $font: string, $size: string }>`
    font-family: ${({ $font }) => $font};
    font-size: ${({ $size }) => $size};
    line-height: 1;
`;
const ImageView = styled.img<{ $src: string, $size: string }>`
    content: url(${({ $src }) => $src});
    object-fit: cover;
    width: ${({ $size }) => $size};
    height: ${({ $size }) => $size};
    border: 1px #999 solid;
    border-radius: 10px;
`;

const SearchContainer = styled.div`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 50%;
    min-width: 400px;
    max-width: 600px;
    z-index: 2;
    background-color: white;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
    border-radius: 10px;
    overflow: 'hidden';
`;

const DesktopScreen = () => {
    const [videos, setVideos] = useState<VideoData[]>([
        {
            "id": "0",
            "title": "",
            "description": "",
            "artist": "",
            "url": ""
        }
    ]);
    const [playingIdx, setPlayingIdx] = useState(0);
    const [isSearching, setIsSearching] = useState(false);

    const handleKeyPress = (event: KeyboardEvent) => {
        const ctrlPressed = event.ctrlKey;
        const keyPressed = event.key === 'f';

        if (ctrlPressed && keyPressed) {
            event.preventDefault();
            setIsSearching((prev) => !prev);
        }
    }

    useEffect(() => {
        window.addEventListener('keydown', handleKeyPress);
        fetch('/api/get')
        .then(res => res.json())
        .then((data: VideoData[]) => {
            console.log(data)
            setVideos(data);
        })
        
        return () => {
            window.removeEventListener('keydown', handleKeyPress);
        };
    }, []);

    return (
        <ScreenContainer>
            { isSearching && (
                <>
                    <Overlay $isSearching={isSearching} />
                    <SearchContainer>
                        <Command>
                            <CommandInput placeholder="Type a command or search..." />
                            <CommandList>
                                <CommandEmpty>No results found.</CommandEmpty>
                                {
                                    videos.slice(0, 10).map((video, i) => {
                                        return <CommandItem className="flex gap-2">
                                            <div className="w-16 overflow-hidden text-nowrap text-ellipsis">{video.artist}</div>
                                            <Separator orientation="vertical" className="h-4" />{video.title}
                                        </CommandItem>
                                    })
                                }
                            </CommandList>
                        </Command>
                    </SearchContainer>
                </>
            )}
            <ChevronLeft
                size={36}
                onClick={() => setPlayingIdx((prev) => (prev > 0 ? prev - 1 : videos.length - 1))}
            />
            <Column>
                <VideoPlayer src={videos[playingIdx].url} width={700} height={360} />
                <Spacing $vertical="28px" />
                <Row>
                    <Column $width="100%">
                        <TextView $font="SUIT-Bold" $size="28px">{videos[playingIdx].title}</TextView>
                        <Spacing $vertical="10px" />
                        <TextView $font="SUIT-Medium" $size="20px">{videos[playingIdx].description}</TextView>
                        <Spacing $vertical="18px" />
                        <Row>
                            <Users2 size={24} />
                            <Spacing $horizontal="10px" />
                            <TextView $font="SUIT-Medium" $size="18px">{videos[playingIdx].artist}</TextView>
                        </Row>
                    </Column>
                    <ImageView $src={videos[playingIdx].url} $size="120px" />
                </Row>
            </Column>
            <ChevronRight
                size={36}
                onClick={() => setPlayingIdx((prev) => (prev < videos.length - 1 ? prev + 1 : 0))}
            />
        </ScreenContainer>
    );
}

export default DesktopScreen;