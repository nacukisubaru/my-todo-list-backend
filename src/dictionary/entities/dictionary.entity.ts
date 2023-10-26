import { Column, DataType, Table, Model, ForeignKey, BelongsToMany } from "sequelize-typescript";
import { DictionariesExamples } from "src/dictionary-examples/entities/dictionaries-examples.entity";
import { DictionaryExample } from "src/dictionary-examples/entities/dictionary-example.entity";
import { DictionaryLinkedWord } from "src/dictionary-linked-words/entities/dictionary-linked-word.entity";
import { DictionariesLinkedWords } from "src/dictionary-linked-words/entities/dictionary-linked-words.entity";
import { User } from "src/users/users.model";

@Table({tableName: 'dictionary'})
export class Dictionary extends Model<Dictionary>{
    @Column({ type: DataType.STRING, unique: true, autoIncrement: false, primaryKey: true })
    id: string;

    @Column({ type: DataType.STRING, allowNull: false })
    originalWord: string;

    @Column({ type: DataType.STRING, allowNull: false })
    translatedWord: string;

    @Column({ type: DataType.STRING, allowNull: false })
    languageOriginal: string;

    @Column({ type: DataType.STRING, allowNull: false })
    languageTranslation: string;

    @Column({ type: DataType.STRING, allowNull: false})
    studyStage: string;

    @BelongsToMany(() => DictionaryExample, () => DictionariesExamples)
    dictionaryExamples: DictionaryExample[]

    @BelongsToMany(() => DictionaryLinkedWord, () => DictionariesLinkedWords)
    dictionaryLinkedWords: DictionaryLinkedWord[]

    @ForeignKey(() => User)
    @Column({ type: DataType.INTEGER, allowNull: false })
    userId: number;
}