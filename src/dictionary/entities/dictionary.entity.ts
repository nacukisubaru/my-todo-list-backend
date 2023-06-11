import { Column, DataType, Table, Model, ForeignKey } from "sequelize-typescript";
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

    @Column({ type: DataType.BOOLEAN, allowNull: false})
    isStudy: boolean;

    @ForeignKey(() => User)
    @Column({ type: DataType.INTEGER, allowNull: false })
    userId: number;
}