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
    IsItalics: boolean,
    IsAccent: boolean,
    Node: string,
    Text: string,
    IsOptional: boolean,
    FullText: string,
    Markup: IMarkup[],
    Items: ItemResponseTranslate[]
}

export interface ItemResponseTranslate {
    Markup: IMarkup[],
    Node: string,
    Text: string,
    IsOptional: boolean,
}

export interface IBodyResponseTranslate {
    Node: string,
    Markup: IMarkup[],
    Items: ItemResponseTranslate[]
}
export interface IResponseTranslte {
    Body: IBodyResponseTranslate[]
}

export interface IResponse {
    data: any
}