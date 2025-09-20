const enableEntranceContentAnimations = () => {
    document.addEventListener("DOMContentLoaded", () => {
    const allColumns = document.querySelectorAll("#column1, #column2, #column3");

    allColumns.forEach((column) => {
            const children = column.children;

            Array.from(children).forEach((child, i) => {
            child.classList.add("fade-slide");
            child.style.animationDelay = `${0.2 * (i + 1)}s`;
            });
        });
    });
}

const mainAnimationArticle = () => {
    enableEntranceContentAnimations()
}

mainAnimationArticle()
