const apiurl = 'https://api.github.com/users/';
const form = document.getElementById('form');
const main = document.getElementById('main');
const search = document.getElementById('search');

async function getUser(username) {
    try {
        const { data } = await axios.get(apiurl + username);
        getRepo(username);
        getCard(data);
    } catch (err) {
        main.innerHTML = `<p class="error">❌ No profile found with this name.</p>`;
    }
}

async function getRepo(username) {
    try {
        const { data } = await axios.get(apiurl + username + '/repos?sort=created');
        addRepoToCard(data);
    } catch (err) {
        document.querySelector('#repos').innerHTML = `<p class="error">⚠️ Error fetching repositories.</p>`;
    }
}

function getCard(user) {
    const card = `
    <div class="card">
        <div>
            <img src="${user.avatar_url}" alt="${user.name}" class="avatar">
        </div>
        <div class="userDetails">
            <h2>${user.name}</h2>
            <p>${user.bio || "No bio available"}</p>
            <ul>
                <li>${user.followers} <strong>Followers</strong></li>
                <li>${user.following} <strong>Following</strong></li>
                <li>${user.public_repos} <strong>Repos</strong></li>
            </ul>  
            <div id="repos"></div>
        </div>
    </div>
    `;
    main.innerHTML = card;
}

function addRepoToCard(repos) {
    const reposEl = document.querySelector('#repos');
    reposEl.innerHTML = ""; // Clear old repos before adding new ones
    repos.slice(0, 10).forEach(repo => {
        const repoEl = document.createElement('a');
        repoEl.classList.add('repo');
        repoEl.href = repo.html_url;
        repoEl.target = '_blank';
        repoEl.innerText = repo.name;
        reposEl.appendChild(repoEl);
    });
}

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const user = search.value.trim();
    if (user) {
        getUser(user);
        search.value = '';
    }
});
