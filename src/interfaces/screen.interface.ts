export interface Screen {
  create(parent: HTMLElement): void;
  show(): void;
  hide(): void;
}
