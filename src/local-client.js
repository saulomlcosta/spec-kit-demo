async function request(path, options = {}) {
  const response = await fetch(path, {
    headers: {
      "content-type": "application/json",
      ...(options.headers || {})
    },
    ...options
  });

  if (!response.ok) {
    let message = `Request failed with ${response.status}`;
    try {
      const body = await response.json();
      message = body.error || message;
    } catch {
      // Keep the generic message when the response is not JSON.
    }
    throw new Error(message);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export function listAlbumsByDate() {
  return request("/api/albums");
}

export function createAlbum(album) {
  return request("/api/albums", {
    method: "POST",
    body: JSON.stringify(album)
  });
}

export function reorderAlbum(payload) {
  return request("/api/albums/reorder", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export function getAlbumPhotos(albumId) {
  return request(`/api/albums/${albumId}/photos`);
}

export function addAlbumPhoto(albumId, photo) {
  return request(`/api/albums/${albumId}/photos`, {
    method: "POST",
    body: JSON.stringify(photo)
  });
}
