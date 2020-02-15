interface IQuiet {
    quiet?: boolean;
}
declare class MediaToggle {
    constructor(options: IQuiet);
    options: IQuiet;
    cssMediaRules: CSSMediaRule[];
    cssTexts: string[][];
    addRule(rule: CSSMediaRule): void;
    get(): CSSMediaRule[];
    delete(): void;
    get disabled(): boolean;
    toggle: (flag?: boolean) => void;
}
declare const getMediaToggle: (options: IQuiet) => {
    get(): Map<string, MediaToggle>;
    toggle(): void;
    subscribe(fn: any): () => void;
};
export default getMediaToggle;
