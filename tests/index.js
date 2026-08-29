// src/index.ts
var DEFAULT_PARSER = (value) => value.split(/\s+/);
var DEFAULT_SERIALIZER = (tokens) => tokens.join(" ");
function addAttributeToken(element, name, token, options = {}) {
  const value = element.getAttribute(name)?.trim();
  const {
    caseInsensitive = false,
    parse = DEFAULT_PARSER,
    serialize = DEFAULT_SERIALIZER
  } = options;
  const tokens = value ? parse(value).filter(Boolean) : [];
  if (caseInsensitive) {
    const lower = token.toLowerCase();
    if (tokens.every((token2) => token2.toLowerCase() !== lower)) {
      tokens.push(token);
      element.setAttribute(name, serialize(tokens));
    }
  } else {
    const set = new Set(tokens);
    set.add(token);
    element.setAttribute(name, serialize([...set]));
  }
}
function removeAttributeToken(element, name, token, options = {}) {
  const value = element.getAttribute(name)?.trim();
  if (!value) {
    return;
  }
  const {
    caseInsensitive = false,
    parse = DEFAULT_PARSER,
    serialize = DEFAULT_SERIALIZER
  } = options;
  const tokens = parse(value).filter(Boolean);
  if (!tokens.length) {
    return;
  }
  if (caseInsensitive) {
    const lower = token.toLowerCase();
    const filtered = tokens.filter((token2) => token2.toLowerCase() !== lower);
    if (filtered.length !== tokens.length) {
      filtered.length ? element.setAttribute(name, serialize(filtered)) : element.removeAttribute(name);
    }
  } else {
    const set = new Set(tokens);
    set.delete(token);
    if (set.size !== tokens.length) {
      set.size ? element.setAttribute(name, serialize([...set])) : element.removeAttribute(name);
    }
  }
}
var snapshots = /* @__PURE__ */ new WeakMap();
function restoreAttributes(element_or_elements) {
  for (const element of Array.isArray(element_or_elements) ? element_or_elements : [element_or_elements]) {
    const snapshot = snapshots.get(element);
    if (!snapshot) {
      continue;
    }
    for (const [name, value] of snapshot.entries()) {
      value === null ? element.removeAttribute(name) : element.setAttribute(name, value);
    }
    snapshots.delete(element);
  }
}
function saveAttributes(element_or_elements, name_or_names) {
  const names = Array.isArray(name_or_names) ? name_or_names : [name_or_names];
  (Array.isArray(element_or_elements) ? element_or_elements : [element_or_elements]).forEach((element) => {
    let snapshot = snapshots.get(element);
    if (!snapshot) {
      snapshot = /* @__PURE__ */ new Map();
      snapshots.set(element, snapshot);
    }
    names.forEach((name) => {
      snapshot.set(name, element.getAttribute(name));
    });
  });
}
/**
 * Attribute Utils
 *
 * @version 2.0.4
 * @author Yusuke Kamiyamane
 * @license MIT
 * @copyright Copyright (c) Yusuke Kamiyamane
 * @see {@link https://github.com/y14e/attribute-utils}
 */

export { addAttributeToken, removeAttributeToken, restoreAttributes, saveAttributes };
