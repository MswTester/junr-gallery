import VideoPlayer from "@/components/VideoPlayer";
import { ChevronLeft, ChevronRight, User, Users, Users2 } from "lucide-react";
import { useState } from "react";
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

const DesktopScreen = () => {
    const videos: VideoDisplay[] = [
        { title: "문선우의 똥", description: "똥의 심미성을 표현한 예술", artist: "문선우", videoUrl: "/videos/2.mp4", qrUrl: "https://avatars.githubusercontent.com/u/133082551?v=4" },
        { title: "문선우의 자지", description: "섹스하고 싶다", artist: "이상준, 안진석", videoUrl: "/videos/2.mp4", qrUrl: "https://avatars.githubusercontent.com/u/125240533?v=4" },
        { title: "문선우의 유두", description: "인생", artist: "섹스킹", videoUrl: "/videos/2.mp4", qrUrl: "https://avatars.githubusercontent.com/u/99114867?v=4" }
    ]
    const [playingIdx, setPlayingIdx] = useState(0);

    return (
        <ScreenContainer>
            <ChevronLeft
                size={36}
                onClick={() => setPlayingIdx((prev) => (prev > 0 ? prev - 1 : videos.length - 1))}
            />
            <Column>
                <VideoPlayer src={videos[playingIdx].videoUrl} width={700} height={360} />
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
                    <ImageView $src={videos[playingIdx].qrUrl} $size="120px" />
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