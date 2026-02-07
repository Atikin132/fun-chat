export function scrollToBottom(container?: HTMLElement) {
  if (container) {
    container.scrollTop = container.scrollHeight;
  }
}
