const Role = require("../../models/role.model");
const systemConfig = require("../../config/system");

// [GET]/admin/roles
module.exports.index = async (req, res) => {
  const find = {
    deleted: false,
  };
  const records = await Role.find(find);
  res.render("admin/pages/role/index.pug", {
    pageTitle: "Nhóm quyền",
    records: records,
  });
};
// [GET]/admin/roles/create
module.exports.create = (req, res) => {
  res.render("admin/pages/role/create.pug", {
    pageTitle: "Tạo nhóm quyền",
  });
};
// [POST]/admin/roles/create
module.exports.createPost = async (req, res) => {
  const record = new Role(req.body);
  await record.save();
  res.redirect(`${systemConfig.prefixAdmin}/roles`);
};
// [GET]/admin/roles/edit/:id
module.exports.edit = async (req, res) => {
  try {
    const find = {
      deleted: false,
      _id: req.params.id,
    };
    const role = await Role.findOne(find);

    res.render("admin/pages/role/edit.pug", {
      pageTitle: "Chỉnh sửa thông tin quyền",
      role: role,
    });
  } catch (error) {
    req.flash("error", `Không tồn tại quyền`);
    res.redirect(`${systemConfig.prefixAdmin}/roles`);
  }
};
// [PATCH]/admin/roles/edit/:id
module.exports.editPatch = async (req, res) => {
  try {
    const id = req.params.id;
    await Role.updateOne(
      {
        _id: id,
        deleted: false,
      },
      req.body
    );
    req.flash("success", `Cập nhật thành công`);
    res.redirect("back");
  } catch (error) {
    req.flash("error", `Cập nhật thất bại`);
    res.redirect(`${systemConfig.prefixAdmin}/roles`);
  }
};
// [GET]/admin/roles/detail/:id
module.exports.detail = async (req, res) => {
  try {
    const find = {
      deleted: false,
      _id: req.params.id,
    };
    const role = await Role.findOne(find);

    res.render("admin/pages/role/detail.pug", {
      role: role,
    });
  } catch (error) {
    req.flash("error", `Không tồn tại sản phẩm`);
    res.redirect(`${systemConfig.prefixAdmin}/role`);
  }
};
// [DELETE]/admin/roles/delete/:id
module.exports.delete = async (req, res) => {
  const id = req.params.id;
  await Role.updateOne(
    { _id: id },
    {
      deleted: true,
      deletedAt: new Date(),
    }
  );
  req.flash("success", `Đã xóa thành công!`);
  res.redirect("back");
};
