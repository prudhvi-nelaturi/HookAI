import axios from 'axios';

// Keys are injected server-side by the Vite proxy (see vite.config.js).
export async function searchVideos(query, perPage = 9) {
  const { data } = await axios.get('/api/pexels', {
    params: { query, per_page: perPage, orientation: 'portrait' },
  });
  return data.videos.map((v) => {
    // pick a vertical-ish file around HD, fall back to first
    const file =
      v.video_files.find((f) => f.quality === 'hd' && f.height >= f.width) ||
      v.video_files.find((f) => f.quality === 'sd' && f.height >= f.width) ||
      v.video_files[0];
    return {
      id: v.id,
      preview: v.image,
      duration: v.duration,
      downloadUrl: file?.link,
      pageUrl: v.url,
      author: v.user?.name,
    };
  });
}
