import { BelongsToMany, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { Dictionary } from "src/dictionary/entities/dictionary.entity";
import { DictionariesLinkedWords } from "./dictionary-linked-words.entity";

@Table({tableName: 'dictionary-linked-words'})
export class DictionaryLinkedWord extends Model<DictionaryLinkedWord> {
    @Column({ type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true })
    id: number;

    @Column({ type: DataType.STRING })
    word: string;
}