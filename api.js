const BASE_URL = "https://6a05692baa826ca75c09c73a.mockapi.io"; // ← THAY BẰNG URL CỦA BẠN

async function getProducts() {
  const res = await fetch(`${BASE_URL}/products`);
  if (!res.ok) throw new Error("Lỗi tải sản phẩm");
  return res.json();
}

async function getProductById(id) {
  const res = await fetch(`${BASE_URL}/products/${id}`);
  return res.json();
}

async function addProduct(product) {
  const res = await fetch(`${BASE_URL}/products`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(product),
  });
  return res.json();
}

async function updateProduct(id, product) {
  const res = await fetch(`${BASE_URL}/products/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(product),
  });
  return res.json();
}

async function deleteProduct(id) {
  await fetch(`${BASE_URL}/products/${id}`, { method: "DELETE" });
}

async function getReviews(productId = "") {
  let url = `${BASE_URL}/reviews`;
  if (productId) url += `?productId=${productId}`;
  const res = await fetch(url);
  return res.json();
}

async function getAllReviews() {
  const res = await fetch(`${BASE_URL}/reviews`);
  return res.json();
}

async function addReview(review) {
  const res = await fetch(`${BASE_URL}/reviews`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(review),
  });
  return res.json();
}

async function updateReview(id, data) {
  const res = await fetch(`${BASE_URL}/reviews/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

async function deleteReview(id) {
  await fetch(`${BASE_URL}/reviews/${id}`, { method: "DELETE" });
}

export {
  getProducts,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct,
  getReviews,
  getAllReviews,
  addReview,
  updateReview,
  deleteReview,
};
