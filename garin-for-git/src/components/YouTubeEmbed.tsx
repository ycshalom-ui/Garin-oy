interface YouTubeEmbedProps {
  videoId: string
  title: string
  startTime?: number
}

export default function YouTubeEmbed({ videoId, title, startTime }: YouTubeEmbedProps) {
  // Build URL with optional start time
  const baseUrl = `https://www.youtube.com/embed/${videoId}`
  const url = startTime ? `${baseUrl}?start=${startTime}` : baseUrl

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="aspect-video">
        <iframe 
          width="100%" 
          height="100%" 
          src={url}
          title={title} 
          frameBorder="0" 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
          allowFullScreen
          className="w-full h-full"
          loading="lazy"
        />
      </div>
    </div>
  )
}
