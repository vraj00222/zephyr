export const BACKGROUNDS = [
  { id: "plain", label: "Plain cobalt", src: null, w: 1, h: 1 },
  { id: "collage", label: "The collage", src: "/backgrounds/collage.jpeg", w: 736, h: 1308 },
  { id: "bg1", label: "Cathedral nave", src: "/backgrounds/bg1.jpg", w: 750, h: 530 },
  { id: "bg2", label: "Grand library", src: "/backgrounds/bg2.jpg", w: 900, h: 679 },
  { id: "bg3", label: "Reading hall", src: "/backgrounds/bg3.jpg", w: 1024, h: 778 },
  { id: "bg4", label: "Archive IV", src: "/backgrounds/bg4.jpg", w: 960, h: 563 },
  { id: "bg5", label: "Archive V", src: "/backgrounds/bg5.jpg", w: 736, h: 736 },
  { id: "bg6", label: "Archive VI", src: "/backgrounds/bg6.jpg", w: 643, h: 1000 },
  { id: "bg7", label: "Long stacks", src: "/backgrounds/bg7.jpg", w: 1008, h: 1237 },
  { id: "bg8", label: "Archive VIII", src: "/backgrounds/bg8.jpg", w: 512, h: 1024 },
  { id: "aesthetic1", label: "Aesthetic I", src: "/backgrounds/aesthetic1.jpg", w: 736, h: 920 },
  { id: "aesthetic2", label: "Aesthetic II", src: "/backgrounds/aesthetic2.jpg", w: 976, h: 1200 },
  { id: "aesthetic3", label: "Aesthetic III", src: "/backgrounds/aesthetic3.jpg", w: 1200, h: 1704 },
  { id: "platoreading", label: "Plato reading", src: "/backgrounds/platoreading.jpg", w: 661, h: 661 },
  { id: "lib1", label: "Library I", src: "/backgrounds/lib1.jpg", w: 736, h: 920 },
  { id: "lib2", label: "Library II", src: "/backgrounds/lib2.jpg", w: 736, h: 770 },
  { id: "lib3", label: "Library III", src: "/backgrounds/lib3.jpg", w: 1080, h: 1350 },
  { id: "lib4", label: "Library IV", src: "/backgrounds/lib4.jpg", w: 1179, h: 1167 },
  { id: "lib5", label: "Library V", src: "/backgrounds/lib5.jpg", w: 1199, h: 1451 },
  { id: "lib6", label: "Library VI", src: "/backgrounds/lib6.jpg", w: 928, h: 1232 },
  { id: "underscore", label: "Underscore", src: "/backgrounds/underscore.jpeg", w: 736, h: 1308 },
  { id: "backgroundtest", label: "Test plate", src: "/backgrounds/backgroundtest.jpg", w: 1024, h: 572 },
] as const;

export type BackgroundId = (typeof BACKGROUNDS)[number]["id"];
export type Background = (typeof BACKGROUNDS)[number];

/* placement is decided by the image's own measurements:
   portrait & square plates go in frames, wide plates go full-bleed */
export const PLATE_BACKGROUNDS = BACKGROUNDS.filter(
  (b) => !b.src || b.h >= b.w * 0.95,
);
export const WIDE_BACKGROUNDS = BACKGROUNDS.filter(
  (b) => b.src && b.h < b.w * 0.95,
);

export function getBackground(id: string) {
  return BACKGROUNDS.find((b) => b.id === id) ?? BACKGROUNDS[0];
}
