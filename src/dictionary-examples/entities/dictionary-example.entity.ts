import { Column, DataType, Table, Model, ForeignKey, BelongsToMany } from "sequelize-typescript";
import { Dictionary } from "src/dictionary/entities/dictionary.entity";
import { User } from "src/users/users.model";
import { DictionariesExamples } from "./dictionaries-examples.entity";

@Table({tableName: 'dictionary-examples'})
export class DictionaryExample extends Model<DictionaryExample>{
    @Column({ type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true })
    id: number;

    @Column({ type: DataType.STRING, allowNull: false })
    originalText: string;

    @Column({ type: DataType.STRING, allowNull: false })
    translatedText: string;

    @Column({ type: DataType.STRING, allowNull: false })
    languageOriginal: string;

    @Column({ type: DataType.STRING, allowNull: false })
    languageTranslation: string;

    @Column({ type: DataType.STRING, allowNull: false })
    exampleType: string;

    @Column({ type: DataType.BOOLEAN, allowNull: false })
    showTranslate: boolean;

    @ForeignKey(() => User)
    @Column({ type: DataType.INTEGER, allowNull: false })
    userId: number;
}