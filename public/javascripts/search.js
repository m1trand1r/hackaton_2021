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

function renderResult() {
    let container = document
    .getElementById('search-results');

    for (let key in documents) {
        let documentContainer = document.createElement('div');
        documentContainer.classList.add('doc-link');
        documentContainer.setAttribute('data-index', documents[key].index);
        documentContainer.innerHTML = `<div class='document-name'>
            ${key}
        </div>
        <div class='document-count'>
            ${documents[key].documents.length}
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
        documents = documents;
        renderResult();
    })
    .catch(err => {
        console.log(err);
    });
}

function documentsAction(e) {
    let target = e.target;
    console.log(e);
    if (target.classList.contains('add-remove-btn')) {

    } else if (target.classList.contains('doc-link')) {
        console.log(documents);
    }
}

function searchAddListener() {
    document
    .getElementById('search-button')
    .addEventListener('click', search);
}

function documentActionListener() {
    document
    .getElementById('search-results')
    .addEventListener('click', documentsAction);
}

document.addEventListener('DOMContentLoaded', () => {
    searchAddListener();
    documentActionListener();
});