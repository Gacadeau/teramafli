// Dans votre composant React
import React, { useState, useEffect } from 'react'

const CacheViewer = () => {
  const [cachedVideos, setCachedVideos] = useState([])

  useEffect(() => {
    const loadCachedVideos = async () => {
      const cache = await caches.open('video-cache')
      const cachedRequests = await cache.keys()

      const videoUrls = cachedRequests.map(request => request.url)
      setCachedVideos(videoUrls)
    }

    loadCachedVideos()
  }, [])

  return (
   <div className="Uploads flex flex-col w-full h-full bg-white rounded-3xl">
        <h1 className='text-3xl font-bold mb-8'>Vidéos en cache</h1>
      <div className="uploadsContainer w-full h-full pt-6 overflow-y-auto">
        {cachedVideos.map((videoUrl, index) => (
          <div key={index} className='bg-white p-4 rounded-lg shadow-md'>
            {/* Utilisez votre lecteur vidéo ou une image avec le chemin spécifié */}
            <video controls className='w-full h-48 object-cover mb-4'>
              <source src={videoUrl} type='video/mp4' />
              Votre navigateur ne prend pas en charge la lecture de la vidéo.
            </video>
            <p className='text-lg font-semibold mb-2'>description video</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default CacheViewer
