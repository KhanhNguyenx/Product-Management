module.exports = (query) => {
  let objectSearch = {
    keyword: "",
  };
  if (query.keyword) {
    objectSearch.keyword = query.keyword;
    const regex = new RegExp(objectSearch.keyword, "i"); //tìm kiếm không phân biệt hoa thường, theo keyword
    objectSearch.regex = regex;
  }
  return objectSearch;
};
