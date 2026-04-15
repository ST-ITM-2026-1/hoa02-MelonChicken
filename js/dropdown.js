document.addEventListener("DOMContentLoaded", init);

let currentFilterdict = {
    category: [],
    status: []
};

function init() {
    // console.log("Lets start");
    let dropdownContents = document.querySelectorAll(".dropdownContent label");
    // console.log("dropdownContent: "+dropdownContents);
    dropdownContents.forEach(content => content.addEventListener("click", filterClick))
    let dropdowns = document.querySelectorAll(".dropdown button");
    dropdowns.forEach(dropdown => {
        dropdown.addEventListener("click", dropdownClick);
    })
}

function dropdownClick(clickedElement) {
    let content = clickedElement.target;
    // console.log(content);
    // How to use .classList
    // https://developer.mozilla.org/ko/docs/Web/API/Element/classList

    while (!content.classList.contains("dropdown")) {
        content = content.parentElement;
    }
    // console.log(`It is ${content}`);
    let dropdownContent = content.getElementsByClassName("dropdownContent");
    let dropdownContents = document.querySelectorAll(".dropdownContent")
    let isOpen = dropdownContent[0].classList.contains("open");
    dropdownContents.forEach(content => {
        content.classList.remove("open");
        content.style.display = "None";
    });
    // console.log(dropdownContent);
    if (isOpen) {
        dropdownContent[0].style.display = "None";
    } else {
        dropdownContent[0].style.display = "grid";
        dropdownContent[0].classList.add("open");
    }

}


/**
 * function to load the filtered contents
 */
function filterClick(clickedElement) {
    let content = clickedElement.target;
    // ignore double-click which happens due to the label? I think so... maybe
    if (content.tagName != "INPUT") {
        return;
    }

    if (content.classList.contains("checked")) {
        content.classList.remove("checked");
    }
    else {
        content.classList.add("checked");
    }
    applyToList(content.name, content.id);
}

function applyToList(name, id) {
    let filterlist = currentFilterdict[name];
    if (filterlist.includes(id)) {
        filterlist.splice(filterlist.indexOf(id));
    }

    else {
        filterlist.push(id);
    }
}