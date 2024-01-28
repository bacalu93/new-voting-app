document.addEventListener('DOMContentLoaded', function() {
    const languagesList = document.getElementById('languages-list');

    fetch('/languages')
        .then(response => response.json())
        .then(languages => {
            languages.forEach(lang => {
                const languageItem = document.createElement('div');
                languageItem.className = 'language-item';
                languageItem.innerHTML = `${lang.name} <span class="vote-count">${lang.votes} votes</span>`;
                languageItem.onclick = function() { vote(lang.id, languageItem); };
                languagesList.appendChild(languageItem);
            });
        });
});

function vote(id, element) {
    fetch('/vote', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: id }),
    })
    .then(response => response.json())
    .then(data => {
        if(data.votes !== undefined) {
            const voteCount = element.querySelector('.vote-count');
            voteCount.textContent = `${data.votes} votes`;
        }
    })
    .catch(error => console.error('Error:', error));
}
