import {useLoaderData} from '@remix-run/react';
import type {LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {json} from '@shopify/remix-oxygen';
import {LookbookGrid} from '~/components/LookbookGrid';
import {SectionHeading} from '~/components/SectionHeading';

interface ProductsResult {
  products: {
    nodes: Array<{
      id: string;
      handle: string;
      title: string;
      vendor?: string | null;
      tags?: string[] | null;
      featuredImage?: {
        url: string;
        altText?: string | null;
      } | null;
      priceRange?: {
        minVariantPrice: {
          amount: string;
          currencyCode: string;
        };
      };
    }>;
  };
}

export async function loader({context}: LoaderFunctionArgs) {
  const {storefront} = context;
  const data = await storefront.query<ProductsResult>(COLLECTION_LOOKBOOK_QUERY, {
    variables: {first: 12},
  });

  return json({products: data.products.nodes});
}

export default function CollectionsIndex() {
  const {products} = useLoaderData<typeof loader>();

  return (
    <div className="space-y-16 pb-24">
      <SectionHeading
        eyebrow="Thrivv Lookbook"
        title="Luxury streetwear in motion"
        description="A cinematic mix of layering, proportion, and luminous finishes. Explore the latest silhouettes styled by the Thrivv creative collective."
      />
      <LookbookGrid products={products} />
    </div>
  );
}

const COLLECTION_LOOKBOOK_QUERY = `#graphql
  query LookbookProducts($first: Int!) {
    products(first: $first, sortKey: BEST_SELLING) {
      nodes {
        id
        handle
        title
        vendor
        tags
        featuredImage {
          url
          altText
        }
        priceRange {
          minVariantPrice {
            amount
            currencyCode
          }
        }
      }
    }
  }
`;
