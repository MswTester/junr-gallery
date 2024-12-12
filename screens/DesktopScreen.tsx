import { Column, ImageView, Row, Spacing, TextView } from "@/components/primitives";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from "@/components/ui/command";
import { Separator } from "@/components/ui/separator";
import VideoPlayer from "@/components/VideoPlayer";
import { generateQrCodeBlobUrl } from "@/lib/utils";
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

const SearchContainer = styled.div`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 600px;
    z-index: 2;
    background-color: white;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
    border-radius: 10px;
    overflow: 'hidden';
`;

const DesktopScreen = (props: {inputId?: string}) => {
    const [videos, setVideos] = useState<VideoData[]>([
        {
            "id": "0",
            "title": "",
            "description": "",
            "artist": "",
            "url": "/"
        }
    ]);
    const [playingIdx, setPlayingIdx] = useState(0);
    const [isSearching, setIsSearching] = useState(false);
    const [qrUrl, setQrUrl] = useState('');

    const prevIdx = () => setPlayingIdx((prev) => (prev > 0 ? prev - 1 : videos.length - 1))
    const nextIdx = () => setPlayingIdx((prev) => (prev < videos.length - 1 ? prev + 1 : 0))

    const handleKeyPress = (event: KeyboardEvent) => {
        const ctrlPressed = event.ctrlKey;
        const keyFPressed = event.key === 'f';
        const keyESCPressed = event.key === 'Escape';

        if (ctrlPressed && keyFPressed) {
            event.preventDefault();
            setIsSearching((prev) => !prev);
        }
        if (keyESCPressed) {
            event.preventDefault();
            setIsSearching(false);
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

    useEffect(() => {
        if (props.inputId) {
            const findIndex = videos.findIndex(video => video.id === props.inputId);
            if (findIndex !== -1) {
                setPlayingIdx(findIndex);
            }
        }
    }, [props.inputId])

    useEffect(() => {
        generateQrCodeBlobUrl(`/mobile/${videos[playingIdx].id}`)
        .then(it => setQrUrl(it));
    }, [videos, playingIdx])

    return (
        <ScreenContainer>
            { isSearching && <>
                <Overlay $isSearching={isSearching} onClick={() => setIsSearching(false)} />
                <SearchContainer>
                    <Command>
                        <CommandInput placeholder="Type a command or search..." />
                        <CommandList>
                            <CommandEmpty>No results found.</CommandEmpty>
                            {
                                videos.slice(0, 10).map((video, i) => {
                                    return <CommandItem>
                                        <TextView $font="SUIT-Medium" $size="16px" $width="100px">{video.artist}</TextView>
                                        <Separator orientation="vertical" className="h-4" />
                                        <TextView $font="SUIT-Medium" $size="16px">{video.title}</TextView>
                                    </CommandItem>
                                })
                            }
                        </CommandList>
                    </Command>
                </SearchContainer>
            </>}
            <ChevronLeft
                size={36}
                onClick={prevIdx}
            />
            <Column>
                <VideoPlayer src={videos[playingIdx].url} width={900} height={500} onEnd={nextIdx} />
                <Spacing $vertical="28px" />
                <Row>
                    <Column $width="780px">
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
                    <ImageView $src={qrUrl} $size="120px" />
                </Row>
            </Column>
            <ChevronRight
                size={36}
                onClick={nextIdx}
            />
        </ScreenContainer>
    );
}

export default DesktopScreen;