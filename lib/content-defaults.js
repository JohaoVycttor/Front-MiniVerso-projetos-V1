function isObject(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function matchingDefault(value, defaults, index) {
  if (!isObject(value)) return defaults[index];
  if (typeof value.id === "string") {
    const match = defaults.find((item) => isObject(item) && item.id === value.id);
    if (match) return match;
  }
  if (typeof value.type === "string") {
    const match = defaults.find((item) => isObject(item) && item.type === value.type);
    if (match) return match;
  }
  return defaults[index];
}

export function mergeContentDefaults(value, defaults) {
  if (Array.isArray(defaults)) {
    if (!Array.isArray(value)) return structuredClone(defaults);
    return value.map((item, index) => {
      const fallback = matchingDefault(item, defaults, index);
      return fallback === undefined ? item : mergeContentDefaults(item, fallback);
    });
  }
  if (isObject(defaults)) {
    const result = isObject(value) ? { ...value } : {};
    for (const [key, fallback] of Object.entries(defaults)) {
      result[key] = key in result ? mergeContentDefaults(result[key], fallback) : structuredClone(fallback);
    }
    return result;
  }
  return value === undefined ? defaults : value;
}
