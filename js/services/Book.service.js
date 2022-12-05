'user strict'

const STORAGE_KEY = 'booksDB'
var gBooks
var gPageIdx = 0
const PAGE_SIZE = 8
var gLastPage
var gHighestPrice = 0
var gLowestPrice = 0
var gFilterBy = { maxPrice: 1000, minRate: 0 }


function getPage() {
    return gPageIdx
}
function getLastPage() {
    if (!gLastPage) gLastPage = (Math.ceil(gBooks.length / PAGE_SIZE) - 1)
    return gLastPage
}


function getBooks() {
    var books = gBooks.filter(book => book.price <= gFilterBy.maxPrice &&
        book.rate >= gFilterBy.minRate)
// console.log('books', books)
    var startIdx = gPageIdx * PAGE_SIZE
    gLastPage = (Math.ceil(books.length / PAGE_SIZE) - 1)
    return books.slice(startIdx, startIdx + PAGE_SIZE)
}

function createBooks() {
    _createBooks()
}

function _createBook(titel, price, img) {
    if (!price) price = getRandomIntInclusive(5, 240)

    return {
        id: makeId(),
        title: titel,
        price: price,
        img: img,
        rate: 0,
        details: makeLorem()
    }
}

function _createBooks() {
    var books = loadFromStorage(STORAGE_KEY)
    // console.log('books', books)
    imgCounter = 0

    if (!books || !books.length) {
        books = []
        for (var i = 0; i < 17; i++) {
            var titel = `mockup${i}`
            imgCounter++
            if (imgCounter > 6) imgCounter = 1
            var img = imgCounter
            books.push(_createBook(titel, '', img))
        }
    }
    gBooks = books
    // console.log('gbooks', gBooks)
    _getHighestLowestPrices()
    _saveBooksToStorage()
}

function _saveBooksToStorage() {
    saveToStorage(STORAGE_KEY, gBooks)
}


function deleteBook(bookId) {
    // console.log('bookId', bookId)
    // console.log('gBooks', gBooks)
    const bookIdx = gBooks.findIndex(book => bookId === book.id)
    gBooks.splice(bookIdx, 1)
    _getHighestLowestPrices()
    _saveBooksToStorage()
}

function addBook(title, price, img) {
    const book = _createBook(title, price, img)
    gBooks.unshift(book)
    _getHighestLowestPrices()
    _saveBooksToStorage()
}


function updateBook(bookId, newBookPrice) {
    const book = gBooks.find(book => bookId === book.id)
    book.price = newBookPrice
    _getHighestLowestPrices()
    _saveBooksToStorage()
}


function updateRate(bookId, direction) {
    const book = gBooks.find(book => bookId === book.id)

    if (direction === 'plus') book.rate++
    else book.rate--
    _saveBooksToStorage()
}


function getBookById(bookId) {
    const book = gBooks.find(book => bookId === book.id)
    return book
}

function setBookSort(sortBy) {
    gPageIdx = 0
    console.log('sortBy', sortBy)
    if (sortBy === 'title') {
        gBooks.sort((book1, book2) => book1.title.localeCompare(book2.title))
        // } else if (sortParam === 'rate') { //if rate to b added to table
        //     gBooks.sort((book1, book2) => book2.rate - book1.rate)
    } else if (sortBy === 'price') {
        gBooks.sort((book1, book2) => book2.price - book1.price)
    }
}

function setBookFilter(filterBy = {}) {
    gPageIdx = 0
    // console.log('filterBy', filterBy)
    if (filterBy.maxPrice !== undefined) gFilterBy.maxPrice = filterBy.maxPrice
    if (filterBy.minRate !== undefined) gFilterBy.minRate = filterBy.minRate
    return gFilterBy
}


function nextPage(direction) {
    var maxPages = getLastPage()
    if (direction) {
        gPageIdx++
        if (gPageIdx === maxPages + 1) {
            gPageIdx = 0
        }
    } else {
        gPageIdx--
        if (gPageIdx < 0) {
            gPageIdx = maxPages
        }
    }
}


function _getHighestLowestPrices() {
    var maxPrice = 0
    var lowestPrice = Infinity
    var prices = gBooks.map(book => {
        if (book.price > maxPrice) maxPrice = book.price
        if (book.price < lowestPrice) lowestPrice = book.price
        return [maxPrice, lowestPrice]
    })
    // console.log('prices', prices)
    gHighestPrice = prices[(prices.length-1)][0]
    gLowestPrice = prices[(prices.length-1)][1]
    // console.log('gHighestPrice', gHighestPrice)
    // console.log('gLowestPrice', gLowestPrice)
}