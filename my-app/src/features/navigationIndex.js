const applyCardBehaviour = () => {
    document.querySelectorAll('.article-card-container').forEach(card => {
        card.addEventListener('click', () => {
            window.location.href = "article.html";
        });
    });
};

const mainNavigationIndex = () => {
    applyCardBehaviour();
};

mainNavigationIndex();