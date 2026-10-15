import Image from 'next/image';
import { FragmentOf, readFragment } from '@/graphql';
import { ProductCardFragment } from '@/lib/vendure/fragments';
import { Price } from '@/components/commerce/price';
import { Suspense } from "react";
import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';

interface ProductCardProps {
    product: FragmentOf<typeof ProductCardFragment>;
}

export function ProductCard({ product: productProp }: ProductCardProps) {
    const t = useTranslations('Product');
    const product = readFragment(ProductCardFragment, productProp);

    return (
        <Link
            href={`/product/${product.slug}`}
            className="group block bg-white overflow-hidden border border-neutral-200 transition-all duration-300 hover:shadow-xl">
            {/* Imagen */}
            <div className="aspect-[4/5] sm:aspect-[3/4] relative bg-[#f7f3ee] overflow-hidden">
                {product.productAsset ? (
                    <Image
                        src={product.productAsset.preview}
                        alt={product.productName}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"/>
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-neutral-400 text-sm uppercase tracking-widest">
                        {t('noImage')}
                    </div>
                )}
            </div>


            {/* Información */}
            <div className="p-5 text-center space-y-3">

                <h3
                    className="
                    text-sm
                    font-medium
                    uppercase
                    tracking-[0.15em]
                    text-neutral-800
                    line-clamp-2
                    transition-colors
                    duration-300
                    group-hover:text-[#a88d70]
                "
                >
                    {product.productName}
                </h3>


                <Suspense fallback={
                    <div className="h-8 w-36 mx-auto rounded bg-muted"></div>
                }>
                    <p className="text-lg font-semibold tracking-wide text-neutral-900">
                        {product.priceWithTax.__typename === 'PriceRange' ? (
                            product.priceWithTax.min !== product.priceWithTax.max ? (
                                <>
                                    <span className="text-xs font-normal text-neutral-500 mr-1">
                                        {t('from')}
                                    </span>

                                    <Price
                                        value={product.priceWithTax.min}
                                        currencyCode={product.currencyCode}
                                    />
                                </>
                            ) : (
                                <Price
                                    value={product.priceWithTax.min}
                                    currencyCode={product.currencyCode}
                                />
                            )
                        ) : product.priceWithTax.__typename === 'SinglePrice' ? (
                            <Price
                                value={product.priceWithTax.value}
                                currencyCode={product.currencyCode}
                            />
                        ) : null}
                    </p>
                </Suspense>


                {/* Botón visual */}
                <div
                    className="mt-5 w-full px-6 py-3 bg-[#d9c5b2] hover:bg-[#c8b39f] text-black font-medium tracking-[0.2em] uppercase text-xs transition-colors duration-300">
                    Comprar ahora
                </div>

            </div>
        </Link>
    );
}
