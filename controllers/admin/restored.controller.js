const ProductCategory = require("../../models/product-category.model");
const Product = require("../../models/product.model");
const filterStatusHelper = require("../../helpers/filterStatus");
const searchHelper = require("../../helpers/search");
const paginationHelper = require("../../helpers/pagination");
const systemConfig = require("../../config/system");
// [GET]/admin/products-category
module.exports.index = async (req, res) => {
  const filterStatus = filterStatusHelper(req.query);
  let find = {
    deleted: true,
  };
  if (req.query.status) {
    find.status = req.query.status;
  }
  const objectSearch = searchHelper(req.query);
  // Search
  if (objectSearch.regex) {
    find.title = objectSearch.regex;
  }
  // End Search
  //Pagination
  const countProductCategory = await ProductCategory.countDocuments(find);
  const countProducts = await Product.countDocuments(find);
  let objectPagination = paginationHelper(
    {
      currentPage: 1,
      limitItems: 4,
    },
    req.query,
    countProductCategory,
    countProducts
  );
  //End Pagination
  // Sort
  let sort = {};
  if (req.query.sortKey && req.query.sortValue) {
    sort[req.query.sortKey] = req.query.sortValue;
  } else {
    sort.position = "desc";
  }
  // End Sort
  const productCategoryRecords = await ProductCategory.find(find)
    .sort(sort) // Thứ tự sản phẩm
    .limit(objectPagination.limitItems)
    .skip(objectPagination.skip);
  const productRecords = await Product.find(find)
    .sort(sort) // Thứ tự sản phẩm
    .limit(objectPagination.limitItems)
    .skip(objectPagination.skip);

  res.render("admin/pages/restored/index.pug", {
    pageTitle: "Khôi phục",
    productCategoryRecords: productCategoryRecords,
    productRecords: productRecords,
    filterStatus: filterStatus,
    keyword: objectSearch.keyword,
    pagination: objectPagination,
  });
};
// [PATCH]/admin/restored/:id
module.exports.restored = async (req, res) => {
  try {
    const id = req.params.id;
    await Product.updateOne(
      { _id: id },
      {
        deleted: false,
      }
    );
    req.flash("success", `Khôi phục thành công`);
    res.redirect("back");
  } catch (error) {
    req.flash("error", `Khôi phục thất bại`);
    res.redirect(`${systemConfig.prefixAdmin}/restored`);
  }
};
