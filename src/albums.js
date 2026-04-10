import { bindDragReorder } from "./drag-reorder.js";
import { enhanceAlbumKeyboardReorder } from "./accessibility.js";

function albumSummary(album) {
  const photoText = album.photoCount === 1 ? "1 photo" : `${album.photoCount} photos`;
  return `${photoText}`;
}

export function renderAlbumGroups(container, groups, handlers) {
  if (!groups.length) {
    container.innerHTML = '<p class="empty-state">No albums yet. Create an album to get started.</p>';
    return;
  }

  container.innerHTML = groups.map((group) => `
    <section class="date-group" aria-labelledby="group-${group.key}">
      <div class="date-group__header">
        <h3 id="group-${group.key}">${group.label}</h3>
        <span>${group.albumCount} album${group.albumCount === 1 ? "" : "s"}</span>
      </div>
      <div class="album-list" data-date-group="${group.key}" role="list">
        ${group.albums.map((album, index) => `
          <article
            class="album-card"
            draggable="true"
            data-album-id="${album.id}"
            data-date-group="${group.key}"
            data-index="${index}"
            role="listitem"
            tabindex="0"
            aria-label="${album.name}, ${albumSummary(album)}"
          >
            <button class="album-card__open" type="button" data-action="open" data-album-id="${album.id}">
              <span>${album.name}</span>
              <small>${albumSummary(album)}</small>
            </button>
            <div class="album-card__controls" aria-label="Reorder ${album.name}">
              <button type="button" data-action="move-up" data-album-id="${album.id}" aria-label="Move ${album.name} up">Up</button>
              <button type="button" data-action="move-down" data-album-id="${album.id}" aria-label="Move ${album.name} down">Down</button>
            </div>
          </article>
        `).join("")}
      </div>
    </section>
  `).join("");

  const albums = new Map(groups.flatMap((group) => group.albums.map((album) => [String(album.id), album])));

  container.querySelectorAll("[data-action='open']").forEach((button) => {
    button.addEventListener("click", () => handlers.onOpenAlbum(albums.get(button.dataset.albumId)));
  });

  bindDragReorder(container, handlers.onReorderAlbum);
  enhanceAlbumKeyboardReorder(container, handlers.onReorderAlbum);
}
