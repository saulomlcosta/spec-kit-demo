let dragged = null;

function findTargetCard(event) {
  return event.target.closest(".album-card");
}

export function bindDragReorder(container, onReorderAlbum) {
  container.querySelectorAll(".album-card").forEach((card) => {
    card.addEventListener("dragstart", (event) => {
      dragged = {
        albumId: Number(card.dataset.albumId),
        dateGroupKey: card.dataset.dateGroup,
        index: Number(card.dataset.index)
      };
      card.classList.add("is-dragging");
      event.dataTransfer.effectAllowed = "move";
      event.dataTransfer.setData("text/plain", card.dataset.albumId);
    });

    card.addEventListener("dragend", () => {
      card.classList.remove("is-dragging");
      dragged = null;
      container.querySelectorAll(".is-drop-target").forEach((target) => target.classList.remove("is-drop-target"));
    });

    card.addEventListener("dragover", (event) => {
      if (!dragged) return;
      event.preventDefault();
      const target = findTargetCard(event);
      if (target?.dataset.dateGroup === dragged.dateGroupKey) {
        target.classList.add("is-drop-target");
      }
    });

    card.addEventListener("dragleave", () => {
      card.classList.remove("is-drop-target");
    });

    card.addEventListener("drop", async (event) => {
      event.preventDefault();
      const target = findTargetCard(event);
      if (!dragged || !target || target.dataset.dateGroup !== dragged.dateGroupKey) {
        return;
      }

      await onReorderAlbum({
        albumId: dragged.albumId,
        dateGroupKey: dragged.dateGroupKey,
        targetIndex: Number(target.dataset.index)
      });
    });
  });
}
