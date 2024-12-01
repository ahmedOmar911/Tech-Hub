// Declare variables to store input values
var productName = document.getElementById("productName");
var productPrice = document.getElementById("productPrice");
var productCategory = document.getElementById("productCategory");
var productDescription = document.getElementById("productDescription");
var productImage = document.getElementById("product-image");

// Declare variables to store buttons
var addBtn = document.getElementById("add-btn");
var updateBtn = document.getElementById("update-btn");

// Declare a variable to work as a linker between setForm & updateProduct functions
var updateIndex;


var allProducts = [];       // Declare an array of products
var filteredProducts = [];  // To keep track of filtered products


// Check if the local storage is empty
if (localStorage.getItem("allProducts") == null) {
    allProducts = [];
} else {
    allProducts = JSON.parse(localStorage.getItem("allProducts"));
}


// Call the display products function when running the app (Display previously added products)
displayProducts(allProducts);


// Declare Adding Product Function
// function addProduct() {
//     // 1) Get all entered values --> put them in an object
//     var product = {
//         productName: productName.value,
//         productPrice: productPrice.value,
//         productCategory: productCategory.value,
//         productImage: `../images/Store-System/${productImage.files[0].name}`,
//         productDescription: productDescription.value
//     };
//     // 2.0) Add this object to an array of products
//     allProducts.push(product);
//     // 2.1) Add this object to the local storage of the browser
//     localStorage.setItem("allProducts", JSON.stringify(allProducts));
//     // 3) clearing the form
//     clearForm();
//     // 4) Displaying products
//     displayProducts(allProducts);
// }

function addProduct() {
    // Convert the image to Base64
    var reader = new FileReader();
    reader.onload = function (event) {
        var base64Image = event.target.result;

        // Create the product object
        var product = {
            productName: productName.value,
            productPrice: productPrice.value,
            productCategory: productCategory.value,
            productImage: base64Image, // Store Base64 data
            productDescription: productDescription.value
        };

        // Add the product to the list
        allProducts.push(product);

        // Save to local storage
        localStorage.setItem("allProducts", JSON.stringify(allProducts));

        // Clear form and refresh display
        clearForm();
        displayProducts(allProducts);
    };

    if (productImage.files[0]) {
        reader.readAsDataURL(productImage.files[0]);
    } else {
        alert("Please select an image!");
    }
}


// Declare Clearing Form Function
function clearForm() {
    productName.value = null;
    productPrice.value = null;
    productCategory.value = null;
    productDescription.value = null;
    productImage.value = null;
}


// Declare a function to display products
function displayProducts(list) {
    var container = ``;
    for (var i = 0; i < list.length; i++) {
        container += `
            <div class="col-lg-3 col-md-6 gy-3">
                <div class="text-center border border-2 rounded-3">
                    <img class="w-75 m-auto my-3 rounded-3" src=${list[i].productImage} alt="product-image">
                    <div class="content">
                        <p>${list[i].productName}</p>
                        <p>product Price: <span>${list[i].productPrice}</span>$</p>
                        <p>product Category: <span>${list[i].productCategory}</span></p>
                        <p>product Description: <span>${list[i].productDescription}</span></p>
                    </div>
                    <div class="my-3">
                        <button class="btn btn-outline-warning me-1" onclick="setForm(${i})"><i class="fa-solid fa-pen"></i> Update</button>
                        <button class="btn btn-outline-danger" onclick="deleteProduct(${i})"><i class="fa-solid fa-trash"></i> Delete</button>
                    </div>
                </div>
            </div>
        `;
    }
    document.getElementById("products-zone").innerHTML = container;
}


// Declare a function to delete a product
function deleteProduct(index) {
    // Check if filteredProducts is being used
    if (filteredProducts.length > 0) {
        // Get the original index of the product in allProducts
        const productToDelete = filteredProducts[index];
        const originalIndex = allProducts.indexOf(productToDelete);
        allProducts.splice(originalIndex, 1); // Remove from main array
        filteredProducts.splice(index, 1);    // Remove from filtered list
        displayProducts(filteredProducts);    // Update display with filtered list
    } else {
        // If no filter is active, remove from allProducts directly
        allProducts.splice(index, 1);
        displayProducts(allProducts);
    }
    // Update local storage
    localStorage.setItem("allProducts", JSON.stringify(allProducts));
}


