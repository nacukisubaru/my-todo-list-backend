export class CreateTodoListDto {
    id: string;
    name: string;
    parentId: string;
    description: string;
    descriptionTwo: string;
    showTasks: boolean;
    sort: number;
    isComplete:boolean
}
