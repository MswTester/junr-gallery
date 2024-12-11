"use client"

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { useEffect, useState } from "react";
import styled from "styled-components";

const ContentOption = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 4px;
`

export default function Upload() {
  const [file, setFile] = useState<File | null>(null);
  const [abortController, setAbortController] = useState<AbortController | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [artist, setArtist] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (abortController) {
        // abortController.abort();
      }
      // 브라우저에서 경고 표시 (선택적)
      // event.preventDefault();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [abortController]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file || !title || !description || !artist) {
      alert("모든 필드를 채워주세요!");
      return;
    }
  
    setIsUploading(true);
  
    const videoId = Date.now().toString(); // 유니크 ID 생성
  
    // const formData = new FormData();
    // formData.append("fileStream", file); // 파일만 FormData로 추가
  
    const query = new URLSearchParams({
      title,
      description,
      artist,
    });
  
    const xhr = new XMLHttpRequest();
  
    xhr.open("POST", `/api/video?id=${videoId}&${query.toString()}`, true);
  
    // 업로드 진행률 이벤트
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const progress = (event.loaded / event.total) * 100;
        setUploadProgress(progress); // 진행률 업데이트
      }
    };

    xhr.onload = () => {
      if (xhr.status === 201) {
        alert("Video uploaded successfully!");
      } else {
        alert(`Upload failed: ${xhr.responseText}`);
      }
      setIsUploading(false);
      setUploadProgress(0);
    };

    xhr.onerror = () => {
      alert("An error occurred during the upload.");
      setIsUploading(false);
      setUploadProgress(0);
    };
  
    xhr.send(file); // FormData로 파일 전송
  };

  const handleCancel = () => {
    if (abortController) {
      abortController.abort();
      setAbortController(null);
    }
  };

  const calcFileSize = (size: number):string => {
    if (size === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(size) / Math.log(k));
    return parseFloat((size / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getProgressString = (progress: number, totalSize: number):string => {
    const uploaded = (totalSize * progress) / 100;
    return `${calcFileSize(uploaded)} / ${calcFileSize(totalSize)}`;
  };

  return <main className="w-full h-full flex justify-center items-center">
    <Card className="min-w-[400px] w-min">
      <CardHeader>
        <CardTitle>{isUploading ? "영상 업로드가 진행 중입니다" : "작업물 추가하기"}</CardTitle>
        <CardDescription>{isUploading ? getProgressString(uploadProgress, file?.size || 0) : "제목, 설명, 작업자, 영상을 기입하세요"}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col justify-center items-center gap-4 p-4">
        {isUploading ? <>
          <Progress value={uploadProgress} max={100} className="w-full" />
        </> : <>
          <ContentOption>
            <Label className="w-16 text-center" htmlFor="title">제목</Label>
            <Input id="title" value={title} onChange={e => setTitle(e.target.value)} placeholder="제목을 입력해주세요" />
          </ContentOption>
          <ContentOption>
            <Label className="w-16 text-center" htmlFor="description">설명</Label>
            <Input id="description" value={description} onChange={e => setDescription(e.target.value)} placeholder="설명을 입력해주세요" />
          </ContentOption>
          <ContentOption>
            <Label className="w-16 text-center" htmlFor="artist">작업자</Label>
            <Input id="artist" value={artist} onChange={e => setArtist(e.target.value)} placeholder="작업자를 입력해주세요" />
          </ContentOption>
          <ContentOption>
            <Label className="w-16 text-center" htmlFor="file">파일</Label>
            <Input id="file" type="file" onChange={handleFileChange} accept="video/mp4" multiple={false} />
          </ContentOption>
        </>}
      </CardContent>
      <CardFooter className="flex justify-end">
        {isUploading ? <Button variant="outline" onClick={handleCancel}>취소</Button> : <Button onClick={handleUpload}>업로드</Button>}
      </CardFooter>
    </Card>
  </main>
}