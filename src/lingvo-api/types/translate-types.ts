type translateMethod = "translateApi" | "yandex";

interface ITranslateWord {
    word: string,
    type: string,
    isActive?: boolean,
    dictionaryWordId: string,
    originalWord: string
}

interface ITranslateValuesParams {
    word: string, 
    sourceLang: string, 
    targetLang: string,
    getYandexTranslate: boolean, 
    getSavedWords: boolean,
    getTranscription: boolean
}

interface ITranslateParams {
    word: string, 
    sourceLang: string, 
    targetLang: string, 
    getYandexTranslate: boolean,
    translateMethod: translateMethod
}

interface IExamplesParams {
    word: string, 
    sourceLang: string, 
    targetLang: string, 
    pageSize: number
}