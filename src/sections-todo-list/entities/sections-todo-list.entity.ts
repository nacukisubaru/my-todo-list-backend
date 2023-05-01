import { Column, DataType, Table, Model, HasMany, ForeignKey, BelongsTo } from "sequelize-typescript";
import { SectionsList } from "src/sections-list/entities/sections-list.entity";
import { TodoList } from "src/todo-list/entities/todo-list.entity";

@Table({tableName: 'sections-todo-list'})
export class SectionsTodoList extends Model<SectionsTodoList>{
    @Column({ type: DataType.STRING, unique: true, autoIncrement: false, primaryKey: true })
    id: string;

    @Column({ type: DataType.STRING, allowNull: false })
    name: string;

    @Column({ type: DataType.BOOLEAN, allowNull: false })
    showTasks: boolean;

    @HasMany(() => TodoList)
    todos: TodoList[];

    @ForeignKey(() => SectionsList)
    @Column({ type: DataType.STRING })
    sectionId: string;

    @BelongsTo(() => SectionsList, { as: 'sectionsList'})
    sections: SectionsList[];

    @Column({ type: DataType.INTEGER, allowNull: false })
    sort: number;
}
