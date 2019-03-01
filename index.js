document.addEventListener("DOMContentLoaded", function() {
  const bookList = document.querySelector('#list')
  const bookUrl = 'http://localhost:3000/books'
  const userUrl = 'http://localhost:3000/users'
  const showPanel = document.querySelector('#show-panel')
  let self = {"id":1, "username":"pouros"}
  let allBooks = []
  let allUsers = []

  // gets all books
  fetch(bookUrl)
    .then(res=>res.json())
    .then(function(books) {
      allBooks = books
      bookList.innerHTML = ""
      allBooks.forEach(renderBooks)
    })

  bookList.addEventListener("click", function(e){
    let id = parseInt(e.target.dataset.id)
    let book = allBooks.find(book => book.id === id)
    if (e.target.tagName === "LI") {
      showBookInfo(book)
      let userList = showPanel.querySelector('#user-list')
      showUsers(book)
    }
  })

//add a like/reader to a book
  showPanel.addEventListener("click", function(e){
    let id = parseInt(e.target.dataset.id)
    let book = allBooks.find(book => book.id === id)
    let bookUsers = book.users
    let reader = bookUsers.filter(user => user.id === self.id)
    debugger
    if (reader.length === 0) {
      bookUsers.push(self)
      let data = {users: bookUsers}
      if (e.target.id === "read-book") {
        fetch(`${bookUrl}/${id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          body: JSON.stringify(data)
        })//end of fetch
        .then(res=>res.json())
        .then(function(newUsers){
          showUsers(newUsers)
        })
      }
    } else if (reader.length > 0){
      alert("You read this already!")
    }
  })











  function showBookInfo(book) {
    showPanel.innerHTML = `
    <h3>${book.title}</h3>
    <img src="${book.img_url}">
    <p>${book.description}</p>
    <ul id="user-list"></ul>
    <button data-id="${book.id}" type="button" id="read-book">Read Book</button>
    `
  }
  function showUsers(book) {
    let userList = showPanel.querySelector('#user-list')
    userList.innerHTML = ""
    book.users.forEach(user => {
      userList.innerHTML += `
      <h5>${user.username}</h5>
      `
    })
  }
  function renderBooks(book){
      bookList.innerHTML += `
      <li data-id="${book.id}">${book.title}</li>
      `
    }
});
