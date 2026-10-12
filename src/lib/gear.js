// Builds an SVG path for a spur-gear outline centred on (cx, cy).
export function gearPath({ cx = 50, cy = 50, outer = 46, root = 38, teeth = 10, top = 0.42, flank = 0.1 } = {}) {
  const step = (Math.PI * 2) / teeth
  const pts = []
  for (let i = 0; i < teeth; i++) {
    const a = i * step - Math.PI / 2
    const rootSpan = (1 - top - flank * 2) * step
    const seq = [
      [root, a],
      [root, a + rootSpan],
      [outer, a + rootSpan + flank * step],
      [outer, a + rootSpan + (flank + top) * step],
      [root, a + step],
    ]
    for (const [r, t] of seq) pts.push([cx + r * Math.cos(t), cy + r * Math.sin(t)])
  }
  return 'M' + pts.map(([x, y]) => `${x.toFixed(2)},${y.toFixed(2)}`).join('L') + 'Z'
}
