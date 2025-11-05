export const API_ENDPOINTS = {
  topics: {
    list: "/topics",
    detail: (id: string) => `/topics/${id}`,
    create: "/topics",
  },
  ideas: {
    list: "/ideas",
    create: "/ideas",
    update: (id: string) => `/ideas/${id}`,
    delete: (id: string) => `/ideas/${id}`,
  },
  likes: {
    toggle: "/likes/toggle",
    list: "/likes",
  },
  comments: {
    list: "/comments",
    create: "/comments",
    update: (id: string) => `/comments/${id}`,
    delete: (id: string) => `/comments/${id}`,
  },
} as const;

