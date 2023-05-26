import { Column, DataType, Table, Model, ForeignKey } from "sequelize-typescript";
import { FilesFolder } from "src/files-folders/entities/files-folder.entity";
import { TodoList } from "src/todo-list/entities/todo-list.entity";
import { User } from "src/users/users.model";

@Table({tableName: 'files'})
export class Files extends Model<Files>{
    @Column({ type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true })
    id: number;

    @Column({ type: DataType.STRING, allowNull: false })
    name: string;

    @Column({ type: DataType.STRING, allowNull: false })
    path:string;

    @ForeignKey(() => User)
    @Column({ type: DataType.INTEGER })
    userId: number;

    @ForeignKey(() => FilesFolder)
    @Column({ type: DataType.INTEGER })
    folderId: number;

    @ForeignKey(() => TodoList)
    @Column({ type: DataType.STRING })
    todoId: string;
}
