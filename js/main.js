var siteNameInput = document.getElementById("bookmarkName");
var siteURLInput = document.getElementById("bookmarkURL");
var submitButton = document.getElementById("submitBTN");
var bookmarksTableBody = document.getElementById("tableContent");
var deleteButtons;
var visitButtons;
var closeModalButton = document.getElementById("closeBtn");
var errorModal = document.querySelector(".box-info");
var bookmarksList = [];

// if bookmarksList exists in localStorage, get it and display bookmarks
if (localStorage.getItem("bookmarksList")) {
	bookmarksList = JSON.parse(localStorage.getItem("bookmarksList"));
	for (var i = 0; i < bookmarksList.length; i++) {
		displayBookmark(i);
	}
}

// Display Bookmark
function displayBookmark(index) {
	var bookmark = bookmarksList[index];
	var url = bookmark.url;
	var formattedURL = url.startsWith("http") ? url : `https://${url}`;
	var cleanURL = url.replace(/^https?:\/\//, "");

	var bookmarkRow = `
              <tr>
                <td>${index + 1}</td>
                <td>${bookmark.name}</td>              
                <td>
                  <button class="btn btn-visit" data-index="${index}">
                    <i class="fa-solid fa-eye pe-2"></i>Visit
                  </button>
                </td>
                <td>
                  <button class="btn btn-delete" data-index="${index}">
                    <i class="fa-solid fa-trash-can pe-2"></i>Delete
                  </button>
                </td>
              </tr>
            `;
	bookmarksTableBody.innerHTML += bookmarkRow;

	// Update Event Listeners
	updateEventListeners();
}

// clearInputFields Function
function clearInputFields() {
	siteNameInput.value = "";
	siteURLInput.value = "";
}

// capitalizeString Function
function capitalizeString(str) {
	return str.charAt(0).toUpperCase() + str.slice(1);
}

// Add Bookmark
submitButton.addEventListener("click", function () {
	if (
		siteNameInput.classList.contains("is-valid") &&
		siteURLInput.classList.contains("is-valid")
	) {
		var newBookmark = {
			name: capitalizeString(siteNameInput.value),
			url: siteURLInput.value,
		};
		bookmarksList.push(newBookmark);
		localStorage.setItem("bookmarksList", JSON.stringify(bookmarksList));
		displayBookmark(bookmarksList.length - 1);
		clearInputFields();
		siteNameInput.classList.remove("is-valid");
		siteURLInput.classList.remove("is-valid");
	} else {
		errorModal.classList.remove("d-none");
	}
});

// Delete Bookmark
function deleteBookmark(event) {
	var indexToDelete = event.target.dataset.index;
	bookmarksList.splice(indexToDelete, 1);
	localStorage.setItem("bookmarksList", JSON.stringify(bookmarksList));
	refreshTable();
}

// Visit Bookmark
function visitBookmark(event) {
	var indexToVisit = event.target.dataset.index;
	var url = bookmarksList[indexToVisit].url;
	var formattedURL = url.startsWith("http") ? url : `https://${url}`;
	window.open(formattedURL, "_blank");
}

// Refresh Table
function refreshTable() {
	bookmarksTableBody.innerHTML = "";
	for (var i = 0; i < bookmarksList.length; i++) {
		displayBookmark(i);
	}
}

// Regular Expressions
var nameRegex = /^\w{3,}(\s+\w+)*$/;
var urlRegex = /^(https?:\/\/)?(w{3}\.)?\w+\.\w{2,}\/?(:\d{2,5})?(\/\w+)*$/;

siteNameInput.addEventListener("input", function () {
	validateInput(siteNameInput, nameRegex);
});

siteURLInput.addEventListener("input", function () {
	validateInput(siteURLInput, urlRegex);
});

function validateInput(inputElement, regex) {
	if (regex.test(inputElement.value)) {
		inputElement.classList.add("is-valid");
		inputElement.classList.remove("is-invalid");
	} else {
		inputElement.classList.add("is-invalid");
		inputElement.classList.remove("is-valid");
	}
}

// sweetAlert Function
function closeModal() {
	errorModal.classList.add("d-none");
}

// Sweet Alert Event Listeners
closeModalButton.addEventListener("click", closeModal);

document.addEventListener("keydown", function (e) {
	if (e.key === "Escape") {
		closeModal();
	}
});

document.addEventListener("click", function (e) {
	if (e.target.classList.contains("box-info")) {
		closeModal();
	}
});

// Update Event Listeners for Buttons
function updateEventListeners() {
	deleteButtons = document.querySelectorAll(".btn-delete");
	for (var i = 0; i < deleteButtons.length; i++) {
		deleteButtons[i].addEventListener("click", deleteBookmark);
	}

	visitButtons = document.querySelectorAll(".btn-visit");
	for (var j = 0; j < visitButtons.length; j++) {
		visitButtons[j].addEventListener("click", visitBookmark);
	}
}
