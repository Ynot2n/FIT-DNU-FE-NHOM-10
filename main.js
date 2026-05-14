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
                onchange='toggleCompare(${JSON.stringify(product)})'
              >
              <label class="form-check-label">
                Compare
              </label>
            </div>
            <button
              class="btn btn-dark mt-auto"
              onclick="showDetail('${product.id}')">
              View Detail
            </button>
          </div>
        </div>
      </div>
    `;
  });
}
function renderCategories() {
  const categories = [...new Set(products.map((p) => p.category))];
  categories.forEach((category) => {
    $("#categoryFilter").append(`
      <option value="${category}">
        ${category}
      </option>
    `);
  });
}
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
function toggleCompare(product) {
  if (compareList.length >= 2) {
    showToast("Only 2 products allowed");
    return;
  }
  compareList.push(product);
  if (compareList.length === 2) {
    renderCompare();
  }
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
