import {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  getAllReviews,
  updateReview,
  deleteReview,
} from "./api.js";
import { validateProductForm, formatPrice } from "./utils.js";

let allProducts = [];

$(document).ready(async () => {
  allProducts = await loadProducts();
  loadReviews();

  // Tab chuyển
  $("#tabProducts").click(() => {
    $("#sectionProducts").removeClass("d-none");
    $("#sectionReviews").addClass("d-none");
    $("#tabProducts").addClass("active");
    $("#tabReviews").removeClass("active");
  });
  $("#tabReviews").click(() => {
    $("#sectionProducts").addClass("d-none");
    $("#sectionReviews").removeClass("d-none");
    $("#tabReviews").addClass("active");
    $("#tabProducts").removeClass("active");
  });

  // Submit form sản phẩm
  $("#productForm").on("submit", async function (e) {
    e.preventDefault();
    const formData = {
      name: $("#name").val().trim(),
      price: parseFloat($("#price").val()),
      category: $("#category").val(),
      image: $("#image").val().trim(),
      description: $("#description").val().trim(),
      brand: $("#brand").val().trim(),
      screen: $("#screen").val().trim(),
      ram: $("#ram").val().trim(),
      storage: $("#storage").val().trim(),
    };

    const errors = validateProductForm(formData);
    if (Object.keys(errors).length > 0) {
      showInlineErrors(errors);
      return;
    }

    const id = $("#productId").val();
    try {
      if (id) {
        await updateProduct(id, formData);
        showToast("Cập nhật sản phẩm thành công!", "success");
      } else {
        await addProduct(formData);
        showToast("Thêm sản phẩm thành công!", "success");
      }
      $("#productModal").modal("hide");
      allProducts = await loadProducts();
      resetForm();
    } catch (err) {
      showToast("Lỗi khi lưu sản phẩm!", "danger");
    }
  });

  // Xóa sản phẩm
  $(document).on("click", ".btn-delete-product", async function () {
    if (!confirm("Bạn chắc chắn muốn xóa sản phẩm này?")) return;
    const id = $(this).data("id");
    await deleteProduct(id);
    showToast("Đã xóa sản phẩm!", "success");
    allProducts = await loadProducts();
  });

  // Edit sản phẩm
  $(document).on("click", ".btn-edit-product", function () {
    const product = allProducts.find((p) => p.id === $(this).data("id"));
    $("#productId").val(product.id);
    $("#name").val(product.name);
    $("#price").val(product.price);
    $("#category").val(product.category);
    $("#image").val(product.image);
    $("#description").val(product.description || "");
    $("#brand").val(product.brand || "");
    $("#screen").val(product.screen || "");
    $("#ram").val(product.ram || "");
    $("#storage").val(product.storage || "");
    $("#modalTitle").text("Chỉnh sửa sản phẩm");
    $("#productModal").modal("show");
  });

  // Duyệt / Hủy duyệt review
  $(document).on("click", ".btn-toggle-review", async function () {
    const id = $(this).data("id");
    const approved = $(this).data("approved");
    await updateReview(id, { approved: !approved });
    showToast("Đã cập nhật trạng thái đánh giá!", "success");
    loadReviews();
  });

  // Xóa review
  $(document).on("click", ".btn-delete-review", async function () {
    if (!confirm("Xóa đánh giá này?")) return;
    await deleteReview($(this).data("id"));
    showToast("Đã xóa đánh giá!", "success");
    loadReviews();
  });
});

async function loadProducts() {
  const tbody = $("#productTable tbody");
  tbody.html(
    '<tr><td colspan="5" class="text-center"><div class="spinner-border text-primary"></div></td></tr>',
  );
  try {
    const products = await getProducts();
    tbody.empty();
    products.forEach((p) => {
      tbody.append(`
        <tr>
          <td><img src="${p.image}" width="50" class="rounded"></td>
          <td>${p.name}</td>
          <td>${formatPrice(p.price)}</td>
          <td><span class="badge bg-info">${p.category}</span></td>
          <td>
            <button class="btn btn-sm btn-warning btn-edit-product" data-id="${p.id}">Sửa</button>
            <button class="btn btn-sm btn-danger btn-delete-product" data-id="${p.id}">Xóa</button>
          </td>
        </tr>`);
    });
    return products;
  } catch (err) {
    tbody.html(
      '<tr><td colspan="5" class="text-center text-danger">Lỗi tải sản phẩm</td></tr>',
    );
    throw err;
  }
}

async function loadReviews() {
  const tbody = $("#reviewTable tbody");
  tbody.html(
    '<tr><td colspan="6" class="text-center"><div class="spinner-border text-primary"></div></td></tr>',
  );
  try {
    const reviews = await getAllReviews();
    tbody.empty();
    reviews.forEach((r) => {
      tbody.append(`
        <tr>
          <td>${r.productId}</td>
          <td>${r.reviewer}</td>
          <td>${r.rating} ⭐</td>
          <td>${r.comment}</td>
          <td>
            <span class="badge ${r.approved ? "bg-success" : "bg-secondary"}">${r.approved ? "Đã duyệt" : "Chờ duyệt"}</span>
          </td>
          <td>
            <button class="btn btn-sm ${r.approved ? "btn-secondary" : "btn-success"} btn-toggle-review" 
                    data-id="${r.id}" data-approved="${r.approved}">
              ${r.approved ? "Hủy duyệt" : "Duyệt"}
            </button>
            <button class="btn btn-sm btn-danger btn-delete-review" data-id="${r.id}">Xóa</button>
          </td>
        </tr>`);
    });
  } catch (err) {
    tbody.html(
      '<tr><td colspan="6" class="text-center text-danger">Lỗi tải đánh giá</td></tr>',
    );
  }
}

function showInlineErrors(errors) {
  $(".invalid-feedback").text("");
  Object.keys(errors).forEach((key) => {
    $(`#err${key.charAt(0).toUpperCase() + key.slice(1)}`)
      .text(errors[key])
      .show();
  });
}

function resetForm() {
  $("#productForm")[0].reset();
  $("#productId").val("");
  $("#modalTitle").text("Thêm sản phẩm mới");
  $(".invalid-feedback").text("");
}

function showToast(message, type) {
  const toastHTML = `
    <div class="toast align-items-center text-white bg-${type} border-0" role="alert">
      <div class="d-flex">
        <div class="toast-body">${message}</div>
        <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
      </div>
    </div>`;
  $("body").append(toastHTML);
  const toast = new bootstrap.Toast($(".toast").last()[0]);
  toast.show();
  setTimeout(() => $(".toast").last().remove(), 4000);
}
