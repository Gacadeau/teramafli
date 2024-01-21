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

        // Vérifier si la clé se termine par "-info"
        const isInfoKey = videoUrl.endsWith('-info');

        // Si c'est une clé d'information, récupérer les informations
        if (isInfoKey) {
          const infoText = await cache.match(request).then(res => res.text());
          console.log('Info for:', videoUrl, ' - ', infoText);
          return null; // Retourner null pour ne pas inclure les infos dans la liste des vidéos
        }

        // Si ce n'est pas une clé d'information, récupérer les vidéos
        return {
          videoUrl,
          // Ajoutez d'autres propriétés que vous avez définies dans Describe.js
          videoId: request.videoId, // Utilisez les informations existantes
          videoUniid: request.videoUniid, // Utilisez les informations existantes
          videoTitle: request.videoTitle, // Utilisez les informations existantes
        };
      });

      // Filtrer les entrées nulles (informations) de la liste des vidéos
      const videoDataArrayResolved = (await Promise.all(videoDataArray)).filter(videoData => videoData !== null);
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
            <pre>{JSON.stringify(videoData, null, 2)}</pre>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CacheViewer;
