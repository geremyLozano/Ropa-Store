import { Button } from "@/components/ui/button";
import { Link } from '@/i18n/navigation';
import { getTranslations } from 'next-intl/server';
import { getRouteLocale } from '@/i18n/server';
import { HeroCarouselImage } from './hero-carousel';

export async function HeroSection() {
    const locale = await getRouteLocale();
    const t = await getTranslations({ locale, namespace: 'Hero' });

    return (
        <section
            className="relative min-h-[600px] md:min-h-[700px] lg:min-h-[800px] flex items-center overflow-hidden"
        >
            {/* Imagen del carrusel */}
            <HeroCarouselImage />

            {/* Degradado oscuro de izquierda a derecha para asegurar contraste del texto */}
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent md:via-black/50" />

            <div className="container relative mx-auto px-6 md:px-12 py-20 z-10">
                <div className="max-w-xl md:max-w-2xl text-center md:text-left flex flex-col items-center md:items-start text-white space-y-6">

                    {/* Subtítulo superior / Marca */}
                    <span className="text-sm md:text-base tracking-[0.3em] uppercase text-stone-300 font-light">
                        ATELIER
                    </span>

                    {/* Título Principal con tipografía serif elegante */}
                    <h1 className="text-4xl md:text-6xl lg:text-7xl tracking-wide uppercase leading-tight font-serif text-stone-200">
                        {t('title')}{" "}
                        <span className="block md:inline text-stone-300 font-normal">
                            {t('titleHighlight')}
                        </span>
                    </h1>

                    {/* Eslogan inferior */}
                    <p className="text-sm md:text-base tracking-widest text-stone-400 font-light max-w-md">
                        {t('subtitle')}
                    </p>

                    {/* Botón personalizado estilo bloque minimalista beige */}
                    <div className="pt-4 w-full sm:w-auto">
                        <Button
                            render={<Link href="/search" />}
                            nativeButton={false}
                            className="w-full sm:w-auto px-10 py-6 bg-[#d9c5b2] hover:bg-[#c8b39f] text-black font-medium tracking-[0.2em] uppercase rounded-none border-none transition-colors duration-300 text-sm"
                        >
                            {t('shopNow')}
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
}