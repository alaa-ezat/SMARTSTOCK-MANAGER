let titleElement = document.getElementById("title");
let priceElement = document.getElementById("price");
let taxesElement = document.getElementById("taxes");
let adsElement = document.getElementById("ads");
let discountElement = document.getElementById("discount");
let totalElement = document.getElementById("total");
let countElement = document.getElementById("count");
let categoryElement = document.getElementById("category");
let submitElement = document.getElementById("submit");
let tbodyElement = document.getElementById("tbody");
let deleteAllElement = document.getElementById("deleteall");
let searchInput = document.getElementById("search");
let searchByTitleButton = document.getElementById("search-title");
let searchByCategoryButton = document.getElementById("searchcategory");

let datapro = JSON.parse(localStorage.getItem('products')) || [];
let selectedRowIndex = -1; 
let selectedCategory = ""; 

function gettotal() {
    if (priceElement.value !== '') {
        let result = (+priceElement.value + +taxesElement.value + +adsElement.value) - +discountElement.value;
        totalElement.innerHTML = result;
        totalElement.style.background = '#ffd166';
        totalElement.style.color= '#000';
    } else {
        totalElement.innerHTML = '';
        totalElement.style.background = '#ef476f';
    }
}

function cleardata() {
    titleElement.value = '';
    priceElement.value = '';
    taxesElement.value = '';
    adsElement.value = '';
    discountElement.value = '';
    totalElement.innerHTML = '';
    countElement.value = '';
    categoryElement.value = '';
}
function clearInputFields() {
    titleElement.value = '';
    priceElement.value = '';
    taxesElement.value = '';
    adsElement.value = '';
    discountElement.value = '';
    totalElement.innerHTML = '';
    countElement.value = '';
    categoryElement.value = '';
    searchByCategoryButton.value='';
    searchByTitleButton.value='';
    searchInput.value='';

}

function showdata() {
    gettotal()

    let table = '';
    for (let i = 0; i < datapro.length; i++) {
        table += `
        <tr>
            <td>${i+ 1}</td>
            <td>${datapro[i].title}</td>
            <td>${datapro[i].price}</td>
            <td>${datapro[i].taxes}</td>
            <td>${datapro[i].ads}</td>
            <td>${datapro[i].discount}</td>
            <td>${datapro[i].total}</td>
            <td>${datapro[i].category}</td>
            <td>
                <button onclick="deletedata(${i})" id="delete">delete</button>
                <button onclick="updatedata(${i})" id="update">update</button>
            </td>
        </tr>`;
    }
    tbodyElement.innerHTML = table;
    toggleDeleteAllButton();
}

function deletedata(i) {
    const confirmation = confirm("Are you sure you want to delete this item?");
    if (confirmation) {
        datapro.splice(i, 1);
        localStorage.setItem('products', JSON.stringify(datapro));
        showdata();
    }
}

function toggleDeleteAllButton() {
    if (datapro.length > 0) {
        deleteAllElement.style.display = 'block';
        deleteAllElement.textContent = `Delete All (${datapro.length} items)`;
    } else {
        deleteAllElement.style.display = 'none';
    }
    
}

function deleteAllData() {
    const confirmation = confirm("Are you sure you want to delete all items?");
    if (confirmation) {
        datapro = [];
        localStorage.removeItem('products');
        showdata();
        alert("All items have been deleted.");
    }
}

submitElement.onclick = function () {
    const titleValue = titleElement.value.trim();
    const priceValue = parseFloat(priceElement.value);
    const countValue = parseInt(countElement.value);
    const categoryValue = categoryElement.value.trim();

    if (titleValue === '' || isNaN(priceValue) || isNaN(countValue) || categoryValue === '') {
        alert('Please fill in all the required fields (title, price, count, and category)');
        return;
    }
    if (countValue > 500) {
        alert('Count value cannot exceed the maximum limit of 500');
        return;
    }

    let newpro = {
        title: titleValue,
        price: priceValue,
        taxes: parseFloat(taxesElement.value),
        ads: parseFloat(adsElement.value),
        discount: parseFloat(discountElement.value),
        total: totalElement.innerHTML,
        count: countValue,
        category: categoryValue,
    };

    let dataIndex = parseInt(submitElement.getAttribute("data-index"));

    if (!isNaN(dataIndex)) {
        
        datapro[dataIndex] = newpro;

       
        for (let i = 1; i < newpro.count; i++) {
            datapro.splice(dataIndex + i, 0, { ...newpro });
        }

        submitElement.textContent = "Create"; 
    } else {

        if (newpro.count > 1) {
            for (let i = 0; i < newpro.count; i++) {
                datapro.push({ ...newpro }); 
            }
        } else {
            datapro.push(newpro);
        }
    }

    newpro.total = (+priceElement.value + +taxesElement.value + +adsElement.value) - +discountElement.value;
    localStorage.setItem('products', JSON.stringify(datapro));
    clearInputFields();
    showdata();
    toggleDeleteAllButton();

    submitElement.removeAttribute("data-index");
};

deleteAllElement.onclick = deleteAllData;

showdata();
toggleDeleteAllButton();    

