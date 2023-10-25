export type translateMethod = "lingvo" | "yandex";

export interface IParseParams {
    result: IResponseTranslte[],
    exclude?: string[],
    itemsForFind?: string[],
    optionalOff?: boolean,
    useGrammarTypes?: boolean,
    excludeAlphabet?: string,
    parseExample?: boolean,
    isChinese?: boolean
}

export interface IMarkup {
    isItalics: boolean,
    isAccent: boolean,
    node: string,
    text: string,
    isOptional: boolean,
    fullText: string,
    markup: IMarkup[],
    items: ItemResponseTranslate[]
}

export interface ItemResponseTranslate {
    markup: IMarkup[],
    node: string,
    rext: string,
    isOptional: boolean,
}

export interface IBodyResponseTranslate {
    node: string,
    markup: IMarkup[],
    items: ItemResponseTranslate[]
}
export interface IResponseTranslte {
    body: IBodyResponseTranslate[]
}

export interface IResponse {
    data: any
}