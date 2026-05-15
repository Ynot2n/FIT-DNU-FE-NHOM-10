import { getProducts, getReviews } from "./api.js";
import { formatPrice, renderStars } from "./utils.js";

let allProducts = [];
let selectedForCompare = [];

$(document).ready(async () => {
  try {
    allProducts = await getProducts();
    renderProducts(allProducts);
  } catch (err) {
    console.error("Lỗi tải sản phẩm:", err);
    $("#productList").html(
      '<div class="alert alert-danger">Lỗi tải sản phẩm. Vui lòng thử lại sau.</div>',
    );
  }

  // Search + Filter
  $("#searchInput").on("input", filterProducts);
  $("#categoryFilter").on("change", filterProducts);

  // Click card → xem chi tiết
  $(document).on("click", ".product-card", function (e) {
    if ($(e.target).is("input[type=checkbox]")) return;
    showProductDetail($(this).data("id"));
  });

  // Checkbox compare
  $(document).on("change", ".compare-checkbox", function () {
    const id = $(this).data("id");
    if (this.checked) {
      if (selectedForCompare.length >= 2) {
        this.checked = false;
        alert("Chỉ được so sánh tối đa 2 sản phẩm!");
        return;
      }
      selectedForCompare.push(allProducts.find((p) => p.id === id));
    } else {
      selectedForCompare = selectedForCompare.filter((p) => p.id !== id);
    }
    $("#compareCount").text(selectedForCompare.length);
  });

  // Nút So sánh
  $("#btnCompare").click(() => {
    if (selectedForCompare.length !== 2) {
      alert("Vui lòng chọn đúng 2 sản phẩm để so sánh!");
      return;
    }
    renderComparisonTable();
    $("#compareModal").modal("show");
  });
});

function renderProducts(products) {
  const container = $("#productList");
  container.html("");
  products.forEach((p) => {
    const card = `
      <div class="col-md-4 col-lg-3 mb-4">
        <div class="card h-100 product-card shadow-sm" data-id="${p.id}">
          <img src="${p.image}" class="card-img-top" style="height:200px;object-fit:cover">
          <div class="card-body">
            <h6 class="card-title">${p.name}</h6>
            <p class="text-primary fw-bold">${formatPrice(p.price)}</p>
            <span class="badge bg-secondary">${p.category}</span>
            <div class="mt-2">
              <input type="checkbox" class="compare-checkbox form-check-input" data-id="${p.id}">
              <label class="form-check-label ms-1">So sánh</label>
            </div>
          </div>
        </div>
      </div>`;
    container.append(card);
  });
}

function filterProducts() {
  const term = $("#searchInput").val().toLowerCase();
  const cat = $("#categoryFilter").val();
  const filtered = allProducts.filter((p) => {
    const matchName = p.name.toLowerCase().includes(term);
    const matchCat = !cat || p.category === cat;
    return matchName && matchCat;
  });
  renderProducts(filtered);
}

async function showProductDetail(id) {
  const product = allProducts.find((p) => p.id === id);
  let reviews = [];
  try {
    reviews = await getReviews(id);
  } catch (err) {
    console.error("Lỗi tải đánh giá:", err);
  }

  $("#modalProductName").text(product.name);
  $("#modalImage").attr("src", product.image);
  $("#modalPrice").html(`<strong>${formatPrice(product.price)}</strong>`);
  $("#modalDescription").text(product.description);

  const specsHTML = `
    <ul class="list-group">
      <li class="list-group-item"><strong>Thương hiệu:</strong> ${product.brand}</li>
      <li class="list-group-item"><strong>Màn hình:</strong> ${product.screen}</li>
      <li class="list-group-item"><strong>RAM:</strong> ${product.ram}</li>
      <li class="list-group-item"><strong>Bộ nhớ:</strong> ${product.storage}</li>
    </ul>`;
  $("#modalSpecs").html(specsHTML);

  // Render reviews
  let reviewHTML = "";
  reviews.forEach((r) => {
    reviewHTML += `
      <div class="border-bottom pb-2 mb-2">
        <div class="d-flex justify-content-between">
          <strong>${r.reviewer}</strong>
          ${renderStars(r.rating)}
        </div>
        <p class="mb-0">${r.comment}</p>
      </div>`;
  });
  $("#reviewList").html(reviewHTML || "<p>Chưa có đánh giá nào.</p>");

  new bootstrap.Modal($("#detailModal")[0]).show();
}

// ====================== SO SÁNH BẰNG DOM MANIPULATION ======================
function renderComparisonTable() {
  const [p1, p2] = selectedForCompare;
  const table = `
    <table class="table table-bordered">
      <thead>
        <tr>
          <th>Thuộc tính</th>
          <th>${p1.name}</th>
          <th>${p2.name}</th>
        </tr>
      </thead>
      <tbody>
        <tr><td>Giá</td><td>${formatPrice(p1.price)}</td><td>${formatPrice(p2.price)}</td></tr>
        <tr><td>Thương hiệu</td><td>${p1.brand}</td><td>${p2.brand}</td></tr>
        <tr><td>Màn hình</td><td>${p1.screen}</td><td>${p2.screen}</td></tr>
        <tr><td>RAM</td><td>${p1.ram}</td><td>${p2.ram}</td></tr>
        <tr><td>Bộ nhớ</td><td>${p1.storage}</td><td>${p2.storage}</td></tr>
      </tbody>
    </table>`;
  $("#compareTable").html(table);
}
