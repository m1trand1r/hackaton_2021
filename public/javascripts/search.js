let data = null;
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
        console.log(documents);
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
            data = keys.find(doc => doc[1].documents[0].index == parseInt(target.dataset.index));
            showViewWindow(data[0], data[1].documents.slice(-3).sort((doc1, doc2) => doc1.index > doc2.index ? 1 : -1));
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

function showViewWindow(name, documents) {
    let window = document.getElementById('view-window');
    document.querySelector('#image-main').setAttribute('src', `/search/image?path=${documents[0].path}`);
    document.querySelector('#doc-name-header').innerText = name;
    document.querySelector('#img-name').innerText = documents[0].imageName;
    let carouselImgs = window.querySelectorAll('.carousel-img');
    for (let i = 0; i < carouselImgs.length; i++) {
        carouselImgs[i].setAttribute('src', `/search/image?path=${documents[i].path}`);
        carouselImgs[i].setAttribute('dataset-name', documents[i].imageName);
    }
    window.classList.remove('d-none');

    let loadMore = document.querySelector('#bot-carousel-btn');
    loadMore.setAttribute('dataset-from', parseInt(loadMore.getAttribute('dataset-from') - 3));
}

function setNewMainImage(newSrc, newName) {
    document.querySelector('#image-main').setAttribute('src', newSrc);
    document.querySelector('#img-name').innerText = newName;
}

function viewWindowAction(e) {
    if (e.target.id == 'doc-menu') {
        closeViewWindow();
    } else if (e.target.classList.contains('carousel-img')) {
        setNewMainImage(e.target.src, e.target.getAttribute('dataset-name'));
    } else if (e.target.classList.contains('load-more')) {
        if (e.target.id = 'bot-carousel-btn') {
            let index = parseInt(e.target.getAttribute('dataset-from'));
            showViewWindow(data[0], data[1].documents.slice(index).sort((doc1, doc2) => doc1.index > doc2.index ? -1 : 1));
        }
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