const dialog= document.getElementById('dialog')
const addBookBtn= document.getElementById('add_book_btn');
const closeBtn=document.querySelector(".close_btn")
const form= document.querySelector(".book_form")
const errorParent= document.querySelector(".error_element")
const errorPara=errorParent.querySelector(".error")
const bookLibrary=document.querySelector(".books_library")

// Book Library Array
let BookLibrary = [];

// Generate Unique Id :
const uid = function(){
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

//Change Read Status

function changeReadState(id){
    const LocalBookStore = JSON.parse(localStorage.getItem("Book_Library"));
    LocalBookStore.map((book)=> {
        if(book.id == id){
            book.read=!book.read
            console.log(book.read);
            return
        } else return
    })
    localStorage.setItem("Book_Library", JSON.stringify(LocalBookStore));
    showBookLIbrary()
}

// Remove Book from Local Storage
function removeBook(id){
    const LocalBookStore = JSON.parse(localStorage.getItem("Book_Library"));
    const newBookStore=LocalBookStore.filter(item => item.id!=id);
    console.log('New Book Library', newBookStore)
    localStorage.setItem("Book_Library", JSON.stringify(newBookStore))
    showBookLIbrary()
}


// Creating Book Card Elements
function addBookCard(id, title, author, pages, read){
    let div= document.createElement('div');
    let h1=document.createElement('h1');
    let h3=document.createElement('h3');
    let h4= document.createElement('h4');
    let button1=document.createElement('button');
    let button2=document.createElement('button');
    div.className='book_card';
    button1.className='card_btn read_btn';
    button2.className='card_btn remove_btn';
    h1.innerText=title;
    h3.innerText=author;
    h4.innerText=pages;
    button1.innerText=`${read ? 'Read' : 'Not Read'}`;
    button2.innerText='Remove'
    button1.addEventListener("click", ()=> changeReadState(id))
    button2.addEventListener("click", ()=> removeBook(id));

     // Append the elements to the div
     div.appendChild(h1);
     div.appendChild(h3);
     div.appendChild(h4);
     div.appendChild(button1);
     div.appendChild(button2);

    bookLibrary.appendChild(div)

}



window.addEventListener('load' , showBookLIbrary)



// Book Constructor 
function Book(title, author, pages, read){
    this.id=uid(),
    this.title = title,
    this.author= author,
    this.pages= pages,
    this.read = read
}
// Add Book to Library
function addBookToLibrary(title,author, pages, read){
    const newBook= new Book(title, author, pages, read)
    if( newBook.read === 'on'){
        newBook.read = true
    } else{
        newBook.read= false
    }
    BookLibrary.push(newBook)
    localStorage.setItem("Book_Library", JSON.stringify(BookLibrary))
    console.log(BookLibrary);
}

// Show the Dialog Modal
addBookBtn.addEventListener("click", ()=>{
    dialog.showModal()
})
// Close the Dialog Modal
closeBtn.addEventListener("click", ()=>{
    dialog.close()
})

// Close the Dialog if the User Clicks outside the Box
dialog.addEventListener("click", e => {
    const dialogDimension= dialog.getBoundingClientRect();

    if(e.clientX < dialogDimension.left-1 ||  e.clientX > dialogDimension.right+1 || e.clientY < dialogDimension.top-1 || e.clientY > dialogDimension.bottom+1){
        dialog.close()
    }
})
// Get Form Data and Form Action on Succesful data get

form.addEventListener("submit", (e)=>{
    e.preventDefault()
    const formData= new FormData(e.currentTarget);
    const title = formData.get('book_title')
    const author= formData.get('book_author')
    const pages = formData.get('book_pages')
    const read =  formData.get('read_status')
    // const entries = [...formData.entries()]
    console.log('Title : ',title);
    console.log('Author : ',author);
    console.log('Pages : ', pages);
    console.log('Read : ', read);

    const isErrorExist= formEntryCheck(title, author, pages)

    if(!isErrorExist){
        addBookToLibrary(title, author, pages, read)
    }
    showBookLIbrary()
    

})


// Write Error if there is any Error in Form Data


function formEntryCheck(title, author, pages){

    const regexString = /^[a-zA-Z,. ]+$/;
    const regexNum = /^[1-9]\d*$/;

    errorParent.classList.remove('show')
        errorParent.classList.add('hidden')
    if([title, author, pages].some((entry) => entry=='')){
        errorParent.classList.remove('hidden')
        errorParent.classList.add('show')
        errorPara.innerHTML= "Please Enter all the Fields"
        return true
    }
    else if(!regexNum.test(pages)){
        errorParent.classList.remove('hidden')
        errorParent.classList.add('show')
        errorPara.innerHTML= "Enter Valid Pages"
        return true
    }
    else if(!regexString.test(title) || !regexString.test(author)){
        errorParent.classList.remove('hidden')
        errorParent.classList.add('show')
        errorPara.innerHTML= "Enter Valid Input for title and Author"
        return true
    }
    
    return false

}

// Form Action on Succesful Data retrieval

function showBookLIbrary(){
    removeAllChildNode(bookLibrary)
    const LocalBookStore = JSON.parse(localStorage.getItem("Book_Library"));
    console.log('Local Storage Library', LocalBookStore);
    LocalBookStore.map((book) => {
        console.log("Book : ",book.read)
        return addBookCard(book.id, book.title, book.author, book.pages, book.read)}
    )

}

// Removing all Child node before adding the data from local storage:

function removeAllChildNode(parent){
    while(parent.firstChild){
        parent.removeChild(parent.firstChild);
    }
}

