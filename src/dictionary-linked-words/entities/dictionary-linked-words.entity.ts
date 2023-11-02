import { Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { Dictionary } from "src/dictionary/entities/dictionary.entity";
import { DictionaryLinkedWord } from "./dictionary-linked-word.entity";

@Table({tableName: 'dictionaries_linked_words'})
export class DictionariesLinkedWords extends Model<DictionariesLinkedWords> {
    @Column({ type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true })
    id: number;

    @ForeignKey(() => Dictionary)
    @Column({ type: DataType.STRING, allowNull: false })
    dictionaryId: string;

    @ForeignKey(() => DictionaryLinkedWord)
    @Column({ type: DataType.INTEGER, allowNull: false })
    dictionaryLinkedWordId: number;
}