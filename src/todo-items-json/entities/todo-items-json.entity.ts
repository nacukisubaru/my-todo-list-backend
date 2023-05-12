import { Column, DataType, Table, Model, ForeignKey } from "sequelize-typescript";
import { User } from "src/users/users.model";

@Table({tableName: 'todo-items-json'})
export class TodoItemsJson extends Model<TodoItemsJson> {
    @Column({ type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true })
    id: string;

    @Column({type: DataType.STRING, allowNull: false})
    code: string;

    @Column({type: DataType.JSONB, allowNull: false})
    jsonData: object

    @ForeignKey(() => User)
    @Column({ type: DataType.INTEGER, allowNull: false })
    userId: number;
}
