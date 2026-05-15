import { getProducts, getReviews } from "./api.js";
import { formatPrice, renderStars } from "./utils.js";

let allProducts = [];
let selectedForCompare = [];

// ====================== HÀM TOAST ĐẸP ======================
function showToast(message, type = "warning") {
  const toastHTML = `
    <div class="toast align-items-center text-white bg-${type} border-0" role="alert" aria-live="assertive" aria-atomic="true">
      <div class="d-flex">
        <div class="toast-body fw-semibold">${message}</div>
        <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
      </div>
    </div>`;

  const container = $(".toast-container");
  container.append(toastHTML);

  const toastElement = container.find(".toast").last()[0];
  const toast = new bootstrap.Toast(toastElement, { delay: 3000 });
  toast.show();

  // Xóa toast sau khi ẩn
  $(toastElement).on("hidden.bs.toast", function () {
    $(this).remove();
  });
}

$(document).ready(async () => {
  try {
    allProducts = await getProducts();
    renderProducts(allProducts);
  } catch (err) {
    console.error(err);
    $("#productList").html(
      '<div class="col-12 text-center text-danger p-5">Lỗi kết nối MockAPI.<br>Kiểm tra BASE_URL trong api.js</div>',
    );
  }

  // Tìm kiếm + lọc
  $("#searchInput").on("input", filterProducts);
  $("#categoryFilter").on("change", filterProducts);

  // CLICK VÀO CARD → HIỆN MODAL CHI TIẾT THÔNG SỐ
  $(document).on("click", ".product-card", function (e) {
    if (
      $(e.target).is(".compare-checkbox") ||
      $(e.target).closest(".compare-checkbox").length
    )
      return;
    const id = $(this).data("id");
    showProductDetail(id);
  });

  // TICK CHECKBOX SO SÁNH
  $(document).on("change", ".compare-checkbox", function () {
    const id = $(this).data("id");
    const product = allProducts.find((p) => p.id === id);

    if (this.checked) {
      if (selectedForCompare.length >= 2) {
        this.checked = false;
        showToast("Chỉ được so sánh tối đa 2 sản phẩm!", "warning");
        return;
      }
      selectedForCompare.push(product);
      $(this)
        .closest(".product-card")
        .addClass("border border-primary border-3");
    } else {
      selectedForCompare = selectedForCompare.filter((p) => p.id !== id);
      $(this)
        .closest(".product-card")
        .removeClass("border border-primary border-3");
    }
    updateCompareButton();
  });

  // NÚT SO SÁNH
  $("#btnCompare").on("click", () => {
    if (selectedForCompare.length !== 2) {
      showToast("Vui lòng chọn đúng 2 sản phẩm để so sánh!", "danger");
      return;
    }
    renderComparisonTable();
    new bootstrap.Modal(document.getElementById("compareModal")).show();
  });
});

// ====================== RENDER DANH SÁCH ======================
function renderProducts(products) {
  const container = $("#productList");
  container.empty();

  products.forEach((p) => {
    const cardHTML = `
      <div class="col-6 col-md-4 col-lg-3 mb-4">
        <div class="card h-100 product-card shadow-sm" data-id="${p.id}">
          <img src="${p.image}" class="card-img-top" style="height:200px;object-fit:cover" alt="${p.name}">
          <div class="card-body d-flex flex-column">
            <h6 class="card-title">${p.name}</h6>
            <p class="text-primary fw-bold mb-2">${formatPrice(p.price)}</p>
            <span class="badge bg-secondary mb-3">${p.category}</span>
            <div class="mt-auto">
              <div class="form-check">
                <input type="checkbox" class="compare-checkbox form-check-input" data-id="${p.id}">
                <label class="form-check-label small">So sánh</label>
              </div>
            </div>
          </div>
        </div>
      </div>`;
    container.append(cardHTML);
  });
}

function updateCompareButton() {
  $("#compareCount").text(selectedForCompare.length);
  $("#btnCompare").prop("disabled", selectedForCompare.length !== 2);
}

// ====================== MODAL CHI TIẾT SẢN PHẨM ======================
async function showProductDetail(id) {
  const product = allProducts.find((p) => p.id === id);
  if (!product) return;

  const reviews = await getReviews(id);

  $("#modalProductName").text(product.name);
  $("#modalImage").attr("src", product.image);
  $("#modalPrice").html(`<strong>${formatPrice(product.price)}</strong>`);
  $("#modalDescription").text(product.description || "Chưa có mô tả.");

  const specsHTML = `
    <ul class="list-group list-group-flush">
      <li class="list-group-item"><strong>Thương hiệu:</strong> ${product.brand || "—"}</li>
      <li class="list-group-item"><strong>Màn hình:</strong> ${product.screen || "—"}</li>
      <li class="list-group-item"><strong>RAM:</strong> ${product.ram || "—"}</li>
      <li class="list-group-item"><strong>Bộ nhớ:</strong> ${product.storage || "—"}</li>
    </ul>`;
  $("#modalSpecs").html(specsHTML);

  let reviewHTML =
    reviews.length === 0
      ? `<p class="text-muted">Chưa có đánh giá nào.</p>`
      : reviews
          .map(
            (r) => `
      <div class="border-bottom pb-2 mb-3">
        <div class="d-flex justify-content-between align-items-center">
          <strong>${r.reviewer}</strong>
          <div>${renderStars(r.rating)}</div>
        </div>
        <p class="mb-0">${r.comment}</p>
      </div>`,
          )
          .join("");

  $("#reviewList").html(reviewHTML);
  new bootstrap.Modal(document.getElementById("detailModal")).show();
}

// ====================== MODAL SO SÁNH THÔNG SỐ ======================
function renderComparisonTable() {
  const [p1, p2] = selectedForCompare;
  const tableHTML = `
    <table class="table table-bordered align-middle">
      <thead class="table-light">
        <tr>
          <th width="30%">Thuộc tính</th>
          <th>${p1.name}</th>
          <th>${p2.name}</th>
        </tr>
      </thead>
      <tbody>
        <tr><td><strong>Giá</strong></td><td>${formatPrice(p1.price)}</td><td>${formatPrice(p2.price)}</td></tr>
        <tr><td><strong>Danh mục</strong></td><td>${p1.category}</td><td>${p2.category}</td></tr>
        <tr><td><strong>Thương hiệu</strong></td><td>${p1.brand || "—"}</td><td>${p2.brand || "—"}</td></tr>
        <tr><td><strong>Màn hình</strong></td><td>${p1.screen || "—"}</td><td>${p2.screen || "—"}</td></tr>
        <tr><td><strong>RAM</strong></td><td>${p1.ram || "—"}</td><td>${p2.ram || "—"}</td></tr>
        <tr><td><strong>Bộ nhớ</strong></td><td>${p1.storage || "—"}</td><td>${p2.storage || "—"}</td></tr>
      </tbody>
    </table>`;
  $("#compareTable").html(tableHTML);
}

// ====================== LỌC SẢN PHẨM ======================
function filterProducts() {
  const term = $("#searchInput").val().toLowerCase().trim();
  const cat = $("#categoryFilter").val();

  const filtered = allProducts.filter((p) => {
    const matchName = !term || p.name.toLowerCase().includes(term);
    const matchCat = !cat || p.category === cat;
    return matchName && matchCat;
  });

  renderProducts(filtered);
}
