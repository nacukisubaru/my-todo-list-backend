import { Column, DataType, Table, Model, ForeignKey } from "sequelize-typescript";
import { User } from "src/users/users.model";

@Table({tableName: 'video-and-books', createdAt: false, updatedAt: false})
export class BookReader extends Model<BookReader> {
    @Column({ type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true })
    id: number;

    @Column({ type: DataType.STRING, allowNull: false })
    name: string;

    @Column({ type: DataType.STRING, allowNull: true })
    videoUrl: string;

    @Column({ type: DataType.STRING, allowNull: false })
    file: string;

    @Column({ type: DataType.INTEGER, allowNull: true })
    bookmarker: number;

    @Column({ type: DataType.BOOLEAN, allowNull: false })
    isVideo: boolean

    @ForeignKey(() => User)
    @Column({ type: DataType.INTEGER })
    userId: number;
}