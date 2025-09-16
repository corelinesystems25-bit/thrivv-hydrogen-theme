import {createRequestHandler} from '@shopify/remix-oxygen';
import * as remixBuild from '@remix-run/dev/server-build';

type Env = {
  MODE: string;
  [key: string]: unknown;
};

export default {
  async fetch(request: Request, env: Env, executionContext: ExecutionContext) {
    const handleRequest = createRequestHandler({
      build: remixBuild,
      mode: env.MODE,
    });

    return handleRequest(request, env, executionContext);
  },
};
