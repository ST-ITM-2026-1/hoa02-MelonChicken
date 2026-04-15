document.addEventListener("DOMContentLoaded", init);

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

function dropdownClick(content) {
    console.log(content);
    // How to use .classList
    // https://developer.mozilla.org/ko/docs/Web/API/Element/classList
    if (!content.target.classList.contains("dropdown")) {
        console.log(content.target.parentElement);
        dropdownContent = content.target.parentElement.getElementsByClassName("dropdownContent");
    } else {
        console.log(`It is ${content}`);
        dropdownContent = content.target.getElementsByClassName("dropdownContent");
    }
    if (dropdownContent[0].style.display == "None") {
        dropdownContent[0].style.display = "grid";
    } else if (dropdownContent[0].style.display == "grid") {
        dropdownContent[0].style.display = "None";
    } else {
        dropdownContent[0].style.display = "grid";
    }
}


/**
 * function to load the filtered contents
 */
function filterClick() {

}