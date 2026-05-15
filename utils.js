function validateProductForm(formData) {
  const errors = {};
  if (!formData.name?.trim()) errors.name = "Tên sản phẩm không được để trống";
  if (!formData.price || formData.price <= 0)
    errors.price = "Giá phải lớn hơn 0";
  if (!formData.category) errors.category = "Vui lòng chọn danh mục";
  if (!formData.image || !/^https?:\/\//.test(formData.image))
    errors.image = "URL ảnh không hợp lệ";
  return errors;
}

function formatPrice(price) {
  return new Intl.NumberFormat("vi-VN").format(price) + " ₫";
}

function renderStars(rating) {
  let stars = "";
  for (let i = 1; i <= 5; i++) {
    stars += `<i class="bi bi-star${i <= rating ? "-fill" : ""} text-warning"></i>`;
  }
  return stars;
}

export { validateProductForm, formatPrice, renderStars };
