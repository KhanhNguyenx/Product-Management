const ProductCategory = require("../models/product-category.model");
module.exports.getSubCategory = async (parentId) => {
  const getCategory = async (parentId) => {
    const subs = await ProductCategory.find({
      parent_id: parentId,
      status: "active",
      deleted: false,
    });

    let allSubs = [...subs];

    for (const sub of subs) {
      const childs = await getCategory(sub.id);
      allSubs = allSubs.concat(childs);
    }

    return allSubs;
  };
  const result = await getCategory(parentId);
  return result;
};
