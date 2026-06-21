import React, { useState, useEffect, useRef, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TitleReveal } from "./TitleReveal";
import { GlossaryWord } from "./GlossaryWord";

gsap.registerPlugin(ScrollTrigger);

export interface CardItem {
  title: string;
  description: React.ReactNode;
  imgUrl: string;
  alt?: string;
}

const DARK_PATTERNS: CardItem[] = [
  { 
    title: "Bẫy Khan Hiếm Ảo",
    description: "\"Chỉ còn 1 sản phẩm ở mức giá này\". Kích thích nỗi sợ bỏ lỡ (FOMO) của người tiêu dùng.",
    imgUrl: "/images/scarcity_trap.jpg"
  },
  {
    title: "Bằng Chứng Đám Đông",
    description: <>"152 người đang xem sản phẩm này". Lợi dụng <GlossaryWord id="bandwagon-effect">hiệu ứng bầy đàn</GlossaryWord> để tạo ảo giác về uy tín, thúc đẩy quyết định mua hàng.</>,
    imgUrl: "/images/Fake_Social_Proof.jpg"
  },
  {
    title: "Game Hóa Mua Sắm",
    description: "Trồng cây kiếm xu, Vòng quay may mắn. Biến việc tiêu dùng thành cơn nghiện dopamine.",
    imgUrl: "/images/Gamification.jpg"
  },
  {
    title: "Cuộn Vô Tận",
    description: <>Giao diện TikTok/Shopee Video không có điểm dừng, vắt kiệt <GlossaryWord id="attention-economy">sự chú ý</GlossaryWord> của người dùng.</>,
    imgUrl: "/images/Infinite_Scroll.jpg"
  },
  {
    title: "Bẫy Chi Phí Chìm",
    description: <>"Mua thêm 15k để được Freeship 30k". Đánh vào tâm lý tiếc <GlossaryWord id="sunk-cost">chi phí chìm</GlossaryWord>, buộc bạn mua những thứ không hề cần.</>,
    imgUrl: "/images/Sunk_Cost_Fallacy.jpg"
  },
  {
    title: "Mê Cung Hủy Đăng Ký",
    description: "Dễ dàng bấm nút Đăng ký gói, nhưng phải qua 10 bước phức tạp mới hủy được (Roach Motel).",
    imgUrl: "/images/Roach_Motel.jpg"
  }
];

const MAX_VISIBLE = 7;
const HALF = 3;

const FAN_POSITIONS = [
  { rot: -21, scale: 0.7756, x: -30, y: 7.3, zIndex: 1 },
  { rot: -14, scale: 0.8498, x: -22, y: 4.0, zIndex: 2 },
  { rot: -7,  scale: 0.9346, x: -11, y: 1.3, zIndex: 3 },
  { rot: 0,   scale: 1.0,    x: 0,   y: 0.0, zIndex: 10 },
  { rot: 7,   scale: 0.9346, x: 11,  y: 1.3, zIndex: 3 },
  { rot: 14,  scale: 0.8498, x: 22,  y: 4.0, zIndex: 2 },
  { rot: 21,  scale: 0.7756, x: 30,  y: 7.3, zIndex: 1 },
];

function getResponsiveMultiplier(width: number) {
  if (width < 480) return 0.28;
  if (width < 640) return 0.38;
  if (width < 768) return 0.5;
  if (width < 1024) return 0.75;
  return 1.0;
}

function getHeightMultiplier(width: number) {
  let idealPx: number;
  if (width < 480) idealPx = 22 * 16;
  else if (width < 640) idealPx = 26 * 16;
  else if (width < 768) idealPx = 28 * 16;
  else if (width < 1024) idealPx = 34 * 16;
  else idealPx = 38 * 16;

  const available = window.innerHeight * 0.7;
  if (available >= idealPx) return 1;
  return available / idealPx;
}

function getSlotConfig(totalCards: number, slot: number) {
  if (totalCards >= MAX_VISIBLE) return FAN_POSITIONS[slot];
  const center = totalCards >> 1;
  const distance = totalCards > 1 ? (slot - center) / center : 0;
  const absDistance = Math.abs(distance);
  return {
    rot: distance * 21,
    scale: 1.0 - 0.2244 * absDistance * absDistance,
    x: distance * 30,
    y: absDistance * absDistance * 7.3,
    zIndex: 10 - Math.abs(slot - center),
  };
}

const ARROW_CLASSES =
  "relative flex items-center justify-center rounded-full border-[1.5px] border-white/20 bg-white/5 backdrop-blur-[16px] text-white/60 cursor-pointer shrink-0 z-30 outline-none shadow-[0_4px_20px_rgba(0,0,0,0.4)] hover:border-orange-500/50 hover:text-orange-500 active:opacity-70 transition-colors duration-300 before:content-[''] before:absolute before:inset-[3px] before:rounded-full before:border before:border-white/[0.04] before:pointer-events-none";

