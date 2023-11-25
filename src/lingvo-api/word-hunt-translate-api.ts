import { HttpService } from "@nestjs/axios";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { type } from "os";
import { arrayUniqueByKey, uniqueList } from "src/helpers/arrayHelper";
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

@Injectable()
export class WordHuntApiService {
    private url = "https://wooordhunt.ru";
    constructor(private readonly httpService: HttpService) { }

    private async queryExecute(query: string): Promise<{ data: any }> {
        return await this.httpService.axiosRef.get(
            this.url + query,
        ).catch(function (error) {
            throw new HttpException(error.response.data, HttpStatus.BAD_REQUEST);
        });
    }

    async parseWords(word: string, targetLang: string = 'ru') {
        let translates: ITranslateResults[] = [];
        const types: string[] = [];
        let data = await this.queryExecute(`/word/${word}`);
        if (data.data) {
            const { document } = new JSDOM(data.data).window;
            const domDocument: HTMLAnchorElement = document;

            if (targetLang === 'ru') {
                const trTags = domDocument.querySelectorAll(".tr");
                let trInc = 0;
                let lineWords = domDocument.querySelector(".t_inline_en");
                if (lineWords) {
                    this.splitContentAndPush(lineWords.innerHTML, translates);
                }
                for (let inc in trTags) {
                    const tr = trTags[inc];
                    if (tr && tr.getElementsByTagName) {
                        const spanTags: HTMLCollection = tr.getElementsByTagName("span");
                        for (let inc in spanTags) {
                            const currentSpan = spanTags[inc];
                            if (currentSpan && currentSpan.hasAttribute && !currentSpan.hasAttribute("class") && !currentSpan.hasAttribute("id")) {
                                let innerSpan = spanTags[inc].innerHTML;
                                if (!innerSpan.includes("span")) {
                                    innerSpan = innerSpan.replaceAll(/<([^\/>]+)>.*?<.*?\/.*?>/g, "");
                                    if (innerSpan) {
                                        this.splitContentAndPush(innerSpan, translates, trInc);
                                    }
                                }
                            }
                        }
                        trInc++;
                    }
                }

                const posItems = domDocument.querySelectorAll(".pos_item");
                for (let inc in posItems) {
                    const posItem = posItems[inc];
                    if (posItem) {
                        if (posItem.innerHTML) {
                            const type = posItem.innerHTML.replaceAll(/<([^\/>]+)>.*?<.*?\/.*?>/g, "").trim();
                            types.push(type);
                        }
                    }
                }
            } else {
                let lineWords = domDocument.querySelector(".t_inline");
                if (lineWords) {
                    this.splitContentAndPush(lineWords.innerHTML, translates);
                }
                const aElements = domDocument.querySelector("#wd_content").getElementsByTagName("a");
                for (let inc in aElements) {
                    let word = aElements[inc];
                    if (word) {
                        if (!new RegExp(/[а-я А-Я]/g).test(word.innerHTML) && word.innerHTML) {
                            translates.push({ word: word.innerHTML, type: 'все' })
                        }
                    }
                }
            }

            this.getSimilarWords(domDocument, '.similar_words', translates);
            this.getSimilarWords(domDocument, '.phrase_by_part', translates);

            const sound: HTMLAnchorElement = domDocument.querySelector("#us_tr_sound");

            if (sound) {
                const transcription = sound.querySelector(".transcription");
                if (transcription) {
                    translates.push({ word: transcription.innerHTML, type: 'transcription' });
                }
            }
        }

        translates = arrayUniqueByKey(translates, 'word');
        if (targetLang !== "ru") {
            return translates;
        }

        let translatesResults: ITranslateResults[] = translates.filter(translate =>
            translate.type === 'все' || translate.type === 'transcription'
        );

        types.map((type, key) => {
            const words = translates.filter(translate => translate.type === `tr${key}`);
            if (words.length) {
                words.map(word => {
                    if (type) {
                        translatesResults.push({ word: word.word, type });
                    }
                });
            }
        });

        return translatesResults;
    }

    async parseExamples(word: string) {
        let examples: IExamples[] = [];
        let data = await this.queryExecute(`/word/${word}`);
        if (data.data) {
            let examplesRussian = [];
            let examplesEnglish = []
            const { document } = new JSDOM(data.data).window;
            const domDocument: HTMLAnchorElement = document;
            const englishExamples: HTMLCollection = domDocument.getElementsByClassName("ex_o");
            const translationExamples: HTMLCollection = domDocument.getElementsByClassName("ex_t");
            for (let inc in englishExamples) {
                const enEx = englishExamples[inc];
                if (enEx) {
                    examplesEnglish.push(enEx.textContent);
                }
            }

            for (let inc in translationExamples) {
                const ex = translationExamples[inc];
                if (ex) {
                    examplesRussian.push(ex.textContent);
                }
            }

            if (englishExamples.length && examplesRussian.length) {
                examplesEnglish.map((exEN, key) => {
                   const exRU = examplesRussian[key];
                    if (exEN && exRU) {
                        examples.push({ originalText: exEN, translatedText: exRU });
                    }
                });
            }

        }

        return examples;
    }

    private splitContentAndPush(string: string, translates: ITranslateResults[], inc?: number) {
        let wordsList = [];
        const split = (delimeter: string, string: string, array: any[] = []) => {
            const stringArray = string.split(delimeter);
            stringArray.map(string => {
                array.push(string.trim());
            });
            return array;
        }

        if (string.includes(";") && string.includes(",")) {
            let arrayWithoutSplits: string[] = [];
            arrayWithoutSplits = arrayWithoutSplits.concat(split(",", string, arrayWithoutSplits));
            arrayWithoutSplits.map((item) => {
                arrayWithoutSplits = arrayWithoutSplits.concat(split(";", item, arrayWithoutSplits));
            })
            wordsList = uniqueList(arrayWithoutSplits.filter(item => !item.includes(";")));
        } else if (string.includes(";")) {
            wordsList = split(";", string, wordsList);
        } else if (string.includes(",")) {
            wordsList = split(",", string, wordsList);

        } else {
            wordsList.push(string.trim());
        }

        wordsList.map(word => {
            const obj = { word, type: `tr${inc}` };

            if (inc === undefined) {
                obj.type = 'все';
            }
            translates.push(obj);
        });
    }

    private getSimilarWords(domDocument: HTMLAnchorElement, query: string, translates: ITranslateResults[]) {
        const similarWords = domDocument.querySelector(query);
        if (similarWords) {
            const strWords = similarWords.innerHTML.replaceAll(/<([^>]+)>.*?<.*?.*?>/g, "").replaceAll(/<.*?.*?>/g, "").replaceAll(/[a-z—]/g, "").trim();
            if (strWords) {
                this.splitContentAndPush(strWords, translates);
            }
        }
    }
}