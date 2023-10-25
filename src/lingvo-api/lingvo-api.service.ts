import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { YandexCloudService } from 'src/yandex-cloud/yandex-cloud.service';
import { IMarkup, IParseParams, IResponse, IResponseTranslte, ItemResponseTranslate } from './types/lingvo-types';
import { arrayUniqueByKey, spliceIntoChunks } from 'src/helpers/arrayHelper';

@Injectable()
export class LingvoApiService {

  private lingvoApiKey = process.env.lingvoKey;
  private url = "https://api.lingvolive.com";
  private languageCodes = {
    ru: 1049,
    en: 1033,
    ch: 1028,
    de: 1031,
    es: 1034,
    it: 1040,
    //fr: 1036, нет общего словаря только юридический, 
    //химический и прочая чепуха
    //uk: 1058, хохляцкий пока не нужен
    //el: 1032, греческий пока не нужен
    // tt: 1092, татарский пока не нужен
    // kk: 1087, казахский не дай бог
    // la: 1142, латинский врятли в обще понадобиться
  };

  private grammarTypes = [
    'глагол', 'предлог', 'наречие',
    'прилагательное', 'существительное',
    'множественное число', 'совершенный вид', 'союз',
    'герундий', 'причастие', 'инфинитив', 'междометие',
    'подлежащее', 'сказуемое', 'дополнение', 'обстоятельство',
    'приложение', 'именительный падеж', 'родительный падеж',
    'дательный падеж', 'винительный падеж', 'творительный падеж',
    'предложный падеж', 'средний род', 'единственное число', 'устаревшее слово',
    'мужской род', 'женский род', 'местоимение', 'грамматический род', 'падеж', 'винительный падеж',
    'артикль', 'детерминатив', 'словосочетание', 'третье лицо', 'второе лицо', 'первое лицо'
  ];

  private excludeValuesList = [
    "амер.", "брит.", "несовер.", "совер.", "© 2014 ABBYY. Все права защищены."
  ];

  private langsWithoutGrammarTypes = ['fr', 'ch'];

  constructor(private readonly httpService: HttpService,
    private yandexService: YandexCloudService,
  ) { }


  private async authorize() {
    const response: any = await this.httpService.axiosRef.post(
      this.url + '/api/v1/authenticate',
      {},
      {
        headers: {
          "Authorization": 'Basic ' + this.lingvoApiKey,
          "Content-Type": "application/json",
          "Content-Length": 0
        }
      }
    ).catch(function (error) {
      throw new HttpException(error.message, HttpStatus.UNAUTHORIZED);
    });

    return response.data;
  }

  private async queryExecute(query: string): Promise<IResponse> {
    return await this.httpService.axiosRef.get(
      this.url + query,
    ).catch(function (error) {
      throw new HttpException(error.response.data, HttpStatus.BAD_REQUEST);
    });
  }

  private async parseTranslateResult({
      result,
      exclude = [],
      optionalOff = false,
      useGrammarTypes = false,
      excludeAlphabet = '',
      parseExample = false,
      isChinese = false
    }: IParseParams) {
   
    let translateList = [];
    exclude = [...exclude, "CardRef"];
    
    const markupCasesCall = (markup: IMarkup) => {

      if (!markup.fullText && markup.text) {
        translateList.push(markup.text);
      }

      if (markup.fullText && !parseExample) {
        translateList.push(markup.fullText);
      }

      if (markup.markup) {
        markupParse(markup.markup);
      }

      if (markup.items) {
        itemParse(markup.items);
      }
    }

    const markupParse = (markups: IMarkup[]) => {
      const isAccent = markups.find(markup => markup.isAccent);
      if (isAccent) {
        const accentMarkups = [];
        markups.map(markup => {
          if (markup.isAccent === true || markup.isAccent === false) {
            accentMarkups.push(markup.text);
          }
        });
        translateList.push(accentMarkups.join(''));
      } else {
        markups.map((markup) => {
          let isContinue = false;

          if (markup.node === "Abbrev") {
            const isGrammarContains = this.grammarTypes.some(type => markup.fullText.includes(type));
            if (!isGrammarContains) {
              isContinue = true;
            }
          }

          if (parseExample && markups.length > 1 && markup.node === "Example" && !isChinese) { 
            isContinue = true;
          }

          if (this.excludeValuesList.includes(markup.text)) {
            isContinue = true;
          }

          if (markup.isItalics) {
            isContinue = true;
          }

          if (exclude.includes(markup.node)) {
            isContinue = true;
          }
          
          if (!isContinue) {
            if (optionalOff) {
              if (markup.isOptional === false) {
                markupCasesCall(markup);
              }
            } else {
              markupCasesCall(markup);
            }
          }
        });
      }
    }

    const itemParse = (items: ItemResponseTranslate[]
      ) => {
      items.map((item) => {
        if (!exclude.includes(item.node)) {
          if (item.markup) {
            markupParse(item.markup);
          }
        }
      });
    }

    result["lingvoArticles"].map((item: IResponseTranslte) => {
      if (item.body) {
        item.body.map((itemBody) => {
          if (itemBody.markup && !exclude.includes(itemBody.node)) {
            markupParse(itemBody.markup);
          }

          if (itemBody.items) {
            itemParse(itemBody.items);
          }
        })
      }
    });
    
    if (parseExample) {
      translateList = this.sanitizeExamples(translateList, isChinese);
      return this.buildTranslateExamples(translateList, excludeAlphabet, isChinese);
    }
    
    translateList = this.sanitizeTranslateResult(translateList);
    return this.buildTranslateList(translateList, useGrammarTypes ? this.grammarTypes : [], excludeAlphabet);
  }

