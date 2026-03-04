interface GoogleMapProps {
  address: string
  title: string
}

export default function GoogleMap({ address, title }: GoogleMapProps) {
  // Convert address to Google Maps embed URL
  const encodedAddress = encodeURIComponent(address)
  const mapUrl = `https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${encodedAddress}`

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden my-6">
      <div className="aspect-video">
        <iframe
          width="100%"
          height="100%"
          style={{ border: 0 }}
          loading="lazy"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
          src={mapUrl}
          title={title}
          className="w-full h-full"
        />
      </div>
    </div>
  )
}
