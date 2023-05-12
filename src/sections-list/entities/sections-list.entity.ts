import { Column, DataType, Table, Model, HasMany, ForeignKey } from "sequelize-typescript";
import { SectionsTodoList } from "src/sections-todo-list/entities/sections-todo-list.entity";
import { User } from "src/users/users.model";

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

    @ForeignKey(() => User)
    @Column({ type: DataType.INTEGER, allowNull: false })
    userId: number;

    @HasMany(() => SectionsTodoList)
    todosSections: SectionsTodoList[];
}
