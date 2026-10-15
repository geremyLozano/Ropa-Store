"use client";

import { useEffect, useState } from "react";

const heroImages = [
    "/Portada1.jpg",
    "/Portada2.jpg",
    "/Portada3.jpg",
];

export function HeroCarouselImage() {
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrent((prev) => (prev + 1) % heroImages.length);
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    return (
        <>
            {/* Imagen */}
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-700"
                style={{
                    backgroundImage: `url(${heroImages[current]})`,
                }}
            />

            {/* Controles */}
            <div className="absolute bottom-8 left-6 md:left-12 z-20 flex flex-col gap-2 text-white/70 font-light text-xs tracking-widest">
                <div className="flex gap-2 items-center">
                    {heroImages.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrent(index)}
                            className="p-2 cursor-pointer"
                            aria-label={`Ir al slide ${index + 1}`}
                        >
                            <div
                                className={`h-[2px] transition-all duration-300 ${current === index
                                        ? "w-8 bg-white"
                                        : "w-5 bg-white/40"
                                    }`}
                            />
                        </button>
                    ))}
                </div>

                <div>
                    {String(current + 1).padStart(2, "0")}
                    <span className="text-white/40"> / </span>
                    {String(heroImages.length).padStart(2, "0")}
                </div>
            </div>
        </>
    );
}