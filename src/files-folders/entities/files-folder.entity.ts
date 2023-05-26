import { Column, DataType, Table, Model, ForeignKey } from "sequelize-typescript";
import { User } from "src/users/users.model";

@Table({tableName: 'files-folders'})
export class FilesFolder extends Model<FilesFolder>{
    @Column({ type: DataType.INTEGER, unique: true, autoIncrement: false, primaryKey: true })
    id: string;

    @Column({ type: DataType.STRING, allowNull: false })
    name: string;

    @ForeignKey(() => User)
    @Column({ type: DataType.INTEGER })
    userId: string;
}