// Declare a function to search for a product
function searchForProduct(inputElement) {
    var key = inputElement.value.trim();
    filteredProducts = allProducts.filter(product => product.productName.toLowerCase().includes(key.toLowerCase()));
    displayProducts(filteredProducts);
}


// Declare a function to put a product's data in the form to update it
function setForm(index) {
    updateIndex = index;
    productName.value = allProducts[index].productName;
    productPrice.value = allProducts[index].productPrice;
    productCategory.value = allProducts[index].productCategory;
    productDescription.value = allProducts[index].productDescription;
    // Switch buttons
    addBtn.classList.add("d-none");
    updateBtn.classList.remove("d-none");
}


// function updateProduct() {
//     // Retrieve the new image if a file is selected
//     var newImage = productImage.files[0] ? `../imgs/${productImage.files[0].name}` : allProducts[updateIndex].productImage;
//     // Create the updated product object
//     var product = {
//         productName: productName.value,
//         productPrice: productPrice.value,
//         productCategory: productCategory.value,
//         productImage: newImage, // Use the new image if selected, or retain the old one
//         productDescription: productDescription.value
//     };
//     // Update the product in the array
//     allProducts[updateIndex] = product;
//     // Update local storage
//     localStorage.setItem("allProducts", JSON.stringify(allProducts));
//     // Display new data
//     displayProducts(allProducts);
//     // Clear the form
//     clearForm();
//     // Reset the buttons
//     addBtn.classList.remove("d-none");
//     updateBtn.classList.add("d-none");
// }

function updateProduct() {
    var reader = new FileReader();
    reader.onload = function (event) {
        var base64Image = event.target.result;

        // Update the product object
        allProducts[updateIndex] = {
            productName: productName.value,
            productPrice: productPrice.value,
            productCategory: productCategory.value,
            productImage: base64Image || allProducts[updateIndex].productImage, // Use new or existing image
            productDescription: productDescription.value
        };

        // Save to local storage
        localStorage.setItem("allProducts", JSON.stringify(allProducts));

        // Refresh display and reset form
        displayProducts(allProducts);
        clearForm();
        addBtn.classList.remove("d-none");
        updateBtn.classList.add("d-none");
    };

    if (productImage.files[0]) {
        reader.readAsDataURL(productImage.files[0]);
    } else {
        // Update without changing the image
        allProducts[updateIndex].productName = productName.value;
        allProducts[updateIndex].productPrice = productPrice.value;
        allProducts[updateIndex].productCategory = productCategory.value;
        allProducts[updateIndex].productDescription = productDescription.value;

        // Save changes
        localStorage.setItem("allProducts", JSON.stringify(allProducts));

        // Refresh display and reset form
        displayProducts(allProducts);
        clearForm();
        addBtn.classList.remove("d-none");
        updateBtn.classList.add("d-none");
    }
}

// Declate a function to validate user's input
function productValidation(element) {
    // Scheme
    var regex = {
        productName: /^[A-Z][A-Za-z0-9]{4,}(?: [A-Za-z0-9-]+)*$/,
        productPrice: /^(10|[1-9][0-9]+)$/,
        productCategory: /^(TVs|Monitors|Desktops|Laptops|Smart Phones|Smart Tablets|Graphic Tablets|Wearable Devices|Consoles|Desktop Accessories)$/,
        productDescription: /^.{11,}$/
    };

    if (regex[element.id].test(element.value)) {
        element.nextElementSibling.classList.replace("d-block", "d-none");
        element.classList.add("is-valid");
        element.classList.remove("is-invalid");
    } else {
        element.nextElementSibling.classList.replace("d-none", "d-block");
        element.classList.add("is-invalid");
        element.classList.remove("is-valid");
    }
}