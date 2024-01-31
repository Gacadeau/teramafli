import React, { useEffect, useState, useContext } from 'react';
import { useRouter } from 'next/router';
import { SessionContext } from './Auth';
const VideoContext = React.createContext();

function VideoProvider(props) {
  const auto = useContext(SessionContext)
  const router = useRouter()
  const [video, setVideo] = useState(null);
  const [online, setOnline] = useState(true);


  const getVideoNameFromHeaders = (headers) => {
    const contentDispositionHeader = headers.get('Content-Disposition');
    if (contentDispositionHeader) {
      const match = contentDispositionHeader.match(/filename=(.+)/);
      if (match && match[1]) {
        return decodeURIComponent(match[1]);
      }
    }
    return 'Unknown';
  };
  
  const getFileInformationFromHeaders = (headers) => {
    const fileInfoHeader = headers.get('X-File-Info');
    if (fileInfoHeader) {
      return JSON.parse(fileInfoHeader);
    }
    return {
      name: 'Unknown',
      body: 'Unknown',
      page: 'Unknown',
      profil: 'Unknown',
      create: 'Unknown',
      Uuid: 'Unknown' ,
      uniid: 'Unkown',
    };
  };

  useEffect(()=>{
    const handleOnlineStatusChange = () =>{
      setOnline(navigator.onLine);
    };

    window.addEventListener('online',handleOnlineStatusChange);
    window.addEventListener('offline',handleOnlineStatusChange);
    setOnline(navigator.onLine);
    return () =>{
      window.removeEventListener('online' ,handleOnlineStatusChange);
      window.removeEventListener('offline',handleOnlineStatusChange);
    }

  },[]);

  useEffect(() => {
    async function fetchData(post, user) {
      if(online){
        const response = await fetch(`/api/posts/watch/${post}/0/${user}`);
        const data = await response.json();
        if (data[0]) setVideo(data[0]);

        if (router.query.v && auto.session) {
          if(auto.session === 'unlogged'){
            fetchData(router.query.v, 0)
          }else{
            fetchData(router.query.v, auto.session.ID)
          }
        }
      }
      else{
        const loadCachedVideos = async () => {
          try {
            // Charger la liste des vidéos depuis le cache
            const cache = await caches.open('downloaded-videos-cache');
            const requests = await cache.keys();
    
            const videoInfoPromises = requests.map(async (request, index) => {
              const url = request.url;
              const response = await cache.match(request);
              
              // Ajoutez ces lignes pour afficher la réponse du cache dans la console
              console.log('Cache Response:', response);
    
              const name = getVideoNameFromHeaders(response.headers);
              const fileInfo = getFileInformationFromHeaders(response.headers);
              const videoBlob = await response.blob();
    
              return { url, name, blob: videoBlob, ...fileInfo };
            });
    
            // Wait for all promises to resolve
            const videoInfoArray = await Promise.all(videoInfoPromises);
            setVideo(videoInfoArray);
            console.log('videos:', videoInfoArray);
          } catch (error) {
            console.error('Error loading cached videos:', error);
          }
        };
    
        loadCachedVideos();
      }
    }
  }, [router.query.v,auto,online]); // Ajout des dépendances router.query.v et auto.session

  return (
    <VideoContext.Provider
      value={{
        video,
      }}>
      {props.children}
    </VideoContext.Provider>
  );
}

export { VideoProvider, VideoContext };