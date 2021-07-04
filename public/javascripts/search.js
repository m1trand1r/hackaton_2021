function postFetchWrapper(url, body) {
    return new Promise((resolve, reject) => {
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(body)
        })
        .then(response => response.json())
        .then(result => {
            resolve(result);
        })
        .catch(err => {
            reject(err);
        });
    });
}

function renderResult(documents) {
    let container = document
    .getElementById('search-results');
    for (let key in documents) {
        let documentContainer = document.createElement('a');
        documentContainer.classList.add('doc-link');
        console.log(documents[key]);
        documentContainer.href=`/document?id=${documents[key].length}`;
        documentContainer.innerHTML = `<div class='document-name'>
            ${key}
        </div>
        <div class='document-count'>
            ${documents[key].length}
        </div>
        <div class='add-remove-btn' title='Добавить'>
            
        </div>`;
        container.append(documentContainer);
    }
}

function clearDocumentsContainer() {
    document
    .getElementById('search-results').innerHTML = '';
}

async function search() {
    let searchInput =  document
    .getElementById('search-input');
    let filterSelect = document
    .getElementById('category');

    clearDocumentsContainer();

    let text = searchInput.value.replace(/\s+/g, ' ').trim(); // Очистка текста для поиска от лиших пробелов
    searchInput.value = text;

    let filter = filterSelect.value;

    postFetchWrapper('search', {
        text: text,
        filter: filter
    })
    .then(documents => {
        renderResult(documents);
    })
    .catch(err => {
        console.log(err);
    });
}

function searchAddListener() {
    document
    .getElementById('search-button')
    .addEventListener('click', search);
}

document.addEventListener('DOMContentLoaded', () => {
    searchAddListener();
});