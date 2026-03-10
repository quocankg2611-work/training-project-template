export const onAppReady = (fn: () => void) => {
  if (document.readyState !== 'loading') {
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
};

export const onAppBeforeUnload = (fn: () => void) => {
  window.addEventListener("beforeunload", fn);
}
