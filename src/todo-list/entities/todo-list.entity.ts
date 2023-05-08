import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { SectionsList } from "src/sections-list/entities/sections-list.entity";
import { SectionsTodoList } from "src/sections-todo-list/entities/sections-todo-list.entity";

@Table({tableName: 'todo-list'})
export class TodoList extends Model<TodoList> {
    @Column({ type: DataType.STRING, unique: true, autoIncrement: false, primaryKey: true })
    id: string;

    @Column({ type: DataType.STRING, allowNull: false })
    name: string;

    @Column({ type: DataType.STRING, allowNull: false })
    description: string;

    @Column({ type: DataType.BOOLEAN, allowNull: false })
    showTasks: boolean;

    @Column({ type: DataType.BOOLEAN, allowNull: false })
    isComplete: boolean;

    @Column({ type: DataType.STRING, allowNull: true })
    parentId: string;

    @ForeignKey(() => SectionsTodoList)
    @Column({ type: DataType.STRING })
    sectionId: string;

    @BelongsTo(() => SectionsTodoList, { as: 'sectionsTodoList'})
    sections: SectionsTodoList[];

    @Column({ type: DataType.INTEGER, allowNull: false })
    sort: number;
}
