export type translateMethod = "lingvo" | "yandex";

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
    Markup: IMarkup[],
    Items: ItemResponseTranslate[]
}
export interface IResponseTranslte {
    Body: IBodyResponseTranslate[]
}

export interface IResponse {
    data: any
}