export type FilterModel = {
    searchNameTerm: string
    sortBy: string
    sortDirection: 'asc' | 'desc'
    pageNumber: number
    pageSize: number
    blogId: string
}

export const queryPagination = (query: any): FilterModel => {

    return {
        searchNameTerm: query.searchNameTerm ?? '',
        sortBy: query.sortBy ?? 'createdAt',
        sortDirection: query.sortDirection === 'asc' ? 'asc': 'desc',
        pageNumber: +(query.pageNumber ?? 1),
        pageSize: +(query.pageSize ?? 10),
        blogId: query.params === undefined ? '' : query.params.id

    }
}