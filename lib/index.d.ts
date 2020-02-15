declare class MediaToggle {
    constructor(rule: CSSMediaRule);
    cssMediaRules: CSSMediaRule[];
    cssTexts: string[][];
    addRule(rule: CSSMediaRule): void;
    get(): CSSMediaRule[];
    delete(): void;
    toggle(): void;
}
declare const _default: {
    get(): Map<string, MediaToggle>;
    toggle(): void;
    subscribe(fn: any): () => void;
};
export default _default;
