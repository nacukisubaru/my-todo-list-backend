import { Column, DataType, Table, Model, ForeignKey } from "sequelize-typescript";
import { User } from "src/users/users.model";
import { DictionaryExample } from "./dictionary-example.entity";
import { Dictionary } from "src/dictionary/entities/dictionary.entity";

@Table({tableName: 'dictionaries_examples'})
export class DictionariesExamples extends Model<DictionariesExamples> {
    @Column({ type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true })
    id: string;

    @ForeignKey(() => Dictionary)
    @Column({ type: DataType.INTEGER })
    dictionaryId: number;

    @ForeignKey(() => DictionaryExample)
    @Column({ type: DataType.INTEGER })
    dictionaryExampleId: number;

    @ForeignKey(() => User)
    @Column({ type: DataType.INTEGER, allowNull: false })
    userId: number;
}