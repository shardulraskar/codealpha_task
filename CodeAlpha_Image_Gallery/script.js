const images = document.querySelectorAll(".gallery img");
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightbox-img");
const filterBtns = document.querySelectorAll(".filters button");

let currentIndex = 0;

function openLightbox(index) {
    currentIndex = index;
    lightboxImg.src = images[index].src;
    lightbox.style.display = "flex";
}

function closeLightbox() {
    lightbox.style.display = "none";
}

function changeImage(step) {
    currentIndex = (currentIndex + step + images.length) % images.length;
    lightboxImg.src = images[currentIndex].src;
}

function filterImages(category) {
    filterBtns.forEach(btn => btn.classList.remove("active"));
    event.target.classList.add("active");

    images.forEach(img => {
        img.style.display =
            category === "all" || img.classList.contains(category)
                ? "block"
                : "none";
    });
}
