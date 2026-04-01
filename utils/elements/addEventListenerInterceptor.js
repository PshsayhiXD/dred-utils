export const addEventListenerInterceptor = () => {
  if (window.__eventListenerInterceptored) return;
  window.__eventListenerInterceptored = true;
  const map = new WeakMap();
  const rawAdd = EventTarget.prototype.addEventListener;
  const rawRemove = EventTarget.prototype.removeEventListener;

  const norm = (opt) =>
    typeof opt === "boolean"
      ? { capture: opt, once: false, passive: false }
      : {
          capture: !!opt?.capture,
          once: !!opt?.once,
          passive: !!opt?.passive
        };

  const get = (el) => map.get(el) || [];
  EventTarget.prototype.addEventListener = function(type, fn, opt) {
    if (fn) {
      const arr = get(this);
      arr.push({ type, fn, ...norm(opt) });
      map.set(this, arr);
    }
    return rawAdd.call(this, type, fn, opt);
  };
  EventTarget.prototype.removeEventListener = function(type, fn, opt) {
    const arr = map.get(this);
    if (arr) {
      const { capture } = norm(opt);
      map.set(this, arr.filter((v) => !(v.type === type && v.fn === fn && v.capture === capture)));
    }
    return rawRemove.call(this, type, fn, opt);
  };
  window.__getTrackedListeners = get;
};

export const getTrackedListeners = (el) => window.__getTrackedListeners?.(el) || [];