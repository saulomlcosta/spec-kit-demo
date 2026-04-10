export function enhanceAlbumKeyboardReorder(container, onReorderAlbum) {
  container.querySelectorAll("[data-action='move-up'], [data-action='move-down']").forEach((button) => {
    button.addEventListener("click", async () => {
      const card = button.closest(".album-card");
      const direction = button.dataset.action === "move-up" ? -1 : 1;
      const index = Number(card.dataset.index);
      const targetIndex = Math.max(0, index + direction);

      await onReorderAlbum({
        albumId: Number(card.dataset.albumId),
        dateGroupKey: card.dataset.dateGroup,
        targetIndex
      });
    });
  });
}
