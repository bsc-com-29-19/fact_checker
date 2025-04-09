// global.d.ts
export {};

declare global {
  interface Window {
    __isModelSelecting?: boolean;
  }
}
