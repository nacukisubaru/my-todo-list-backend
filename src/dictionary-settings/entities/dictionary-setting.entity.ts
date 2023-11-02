import { Column, DataType, Table, Model, ForeignKey } from "sequelize-typescript";
import { User } from "src/users/users.model";

@Table({tableName: 'dictionary-settings'})
export class DictionarySettings extends Model<DictionarySettings>{
    @Column({ type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true })
    id: number;

    @Column({ type: DataType.STRING, allowNull: false })
    sourceLanguage: string;

    @Column({ type: DataType.STRING, allowNull: false })
    targetLanguage: string;
    
    @Column({ type: DataType.STRING, allowNull: false })
    sourceISO: string;

    @Column({ type: DataType.STRING, allowNull: false })
    targetISO: string;

    @ForeignKey(() => User)
    @Column({ type: DataType.INTEGER, allowNull: false })
    userId: number;

    @Column({ type: DataType.BOOLEAN, allowNull: false })
    isActive: boolean;
}