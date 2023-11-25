
import { Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { User } from "src/users/users.model";

@Table({tableName: 'translate-api-settings', createdAt: false, updatedAt: false})
export class TranslateApiSettings extends Model<TranslateApiSettings> {
    @Column({ type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true })
    id: number;

    @Column({ type: DataType.BOOLEAN })
    lingvo: boolean;

    @Column({ type: DataType.BOOLEAN })
    wordHunt: boolean;

    @ForeignKey(() => User)
    @Column({ type: DataType.INTEGER, allowNull: false })
    userId: number;
}