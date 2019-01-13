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
            onSuccess(xhr.responseText);
        } else if (this.readyState == 4 && this.status != 200) {
            onError();
        }
    };
}

function addDOMItems(items) {
    for (var i = 0; i < items.length; i++) {
        var item = document.createElement("div");
        console.log(items[i]);
        //...
        // item.appendChild(name);
        // item.appendChild(description);
        // item.appendChild(price);
    }
}