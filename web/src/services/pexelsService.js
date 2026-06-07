import axios from 'axios';

const PEXELS_API_KEY = import.meta.env.VITE_PEXELS_API_KEY;

const client = axios.create({
  baseURL: 'https://api.pexels.com',
  headers: { Authorization: PEXELS_API_KEY },
});

export async function searchVideos(query, perPage = 9) {
  const { data } = await client.get('/videos/search', {
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
