'user strict'

function onInit() {
    createBooks()
    renderBooks()
    renderPageNumber()
    renderPriceFilter()
}


function renderBooks() {
    var books = getBooks()
    var strHtmls = books.map(book => `<tr>
        <td>${book.id}</td>
        <td>${book.title}</td>
        <td>₪${book.price}</td>
        <td><img onerror="this.src='img/dflt-book.png'" src="img/${book.img}.png" alt="Book name ${book.title}"></td>     
        <td><button class="readBtn" onclick="onBookDetails('${book.id}')">Read</button></td>
        <td><button class="updtBtn" onclick="onUpdateBook('${book.id}')">Update</button></td>
        <td><button class="delBtn" onclick="onRemoveBook('${book.id}')">Delete</button></td>
        </tr>`
    )
    document.querySelector('tbody').innerHTML = strHtmls.join('')

}


function onRemoveBook(bookId) {
    deleteBook(bookId)
    renderBooks()
}

function onAddBook() {
    var bookName = prompt('please enter title')
    var bookPrice = +prompt('plase enter price')
    var bookImg = prompt('please enter img png file (optional)')

    if (bookName) {
        addBook(bookName, bookPrice, bookImg)
        renderBooks()
    }
}

function onUpdateBook(bookId) {
    var newBookPrice = +prompt('plase enter new price')
    if (newBookPrice) {
        updateBook(bookId, newBookPrice)
        renderBooks()
    }
}


function onBookDetails(bookId) {
    var book = getBookById(bookId)
    const img = `<img onerror="this.src='img/dflt-book.png'" src="img/${book.img}.png" alt="Book name ${book.title}" width="200px">`
    const rates = `<button class="rate-minus" onclick="onRateChange('${bookId}', 'minus')">-</button><span class="current-rate">${book.rate}</span><button class="rate-plus" onclick="onRateChange('${bookId}', 'plus')">+</button>`
    var elModal = document.querySelector('.modal')
    elModal.querySelector('h3').innerText = book.title
    elModal.querySelector('h4 span').innerText = book.rate
    elModal.querySelector('.rate-buttons').innerHTML = rates
    elModal.querySelector('.book-img').innerHTML = img
    elModal.querySelector('p').innerText = book.details
    elModal.classList.add('show')
}


function onCloseModal() {
    document.querySelector('.modal').classList.remove('show')
}

function onRateChange(bookId, direction) {
    var book = getBookById(bookId)
    if (direction === 'minus' && !book.rate) return
    if (direction === 'plus' && book.rate >= 10) return

    updateRate(bookId, direction)

    var elRate = document.querySelector('.modal .rate-buttons')
    elRate.querySelector('.current-rate').innerText = book.rate
}


function onSortBy(sortBy) {
    setBookSort(sortBy)
    renderBooks()

    const queryStringParams = `?sort=${sortBy}`
    const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname + queryStringParams
    window.history.pushState({ path: newUrl }, '', newUrl)
}

// function renderBooksSortedByQueryStringParams() {
//     const queryStringParams = new URLSearchParams(window.location.search)
//     const sortBy = queryStringParams.get('sort')
//     if (!sortBy) return
//     setBookSorted(sortBy)
// }

function onSetFilterBy(filterBy) {
    filterBy = setBookFilter(filterBy)
    // console.log('filterBy', filterBy)
    renderBooks()
    renderPageNumber()
    const queryStringParams = `?vendor=${filterBy.maxPrice}&minSpeed=${filterBy.minRate}`
    const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname + queryStringParams
    window.history.pushState({ path: newUrl }, '', newUrl)

}


function onPageChange(isRight) {
    nextPage(isRight)
    renderPageNumber()
    var page = getPage()
    var lastPage = getLastPage()
    var elRight = document.querySelector('.page-right')
    var elLeft = document.querySelector('.page-left')

    switch (page) {
        case 0:
            elRight.innerText = 'Go to next page'
            elLeft.innerText = 'Go to last page'
      break      
        case lastPage:
            elRight.innerText = 'Go to first page'
            elLeft.innerText = 'Go to previous page'
      break      
         default:
            elRight.innerText = 'Go to next page'
            elLeft.innerText = 'Go to previous page'       
    }
    renderBooks()
}


function renderPageNumber() {
    var elPgNum = document.querySelector('.page-number')
    var page = getPage() + 1
    elPgNum.innerText = page

}


function renderPriceFilter(){
    var elFilter = document.querySelector('.filter-price-range')
    elFilter.value = gHighestPrice
    elFilter.max = gHighestPrice
    elFilter.min = gLowestPrice
 }