export const DarkPatternsSection: React.FC = () => {
  const cards = DARK_PATTERNS;
  const containerRef = useRef<HTMLDivElement>(null);
  const isAnimating = useRef(false);
  const hasEntered = useRef(false);
  const directionRef = useRef<"left" | "right" | null>(null);
  const prevVisible = useRef<Set<number>>(new Set());

  const totalCards = cards.length;
  const needsPagination = totalCards > MAX_VISIBLE;
  const [centerIndex, setCenterIndex] = useState(needsPagination ? HALF : totalCards >> 1);

  const getVisibleMap = useCallback((center: number) => {
    const map = new Map<number, number>();
    if (!needsPagination) {
      cards.forEach((_, i) => map.set(i, i));
      return map;
    }
    for (let slot = 0; slot < MAX_VISIBLE; slot++) {
      map.set(((center + slot - HALF) % totalCards + totalCards) % totalCards, slot);
    }
    return map;
  }, [totalCards, needsPagination, cards]);

  const cycle = useCallback((direction: "left" | "right") => {
    if (isAnimating.current || !needsPagination) return;
    isAnimating.current = true;
    directionRef.current = direction;
    setCenterIndex(prev =>
      direction === "right" ? (prev + 1) % totalCards : (prev - 1 + totalCards) % totalCards
    );
  }, [totalCards, needsPagination]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !totalCards) return;

    const cardElements = Array.from(container.querySelectorAll<HTMLElement>(".fan-card"));
    if (!cardElements.length) return;

    const visibleMap = getVisibleMap(centerIndex);
    const previouslyVisible = prevVisible.current;
    const direction = directionRef.current;
    const isFirstMount = !hasEntered.current;
    const multiplier = getResponsiveMultiplier(window.innerWidth);
    const hMult = getHeightMultiplier(window.innerWidth);
    const slotCount = needsPagination ? MAX_VISIBLE : totalCards;
    const config = (slot: number) => getSlotConfig(slotCount, slot);

    if (isFirstMount) isAnimating.current = true;

    let completedCount = 0;
    const visibleCount = visibleMap.size;
    const onCardDone = () => {
      if (++completedCount >= visibleCount) {
        isAnimating.current = false;
        if (isFirstMount) hasEntered.current = true;
      }
    };

    cardElements.forEach((card, cardIndex) => {
      const slot = visibleMap.get(cardIndex);
      const wasVisible = previouslyVisible.has(cardIndex);

      if (slot !== undefined) {
        const { x, y, rot, scale, zIndex } = config(slot);
        const target = {
          x: `${x * multiplier}rem`,
          y: `${y * hMult}rem`,
          rotation: rot,
          scale,
          opacity: 1,
          zIndex,
        };

        if (isFirstMount) {
          gsap.set(card, { x: 0, y: `${12 * hMult}rem`, rotation: 0, scale: 0.5, opacity: 0 });
          gsap.to(card, { ...target, duration: 1.2, ease: "elastic.out(1.05,.78)", delay: 0.2 + slot * 0.06, scrollTrigger: { trigger: container, start: "top 60%" }, onComplete: onCardDone });
        } else if (!wasVisible) {
          const enterX = direction === "right" ? 40 : -40;
          gsap.set(card, { x: `${enterX}rem`, y: `${y * hMult}rem`, rotation: direction === "right" ? 30 : -30, scale: 0.5, opacity: 0 });
          gsap.to(card, { ...target, duration: 0.6, ease: "power2.out", onComplete: onCardDone });
        } else {
          gsap.to(card, { ...target, duration: 0.5, ease: "power2.out", onComplete: onCardDone });
        }
      } else if (wasVisible) {
        const exitX = direction === "right" ? -40 : 40;
        gsap.to(card, { x: `${exitX}rem`, opacity: 0, scale: 0.5, rotation: direction === "right" ? -30 : 30, duration: 0.4, ease: "power2.in", zIndex: 0 });
      } else if (isFirstMount) {
        gsap.set(card, { opacity: 0, scale: 0.3, x: 0, y: 0, zIndex: 0 });
      }
    });

    prevVisible.current = new Set(visibleMap.keys());

    // Hover interactions
    const visibleEntries: { el: HTMLElement; slot: number }[] = [];
    cardElements.forEach((el, i) => {
      const slot = visibleMap.get(i);
      if (slot !== undefined) visibleEntries.push({ el, slot });
    });
    visibleEntries.sort((a, b) => a.slot - b.slot);

    let activeSlot: number | null = null;
    let leaveTimer: ReturnType<typeof setTimeout> | null = null;
    const centerSlot = visibleEntries.length >> 1;

    const updateHoverLayout = (hoveredSlot: number | null) => {
      const mult = getResponsiveMultiplier(window.innerWidth);
      const hM = getHeightMultiplier(window.innerWidth);

      visibleEntries.forEach(({ el, slot }) => {
        const base = config(slot);
        let targetX = base.x * mult;
        let targetY = base.y * hM;
        let targetRot = base.rot;
        let targetScale = base.scale;
        let delay;

        if (hoveredSlot !== null) {
          const distance = Math.abs(slot - hoveredSlot);
          delay = distance * 0.02;

          if (slot === hoveredSlot) {
            targetY -= 2.5 * hM;
            targetScale *= 1.08;
          } else {
            const normalized = centerSlot > 0 ? (slot - centerSlot) / centerSlot : 0;
            const pushStrength = 8 * (1 - Math.abs(normalized)) * (1 + 0.2 * Math.max(0, 3 - distance));

            if (slot < hoveredSlot) {
              targetX -= pushStrength * mult;
              targetRot -= 3 / (distance + 1);
            } else {
              targetX += pushStrength * mult;
              targetRot += 3 / (distance + 1);
            }

            if (slot === visibleEntries.length - 1 && hoveredSlot < centerSlot) targetY -= 1 * hM;
            if (slot === 0 && hoveredSlot > centerSlot) targetY -= 1 * hM;
          }
        } else {
          delay = Math.abs(slot - centerSlot) * 0.02;
        }

        gsap.to(el, {
          x: `${targetX}rem`, y: `${targetY}rem`, rotation: targetRot, scale: targetScale,
          duration: 0.5, delay, ease: "elastic.out(1,.75)", overwrite: "auto",
        });
        gsap.set(el, { zIndex: base.zIndex });
      });
    };

    const enterHandlers = visibleEntries.map(({ el, slot }) => {
      const handler = () => {
        if (isAnimating.current) return;
        if (leaveTimer) { clearTimeout(leaveTimer); leaveTimer = null; }
        if (activeSlot !== slot) { activeSlot = slot; updateHoverLayout(slot); }
      };
      el.addEventListener("mouseenter", handler);
      return { el, handler };
    });

    const onMouseLeave = () => {
      if (isAnimating.current) return;
      if (leaveTimer) clearTimeout(leaveTimer);
      leaveTimer = setTimeout(() => { activeSlot = null; updateHoverLayout(null); }, 50);
    };
    container.addEventListener("mouseleave", onMouseLeave);

    const onResize = () => { if (!isAnimating.current) updateHoverLayout(activeSlot); };
    window.addEventListener("resize", onResize);

    return () => {
      enterHandlers.forEach(({ el, handler }) => el.removeEventListener("mouseenter", handler));
      container.removeEventListener("mouseleave", onMouseLeave);
      window.removeEventListener("resize", onResize);
      if (leaveTimer) clearTimeout(leaveTimer);
    };
  }, [centerIndex, totalCards, getVisibleMap, needsPagination]);

  const chevron = (direction: "left" | "right") => (
    <svg className="relative z-[2] w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points={direction === "left" ? "15 18 9 12 15 6" : "9 18 15 12 9 6"} />
    </svg>
  );

  return (
    <section className="flex flex-col items-center justify-center w-full min-h-screen py-24 px-4 relative z-20 bg-stone-950 overflow-hidden">
      
      <div className="absolute top-24 left-0 right-0 z-50 text-center pointer-events-none">
        <TitleReveal>
          <h2 className="text-4xl md:text-5xl font-bold text-white flex gap-x-3 justify-center">
            <span className="word-animate inline-block">Ma Trận</span>
            <span className="word-animate inline-block text-orange-500">Thao Túng</span>
          </h2>
        </TitleReveal>
        <p className="text-stone-400 mt-4 text-lg">Cách nền tảng hack tâm lý người tiêu dùng</p>
      </div>

      <div className="flex items-center justify-center w-full max-w-[90rem] mt-20 h-[600px] perspective-1000">
        <div ref={containerRef} className="fan-layout flex relative justify-center items-center w-full max-w-[80rem] h-full">
          {cards.map((card, index) => {
            return (
              <div 
                key={index} 
                className="fan-card absolute w-[300px] h-[450px] md:w-[340px] md:h-[500px] rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden cursor-pointer group border border-white/10 bg-black"
                style={{ transformOrigin: "center bottom" }} // Để xoay đẹp hơn
              >
                <div className="relative w-full h-full">
                  <img 
                    src={card.imgUrl} 
                    loading="lazy" 
                    alt={card.alt || card.title} 
                    className="absolute inset-0 w-full h-full object-cover z-10 opacity-70 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 ease-out" 
                  />
                  {/* Gradient Overlay để làm nổi bật text */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-20 opacity-90 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  <div className="absolute bottom-0 left-0 right-0 p-8 z-30 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <h3 className="text-2xl font-bold text-white mb-3 shadow-black drop-shadow-md">{card.title}</h3>
                    <p className="text-sm text-stone-300 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 leading-relaxed shadow-black drop-shadow-md">
                      {card.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {needsPagination && (
        <div className="flex items-center justify-center gap-6 mt-12 z-30">
          <button className={`${ARROW_CLASSES} w-12 h-12`} onClick={() => cycle("left")} aria-label="Previous">
            {chevron("left")}
          </button>
          <div className="flex items-center gap-3">
            {cards.map((_, i) => (
              <span key={i} className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${i === centerIndex ? "bg-orange-500 scale-[1.3] shadow-[0_0_10px_rgba(249,115,22,0.8)]" : "bg-white/20 hover:bg-white/40"}`} />
            ))}
          </div>
          <button className={`${ARROW_CLASSES} w-12 h-12`} onClick={() => cycle("right")} aria-label="Next">
            {chevron("right")}
          </button>
        </div>
      )}
    </section>
  );
};
