const IMAGE_LIST = `
query ($id: Int, $page: Int, $perPage: Int, $search: String) {
  Page (page: $page, perPage: $perPage) {
    pageInfo {
      total
      currentPage
      lastPage
      hasNextPage
      perPage
    }
    media (id: $id, search: $search) {
      id
      source
      siteUrl
      title {
        romaji
      }
    }
  }
}
`;

export { IMAGE_LIST };