  private sanitizeTranslateResult(translateList: string[]) {
    let translates = [];
    let pattern = /[.=*\+\-\()#$№%!@-^&~<>:«»0-9]/g;

    translateList = translateList.map(translate => {
      return translate.replaceAll(pattern, " ");
    });

    translateList.map((translate: string, inc: number) => {
      if (!translate.includes("(") && !translate.includes(")")) {
        if (!translateList[inc - 1]) {
          translates.push(translate);
        } else if (translateList[inc - 1] && !translateList[inc - 1].includes("(")) {
          translates.push(translate);
        }
      }
    });

    return translates;
  }

  private sanitizeExamples(translateList: string[], isChinese: boolean = false) {
    let translates = [];
    let pattern = /[|=*\+\()\[|\]#$№%@^&~<>:«»≈0-9]/g;
    let patternSymbols = /[.,|;=*\+\-\()\[|\]#$№%!@-^&~<>:«»≈≈ 0-9]/g;

    translateList.map(translate => {
      translate.split("—").map(word => {
        
        let isContinue = false;
        const isWord = word.replaceAll(patternSymbols, "");
        
        if (!isWord) {
          isContinue = true;
        }

        word = word.trimStart().trimEnd().replaceAll(pattern, "");

        if (!isChinese && word.length <= 6) {
          isContinue = true
        }

        if (!isContinue && word) {
          translates.push(word);
        }
      });
    });

    return translates.filter(translate => translate !== "—");
  }

  private buildTranslateExamples(wordList: string[], excludeAlphabet: string = '', isChinese: boolean = false) {
    const examples = [];
    const chunksList = spliceIntoChunks(
      wordList, 
      isChinese ? 3 : 2
    );
    const reg = new RegExp(`[${excludeAlphabet}\u0400]`);
    chunksList.map((chunk) => {
      if (chunk.length > 1) {
        const prepareExample:any = {};
        
        if (isChinese) {
          prepareExample.word = chunk[0]
          prepareExample.transcription = chunk[1];
          prepareExample.translate = chunk[2];
        } else {
          prepareExample.word = chunk[0];
          prepareExample.translate = chunk[1];
        }

        if (reg.test(prepareExample.translate) === false) {      
          examples.push(prepareExample);
        }
      }
    });

    return examples;
  }

  private buildTranslateList(translateList: string[], grammarTypes: string[] = [], excludeAlphabet: string = '') {
    let translateMap = [];
    let grammarTypeStr = "any";
    const reg = new RegExp(`[${excludeAlphabet}\u0400]`);

    translateList.map((translate) => {
      const grammarExist = grammarTypes.some((grammarType) => {
        if (translate.includes(grammarType) || translate.includes(grammarType.slice(0, 4))) {
          grammarTypeStr = grammarType;
          return true;
        }
        return false;
      });

      if (!grammarExist) {
        if (translate.match(/[|;,]/g)) {
          translate = translate.replaceAll(/[;|]/g, ",");
          const translateArray = translate.toString().split(",");
          translateArray.map((word: string) => {
            const translateObj: any = { word: word.trimStart().trimEnd() };
            if (grammarTypes.length) {
              translateObj.type = grammarTypeStr;
            }

            if (!excludeAlphabet || (excludeAlphabet && reg.test(translate) === false)) {
              translateMap.push(translateObj);
            }
          });
        } else {
          const translateObj: any = { word: translate.trimStart().trimEnd() };
          if (grammarTypes.length) {
            translateObj.type = grammarTypeStr;
          }
          translateMap.push(translateObj);
        }
      }
    });
    translateMap = translateMap.filter(translate => translate.word !== "");

    if (excludeAlphabet) {
      translateMap = translateMap.filter(translate => reg.test(translate.word) === false)
    }

    return translateMap;
    //return arrayUniqueByKey(translateMap, 'word');
  }

  async shortTranslateWord(word: string, sourceLang: string, targetLang: string) {
    const response = await this.queryExecute(
      `/Translation/tutor-cards?text=${word}&srcLang=${this.languageCodes[sourceLang]}&dstLang=${this.languageCodes[targetLang]}`
    );

    return {
      originalWord: response.data.Heading,
      translatedWord: response.data.Translation.Translation,
      originalLang: sourceLang,
      translateLang: targetLang
    };
  }

  async fullTranslateWord(word: string, sourceLang: string, targetLang: string) {
    const response = await this.queryExecute(
      `/Translation/Translate?text=${word}&srcLang=${this.languageCodes[sourceLang]}&dstLang=${this.languageCodes[targetLang]}&returnJsonArticles=true`
    );

    let useGrammarTypes = true;
    if (this.langsWithoutGrammarTypes.includes(targetLang) || this.langsWithoutGrammarTypes.includes(sourceLang)) {
      useGrammarTypes = false;
    }

    let excludeAlphabet = '';
    if (sourceLang !== 'ru') {
      excludeAlphabet = 'a-z';
      if (sourceLang === 'ch') {
        excludeAlphabet = '一-俿';
      }
    } else {
      excludeAlphabet = 'а-я'
    }

    return await this.parseTranslateResult({
      result: response.data,
      exclude: ["Example", "Comment", "Transcription"],
      itemsForFind: [],
      optionalOff: true,
      useGrammarTypes,
      excludeAlphabet
    });
  }

  async getExamplesForWord(word: string, sourceLang: string, targetLang: string) {
    const response = await this.queryExecute(
      `/Translation/Translate?text=${word}&srcLang=${this.languageCodes[sourceLang]}&dstLang=${this.languageCodes[targetLang]}&returnJsonArticles=true`
    );

    let isChinese: boolean = false;
    const exclude = ["Transcription", "Paragraph", "Abbrev", "Sound", "Caption"];
    if (sourceLang !== "ch" && targetLang !== "ch") {
      exclude.push("Comment");
    } else {
      isChinese = true;
    }

    let excludeAlphabet = '';
    if (sourceLang !== 'ru') {
      excludeAlphabet = 'a-z';
      if (sourceLang === 'ch') {
        excludeAlphabet = '一-俿';
      }
    } else {
      excludeAlphabet = 'а-я'
    }

    return await this.parseTranslateResult({
      result: response.data,
      exclude,
      parseExample: true,
      isChinese,
      excludeAlphabet
    });
  }

  async translate(word: string, sourceLang: string, targetLang: string) {
    try {
      const result: any = await this.shortTranslateWord(word, sourceLang, targetLang);
      if (result.originalWord.length !== word.length) {
        throw new HttpException('Слово не найдено', HttpStatus.NOT_FOUND);
      }

      if (result.translatedWord.includes("совер.")) {
        throw new HttpException('Слово не найдено', HttpStatus.NOT_FOUND);
      }

      if (await this.yandexService.getLanguage(result.translatedWord) === sourceLang) {
        throw new HttpException('Слово не найдено', HttpStatus.NOT_FOUND);
      }

      return result;
    } catch (e) {
      try {
        return await this.yandexService.translate(word, targetLang, sourceLang);
      } catch (error) {
        throw new HttpException(error, HttpStatus.NOT_FOUND);
      }
    }
  }
}
