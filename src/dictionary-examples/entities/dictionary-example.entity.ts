import { Column, DataType, Table, Model, ForeignKey } from "sequelize-typescript";
import { User } from "src/users/users.model";

@Table({tableName: 'dictionary-examples'})
export class DictionaryExample extends Model<DictionaryExample>{
    @Column({ type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true })
    id: string;

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

    @ForeignKey(() => User)
    @Column({ type: DataType.INTEGER, allowNull: false })
    userId: number;
}