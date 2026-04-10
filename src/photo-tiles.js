function previewUrl(photo) {
  return `/api/photos/${photo.id}/preview`;
}

export function renderPhotoTiles(container, photos) {
  if (!photos.length) {
    container.innerHTML = '<p class="empty-state">This album has no photos yet.</p>';
    return;
  }

  container.innerHTML = photos.map((photo) => {
    const showPreview = photo.previewStatus !== "missing" && photo.previewStatus !== "error";
    return `
      <figure class="photo-tile">
        ${showPreview ? `<img src="${previewUrl(photo)}" alt="${photo.fileName}" loading="lazy">` : '<div class="photo-placeholder">Preview unavailable</div>'}
        <figcaption>${photo.fileName}</figcaption>
      </figure>
    `;
  }).join("");
}
