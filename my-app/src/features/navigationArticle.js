const applyTurnBackBehaviour = () => {
    document.getElementById("turn-back-icon").addEventListener("click", () => {
        window.location.href = "index.html"
    });
};


const main = () => {
    applyTurnBackBehaviour();
};

main();