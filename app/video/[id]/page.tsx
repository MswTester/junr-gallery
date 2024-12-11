import { notFound } from 'next/navigation'
import VideoPlayer from '@/components/VideoPlayer'
import { works } from '@/app/data/fakedb'

// 이 함수는 서버 사이드에서 실행됩니다
async function getVideoData(id: string) {
  // 실제 구현에서는 여기서 데이터베이스나 API를 호출합니다
  return works.find(video => video.id === parseInt(id))
}

export default async function VideoPage({ params }: { params: { id: string } }) {
  const video = await getVideoData(params.id)

  if (!video) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">{video.title}</h1>
      <VideoPlayer src={video.videoUrl} />
      <p className="mt-4 text-muted-foreground">Artist: {video.artist}</p>
    </div>
  )
}