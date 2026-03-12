/**
 * NeuronCanvas - Animated neural network background
 * Auto-detects theme from CSS variables - no mode prop needed
 * Mode prop kept for backwards compatibility but ignored
 */

import { useEffect, useRef, useState } from "react";

interface NeuronCanvasProps {
  /** @deprecated Mode is now auto-detected from CSS variables */
  mode?: "dark" | "light";
  style?: React.CSSProperties;
}

/** Parse RGB from CSS variable */
function parseRgbVariable(varName: string): [number, number, number] {
  // Get computed style from document root
  const root = document.documentElement;
  const computedStyle = getComputedStyle(root);
  const rgbString = computedStyle.getPropertyValue(varName).trim();

  if (!rgbString) {
    // Fallback to defaults
    return varName.includes("secondary")
      ? [99, 102, 241] // dark secondary
      : [110, 247, 212]; // dark primary
  }

  // Handle rgb(r, g, b) format
  const match = rgbString.match(/(\d+),\s*(\d+),\s*(\d+)/);
  if (match) {
    return [
      Number.parseInt(match[1]),
      Number.parseInt(match[2]),
      Number.parseInt(match[3]),
    ];
  }

  // Handle hex format
  if (rgbString.startsWith("#")) {
    const hex = rgbString.slice(1);
    return [
      Number.parseInt(hex.slice(0, 2), 16),
      Number.parseInt(hex.slice(2, 4), 16),
      Number.parseInt(hex.slice(4, 6), 16),
    ];
  }

  // Fallback
  return varName.includes("secondary") ? [99, 102, 241] : [110, 247, 212];
}

export default function NeuronCanvas({
  mode: _mode,
  style,
}: NeuronCanvasProps) {
  // mode prop is deprecated - theme is now auto-detected from CSS variables
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [themeColors, setThemeColors] = useState<{
    dotColor: [number, number, number];
    lineColor: [number, number, number];
    dotAlpha: number;
    lineAlpha: number;
  }>({
    dotColor: [110, 247, 212],
    lineColor: [99, 102, 241],
    dotAlpha: 0.4,
    lineAlpha: 0.15,
  });

  // Detect theme from CSS variables
  useEffect(() => {
    const updateColors = () => {
      const dotColor = parseRgbVariable("--neuron-color");
      const lineColor = parseRgbVariable("--neuron-secondary");

      // Get opacity from CSS
      const root = document.documentElement;
      const computedStyle = getComputedStyle(root);
      const opacityStr = computedStyle
        .getPropertyValue("--neuron-opacity")
        .trim();
      const opacity = opacityStr ? Number.parseFloat(opacityStr) : 0.4;

      setThemeColors({
        dotColor,
        lineColor,
        dotAlpha: opacity,
        lineAlpha: opacity * 0.375,
      });
    };

    updateColors();

    // Listen for theme changes
    const observer = new MutationObserver(updateColors);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    // Also listen for load events (fonts may affect this)
    window.addEventListener("load", updateColors);

    return () => {
      observer.disconnect();
      window.removeEventListener("load", updateColors);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    const resizeObs = new ResizeObserver(resize);
    resizeObs.observe(canvas);

    const nodeCount = 35;
    const nodes = Array.from({ length: nodeCount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      pulseOffset: Math.random() * Math.PI * 2,
      pulseSpeed: 0.02 + Math.random() * 0.02,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const t = Date.now() * 0.001;

      const { dotColor, lineColor, dotAlpha, lineAlpha } = themeColors;

      for (const n of nodes) {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > canvas.width) n.vx *= -1;
        if (n.y < 0 || n.y > canvas.height) n.vy *= -1;
      }

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 140) {
            const alpha = lineAlpha * (1 - dist / 140);
            ctx.strokeStyle = `rgba(${lineColor[0]},${lineColor[1]},${lineColor[2]},${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }

      for (const n of nodes) {
        const pulse =
          dotAlpha *
          (0.6 + 0.4 * Math.sin(t * n.pulseSpeed * 60 + n.pulseOffset));
        ctx.fillStyle = `rgba(${dotColor[0]},${dotColor[1]},${dotColor[2]},${pulse})`;
        ctx.beginPath();
        ctx.arc(n.x, n.y, 2, 0, Math.PI * 2);
        ctx.fill();
      }

      animId = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(animId);
      resizeObs.disconnect();
    };
  }, [themeColors]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        ...style,
      }}
    />
  );
}
