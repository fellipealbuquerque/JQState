export class JQProcessor {
    constructor(proxy) {
        this.proxy = proxy;
    }
    process($el) { throw new Error("Method 'process' must be implemented!"); }
}
