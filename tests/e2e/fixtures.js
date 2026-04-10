export async function createAlbum(request, name, albumDate = null) {
  const response = await request.post("/api/albums", {
    data: { name, albumDate }
  });
  return (await response.json()).album;
}

export async function createPhoto(request, albumId, photo) {
  const response = await request.post(`/api/albums/${albumId}/photos`, {
    data: photo
  });
  return (await response.json()).photo;
}
