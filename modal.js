document.querySelectorAll(".modalLink").forEach(link => {
    link.addEventListener("click", e => {
        e.preventDefault();
        const linkName = link.dataset.modal;
        const modal = document.getElementById(linkName);

        modal.style.display = "flex";
    });
});

document.querySelectorAll(".close").forEach(click => {
    click.addEventListener("click", () => {
        const modal = click.closest(".modal");
        modal.style.display = "none";
    });
});

window.addEventListener("click", e => {
    if (e.target.classList.contains("modal")) {
        e.target.style.display = "none";
    }
});
