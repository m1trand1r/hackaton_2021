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
    let idx = 1;
    for (let key in documents) {
        let documentContainer = document.createElement('div');
        documentContainer.classList.add('doc-link');
        documentContainer.innerHTML = `<div class='document-idx col-1 d-flex justify-content-start align-content-center'>
            <span class="p-2 fw-bold font_color">${idx}</span>
        </div>
        <div class='col-4 d-flex justify-content-center align-content-center'>
            <span class="p-2 fw-bold font_color document-name" data-index=${documents[key].documents[0].index}>${key}</span>
        </div>
        <div class='document-count col-4 d-flex justify-content-center align-content-center'>
            <span class="p-2 fw-bold font_color">${documents[key].documents.length}</span>
        </div>
        <div class='add-remove-btn mx-auto col-3 d-flex justify-content-end align-content-center' title='Добавить'>
            
        </div>`;
        container.append(documentContainer);
        idx++;
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
    .then(docs => {
        documents = docs;
        renderResult();
    })
    .catch(err => {
        console.log(err);
    });
}

function documentsAction(e) {
    let target = e.target;
    let currentTarget = e.currentTarget;
    if (target != currentTarget) {
        if (target.classList.contains('add-remove-btn')) {

        } else if (target.classList.contains('document-name')) {
            let keys = Object.entries(documents);
            showViewWindow(keys.find(doc => doc[1].documents[0].index == parseInt(target.dataset.index)))
        }
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

function closeViewWindow() {
    document.getElementById('view-window').classList.add('d-none');
}

function showViewWindow(data) {
    let name = data[0];
    let documents = data[1].documents.slice(-3).sort((doc1, doc2) => doc1.index > doc2.index ? 1 : -1);
    let window = document.getElementById('view-window');
    console.log(window, name, documents);
}

function viewWindowAction(e) {
    if (e.target.id == 'doc-menu') {
        closeViewWindow();
    }
}

function viewWindowActionListener() {
    document
    .getElementById('view-window')
    .addEventListener('click', viewWindowAction);
}

document.addEventListener('DOMContentLoaded', () => {
    searchAddListener();
    documentActionListener();
    viewWindowActionListener();
});