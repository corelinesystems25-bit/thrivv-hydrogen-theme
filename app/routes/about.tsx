import {useLoaderData} from '@remix-run/react';
import type {LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {json} from '@shopify/remix-oxygen';
import {StoryContent} from '~/components/StoryContent';

export async function loader({context}: LoaderFunctionArgs) {
  const {storefront} = context;
  const data = await storefront.query(ABOUT_QUERY);

  return json({
    mission: data.shop?.description ?? 'Thrivv fuses luxury tailoring with adaptive technology to outfit the future city.',
  });
}

export default function About() {
  const {mission} = useLoaderData<typeof loader>();

  return (
    <div className="space-y-16 pb-24">
      <header className="section-shell space-y-4 pt-16">
        <p className="pill w-fit bg-carbon-900/60 text-electric-400">Thrivv Community</p>
        <h1 className="font-display text-4xl text-slate-100">Crafted for the movement ahead</h1>
        <p className="max-w-2xl text-sm text-slate-400">{mission}</p>
      </header>

      <StoryContent
        vision={{
          title: 'Luxury silhouettes engineered for tomorrow',
          description:
            'Thrivv began as a nightshift experiment—tailors, coders, and DJs reimagining how garments perform in hyper-connected cities. Our studio collides couture-level construction with embedded technology to create pieces that feel ceremonial yet ready for motion.',
          points: [
            'Bio-adaptive textiles sourced from partner labs',
            'Limited drops to preserve craftsmanship and reduce waste',
            'Collaborative design cycles with our community council',
          ],
        }}
        community={{
          title: 'Community is the core operating system',
          description:
            'We design with the Thrivv Collective—an invite-only network of artists, athletes, and technologists sharing prototypes, field testing new fabrics, and shaping the narrative.',
          points: [
            'Monthly lookbook challenges featuring members worldwide',
            'Community repair program keeping garments in rotation',
            'Private forums and XR meetups for upcoming drops',
          ],
        }}
        initiatives={[
          {
            title: 'Thrivv Frequency Lab',
            excerpt:
              'A residency pairing sound designers with pattern engineers to embed audio-reactive fibers into ceremonial jackets.',
          },
          {
            title: 'Regenerative Materials Initiative',
            excerpt:
              'Partnership with textile scientists developing fully recyclable membranes that elevate durability without compromise.',
          },
          {
            title: 'Urban Movement Fellowship',
            excerpt:
              'Funding for dancers and athletes experimenting with Thrivv gear in underground venues across the globe.',
          },
        ]}
      />
    </div>
  );
}

const ABOUT_QUERY = `#graphql
  query AboutPageQuery {
    shop {
      description
    }
  }
`;
