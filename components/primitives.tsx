import styled from "styled-components";

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
const TextView = styled.div<{ $font: string, $size: string, $width?: string, $textAlign?: string }>`
    width: ${({ $width = 'auto' }) => $width};
    padding: 4px;
    font-family: ${({ $font }) => $font};
    font-size: ${({ $size }) => $size};
    line-height: 1;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    text-align: ${({ $textAlign = 'left' }) => $textAlign};
`;
const ImageView = styled.img<{ $src: string, $size: string }>`
    content: url(${({ $src }) => $src});
    object-fit: cover;
    width: ${({ $size }) => $size};
    height: ${({ $size }) => $size};
    border: 1px #999 solid;
    border-radius: 10px;
`;

export {Row, Column, Spacing, TextView, ImageView};