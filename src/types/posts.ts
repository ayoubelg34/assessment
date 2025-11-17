export interface Category {
  id: string;
  name: string;
}

export interface Author {
  name: string;
  avatar?: string;
}

export interface Post {
  id: string;
  title: string;
  publishDate: string;
  summary: string;
  author?: Author;
  categories?: Category[];
}

export interface PostsResponse {
  posts: Post[];
}
