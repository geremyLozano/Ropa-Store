import { ProductCarousel } from "@/components/commerce/product-carousel";
import { getRouteLocale } from "@/i18n/server";
import { cacheLife, cacheTag } from "next/cache";
import { getActiveCurrencyCode } from '@/lib/currency-server';
import { query } from "@/lib/vendure/api";
import { GetCollectionProductsQuery, GetFacetProductsQuery, SearchProductsQuery } from "@/lib/vendure/queries";
import { Link } from '@/i18n/navigation';
import { ArrowRight } from "lucide-react";
import { getTranslations } from 'next-intl/server';

async function getFeaturedCollectionProducts(currencyCode: string) {
    const locale = await getRouteLocale();

    const collections = [
        {
            facetCode: "vestidos-verano",
            name: "Vestidos de Verano"
        },
        {
            facetCode: "collar",
            name: "Collares"
        },
        {
            facetCode: "vestidos-de-fiesta",
            name: "Vestidos de Fiesta"
        }
    ];

    // Obtener los facet values disponibles
    const facetResult = await query(SearchProductsQuery, {
        input: {
            take: 0,
            skip: 0,
            groupByProduct: true
        }
    }, {
        languageCode: locale,
        currencyCode
    });

    const productsByCollection = await Promise.all(
        collections.map(async (collection) => {

            const facetValue = facetResult.data.search.facetValues.find(
                (item) =>
                    item.facetValue.name
                        .toLowerCase()
                        .replaceAll(" ", "-") === collection.facetCode
            );

            const result = await query(GetFacetProductsQuery, {
                input: {
                    take: 12,
                    skip: 0,
                    groupByProduct: true,
                    facetValueIds: facetValue
                        ? [facetValue.facetValue.id]
                        : []
                }
            }, {
                languageCode: locale,
                currencyCode
            });

            return {
                name: collection.name,
                slug: collection.facetCode,
                facetValueId: facetValue?.facetValue.id,
                products: result.data.search.items
            };
        })
    );

    return productsByCollection;
}


export async function FeaturedProducts() {
    const locale = await getRouteLocale();
    const currencyCode = await getActiveCurrencyCode();
    const t = await getTranslations({ locale, namespace: 'Product' });
    const collections = await getFeaturedCollectionProducts(currencyCode);

    return (
        <div>
            {
                collections.map((collection) => (
                    <ProductCarousel
                        key={collection.name}
                        title={collection.name}
                        facetValueId={collection.facetValueId}
                        products={collection.products}
                    />
                ))
            }
            <div className="container mx-auto px-4 -mt-6 mb-8">
                <div className="flex justify-center">
                    <Link
                        href="/search"
                        className="group inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline underline-offset-4 transition-colors"
                    >
                        {t('viewAllProducts')}
                        <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                    </Link>
                </div>
            </div>
        </div>
    )
}
