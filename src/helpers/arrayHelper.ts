export const arrayUniqueByKey = (array:any, key = 'id') => {
    const map:any = Map;
    const arrayUniqueByKey = [
        ...new map(array.map((item: { [x: string]: any; }) => [item[key], item])).values()
    ];

    return arrayUniqueByKey;
}