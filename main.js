const productList = document.getElementById("productList");
const loading = document.getElementById("loading");
let products = [];
let compareList = [];
async function loadProducts() {
  try {
    $("#loading").fadeIn();
    products = await getProducts();
    renderProducts(products);
    renderCategories();
  } catch (error) {
    alert("Failed to load products");
  } finally {
    $("#loading").fadeOut();
  }
}
function renderProducts(data) {
  productList.innerHTML = "";
  data.forEach((product) => {
    productList.innerHTML += `
      <div class="col-12 col-md-6 col-lg-4">
        <div class="card shadow h-100">
          <img
            src="${product.image}"
            class="card-img-top product-img"
          >
          <div class="card-body d-flex flex-column">
            <span class="badge bg-primary mb-2">
              ${product.category}
            </span>
            <h5>${product.name}</h5>
            <p class="text-danger fw-bold">
              ${formatPrice(product.price)}
            </p>
            <div class="form-check mb-3">
              <input
                class="form-check-input compare-check"
                type="checkbox"
                data-product-id="${product.id}"
              >
              <label class="form-check-label">
                Compare
              </label>
            </div>
            <button
              class="btn btn-dark mt-auto detail-btn"
              type="button"
              data-product-id="${product.id}">
              View Detail
            </button>
          </div>
        </div>
      </div>
    `;
  });
  updateCompareButton();
}

$(document).on("change", ".compare-check", function () {
  const id = $(this).data("product-id");
  const checked = $(this).is(":checked");
  toggleCompare(id, checked, this);
});

$(document).on("click", ".detail-btn", function () {
  showDetail($(this).data("product-id"));
});

function renderCategories() {
  const categories = [...new Set(products.map((p) => p.category))];
  $("#categoryFilter").html(`<option value="all">All Categories</option>`);
  categories.forEach((category) => {
    $("#categoryFilter").append(`
      <option value="${category}">
        ${category}
      </option>
    `);
  });
}

function updateCompareButton() {
  $("#compareBtn").prop("disabled", compareList.length !== 2);
}

$("#compareBtn").on("click", function () {
  if (compareList.length === 2) {
    renderCompare();
  } else {
    showToast("Select 2 products to compare");
  }
});
$("#searchInput").on("input", function () {
  const keyword = $(this).val().toLowerCase();
  const filtered = products.filter((product) =>
    product.name.toLowerCase().includes(keyword),
  );
  renderProducts(filtered);
});
$("#categoryFilter").on("change", function () {
  const value = $(this).val();
  if (value === "all") {
    renderProducts(products);
    return;
  }
  const filtered = products.filter((product) => product.category === value);
  renderProducts(filtered);
});
function showDetail(id) {
  const product = products.find((p) => p.id == id);
  if (!product) {
    showToast("Product not found");
    return;
  }
  $("#modalBody").html(`
    <img
      src="${product.image}"
      class="img-fluid rounded mb-3"
    >
    <h2>${product.name}</h2>
    <p>${product.description}</p>
    <h4 class="text-danger">
      ${formatPrice(product.price)}
    </h4>
  `);
  const modal = new bootstrap.Modal(document.getElementById("productModal"));
  modal.show();
}
function toggleCompare(id, checked, checkbox) {
  const product = products.find((p) => p.id == id);
  if (!product) return;
  if (checked) {
    if (compareList.some((p) => p.id == id)) return;
    if (compareList.length >= 2) {
      showToast("Only 2 products allowed");
      if (checkbox) checkbox.checked = false;
      return;
    }
    compareList.push(product);
    if (compareList.length === 2) {
      renderCompare();
    }
  } else {
    compareList = compareList.filter((p) => p.id != id);
  }
  updateCompareButton();
}
function renderCompare() {
  $("#modalBody").html(`
    <table class="table table-bordered">
      <tr>
        <th>Property</th>
        <th>${compareList[0].name}</th>
        <th>${compareList[1].name}</th>
      </tr>
      <tr>
        <th>Price</th>
        <td>
          ${formatPrice(compareList[0].price)}
        </td>
        <td>
          ${formatPrice(compareList[1].price)}
        </td>
      </tr>
      <tr>
        <th>Category</th>
        <td>${compareList[0].category}</td>
        <td>${compareList[1].category}</td>
      </tr>
    </table>
  `);
  const modal = new bootstrap.Modal(document.getElementById("productModal"));
  modal.show();
}
loadProducts();
