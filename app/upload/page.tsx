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

    const controller = new AbortController();
    setAbortController(controller);

    const videoId = Date.now().toString(); // 유니크 ID 생성

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("title", title);
      formData.append("description", description);
      formData.append("artist", artist);

      const response = await fetch(`/api/video?id=${videoId}`, {
        method: "POST",
        body: formData,
        signal: controller.signal,
      });

      if (response.ok) {
        alert("Video uploaded successfully!");
      } else {
        const errorData = await response.json();
        console.error("Upload failed:", errorData);
        alert(`Upload failed: ${errorData.message}`);
      }
    } catch (err: any) {
      if (err.name === "AbortError") {
        console.log("Upload canceled.");
      } else {
        console.error("Upload failed:", err);
      }
    }
  };

  const handleCancel = () => {
    if (abortController) {
      abortController.abort();
      setAbortController(null);
    }
  };

  return <main className="w-full h-full flex justify-center items-center">
    <Card className="min-w-[400px] w-min">
      <CardHeader>
        <CardTitle>작업물 추가하기</CardTitle>
        <CardDescription>제목, 설명, 작업자, 영상을 기입하세요.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col justify-center items-center gap-4 p-4">
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
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button onClick={handleUpload}>업로드</Button>
      </CardFooter>
    </Card>
  </main>
}