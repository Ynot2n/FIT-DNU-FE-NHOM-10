const adminTable = document.getElementById("adminTable");
let editId = null;
async function loadAdminProducts() {
  const products = await getProducts();
  adminTable.innerHTML = "";
  products.forEach((product) => {
    adminTable.innerHTML += `
      <tr>
        <td>
          <img src="${product.image}">
        </td>
        <td>${product.name}</td>
        <td>${formatPrice(product.price)}</td>
        <td>${product.category}</td>
        <td>
          <button
            class="btn btn-warning btn-sm edit-btn"
            data-id="${product.id}">
            Edit
          </button>
          <button
            class="btn btn-danger btn-sm delete-btn"
            data-id="${product.id}">
            Delete
          </button>
        </td>
      </tr>
    `;
  });
  $(".edit-btn").click(handleEdit);
  $(".delete-btn").click(handleDelete);
}
async function handleDelete() {
  const id = $(this).data("id");
  if (confirm("Delete this product?")) {
    await deleteProduct(id);
    showToast("Deleted successfully");
    loadAdminProducts();
  }
}
async function handleEdit() {
  const id = $(this).data("id");
  const products = await getProducts();
  const product = products.find((p) => p.id == id);
  if (!product) {
    showToast("Product not found");
    return;
  }
  editId = id;
  $("#name").val(product.name);
  $("#price").val(product.price);
  $("#category").val(product.category);
  $("#image").val(product.image);
  $("#description").val(product.description);
}
$("#productForm").submit(async function (e) {
  e.preventDefault();
  const product = {
    name: $("#name").val(),
    price: Number($("#price").val()),
    category: $("#category").val(),
    image: $("#image").val(),
    description: $("#description").val(),
  };
  const errors = validateProduct(product);
  $(".error").html("");
  if (Object.keys(errors).length > 0) {
    if (errors.name) {
      $("#nameError").html(errors.name);
    }
    if (errors.price) {
      $("#priceError").html(errors.price);
    }
    if (errors.image) {
      $("#imageError").html(errors.image);
    }
    return;
  }
  if (editId) {
    await updateProduct(editId, product);
    showToast("Updated successfully");
  } else {
    await createProduct(product);
    showToast("Added successfully");
  }
  this.reset();
  editId = null;
  loadAdminProducts();
});
loadAdminProducts();
