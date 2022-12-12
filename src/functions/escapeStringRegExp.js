export function escapeStringRegExp(str) {
  return str.replace(/[|\\{}()[\]^$+*?.]/g, "\\$&");
}
