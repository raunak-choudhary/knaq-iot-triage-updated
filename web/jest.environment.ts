import { TestEnvironment } from "jest-environment-jsdom";

class CustomJsdomEnvironment extends TestEnvironment {
  async setup() {
    await super.setup();
    // Override jsdom's fetch with Node.js native fetch (available in Node 18+)
    // This ensures MSW's node-level http interceptors can intercept RTK Query requests
    const nodeFetch = (global as Record<string, unknown>).fetch;
    const nodeRequest = (global as Record<string, unknown>).Request;
    const nodeResponse = (global as Record<string, unknown>).Response;
    const nodeHeaders = (global as Record<string, unknown>).Headers;
    const nodeFormData = (global as Record<string, unknown>).FormData;

    if (typeof nodeFetch === "function") {
      (this.global as Record<string, unknown>).fetch = nodeFetch;
    }
    if (nodeRequest) (this.global as Record<string, unknown>).Request = nodeRequest;
    if (nodeResponse) (this.global as Record<string, unknown>).Response = nodeResponse;
    if (nodeHeaders) (this.global as Record<string, unknown>).Headers = nodeHeaders;
    if (nodeFormData) (this.global as Record<string, unknown>).FormData = nodeFormData;
  }
}

export default CustomJsdomEnvironment;
