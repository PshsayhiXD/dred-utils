export const sendKey = ({ key, delay = 0, event = "keydown", method = "dispatch", target }) => {
  const e = new KeyboardEvent(event, {
    key,
    code: key.length === 1 ? `Key${key.toUpperCase()}` : key,
    bubbles: true,
    cancelable: true
  });
  setTimeout(() => {
    const el =
      target ||
      (method === "focus"
        ? document.activeElement
        : method === "send"
          ? document.body
          : document);
    el?.dispatchEvent(e);
  }, delay);
};

export const inputKeys = async ({ input, key, event = "keydown", method = "focus", write = true }) => {
  if (!(input instanceof HTMLInputElement)) return;
  const keys = (Array.isArray(key) ? key : [key]).flatMap((v) =>
    typeof v === "string" && v.length > 1 && !["Enter", "Tab", "Escape", "Backspace", "Shift", "Control", "Alt", "Meta", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(v)
      ? [...v]
      : [v]
  );
  input.focus();
  for (let i = 0; i < keys.length; i++) {
    const k = keys[i];
    if (write && typeof k === "string" && k.length === 1 && "value" in input) {
      input.value += k;
      input.dispatchEvent(new Event("input", { bubbles: true }));
    }
    if (write && k === "Backspace" && "value" in input) {
      input.value = input.value.slice(0, -1);
      input.dispatchEvent(new Event("input", { bubbles: true }));
    }
    sendKey({ key: k, delay: 0, event, method, target: input });
    await new Promise((res) => setTimeout(res, 0));
  }
  return new Promise((resolve) => setTimeout(() => resolve(input.value), 0));
};

export const pressBtn = ({ btn, delay = 0, event = "click", option = { bubbles: true, cancelable: true } }) => {
  setTimeout(() => {
    btn?.click();
    dispatchEvent({ el: btn, events: [event], option });
  }, delay);
};

export const dispatchInputEvent = ({ input, events = ["input", "change"], option = { bubbles: true, cancelable: true } }) => {
  if (!(input instanceof HTMLElement)) return;
  events.forEach((event) => input.dispatchEvent(new Event(event, option)));
};

export const dispatchEvent = ({ el, events = ["click"], option = { bubbles: true, cancelable: true } }) => {
  if (!(el instanceof HTMLElement)) return;
  events.forEach((event) => el.dispatchEvent(new Event(event, option)));
};