let currentPage = 0;
let queryTerm = '';
let loader = document.getElementById("load");
loader.style.display = "none";

document.getElementById("theme-toggle").addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    const themeToggleBtn = document.getElementById("theme-toggle");
    themeToggleBtn.innerText = document.body.classList.contains("dark-mode") ? "Light Mode" : "Dark Mode";
});

function queryBooks() {
    queryTerm = document.getElementById("query").value.trim();
    if (!queryTerm) {
        alert("Please enter a search term!");
        return;
    }
    currentPage = 0;
    fetchBooks();
}

function fetchBooks() {
    loader.style.display = "block";
    const URL = `https://www.googleapis.com/books/v1/volumes?q=${queryTerm}&startIndex=${currentPage * 10}&maxResults=10`;
    fetch(URL)
        .then(response => response.json())
        .then(data => {
            loader.style.display = "none";
            if (!data.items || data.items.length === 0) {
                document.getElementById("res").innerHTML = "<p>No results found.</p>";
                return;
            }
            displayBooks(data.items);
            document.getElementById("pagination").classList.remove("d-none");
        })
        .catch(() => {
            loader.style.display = "none";
            alert("Something went wrong! Please try again.");
        });
}

function displayBooks(items) {
    const results = document.getElementById("res");
    if (currentPage === 0) results.innerHTML = ""; // Clear results on a new search
    items.forEach(book => {
        const { title, authors, publisher, imageLinks, infoLink } = book.volumeInfo;
        const thumbnail = imageLinks?.thumbnail || "https://via.placeholder.com/100";
        const card = `
            <div class="card">
                <img src="${thumbnail}" alt="${title}">
                <div>
                    <h5 class="card-title">${title || "No title available"}</h5>
                    <p class="card-text">
                        Author: ${authors?.join(", ") || "Unknown"}<br>
                        Publisher: ${publisher || "Unknown"}
                    </p>
                    <a href="${infoLink}" target="_blank" class="btn btn-primary">More Info</a>
                </div>
            </div>`;
        results.insertAdjacentHTML("beforeend", card);
    });
}

function loadMoreResults() {
    currentPage++;
    fetchBooks();
}
