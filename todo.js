let box = document.getElementById("box");
let add = document.getElementById("add");
let edit = document.getElementById("edit");
let modify = document.getElementById("modify");

// HTML to PDF functionality
let getPdf = () => {
    html2pdf().from(document.body).save();
}

// Function to load tasks from localStorage and display them
const load = () => {
    try {
        if (typeof Storage !== "undefined") {
            box.innerHTML = "";  // Clear the task list
            let list = localStorage.getItem("list");

            if (list !== null) {
                list = JSON.parse(list);  // Parse the list from localStorage

                if (list.data && list.data.length > 0) {
                    list.data.forEach((val) => {
                        box.insertAdjacentHTML("beforeend", `
                            <tr>
                                <td>${val}</td>
                                <td><button class='btn btn-success' onclick="editform('${val}')">edit</button></td>
                                <td><button class='btn btn-danger' onclick="deletedata('${val}')">delete</button></td>
                            </tr>`);
                    });

                    // Add the download PDF button at the end of the list
                    box.insertAdjacentHTML("beforeend", `
                        <tr><td colspan="3">
                            <button onclick="getPdf()" type="button" class="btn btn-dark">Download PDF</button>
                        </td></tr>`);
                } else {
                    // If no tasks are found
                    box.innerHTML = "<tr><td colspan='3'>No records found</td></tr>";
                }
                modify.innerHTML = "Last Modify: " + list.modify;
            } else {
                // If localStorage is empty
                box.innerHTML = "<tr><td colspan='3'>No records found</td></tr>";
            }
        } else {
            alert("Your browser does not support localStorage");
        }
    } catch (err) {
        alert("Error: " + err);
    }
}

// Function to handle editing of a task
const editform = (val) => {
    edit.classList.remove("d-none");  // Show the edit form
    edit.term.value = val;  // Set the value to be edited
    edit.setAttribute("data-name", val);  // Store the original task name
}

// Function to delete a task from localStorage
const deletedata = (val) => {
    let list = localStorage.getItem("list");
    if (list !== null) {
        list = JSON.parse(list);  // Parse the list from localStorage
        list.data = list.data.filter(item => item !== val);  // Remove the task
        localStorage.setItem("list", JSON.stringify({ data: list.data, modify: new Date().toLocaleString() }));
        load();  // Reload the task list
    }
}

// Function to handle form submission for both adding and editing tasks
let submited = (e) => {
    e.preventDefault();
    let { name, term } = e.target;
    term = term.value.trim();

    if (typeof Storage !== "undefined") {
        let list = localStorage.getItem("list");
        list = list ? JSON.parse(list) : { data: [], modify: new Date().toLocaleString() };  // Initialize list if it's null

        if (term === "") {
            alert("Please write something.");
        } else if (name === "add") {
            // Adding a new task
            if (!list.data.includes(term)) {
                list.data.push(term);  // Add the new task
                localStorage.setItem("list", JSON.stringify({ data: list.data, modify: new Date().toLocaleString() }));
            } else {
                alert("Item already exists");
            }
            load();  // Reload the task list

        } else if (name === "edit") {
            // Editing an existing task
            let prev = edit.dataset.name;  // Get the original task name
            list.data = list.data.map(item => item === prev ? term : item);  // Replace the task with the new value
            localStorage.setItem("list", JSON.stringify({ data: list.data, modify: new Date().toLocaleString() }));
            edit.classList.add("d-none");  // Hide the edit form
            edit.term.value = "";
            load();  // Reload the task list
        } else {
            alert("Something went wrong");
        }
    } else {
        alert("Your browser does not support localStorage");
    }
    e.target.reset();  // Reset the form
}

// Event listeners for form submissions
add.addEventListener("submit", submited);
edit.addEventListener("submit", submited);

// Load the task list when the page loads
load();