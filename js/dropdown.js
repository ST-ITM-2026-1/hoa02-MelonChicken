document.addEventListener("DOMContentLoaded", init);

let currentFilterdict = {
    category: [],
    status: [],
    keyword: []
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
    selectFilteredContent();
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

function selectFilteredContent() {
    let projectcards = document.querySelectorAll(".card");
    let selectedProjects = [];
    let filterlist = currentFilterdict["category"].concat(currentFilterdict["status"], currentFilterdict["keyword"]);
    let isAll = false;
    if (filterlist.length == 0) {
        isAll = true;
    }
    // console.log(filterlist);
    projectcards.forEach(projectcard => {
        let current = new Project(projectcard);
        filterlist.forEach(keyword => {
            if (current.toString().includes(keyword) || isAll) {
                if (!selectedProjects.includes(projectcard)) {
                    selectedProjects.push(projectcard);
                }
            }
        })
        projectcard.parentNode.style.display = "None";
    })

    if (isAll) {
        projectcards.forEach(project => {
            project.parentNode.style.display = "flex";
        });
    } else {
        selectedProjects.forEach(project => {
            project.parentNode.style.display = "flex";
        });
    }
}

class Project {
    name;
    content;
    category;
    categoryString;
    stacks;
    result;

    constructor(element) {
        this.loadInfo(element);
    }

    loadInfo(element) {
        this.name = element.getElementsByTagName("H3")[0].innerText;
        this.content = element.getElementsByTagName("p")[0].innerText;
        this.category = [];
        let metaGroups = element.getElementsByClassName("metaGroup")[0].getElementsByTagName("SPAN");
        this.categoryString = "";
        for(let i = 0; i < metaGroups.length; i++){
            this.categoryString += metaGroups[i].innerText + " ";
            this.category.push()
        }
        let stacksList = element.getElementsByClassName("stacks")[0].getElementsByTagName("P");
        this.stacks = [];

        for (let i = 0; i < stacksList.length; i++) {
            this.stacks.push(stacksList[i].innerText);
        }
        this.result = element.getElementsByClassName("result")[0].getElementsByTagName("P")[0].innerText;
    }

    toString() {
        let string = this.name + " " + this.content + " " + this.categoryString + " ";

        this.stacks.forEach(stack => string += " " + stack);
        string += " " + this.result;
        // console.log(string);

        return string;
    }
}