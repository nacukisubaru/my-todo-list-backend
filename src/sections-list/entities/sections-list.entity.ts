import { Column, DataType, Table, Model, HasMany } from "sequelize-typescript";
import { SectionsTodoList } from "src/sections-todo-list/entities/sections-todo-list.entity";

@Table({tableName: 'sections-list'})
export class SectionsList extends Model<SectionsList>{
    @Column({ type: DataType.STRING, unique: true, autoIncrement: false, primaryKey: true })
    id: string;

    @Column({ type: DataType.STRING, allowNull: false })
    name: string;

    @Column({ type: DataType.INTEGER, allowNull: false })
    sort: number;

    @Column({ type: DataType.BOOLEAN, allowNull: false })
    showSections: boolean;

    @Column({ type: DataType.STRING })
    parentId: string;

    @HasMany(() => SectionsTodoList)
    todosSections: SectionsTodoList[];
}
