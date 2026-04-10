import { renderAlbumGroups } from "./albums.js";
import { getAlbumPhotos, createAlbum, listAlbumsByDate, reorderAlbum } from "./local-client.js";
import { renderPhotoTiles } from "./photo-tiles.js";

const elements = {
  form: document.querySelector("#album-form"),
  name: document.querySelector("#album-name"),
  date: document.querySelector("#album-date"),
  groups: document.querySelector("#album-groups"),
  message: document.querySelector("#message"),
  refresh: document.querySelector("#refresh-albums"),
  albumView: document.querySelector("#album-view"),
  albumViewTitle: document.querySelector("#album-view-title"),
  closeAlbum: document.querySelector("#close-album"),
  photoGrid: document.querySelector("#photo-grid")
};

let currentGroups = [];

function setMessage(message, tone = "neutral") {
  elements.message.textContent = message;
  elements.message.dataset.tone = tone;
}

async function loadAlbums() {
  setMessage("Loading albums...");
  try {
    const data = await listAlbumsByDate();
    currentGroups = data.groups;
    renderAlbumGroups(elements.groups, currentGroups, {
      onOpenAlbum: openAlbum,
      onReorderAlbum: handleReorder
    });
    setMessage(currentGroups.length ? "" : "No albums yet. Create an album to get started.");
  } catch (error) {
    setMessage(error.message, "error");
  }
}

async function handleReorder({ albumId, dateGroupKey, targetIndex }) {
  try {
    const data = await reorderAlbum({ albumId, dateGroupKey, targetIndex });
    currentGroups = data.groups;
    renderAlbumGroups(elements.groups, currentGroups, {
      onOpenAlbum: openAlbum,
      onReorderAlbum: handleReorder
    });
    setMessage("Album order saved.", "success");
  } catch (error) {
    setMessage(error.message, "error");
    await loadAlbums();
  }
}

async function openAlbum(album) {
  elements.albumView.hidden = false;
  elements.albumViewTitle.textContent = album.name;
  elements.photoGrid.innerHTML = '<p class="empty-state">Loading photos...</p>';

  try {
    const data = await getAlbumPhotos(album.id);
    renderPhotoTiles(elements.photoGrid, data.photos);
  } catch (error) {
    elements.photoGrid.innerHTML = `<p class="empty-state">${error.message}</p>`;
  }
}

elements.form.addEventListener("submit", async (event) => {
  event.preventDefault();
  try {
    await createAlbum({
      name: elements.name.value,
      albumDate: elements.date.value || null
    });
    elements.form.reset();
    await loadAlbums();
    setMessage("Album created.", "success");
  } catch (error) {
    setMessage(error.message, "error");
  }
});

elements.refresh.addEventListener("click", loadAlbums);
elements.closeAlbum.addEventListener("click", () => {
  elements.albumView.hidden = true;
  elements.photoGrid.innerHTML = "";
});

loadAlbums();
