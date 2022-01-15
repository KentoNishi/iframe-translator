export declare function getClient(host?: string): Promise<{
    translate: (text: string, targetLanguage: string) => Promise<string>;
    destroy: () => void;
}>;
