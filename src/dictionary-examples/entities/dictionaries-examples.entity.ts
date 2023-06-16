import { Column, DataType, Table, Model, ForeignKey } from "sequelize-typescript";
import { User } from "src/users/users.model";
import { DictionaryExample } from "./dictionary-example.entity";
import { Dictionary } from "src/dictionary/entities/dictionary.entity";

@Table({tableName: 'dictionaries_examples', createdAt: false, updatedAt: false})
export class DictionariesExamples extends Model<DictionariesExamples> {
    @Column({ type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true })
    id: string;

    @ForeignKey(() => Dictionary)
    @Column({ type: DataType.STRING })
    dictionaryId: string;

    @ForeignKey(() => DictionaryExample)
    @Column({ type: DataType.INTEGER })
    dictionaryExampleId: number;

    @ForeignKey(() => User)
    @Column({ type: DataType.INTEGER, allowNull: false })
    userId: number;
}