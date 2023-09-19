import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateLingvoApiDto } from './dto/create-lingvo-api.dto';
import { UpdateLingvoApiDto } from './dto/update-lingvo-api.dto';
import { HttpService } from '@nestjs/axios';
import { YandexCloudService } from 'src/yandex-cloud/yandex-cloud.service';
import { IMarkup, IResponse, IResponseTranslte, ItemResponseTranslate } from './types/lingvo-types';
import { arrayUniqueByKey } from 'src/helpers/arrayHelper';

@Injectable()
export class LingvoApiService {

  private lingvoApiKey = process.env.lingvoKey;
  private url = "https://developers.lingvolive.com";
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
    'Герундий', 'Причастие', 'Инфинитив', 'Междометие',
    'Подлежащее', 'Сказуемое', 'Дополнение', 'Обстоятельство',
    'Приложение', 'Именительный падеж', 'Родительный падеж',
    'Дательный падеж', 'Винительный падеж', 'Творительный падеж',
    'Предложный падеж', 'средний род', 'единственное число', 'устаревшее слово',
    'мужской род', 'женский род'
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
    const token = await this.authorize();
    return await this.httpService.axiosRef.get(
      this.url + query,
      {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      }
    ).catch(function (error) {
      throw new HttpException(error.response.data, HttpStatus.BAD_REQUEST);
    });
  }

  private async parseTranslateResult(
    result: IResponseTranslte[],
    exclude: string[] = [],
    optionalOff: boolean = false,
    useGrammarTypes: boolean = false,
    excludeLatinAlphabet: boolean = false
  ) {
    let translateList = [];
    exclude = [...exclude, "CardRef"];

    const markupCasesCall = (markup: IMarkup) => {
      if (!markup.FullText && markup.Text) {
        translateList.push(markup.Text);
      }

      if (markup.FullText) {
        translateList.push(markup.FullText);
      }

      if (markup.Markup) {
        markupParse(markup.Markup);
      }

      if (markup.Items) {
        itemParse(markup.Items);
      }
    }

    const markupParse = (markups: IMarkup[]) => {
      const isAccent = markups.find(markup => markup.IsAccent);
      //на испанском(других языках) не работает из-за !isAccent и каких-то других вещей
      //возможно писать отдельно парсер
      if (isAccent) {
        const accentMarkups = [];
        markups.map(markup => {
          if (markup.IsAccent === true || markup.IsAccent === false) {
            accentMarkups.push(markup.Text);
          }
        });
        translateList.push(accentMarkups.join(''));
      } else {
        markups.map((markup) => {
          let isContinue = false;
          // if (markup.Node === "Abbrev" && markup.FullText && markup.FullText.includes("(")) {
          //   isContinue = true;
          // }

          if (markup.Text === "несовер." || markup.Text === "совер." || markup.Text === "амер.") {
            isContinue = true;
          }

          if (markup.IsItalics) {
            isContinue = true;
          }

          if (!exclude.includes(markup.Node) && !isContinue) {
            if (optionalOff) {
              if (markup.IsOptional === false) {
                markupCasesCall(markup);
              }
            } else {
              markupCasesCall(markup);
            }
          }
        });
      }
    }

    const itemParse = (items: ItemResponseTranslate[]) => {
      items.map((item) => {
        if (!exclude.includes(item.Node)) {
          if (item.Markup) {
            markupParse(item.Markup);
          }
        }
      });
    }

    result.map((item: IResponseTranslte) => {
      if (item.Body) {
        item.Body.map((itemBody, inc) => {
          //если не парсим только значения слов
          //убираем первый блок про транскрипцию и т.д
          if (inc) {
            if (itemBody.Markup) {
              markupParse(itemBody.Markup);
            }

            if (itemBody.Items) {
              itemParse(itemBody.Items);
            }
          }
        })
      }
    });

    translateList = this.sanitizeTranslateResult(translateList);
    return this.buildTranslateList(translateList, useGrammarTypes ? this.grammarTypes : [], excludeLatinAlphabet);
  }

  private sanitizeTranslateResult(translateList: string[]) {
    let translates = [];
    let pattern = /[.=*\+\-\()#$№%!@-^&~<>:/\d/g]/g;

    translateList = translateList.map(translate => {
      return translate.replaceAll(pattern, "");
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

  private buildTranslateList(translateList: string[], grammarTypes: string[] = [], excludeLatinAlphabet: boolean = false) {
    let translateMap = [];
    let grammarTypeStr = "";
    
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

            if (!excludeLatinAlphabet || (excludeLatinAlphabet && /[a-z\u0400-]/gi.test(translate) === false)) {
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

    if (grammarTypes.length) {
      translateMap = translateMap.filter(translate => translate.type !== "" && translate.word !== "");
    } else {
      translateMap = translateMap.filter(translate => translate.word !== "" );
    }

    if (excludeLatinAlphabet) {
      translateMap = translateMap.filter(translate => /[a-z\u0400-]/gi.test(translate.word) === false) 
    }

    return arrayUniqueByKey(translateMap, 'word');
  }

  async shortTranslateWord(word: string, sourceLang: string, targetLang: string) {
    const response = await this.queryExecute(
      `/api/v1/Minicard?text=${word}&srcLang=${this.languageCodes[sourceLang]}&dstLang=${this.languageCodes[targetLang]}`
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
      `/api/v1/Translation?text=${word}&srcLang=${this.languageCodes[sourceLang]}&dstLang=${this.languageCodes[targetLang]}`
    );

    let useGrammarTypes = true;
    if (this.langsWithoutGrammarTypes.includes(targetLang) || this.langsWithoutGrammarTypes.includes(sourceLang)) {
      useGrammarTypes = false;
    }

    let excludeLatinAlphabet = false;
    if (sourceLang !== 'ru') {
      excludeLatinAlphabet = true;
    }

    // return response.data;
    return await this.parseTranslateResult(
      response.data,
      ["Example", "Comment", "Transcription"],
      true,
      useGrammarTypes,
      excludeLatinAlphabet
    );
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

  create(createLingvoApiDto: CreateLingvoApiDto) {
    return 'This action adds a new lingvoApi';
  }

  findAll() {
    return `This action returns all lingvoApi`;
  }

  findOne(id: number) {
    return `This action returns a #${id} lingvoApi`;
  }

  update(id: number, updateLingvoApiDto: UpdateLingvoApiDto) {
    return `This action updates a #${id} lingvoApi`;
  }

  remove(id: number) {
    return `This action removes a #${id} lingvoApi`;
  }
}
