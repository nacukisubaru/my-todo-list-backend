export const arrayUniqueByKey = (array:any, key = 'id') => {
    const map:any = Map;
    const arrayUniqueByKey = [
        ...new map(array.map((item: { [x: string]: any; }) => [item[key], item])).values()
    ];

    return arrayUniqueByKey;
}

export function spliceIntoChunks(arr, chunkSize) {
    const res = [];
    while (arr.length > 0) {
        const chunk = arr.splice(0, chunkSize);
        res.push(chunk);
    }
    return res;
}

export const uniqueList = (array: any[]) => {
    function onlyUnique(value: any, index: number, array: any[]) {
        return array.indexOf(value) === index;
    }

    return array.filter(onlyUnique);
}