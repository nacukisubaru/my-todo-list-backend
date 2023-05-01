import { Column, DataType, Table, Model } from "sequelize-typescript";

@Table({tableName: 'todo-items-json'})
export class TodoItemsJson extends Model<TodoItemsJson> {
    @Column({ type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true })
    id: string;

    @Column({type: DataType.STRING, allowNull: false})
    code: string;

    @Column({type: DataType.JSONB, allowNull: false})
    jsonData: object
}
