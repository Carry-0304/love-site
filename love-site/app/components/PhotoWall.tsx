"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ---- CONFIG: Replace with real photo URLs ----
interface Photo {
  id: string;
  src: string;
  caption: string;
  date: string;
}

const photos: Photo[] = [
  { id: "1", src: "/chuyu.jpg", caption: "奇怪的默契游戏", date: "2026.05" },
  { id: "2", src: "/aimei.jpg", caption: "一起逛超市", date: "2026.05" },
  { id: "3", src: "/yuehui.jpg", caption: "游乐场的尖叫", date: "2026.06" },
  { id: "4", src: "/gaobai.jpg", caption: "模仿对方的口头禅", date: "2026.06" },
  { id: "5", src: "/xiangai.jpg", caption: "一起出去旅游", date: "2026.07" },
  { id: "6", src: "/gaobai.jpg", caption: "你生日那天的惊喜", date: "2026.07" },
];
// -------------------------------------------

export default function PhotoWall() {
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <section className="relative py-24 px-4">
      {/* Section title */}
      <motion.div
        className="text-center mb-16"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="text-4xl md:text-5xl font-script text-gradient-love mb-3">
            回忆墙
        </h2>
        <p className="text-sm text-rose-dried/60 tracking-widest font-sans">
          定格每一个有你的瞬间
        </p>
      </motion.div>

      {/* Photo grid */}
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-10">
          {photos.map((photo, index) => (
            <motion.div
              key={photo.id}
              className="polaroid cursor-pointer"
              initial={{ opacity: 0, y: 40, rotate: index % 2 === 0 ? -4 : 3 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{
                duration: 0.6,
                delay: index * 0.12,
                type: "spring",
                damping: 20,
              }}
              whileHover={{
                scale: 1.08,
                rotate: 0,
                zIndex: 10,
                transition: { duration: 0.3 },
              }}
              onHoverStart={() => setHoveredId(photo.id)}
              onHoverEnd={() => setHoveredId(null)}
              onClick={() => setSelectedPhoto(photo)}
            >
              {/* Polaroid card */}
              <div
                className="bg-white p-3 pb-8 shadow-lg transition-shadow duration-300"
                style={{
                  boxShadow: hoveredId === photo.id
                    ? "0 20px 50px rgba(181, 101, 118, 0.3)"
                    : "0 4px 20px rgba(0, 0, 0, 0.08)",
                  borderRadius: "4px",
                }}
              >
                {/* Photo area */}
                <div
                  className="w-full aspect-[4/5] bg-gradient-to-br from-rose-soft to-rose-peach flex items-center justify-center overflow-hidden"
                  style={{ borderRadius: "2px" }}
                >
                  {photo.src ? (
                    <img
                      src={photo.src}
                      alt={photo.caption}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-center text-rose-dried/30 p-4">
                      <div className="text-3xl md:text-4xl mb-2">📷</div>
                      <p className="text-[10px] md:text-xs font-sans">点击添加照片</p>
                    </div>
                  )}
                </div>

                {/* Caption */}
                <p className="text-center mt-3 text-sm font-script text-rose-deep/70">
                  {photo.caption}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Photo detail modal */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedPhoto(null)}
          >
            <motion.div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            <motion.div
              className="relative bg-white p-4 pb-10 max-w-md w-full shadow-2xl z-10"
              style={{ borderRadius: "4px" }}
              initial={{ scale: 0.7, opacity: 0, rotate: -5 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              exit={{ scale: 0.7, opacity: 0, rotate: 5 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className="w-full aspect-[4/5] bg-gradient-to-br from-rose-soft to-rose-peach flex items-center justify-center"
                style={{ borderRadius: "2px" }}
              >
                {selectedPhoto.src ? (
                  <img
                    src={selectedPhoto.src}
                    alt={selectedPhoto.caption}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center text-rose-dried/30">
                    <div className="text-6xl mb-2">📸</div>
                    <p className="text-xs font-sans">放一张照片在这里</p>
                  </div>
                )}
              </div>

              <div className="text-center mt-6">
                <p className="text-xl font-script text-rose-deep mb-1">
                  {selectedPhoto.caption}
                </p>
                <p className="text-xs text-rose-dried/50 tracking-widest font-sans">
                  {selectedPhoto.date}
                </p>
              </div>

              <button
                onClick={() => setSelectedPhoto(null)}
                className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center text-rose-deep hover:scale-110 transition-transform"
              >
                ✕
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
