export type FilterModel = {
    searchNameTerm: string
    sortBy: string
    sortDirection: 'asc' | 'desc'
    pageNumber: number
    pageSize: number
    blogId: string
}

export const queryPagination = (req: any): FilterModel => {

    return {
        searchNameTerm: req.query.searchNameTerm ?? '',
        sortBy: req.query.sortBy ?? 'createdAt',
        sortDirection: req.query.sortDirection === 'asc' ? 'asc': 'desc',
        pageNumber: +(req.query.pageNumber ?? 1),
        pageSize: +(req.query.pageSize ?? 10),
        blogId: req.params.id ?? ''

    }
}