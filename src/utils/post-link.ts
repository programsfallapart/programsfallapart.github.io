import type { PostModel } from '@interfaces/models'

export const getPostLink = (post: PostModel) => `/posts/${post.data.abbrlink}`
