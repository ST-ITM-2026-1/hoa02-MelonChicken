document.addEventListener("DOMContentLoaded", init);

const baseUrl = 'https://api.github.com/users/MelonChicken';
let profileData;
let reposUrl;
/**
 * The function to load GitHub Data and GitHub Repositories list
 */
function init() {
    fetch(baseUrl)
        .then(response => response.json())
        .then(profileData => {
            // console.log(profileData);
            // sort by the updated date
            //https://docs.github.com/en/rest/repos/repos?utm_source=chatgpt.com&apiVersion=2026-03-10 
            reposUrl = `${profileData.repos_url}?sort=updated&direction=desc`
            fillAllProfileInfo(profileData);
            getRepositories(reposUrl)
                .then(reposArray => fillRepositoriesSection(reposArray))
                .catch(error => {
                    console.log(`Error: ${error}`);
                })
        })
        .catch(error => {
            console.log(`Error: ${error}`);
        })
}


function fillAllProfileInfo(data) {
    fillProfileSection(data);
    fillStaticsSection(data);
    filldetailSection(data);
    fillTitleSection(data);
}

/**
 * The function to fill profile section 
 */
function fillProfileSection(data) {
    const profileSection = document.querySelector('.profileSection');
    let imageUrl = data.avatar_url;
    let username = data.name;
    let login = data.login;
    let company = data.company;
    let location = data.location;
    let bio = data.bio;

    if (100 < bio.length) {
        bio = bio.slice(100);
    }
    profileSection.innerHTML = `
    <img src="${imageUrl}" alt="profile">
            <div class="infoContainer">
                <h1>${username}</h1>
                <p>@${login}</p>
                <div class="locationContainer">
                    <p>${company}</p>
                    <p>${location}</p>
                </div>
                <p>${bio}</p>
            </div>
    `;
}


/**
 * The function to fill statistics section 
 */
function fillStaticsSection(data) {
    const staticsSection = document.querySelector('.staticsSection');

    // public repos
    let icon = 'fa-book-bookmark';
    let status = data.public_repos;
    let info = 'PUBLIC REPOS'
    staticsSection.appendChild(createStaticsContainer(icon, status, info));

    // follows
    icon = 'fa-user-group';
    status = data.followers;
    info = 'FOLLOWS'
    staticsSection.appendChild(createStaticsContainer(icon, status, info));

    // following
    status = data.following;
    info = 'FOLLOWING';
    staticsSection.appendChild(createStaticsContainer(icon, status, info));

    // since
    icon = 'fa-calendar-week';
    status = data.created_at;
    info = 'SINCE'
    staticsSection.appendChild(createStaticsContainer(icon, status, info));
}

/**
 * Helper function to create statistics container 
 */
function createStaticsContainer(icon, status, info) {
    let container = document.createElement('div');
    // if we have to convert date
    if (info == 'SINCE') {
        status = convertToSince(status);
    }
    container.classList.add('staticsContainer');
    container.innerHTML = `
    <div class="content">
    <div class="iconBox">
    <i class="fa-solid ${icon}"></i>
    </div>
    <div class="textBox">
    <h2 class="status">${status}</h2>
    <p class="info">${info}</p>
    </div>
    </div>
    `
    return container;
}

/**
 * Helper function to convert YYYY-MM-ddThh:mm:ssZ into how long day is ago
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date#examples 
 */

function convertToSince(dateString) {

    // 1. Get Time
    const inputDate = new Date(dateString);
    return inputDate.getFullYear();
}

function convertToTimeAgo(dateString) {

    // 1. Get Time
    const inputDate = new Date(dateString);
    const now = new Date();

    // 2. Calculate difference between two dates
    const diffMs = now - inputDate;

    // just before 
    if (diffMs < 60 * 1000) {
        return 'Just now';
    }

    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffYears = Math.floor(diffMs / (1000 * 60 * 60 * 24 * 365));

    // 3. Convert into date expression

    if (1 <= diffYears) {
        const remainingDays = diffDays % 365;
        return diffYears === 1 ? "1 year ago" : `${diffYears} years ${remainingDays} days ago`;
    }

    if (1 <= diffDays) {
        // for safe conversion, use === rather than ==
        return diffDays === 1 ? "1 day ago" : `${diffDays} days ago`;
    }

    if (1 <= diffHours) {
        return diffHours === 1 ? "1 hour ago" : `${diffHours} hours ago`;
    }

    return diffMinutes <= 1 ? "1 minute ago" : `${diffMinutes} minutes ago`;
}

