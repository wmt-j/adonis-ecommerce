export default async function (query, page: number, limit: number) {
    const results = await query.limit(limit).skip((page - 1) * limit)

    return { pageInfo: { currentPage: page, totalPages: Math.ceil(page / limit) }, results }
}