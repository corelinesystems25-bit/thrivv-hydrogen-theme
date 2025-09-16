/// <reference types="@remix-run/dev" />
/// <reference types="@shopify/remix-oxygen" />

import type {CartWithLines} from '~/components/Layout';

declare module '@shopify/remix-oxygen' {
  interface AppLoadContext {
    cart?: CartWithLines | null;
  }
}
