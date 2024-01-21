// Importez useState et useEffect de 'react'
import React, { useState, useEffect } from 'react';

const CacheViewer = () => {
  const [cachedVideos, setCachedVideos] = useState([]);

  useEffect(() => {
    const loadCachedVideos = async () => {
      try {
        const cache = await caches.open('video-cache');
        const cachedRequests = await cache.keys();

        // Utilisez map pour transformer chaque requête en une promesse résolue avec les informations de la vidéo
        const videoDataArray = await Promise.all(
          cachedRequests.map(async (request) => {
            const videoUrl = request.url;

            // Récupérer les informations du cache pour la vidéo
            const infoRequest = new Request(videoUrl + '-info');
            const infoResponse = await cache.match(infoRequest);

            if (infoResponse) {
              const infoText = await infoResponse.text();
              const videoInfo = JSON.parse(infoText);

              return {
                videoUrl,
                videoId: videoInfo.id,
                videoUniid: videoInfo.uniid,
                videoTitle: videoInfo.title,
              };
            } else {
              console.error('Info response not found for:', videoUrl);
              return null;
            }
          })
        );

        // Filtrer les valeurs nulles (les vidéos sans informations)
        const filteredVideoDataArray = videoDataArray.filter(Boolean);
        setCachedVideos(filteredVideoDataArray);
      } catch (error) {
        console.error('Erreur lors du chargement des vidéos en cache :', error);
      }
    };

    loadCachedVideos();
  }, []);

  return (
    <div className="Uploads flex flex-col w-full h-full bg-white rounded-3xl">
      <h1 className="text-3xl font-bold mb-8">Vidéos en cache</h1>
      <div className="uploadsContainer w-full h-full pt-6 overflow-y-auto">
        {cachedVideos.map((videoData, index) => (
          <div key={index} className="bg-white p-4 rounded-lg shadow-md">
            <video controls className="w-full h-48 object-cover mb-4">
              <source src={videoData.videoUrl} type="video/mp4" />
              Votre navigateur ne prend pas en charge la lecture de la vidéo.
            </video>
            <p className="text-lg font-semibold mb-2">ID: {videoData.videoId}</p>
            <p className="text-lg font-semibold mb-2">Uniid: {videoData.videoUniid}</p>
            <p className="text-lg font-semibold mb-2">Title: {videoData.videoTitle}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CacheViewer;
