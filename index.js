let allBooks = []
let list = document.querySelector("#list")
let showPanel = document.querySelector("#show-panel")

document.addEventListener("DOMContentLoaded", function() {
  getBooks()

  document.addEventListener("click", function(e) {
    console.log(e.target)
    if (e.target.className === "book") {
      showBook(e.target.dataset)
      // let book = allBooks.find(b => b.id == e.target.dataset.id)
      // // let users = document.querySelector("#users")
      // showPanel.innerHTML = `
      // <h1 data-id=${book.id}> ${book.title} </h1>
      // <img src=${book.img_url}></img>
      // <p> ${book.description}</p>
      // `
      // for(var user in book.users) {
      //   showPanel.innerHTML += `
      //   <div id="users">
      //   <strong> ${book.users[user].username} <strong>
      //   </div>
      //   <br>
      //   `
      //  }
      // showPanel.innerHTML += `
      // <br>
      // <button id="readButton"> Read Book </button>
      // `
    }
    if (e.target.id === "readButton") {
      readBook(e.target.parentElement)
    }
  })

});

function showBook(target) {
  let book = allBooks.find(b => b.id == target.id)
  // let users = document.querySelector("#users")
  showPanel.innerHTML = `
  <h1 data-id=${book.id}> ${book.title} </h1>
  <img src=${book.img_url}></img>
  <p> ${book.description}</p>
  `
  for(var user in book.users) {
    showPanel.innerHTML += `
    <div id="users">
    <strong> ${book.users[user].username} <strong>
    </div>
    <br>
    `
   }
  showPanel.innerHTML += `
  <br>
  <button id="readButton"> Read Book </button>
  `
}

function readBook(like) {
  let id = like.children[0].dataset.id
  // let users = like.querySelector("#users")
  let me = {"id":1, "username":"pouros"}
  let things = allBooks.find(b => b.id == id)
  // if (things.users.length > 0) {
  //   let users = things.users
  // } else {
  //   let users = things.users
  // }
  let users = things.users
// debugger
  if (users != 1) {
    // debugger
    if (users.filter(u => (u.username == "pouros")).length > 0) {
      alert("You already read this!")
    } else {
      users[users.length] = me
    }
  } else {
    users[0] = {"id":1, "username":"pouros"}
  }
  fetch(`http://localhost:3000/books/${id}`, {
    method: "PATCH",
    mode: "cors",
    cache: "no-cache",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
    body: JSON.stringify({users: users})
  })
  .then(r => r.json())
  .then(function(book) {
    let thing = allBooks.find(b => b.id == book.id)
    showBook(thing)
  })

}

function getBooks() {
  fetch(`http://localhost:3000/books`)
  .then(r => r.json())
  .then(function(parsed) {
    allBooks = parsed
    renderBooks(parsed)
  })
}

function renderBooks(books) {
  books.forEach(function(book) {
    renderBook(book)
  })
}

function renderBook(book) {
  list.innerHTML += `
  <li class ="book" data-id="${book.id}"> ${book.title} </li>
  `
}
