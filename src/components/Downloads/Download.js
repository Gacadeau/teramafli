// Dans CacheViewer.js
import React, { useState, useEffect } from 'react';

const CacheViewer = () => {
  const [cachedVideos, setCachedVideos] = useState([]);

  useEffect(() => {
    const loadCachedVideos = async () => {
      const cache = await caches.open('video-cache');
      const cachedRequests = await cache.keys();

      // Construire un tableau d'objets contenant les informations nécessaires
      const videoDataArray = cachedRequests.map(async (request) => {
        const videoUrl = request.url;

        // Ajouter d'autres informations à récupérer depuis la vidéo en cache
        const videoBlob = await cache.match(request).then((res) => res.blob());
        const videoElement = document.createElement('video');
        videoElement.src = window.URL.createObjectURL(videoBlob);

        return {
          videoUrl,
          // Ajoutez d'autres propriétés que vous avez définies dans Describe.js
          videoId: videoElement.id,
          videoUniid: videoElement.uniid,
          videoTitle: videoElement.title,
        };
      });

      // Attendre que toutes les informations soient récupérées avant de mettre à jour l'état
      const videoDataArrayResolved = await Promise.all(videoDataArray);
      setCachedVideos(videoDataArrayResolved);
    };

    loadCachedVideos();
  }, []);

  return (
    <div className="Uploads flex flex-col w-full h-full bg-white rounded-3xl">
      <h1 className='text-3xl font-bold mb-8'>Vidéos en cache</h1>
      <div className="uploadsContainer w-full h-full pt-6 overflow-y-auto">
        {cachedVideos.map((videoData, index) => (
          <div key={index} className='bg-white p-4 rounded-lg shadow-md'>
            <video controls className='w-full h-48 object-cover mb-4'>
              <source src={videoData.videoUrl} type='video/mp4' />
              Votre navigateur ne prend pas en charge la lecture de la vidéo.
            </video>
            <p className='text-lg font-semibold mb-2'>Title: {videoData.videoTitle}</p>
            {/* Ajoutez d'autres informations si nécessaire */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CacheViewer;
