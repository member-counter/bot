export function mentionColor(color: number) {
  return {
    text: "#" + color.toString(16),
    background: "#" + color.toString(16) + Math.round(255 * 0.3).toString(16),
    backgroundHover:
      "#" + color.toString(16) + Math.round(255 * 0.4).toString(16),
  };
}