/**
 * The function to fill details section 
 */
function filldetailSection(data) {
    const leftContainer = document.querySelector('.leftContainer');
    const rightContainer = document.querySelector('.rightContainer');

    let name = data.name;
    let username = data.login;
    let affiliation = data.company;
    let base = data.location;
    // fill left container
    leftContainer.innerHTML = `     
    <h2>
        <i class="fa-solid fa-user-group"></i>
        <span>Profile Details</span>
    </h2>

    <span>
        <p>Name</p>
        <p>${name}</p>
    </span>
    <span>
        <p>Username</p>
        <p>${username}</p>
    </span>
    <span>
        <p>Affiliation</p>
        <p>${affiliation}</p>
    </span>
    <span>
        <p>Based at</p>
        <p>${base}</p>
    </span>`;

    // fill right container

    rightContainer.innerHTML = `
    <h2>
        <i class="fa-solid fa-link"></i>
        <span>External Links</span>
    </h2>
    <div class="externalLink">
        <div class="iconBox">
            <i class="fa-solid fa-link"></i>
        </div>
        <div class="textBox">
            <h3 class="title">Porfolio</h3>
            <a href="${data.blog}">${data.blog}</a>
        </div>
    </div>
    <div class="externalLink">
        <div class="iconBox">
            <i class="fa-brands fa-github"></i>
        </div>
        <div class="textBox">
            <h3 class="title">GitHub Profile</h3>
            <a href="${data.html_url}">${data.html_url}</a>
        </div>
    </div>`
}


/**
 * The function to fill details section 
 */
function fillTitleSection(data) {
    const titleSection = document.querySelector('.titleSection');
    const h2Title = document.createElement('h2');
    h2Title.innerText = 'Latest Reporsitories';
    titleSection.appendChild(h2Title);


    const container = document.createElement('div');
    container.classList.add('buttonContainer');

    const aButton = document.createElement('a');
    aButton.href = `${data.html_url}?tab=repositories`;
    aButton.innerText = 'See all repos in GitHub ⇾';


    container.appendChild(aButton);
    titleSection.appendChild(container);
}


/**
 * The function to extract reposList from url
 */
async function getRepositories(reposUrl, n = 4) {
    try {
        let response = await fetch(reposUrl);
        let reposArr = await response.json();
        return reposArr.slice(0, 4);
    }
    catch (error) {
        console.log(`Error while Repos Loading: ${error}`);
    }
}

function fillRepositoriesSection(arr) {

    const repositoriesSection = document.querySelector('.repositoriesSection');

    arr.forEach((repo) => {
        let repoContainer = document.createElement('div');
        repoContainer.classList.add('repository');

        // prevent the case of no language or no description
        let language = repo.language ?? 'Unknown';
        let description = repo.description ?? 'No description provided.';
        let languageColor = stringToColor(language);
        let date = convertToTimeAgo(repo.updated_at);
        
        repoContainer.innerHTML = `
                <div class="top">
                    <div class="title">
                        <h2>
                            <i class="fa-solid fa-code"></i>
                            <span>${repo.name}</span>
                        </h2>
                        <span class="tag" style="background-color: ${languageColor};">${language}</span>
                    </div>
                    <p>${description}</p>
                </div>
                <div class="bottom">
                    <div class="status">
                        <i class="fa-regular fa-star"></i>
                        <p>${repo.stargazers_count}</p>
                        <i class="fa-solid fa-chart-line"></i>
                        <p>${repo.forks_count}</p>
                    </div>
                    <div class="date">${date}</div>
                </div>
        `
        repositoriesSection.appendChild(repoContainer);
    });
}


/**
 * The function to get colors of each programming language
 */
function stringToColor(str) {
    const colorMap = {
        Python: "#3572A5",
        Java: "#b07219",
        C: "#5c6bc0",
        JavaScript: "#f1e05a",
        TypeScript: "#3178c6",
        HTML: "#e34c26",
        CSS: "#563d7c",
        Dart: "#00B4AB"
    };

    // if the language is not mapped, return #0f4c75, the default color
    return colorMap[str] || "#0f4c75";
}