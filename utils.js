function formatPrice(price) {
  return Number(price).toLocaleString("vi-VN") + "₫";
}
function isValidURL(url) {
  return /(https?:\/\/.*\.(?:png|jpg|jpeg|gif))/i.test(url);
}
function validateProduct(data) {
  let errors = {};
  if (!data.name.trim()) {
    errors.name = "Product name required";
  }
  if (data.price <= 0) {
    errors.price = "Price must be greater than 0";
  }
  if (!isValidURL(data.image)) {
    errors.image = "Invalid image URL";
  }
  return errors;
}
function showToast(message) {
  $("#toastText").html(message);
  const toast = new bootstrap.Toast(document.getElementById("mainToast"));
  toast.show();
}
