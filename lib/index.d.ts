interface IQuiet {
    quiet?: boolean;
    onError?: Function;
}
declare class MediaToggle {
    constructor(options: IQuiet);
    options: IQuiet;
    cssMediaRules: Set<CSSMediaRule>;
    cssTexts: string[][];
    addRule(rule: CSSMediaRule): void;
    get(): Set<CSSMediaRule>;
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
