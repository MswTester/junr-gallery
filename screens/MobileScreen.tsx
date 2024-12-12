import { Column, Row, Spacing, TextView } from "@/components/primitives";
import VideoPlayer from "@/components/VideoPlayer";
import { generateQrCodeBlobUrl } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import styled from "styled-components";

const ScreenContainer = styled.div`
    width: 100%;
    height: calc(100vh - 4rem);

    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;

    overflow: hidden;
`;

const MobileScreen = (props: {inputId?: string}) => {
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

    useEffect(() => {
        fetch('/api/get')
        .then(res => res.json())
        .then((data: VideoData[]) => {
            console.log(data)
            setVideos(data);
        })
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
        generateQrCodeBlobUrl(videos[playingIdx].url)
        .then(it => setQrUrl(it));
    }, [videos, playingIdx])

    return (
        <ScreenContainer>
            <VideoPlayer src={videos[playingIdx].url} onEnd={nextIdx} useMobile={true} borderRadius={0} height={400} />
            <Column $width="100%">
                <TextView $font="SUIT-Bold" $size="28px" $textAlign="center">{videos[playingIdx].title}</TextView>
                <TextView $font="SUIT-Medium" $size="20px" $textAlign="center">{videos[playingIdx].description}</TextView>
            </Column>
            <Row $width="100%">
                <ChevronLeft
                    size={36}
                    onClick={prevIdx}
                />
                <TextView $font="SUIT-Bold" $size="18px" $width="100%" $textAlign="center">{videos[playingIdx].artist}</TextView>
                <ChevronRight
                    size={36}
                    onClick={nextIdx}
                />
            </Row>
        </ScreenContainer>
    );
}

export default MobileScreen;