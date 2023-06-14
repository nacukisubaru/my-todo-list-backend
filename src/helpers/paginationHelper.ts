export const defaultLimitPage = 8;

export const paginate = (query: object, page: number, pageSize: number = defaultLimitPage) => {
    let limit = pageSize;
    const offset = page * limit;

    return {
        ...query,
        offset,
        limit,
    };
};