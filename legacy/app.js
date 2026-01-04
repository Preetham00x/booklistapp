//book class representing a book
class Book {
    constructor(title,author,isbn){
        this .title=title;
        this.author=author;
        this.isbn=isbn;
    }}
//ui class to handle ui tasks
class UI{
    static displayBooks(){
        const Storedbook=[{
            title:'Book One',  
            author:'John Doe',
            isbn:'343434',
        },
        {
            title:'Book Two',   
            author:'Jane Doe',
            isbn:'454545',}
        ];
    const books=Storedbook;
    books.forEach((book) => UI.addBookList(book));
}
static addBookList(book){
    const list=document.querySelector('#book-list');
    const row = document.createElement('tr');
    row.innerHTML=`
    <td>${book.title}</td>
    <td>${book.author}</td>
    <td>${book.isbn}</td>
    <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>
    `;
    list.appendChild(row);
}
static deletbook(el){
    if(el.contains('delete')){
        el.parentElement.parentElement.remove();};
    }
static showAlert(message,className){
    const div=document.createElement('div');
    div.className=`alert alert-${className}`;
    div.appendChild(document.createTextNode(message));
    const container=document.querySelector('.container');
    const form=document.querySelector('#book-form');
    container.insertBefore(div,form);
    //vanish in 3 seconds
    setTimeout(()=>document.querySelector('.alert').remove(),3000);
}


static clearFields(){
        document.querySelector('#title').value='';
        document.querySelector('#author').value='';
        document.querySelector('#isbn').value='';
    };
};
class Store{
    static getbooks(){
        let books;
        if(localStorage.getItem('books')===null){
            books=[];
        }
        else{
            books=JSON.parse(localStorage.getItem('books'));
        }
        return books;
    }
    static addbook(book){
        const books=Store.getbooks();
        books.push(book);
        localStorage.setItem('books',JSON.stringify(books));
    }
    static removebook(isbn){
        const books=Store.getbooks();
        books.forEach((book,index)=>{
            if(book.isbn===isbn){
                books.splice(index,1);
            }
        });
        localStorage.setItem('books',JSON.stringify(books));
    }
}

//event display book
document.addEventListener('DOMContentLoaded',UI.displayBooks);
//event add a book
document.querySelector('#book-form').addEventListener('submit', (e)=>{
    //prevent actual submit
    e.preventDefault();
    //get form value
    const title=document.querySelector('#title').value;
    const author=document.querySelector('#author').value;
    const isbn=document.querySelector('#isbn').value;
    if(title=== '' || author==='' || isbn===''){
        UI.showAlert("FIll in all FIELDS","danger");
    }else{
    //instantiate book
    const book =new Book(title,author,isbn);
    UI.addBookList(book);   
    UI.showAlert("Book Added","success");
    UI.clearFields();}
});;
//delete book event
document.querySelector('#book-list').addEventListener('click',(e) =>{
    UI.deletbook(e.target)
    UI.showAlert("Book Removed","success");});