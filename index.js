document.addEventListener("DOMContentLoaded", function() {

  /**********************************************
              CONSTANTS & VARIABLES
  **********************************************/
  const booksUrl = "http://localhost:3000/books"
  const usersUrl = "http://localhost:3000/users"
  const listPanel = document.querySelector("#list-panel")
  const listUl = document.querySelector("#list")
  const showPanel = document.querySelector("#show-panel")
  const headers = {
    "Content-Type": "application/json",
    "Accept": "application/json"
  }
  let books = []
  let users = []
  let currentUser = ""
  let currentlyLikedBooks = []


  /**********************************************
                  FETCH REQUESTS
  **********************************************/
  function getBooks() {
    fetch(booksUrl)
    .then(res => res.json())
    .then(json => {
      books = json
      renderAllBooks(books)
    })
  }

  function getUsers() {
    fetch(usersUrl)
    .then(res => res.json())
    .then(json => {
      users = json
      currentUser = users[0]
      // renderAllBooks(books)
    })
  }

  function editBook(book) {
    fetch(`${booksUrl}/${book.id}`, {
      method: "PATCH",
      headers: headers,
      body: JSON.stringify(book)
    })
    .then(res => res.json())
    .then( json => {
      showPanel.innerHTML = ""
      showBook(book)
    })
  }

  /**********************************************
                  EVENT LISTENERS
  **********************************************/
  listPanel.addEventListener("click", event => {
    if (event.target.dataset.action === "show") {
      let book = findBook(event.target.dataset.id)
      showBook(book)
    }
  })

  showPanel.addEventListener("click", event => {
    if (event.target.dataset.action === "like") {
      let book = findBook(event.target.dataset.id)
      likeOrUnlikeBook(book)
    }
  })

  /**********************************************
                  HELPER FUNCTIONS
  **********************************************/
  function findBook(id) {
    return books.find( book => book.id == id)
  }

  function renderAllBooks(books) {
    books.forEach( book => {
      renderSingleBook(book)
    })
  }

  function renderSingleBook(book) {
    listPanel.innerHTML += `
    <li data-id="${book.id}" data-action="show">${book.title}</li>`
  }

  function showBook(book) {
    let likes = Object.keys(book.users).length
    let likedUsers = []
    book.users.forEach( user => {
      likedUsers.push(user.username)
    })

    if(likedUsers.includes(currentUser.username)) {
      button = "Unlike this book"
    } else {
      button = "Like this book"
    }

    showPanel.innerHTML = `
    <div>
      <h1>${book.title}</h1>
      <img src="${book.img_url}">
      <p id="like-${book.id}">${likes} likes</p>
      <p>By Users: ${likedUsers}</p>
      <button data-action="like" data-id="${book.id}">${button}</button>
      <h4>${book.description}</h4>
    </div>`
  }

  function likeOrUnlikeBook(book) {
    let likedUsers = []
    book.users.forEach( user => {
      likedUsers.push(user.username)
    })
    if (likedUsers.includes(currentUser.username)) {
      let newUsers = book.users.filter( user => {
        return user.id != currentUser.id
      })
      book.users = newUsers
      // console.log(book);
      editBook(book)
    } else {
      book.users.push(currentUser)
      currentlyLikedBooks.push(book.title)
      editBook(book)
    }
  }

  /**********************************************
                INVOKING FUNCTIONS
  **********************************************/
  getBooks()
  getUsers()
});
