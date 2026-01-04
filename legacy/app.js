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
    
}}
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
    //instantiate book
    const book =new Book(title,author,isbn);
    UI.addBookList(book);
    console.log(book);
});