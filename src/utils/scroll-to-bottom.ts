export function scrollToBottom(container?: HTMLElement | null) {
  if (container) {
    container.scrollTop = container.scrollHeight;
  }
}
