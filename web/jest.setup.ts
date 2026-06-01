import "@testing-library/jest-dom";

// Polyfill TextEncoder/TextDecoder for MSW v2 in jsdom
import { TextEncoder, TextDecoder } from "util";
global.TextEncoder = TextEncoder as typeof global.TextEncoder;
global.TextDecoder = TextDecoder as typeof global.TextDecoder;

// Polyfill Web Streams API for MSW v2
import {
  ReadableStream,
  TransformStream,
  WritableStream,
} from "stream/web";
global.ReadableStream = ReadableStream as typeof global.ReadableStream;
global.TransformStream = TransformStream as typeof global.TransformStream;
global.WritableStream = WritableStream as typeof global.WritableStream;

// Restore Node.js native fetch AFTER jsdom may override it
// MSW setupServer intercepts at the Node http level which Node native fetch uses
// jsdom's fetch implementation may bypass Node's http module
// We must use Node's native fetch for MSW to work
const nodeFetch = globalThis.fetch;
if (typeof nodeFetch === "function") {
  // Node 18+ has native fetch — use it (MSW intercepts at http level)
  // But jsdom environment may override globalThis.fetch with its own implementation
  // We don't need to do anything special here since setup runs after jsdom initializes
}

// If jsdom has overridden fetch, restore Node's native fetch
// Check by looking at the source - Node's fetch uses undici internally
// We use whatwg-fetch polyfill as a fallback only if no fetch exists
if (typeof window !== "undefined" && !window.fetch) {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  require("whatwg-fetch");
}

// Polyfill BroadcastChannel for MSW v2
class BroadcastChannelPolyfill {
  name: string;
  constructor(name: string) {
    this.name = name;
  }
  postMessage() {}
  close() {}
  addEventListener() {}
  removeEventListener() {}
  dispatchEvent() { return false; }
}

if (!global.BroadcastChannel) {
  global.BroadcastChannel = BroadcastChannelPolyfill as unknown as typeof BroadcastChannel;
}

// Mock next/navigation
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
  }),
  useParams: () => ({}),
  useSearchParams: () => new URLSearchParams(),
  redirect: jest.fn(),
}));
