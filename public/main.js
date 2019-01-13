document.addEventListener('DOMContentLoaded', function() {
    // Load shop items and add event listeners
    loadItems(function(responseText) {
        // Add DOM elements
        addDOMItems(JSON.parse(responseText).data.items);

        // Display items when they are loaded
        var containerItems = document.querySelector(".container__items");
        containerItems.style.display = 'block';
    }, function() {
        // Alert on error
        alert("Couldn't load shop items");
    });

    document.querySelector(".change-currency").addEventListener("click", function(){
        var select = document.querySelector(".currencies").getElementsByTagName("select")[0];
        var currency = select.options[select.selectedIndex].value;
        updateCurrencies(currency);
    });
});

function loadItems(onSuccess, onError) {
    var xhr = new XMLHttpRequest();

    xhr.open('POST', 'http://localhost:3000/graphql', true);
    xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');

    xhr.send(JSON.stringify({
        "operationName": null,
        "query": `{
            items {
                id
                name
                description
                price
                currency
            }
        }`,
        "variables": {}
    }));

    xhr.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            console.log(xhr.responseText);
            onSuccess(xhr.responseText);
        } else if (this.readyState == 4 && this.status != 200) {
            onError();
        }
    };
}

function updateCurrencies(currency) {
    var xhr = new XMLHttpRequest();

    xhr.open('POST', 'http://localhost:3000/graphql', true);
    xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    xhr.send(JSON.stringify({
        "operationName": null,
        "query": `{
            items(currency: "`+currency+`") {
                id
                price
                currency
            }
        }`,
        "variables": {}
    }));

    xhr.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            changeCurrencies(xhr.responseText);
        } else if (this.readyState == 4 && this.status != 200) {
            alert("Sorry, currency changing is not available");
        }
    };
}

function changeCurrencies(response) {
    var items = JSON.parse(response).data.items;
    var itemElements = document.getElementsByClassName("item");
    for (var i = 0; i < itemElements.length; i++) {
        var id = itemElements[i].getAttribute("data-id");
        var item = items.find(function(el) {return el.id == id});

        if (item === undefined) {
            // There's no element in database anymore
            itemElements[i].style.display = "none";
            continue;
        }
        
        var priceElement = itemElements[i].querySelector(".item__price");
        priceElement.innerHTML = item.price.toFixed(2) + " " + item.currency;
    }
}

function addDOMItems(items) {
    var containerItems = document.querySelector(".container__items");
    for (var i = 0; i < items.length; i++) {
        var item = document.createElement("div");
        item.className = "item";
        item.setAttribute("data-id", items[i].id);

        var name = document.createElement("span");
        name.innerHTML = items[i].name;
        name.className = "item__name";
        
        var description = document.createElement("span");
        description.innerHTML = items[i].description;
        description.className = "item__description";
        
        var price = document.createElement("span");
        price.innerHTML = items[i].price.toFixed(2) + ' ' + items[i].currency.toLowerCase();
        price.className = "item__price";
        
        item.appendChild(name);
        item.appendChild(description);
        item.appendChild(price);
        
        containerItems.appendChild(item);
    }
}