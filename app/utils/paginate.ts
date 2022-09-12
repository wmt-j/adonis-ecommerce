export default async function (query, page: number, limit: number) {
    const docs = await query.find()
    const results = await query.limit(limit).skip((page - 1) * limit).clone()

    return { pageInfo: { currentPage: page, totalPages: Math.ceil(docs.length / limit) }, results }
}