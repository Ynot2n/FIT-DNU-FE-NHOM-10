const BASE_URL = "https://6a05692baa826ca75c09c73a.mockapi.io";
function getProducts() {
  return fetch(`${BASE_URL}/products`).then((res) => res.json());
}
function createProduct(product) {
  return fetch(`${BASE_URL}/products`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(product),
  }).then((res) => res.json());
}
function updateProduct(id, product) {
  return fetch(`${BASE_URL}/products/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(product),
  }).then((res) => res.json());
}
function deleteProduct(id) {
  return fetch(`${BASE_URL}/products/${id}`, {
    method: "DELETE",
  }).then((res) => res.json());
}
function getReviews() {
  return fetch(`${BASE_URL}/reviews`).then((res) => res.json());
}
