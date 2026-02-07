export function showContextMenu(menu: HTMLElement, x: number, y: number): void {
  const oldMenu = document.querySelector(".custom-context-menu");
  oldMenu?.remove();

  menu.style.position = "absolute";
  menu.style.zIndex = "1000";
  menu.style.top = y + "px";
  menu.style.left = x - 40 + "px";

  document.body.append(menu);

  const removeMenu = (e: MouseEvent) => {
    if (!menu.contains(e.target as Node)) {
      menu.remove();
      document.removeEventListener("click", removeMenu);
    }
  };
  document.addEventListener("click", removeMenu);
}
