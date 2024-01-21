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

        // Récupérer les informations du cache pour la vidéo
        const infoRequest = new Request(videoUrl + '-info');
        const infoResponse = await cache.match(infoRequest);
        if (infoResponse) {
          const infoText = await infoResponse.text();
          const videoInfo = JSON.parse(infoText);

          // Ne créez pas un nouvel élément vidéo ici, utilisez les informations existantes
          return {
            videoUrl,
            // Utilisez les informations existantes
            videoId: videoInfo.id,
            videoUniid: videoInfo.uniid,
            videoTitle: videoInfo.title,
          };
        } else {
          console.error('Info response not found for:', videoUrl);
          return null;
        }
      });

      // Attendre que toutes les informations soient récupérées avant de mettre à jour l'état
      const videoDataArrayResolved = await Promise.all(videoDataArray);
      const filteredVideoDataArray = videoDataArrayResolved.filter(Boolean); // Filtrer les valeurs nulles
      setCachedVideos(filteredVideoDataArray);
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
            <pre>{JSON.stringify(videoData, null, 2)}</pre>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CacheViewer;
