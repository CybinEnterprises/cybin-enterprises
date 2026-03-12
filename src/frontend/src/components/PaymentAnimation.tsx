import { useEffect, useRef } from "react";

interface PaymentAnimationProps {
  mode?: "dark" | "light";
}

export default function PaymentAnimation({ mode = "dark" }: PaymentAnimationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isLight = mode === "light";

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let time = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2); // Limit DPR for performance
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };
    resize();
    window.addEventListener("resize", resize);

    // Money elements - realistic bills and coins
    const moneyItems: Array<{
      x: number;
      y: number;
      baseX: number;
      baseY: number;
      rotation: number;
      floatPhase: number;
      type: "bill" | "coin";
      denomination: number;
    }> = [];

    const centerX = 250;
    const centerY = 250;

    // Create realistic money arrangement
    const positions = [
      { angle: 0, dist: 130, type: "bill" as const, denom: 100 },
      { angle: 45, dist: 150, type: "coin" as const, denom: 1 },
      { angle: 90, dist: 130, type: "bill" as const, denom: 100 },
      { angle: 135, dist: 150, type: "coin" as const, denom: 1 },
      { angle: 180, dist: 130, type: "bill" as const, denom: 100 },
      { angle: 225, dist: 150, type: "coin" as const, denom: 1 },
      { angle: 270, dist: 130, type: "bill" as const, denom: 100 },
      { angle: 315, dist: 150, type: "coin" as const, denom: 1 },
      { angle: 30, dist: 180, type: "bill" as const, denom: 100 },
      { angle: 120, dist: 180, type: "coin" as const, denom: 1 },
      { angle: 210, dist: 180, type: "bill" as const, denom: 100 },
      { angle: 300, dist: 180, type: "coin" as const, denom: 1 },
    ];

    positions.forEach((pos) => {
      const rad = (pos.angle * Math.PI) / 180;
      moneyItems.push({
        x: centerX + Math.cos(rad) * pos.dist,
        y: centerY + Math.sin(rad) * pos.dist,
        baseX: centerX + Math.cos(rad) * pos.dist,
        baseY: centerY + Math.sin(rad) * pos.dist,
        rotation: Math.random() * Math.PI * 2,
        floatPhase: Math.random() * Math.PI * 2,
        type: pos.type,
        denomination: pos.denom,
      });
    });

    // Draw realistic $100 bill
    const drawBill = (x: number, y: number, rotation: number, opacity: number) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation);
      
      const width = 50;
      const height = 22;
      
      // Bill shadow
      ctx.shadowColor = isLight ? "rgba(0, 0, 0, 0.3)" : "rgba(0, 0, 0, 0.4)";
      ctx.shadowBlur = 15;
      ctx.shadowOffsetY = 5;
      
      // Bill background - green gradient
      const billGradient = ctx.createLinearGradient(-width, -height, width, height);
      billGradient.addColorStop(0, `rgba(22, 163, 74, ${opacity})`);
      billGradient.addColorStop(0.5, `rgba(34, 197, 94, ${opacity})`);
      billGradient.addColorStop(1, `rgba(22, 163, 74, ${opacity})`);
      
      ctx.fillStyle = billGradient;
      ctx.beginPath();
      ctx.roundRect(-width, -height, width * 2, height * 2, 4);
      ctx.fill();
      
      ctx.shadowBlur = 0;
      ctx.shadowOffsetY = 0;
      
      // White border
      ctx.strokeStyle = `rgba(255, 255, 255, ${opacity * 0.6})`;
      ctx.lineWidth = 1.5;
      ctx.stroke();
      
      // Inner pattern
      ctx.strokeStyle = `rgba(255, 255, 255, ${opacity * 0.3})`;
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      ctx.roundRect(-width * 0.85, -height * 0.85, width * 1.7, height * 1.7, 2);
      ctx.stroke();
      
      // "100" text
      ctx.fillStyle = `rgba(255, 255, 255, ${opacity * 0.9})`;
      ctx.font = "bold 11px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("100", 0, 0);
      
      // Corner decorations
      ctx.font = "bold 6px sans-serif";
      ctx.fillText("100", -width + 8, -height + 6);
      ctx.fillText("100", width - 8, height - 6);
      
      ctx.restore();
    };

    // Draw realistic gold coin
    const drawCoin = (x: number, y: number, rotation: number, opacity: number) => {
      ctx.save();
      ctx.translate(x, y);
      
      const size = 16;
      
      // Coin shadow
      ctx.shadowColor = "rgba(0, 0, 0, 0.4)";
      ctx.shadowBlur = 12;
      ctx.shadowOffsetY = 4;
      
      // Outer gold ring with 3D effect
      const outerGradient = ctx.createRadialGradient(
        -size * 0.3, -size * 0.3, 0,
        0, 0, size
      );
      outerGradient.addColorStop(0, `rgba(252, 211, 77, ${opacity})`);
      outerGradient.addColorStop(0.4, `rgba(251, 191, 36, ${opacity})`);
      outerGradient.addColorStop(0.8, `rgba(245, 158, 11, ${opacity})`);
      outerGradient.addColorStop(1, `rgba(180, 83, 9, ${opacity})`);
      
      ctx.fillStyle = outerGradient;
      ctx.beginPath();
      ctx.ellipse(0, 0, size, size * 0.35, rotation, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.shadowBlur = 0;
      ctx.shadowOffsetY = 0;
      
      // Inner ridge
      ctx.strokeStyle = `rgba(251, 191, 36, ${opacity * 0.8})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.ellipse(0, 0, size * 0.85, size * 0.3, rotation, 0, Math.PI * 2);
      ctx.stroke();
      
      // Inner face
      const innerGradient = ctx.createRadialGradient(
        -size * 0.2, -size * 0.2, 0,
        0, 0, size * 0.75
      );
      innerGradient.addColorStop(0, `rgba(252, 211, 77, ${opacity})`);
      innerGradient.addColorStop(1, `rgba(251, 191, 36, ${opacity})`);
      
      ctx.fillStyle = innerGradient;
      ctx.beginPath();
      ctx.ellipse(0, 0, size * 0.75, size * 0.26, rotation, 0, Math.PI * 2);
      ctx.fill();
      
      // Shine reflection
      ctx.fillStyle = `rgba(255, 255, 255, ${opacity * 0.4})`;
      ctx.beginPath();
      ctx.ellipse(-size * 0.3, -size * 0.1, size * 0.3, size * 0.1, rotation, 0, Math.PI * 2);
      ctx.fill();
      
      // "$" symbol
      ctx.fillStyle = `rgba(69, 26, 3, ${opacity * 0.9})`;
      ctx.font = `bold ${size * 0.7}px sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("$", 0, 0);
      
      ctx.restore();
    };

    // Draw elegant bank vault/strongbox
    const drawBank = () => {
      const size = 90;
      
      // Outer glow halo
      const halo = ctx.createRadialGradient(centerX, centerY, size * 0.8, centerX, centerY, size * 2);
      halo.addColorStop(0, isLight ? `rgba(99, 102, 241, 0.15)` : `rgba(110, 247, 212, 0.1)`);
      halo.addColorStop(1, "transparent");
      ctx.fillStyle = halo;
      ctx.fillRect(centerX - size * 2.5, centerY - size * 2.5, size * 5, size * 5);
      
      // Vault body shadow
      ctx.shadowColor = isLight ? "rgba(0, 0, 0, 0.2)" : "rgba(0, 0, 0, 0.4)";
      ctx.shadowBlur = 30;
      ctx.shadowOffsetY = 10;
      
      // Vault body - cylindrical shape
      const bodyGradient = ctx.createLinearGradient(centerX - size, centerY - size, centerX + size, centerY + size);
      bodyGradient.addColorStop(0, isLight ? "rgba(71, 85, 105, 0.98)" : "rgba(51, 65, 85, 0.98)");
      bodyGradient.addColorStop(0.5, isLight ? "rgba(100, 116, 139, 0.98)" : "rgba(71, 85, 105, 0.98)");
      bodyGradient.addColorStop(1, isLight ? "rgba(71, 85, 105, 0.98)" : "rgba(51, 65, 85, 0.98)");
      
      ctx.fillStyle = bodyGradient;
      ctx.beginPath();
      ctx.ellipse(centerX, centerY + size * 0.4, size * 1.1, size * 0.35, 0, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.shadowBlur = 0;
      ctx.shadowOffsetY = 0;
      
      // Vault door (circular)
      const doorGradient = ctx.createRadialGradient(
        centerX - size * 0.2, centerY - size * 0.2, 0,
        centerX, centerY, size
      );
      doorGradient.addColorStop(0, isLight ? "rgba(148, 163, 184, 0.98)" : "rgba(100, 116, 139, 0.98)");
      doorGradient.addColorStop(0.7, isLight ? "rgba(71, 85, 105, 0.98)" : "rgba(51, 65, 85, 0.98)");
      doorGradient.addColorStop(1, isLight ? "rgba(30, 41, 59, 0.98)" : "rgba(15, 23, 42, 0.98)");
      
      ctx.fillStyle = doorGradient;
      ctx.beginPath();
      ctx.arc(centerX, centerY, size, 0, Math.PI * 2);
      ctx.fill();
      
      // Outer rim
      ctx.strokeStyle = isLight ? `rgba(99, 102, 241, 0.6)` : `rgba(110, 247, 212, 0.5)`;
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(centerX, centerY, size, 0, Math.PI * 2);
      ctx.stroke();
      
      // Inner rim
      ctx.strokeStyle = isLight ? `rgba(99, 102, 241, 0.3)` : `rgba(110, 247, 212, 0.25)`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(centerX, centerY, size * 0.85, 0, Math.PI * 2);
      ctx.stroke();
      
      // Vault spokes/handles
      const spokeColors = isLight 
        ? ["rgba(99, 102, 241, 0.8)", "rgba(79, 70, 229, 0.8)"]
        : ["rgba(110, 247, 212, 0.8)", "rgba(52, 211, 153, 0.8)"];
      
      for (let i = 0; i < 6; i++) {
        const angle = (i * 60 * Math.PI) / 180;
        const spokeGradient = ctx.createLinearGradient(
          centerX + Math.cos(angle) * size * 0.3,
          centerY + Math.sin(angle) * size * 0.3,
          centerX + Math.cos(angle) * size * 0.8,
          centerY + Math.sin(angle) * size * 0.8
        );
        spokeGradient.addColorStop(0, spokeColors[0]);
        spokeGradient.addColorStop(1, spokeColors[1]);
        
        ctx.strokeStyle = spokeGradient;
        ctx.lineWidth = 8;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(
          centerX + Math.cos(angle) * size * 0.3,
          centerY + Math.sin(angle) * size * 0.3
        );
        ctx.lineTo(
          centerX + Math.cos(angle) * size * 0.75,
          centerY + Math.sin(angle) * size * 0.75
        );
        ctx.stroke();
      }
      
      // Center hub
      const hubGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, size * 0.25);
      hubGradient.addColorStop(0, isLight ? "rgba(99, 102, 241, 0.9)" : "rgba(110, 247, 212, 0.9)");
      hubGradient.addColorStop(1, isLight ? "rgba(79, 70, 229, 0.9)" : "rgba(52, 211, 153, 0.9)");
      
      ctx.fillStyle = hubGradient;
      ctx.beginPath();
      ctx.arc(centerX, centerY, size * 0.22, 0, Math.PI * 2);
      ctx.fill();
      
      // Center lock keyhole
      ctx.fillStyle = isLight ? "rgba(30, 41, 59, 0.9)" : "rgba(15, 23, 42, 0.9)";
      ctx.beginPath();
      ctx.arc(centerX, centerY - 3, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillRect(centerX - 3, centerY - 3, 6, 10);
      
      // Glowing "$" on vault
      ctx.save();
      ctx.shadowColor = isLight ? "rgba(99, 102, 241, 0.8)" : "rgba(110, 247, 212, 0.8)";
      ctx.shadowBlur = 15;
      ctx.fillStyle = "rgba(255, 255, 255, 0.95)";
      ctx.font = `bold ${size * 0.25}px sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("$", centerX, centerY - 50);
      ctx.restore();
    };

    const animate = () => {
      time += 0.016;
      ctx.clearRect(0, 0, 500, 500);
      
      // Draw subtle orbital ring
      ctx.strokeStyle = isLight ? `rgba(99, 102, 241, 0.06)` : `rgba(110, 247, 212, 0.05)`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(centerX, centerY, 180, 0, Math.PI * 2);
      ctx.stroke();
      
      // Draw bank vault
      drawBank();
      
      // Animate money items with gentle floating
      moneyItems.forEach((item) => {
        // Gentle bobbing motion
        const bobOffset = Math.sin(time * 0.5 + item.floatPhase) * 6;
        item.x = item.baseX;
        item.y = item.baseY + bobOffset;
        
        // Very slow rotation
        item.rotation += 0.001;
        
        // Calculate opacity based on position
        const distFromCenter = Math.sqrt((item.x - centerX) ** 2 + (item.y - centerY) ** 2);
        const opacity = Math.max(0.5, 1 - (distFromCenter - 120) / 100);
        
        // Draw connection line to vault (subtle)
        if (distFromCenter < 170) {
          ctx.strokeStyle = isLight 
            ? `rgba(99, 102, 241, ${0.06 * opacity})` 
            : `rgba(110, 247, 212, ${0.05 * opacity})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(item.x, item.y);
          ctx.lineTo(centerX, centerY);
          ctx.stroke();
        }
        
        // Draw the money item
        if (item.type === "bill") {
          drawBill(item.x, item.y, item.rotation, opacity);
        } else {
          drawCoin(item.x, item.y, item.rotation, opacity);
        }
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, [isLight]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
      }}
    />
  );
}