function updatedata(i) {
    let updatedProduct = datapro[i];

    titleElement.value = updatedProduct.title;
    priceElement.value = updatedProduct.price;
    taxesElement.value = updatedProduct.taxes;
    adsElement.value = updatedProduct.ads;
    discountElement.value = updatedProduct.discount;
    totalElement.innerHTML = updatedProduct.total;
    countElement.value = updatedProduct.count;
    categoryElement.value = updatedProduct.category;

    window.scrollTo({ top: 0, behavior: 'smooth' });

    submitElement.textContent = "Update";
    submitElement.setAttribute("data-index", i);

    gettotal();
}

function performTitleSearch(searchTerm) {
    const filteredData = datapro.filter(product => product.title.toLowerCase().includes(searchTerm));
    if (filteredData.length > 0) {
        selectedRowIndex = datapro.indexOf(filteredData[0]);
        showFilteredDataInTable(filteredData);
        populateInputFields(filteredData[0]);
    } else {
        selectedRowIndex = -1;
        showdata();
        cleardata();
    }
}

searchByTitleButton.addEventListener('click', function () {
    const searchTitle = searchInput.value.trim().toLowerCase();
    searchInput.placeholder = "Search by Title"; 
    searchInput.focus();

    if (searchTitle !== '') {
        performTitleSearch(searchTitle);
    } else {
        selectedRowIndex = -1; 
        showdata();
        clearInputFields(); 
    }
    gettotal();
    searchInput.value = '';
});

searchInput.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        const searchTerm = searchInput.value.trim().toLowerCase();
        performTitleSearch(searchTerm);
    }
});

function searchByCategory(category) {
    selectedCategory = category;
    selectedRowIndex = -1; 
    showdata(); 
    cleardata(); 
}
function showFilteredDataInTable(filteredData) {
    let table = '';
    for (let i = 0; i < filteredData.length; i++) {
        table += `
        <tr>
            <td>${i+ 1}</td>
            <td>${filteredData[i].title}</td>
            <td>${filteredData[i].price}</td>
            <td>${filteredData[i].taxes}</td>
            <td>${filteredData[i].ads}</td>
            <td>${filteredData[i].discount}</td>
            <td>${filteredData[i].total}</td>
            <td>${filteredData[i].category}</td>
            <td>
                <button onclick="deletedata(${i})" id="delete">delete</button>
                <button onclick="updatedata(${i})" id="update">update</button>
            </td>
        </tr>
        `;
    }
    tbodyElement.innerHTML = table;
    deleteAllElement.style.display = 'none'; 
}
function performCategorySearch(searchTerm) {
    const filteredData = datapro.filter(product => product.category.toLowerCase().includes(searchTerm));
    if (filteredData.length > 0) {
        selectedRowIndex = datapro.indexOf(filteredData[0]);
        showFilteredDataInTable(filteredData);
        populateInputFields(filteredData[0]);
    } else {
        selectedRowIndex = -1;
        showdata();
        cleardata();
    }
}

searchByCategoryButton.addEventListener('click', function () {
    const searchCategory = searchInput.value.trim().toLowerCase();
    searchInput.placeholder = "Search by Category"; 
    searchInput.focus();

    if (searchCategory !== '') {
        performCategorySearch(searchCategory);
    } else {
        selectedRowIndex = -1; 
        showdata();
        clearInputFields();
    }
    gettotal();
    searchInput.value = '';
});

searchInput.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        const searchTerm = searchInput.value.trim().toLowerCase();
        performCategorySearch(searchTerm);
    }
});

function selectRow(rowIndex) {
    selectedRowIndex = rowIndex;
    showdata(); 
    populateInputFields(datapro[rowIndex]); 
}


function populateInputFields(data) {
    titleElement.value = data.title;
    priceElement.value = data.price;
    taxesElement.value = data.taxes;
    adsElement.value = data.ads; 
    discountElement.value = data.discount;
    totalElement.innerHTML = data.total;
    countElement.value = data.count;
    categoryElement.value = data.category;
}

function performGeneralSearch(searchTerm) {
    searchTerm = searchTerm.toLowerCase();
    const filteredData = datapro.filter(product =>
        product.title.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm) ||
        product.price.toString().includes(searchTerm) ||
        product.taxes.toString().includes(searchTerm) ||
        product.ads.toString().includes(searchTerm) ||
        product.discount.toString().includes(searchTerm) ||
        product.total.toString().includes(searchTerm) ||
        product.count.toString().includes(searchTerm)
    );

    if (filteredData.length > 0) {
        selectedRowIndex = datapro.indexOf(filteredData[0]); 
        showFilteredDataInTable(filteredData); 
        populateInputFields(filteredData[0]); 
    } else {
        selectedRowIndex = -1;
        showdata();
        clearInputFields();
    }
    gettotal();
    searchInput.value = ''; 
}

searchInput.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        event.preventDefault(); 
        const searchTerm = searchInput.value.trim();
        if (searchInput.placeholder === "Search by Category") {
            performCategorySearch(searchTerm.toLowerCase());
        } else if (searchInput.placeholder === "Search by Title") {
            performTitleSearch(searchTerm.toLowerCase());
        } else {
            performGeneralSearch(searchTerm.toLowerCase());
        }
    }
});







































