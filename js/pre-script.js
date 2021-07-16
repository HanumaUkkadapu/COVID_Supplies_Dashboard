let root,
    body,
    menuBtn,
    navEl,
    navLinks,
    tblLinks,
    langsel,
    eng_div,
    tel_div,
    engCarousel,
    telCarousel,
    navCarsBtns,
    closeCarslBtns,
    showAUBtn,
    aboutUsDiv,
    closeAUBtn,
    showCFBtn,
    contactDiv,
    contactForm,
    closeCFBtn;

window.addEventListener("DOMContentLoaded", () => {
    init();
});

function init() {
    root = document.documentElement;
    body = document.body;
    menuBtn = document.getElementById("menu");
    navEl = document.getElementById("nav_el");
    navLinks = document.querySelectorAll("#nav_el a");

    tblLinks = document.querySelectorAll(".container table a");

    langsel = document.querySelector("#langsel");
    eng_div = document.querySelector(".eng_div");
    tel_div = document.querySelector(".tel_div");

    menuBtn.addEventListener("click", () => {
        menuBtn.classList.toggle("open");
        navEl.classList.toggle("open");
        body.classList.toggle("menu-open");
    });

    navLinks.forEach((el) => {
        el.addEventListener("click", () => {
            if (menuBtn.classList.contains("open")) menuBtn.click();
        });
    });

    tblLinks.forEach((link) => {
        // console.log(link.getAttribute("href"));
        let hRef = link.getAttribute("href");
        let prnt = link.parentElement;
        let el = `<a class="flex-cc" href="${hRef}" target="_blank" rel="noreferrer noopener">Download<span class="material-icons icon">open_in_new</span></a>`;
        link.remove();
        prnt.insertAdjacentHTML("beforeend", el);
    });

    tel_div.style.display = "none";
    langsel.addEventListener("input", (e) => {
        let selectedLang = langsel.options[langsel.selectedIndex].value;
        //console.log(selectedLang);
        if (selectedLang == "english") {
            tel_div.style.display = "none";
            eng_div.style.display = "flex";
        } else if (selectedLang == "telugu") {
            eng_div.style.display = "none";
            tel_div.style.display = "flex";
        }
    });
    // console.log(eng_div.childElementCount);
    // console.log(tel_div.childElementCount);
    [eng_div, tel_div].forEach((el) => {
        [...el.children].forEach((imgPre) => {
            imgPre.addEventListener("click", (e) => {
                let targEl = e.target;
                if (targEl.tagName == "IMG") {
                    if (targEl.parentElement.tagName == "PICTURE") {
                        targEl = e.target.parentElement.parentElement;
                    } else targEl = e.target.parentElement;
                }
                // console.log(el.classList[1], targEl.dataset.ind);
                openCarousel(el.classList[1], targEl.dataset.ind);
            });
        });
    });

    engCarousel = document.getElementById("carousel_eng");
    telCarousel = document.getElementById("carousel_tel");
    navCarsBtns = document.querySelectorAll(".carouselSect .cNavLink");
    closeCarslBtns = document.querySelectorAll(".closeCarouselBtn");

    navCarsBtns.forEach((btn) => {
        btn.addEventListener("click", (e) => {
            // console.log(btn.parentElement.id, btn.dataset.currelid, typeof btn.dataset.currelid);
            moveCarousel(btn.parentElement.id, btn, btn.dataset.currelid);
        });
    });

    closeCarslBtns.forEach((btn) => {
        btn.addEventListener("click", () => {
            // console.log(btn.dataset.targetid);
            closeCarousel(btn.dataset.targetid);
        });
    });

    function openCarousel(elClsName, targElInd) {
        let carsID = `carousel_${elClsName.split("_")[0]}`;
        // console.log(carsID);
        let carslEl = document.getElementById(carsID);
        carslEl.classList.add("open");
        body.classList.add("menu-open");
        document.querySelectorAll(`#${carsID} .cNavLink`).forEach((btn) => {
            btn.dataset.currelid = targElInd;
            checkDisable(btn, targElInd);
        });
        let divEl = carslEl.children[1].children[0];
        divEl.children[targElInd].scrollIntoView({
            block: "end",
            inline: "nearest",
        });
    }

    function checkDisable(btn, targElInd) {
        if (btn.classList[2] == "prevItemLink" && targElInd == 0)
            btn.disabled = true;
        else if (btn.classList[2] == "nextItemLink" && targElInd == 11)
            btn.disabled = true;
        else btn.disabled = false;
    }

    function moveCarousel(parentID, btn, currElID) {
        let btnType = btn.classList[2],
            imgWrapChildDiv,
            targetElID;
        // console.log(btnType, currElID);
        if (btnType == "prevItemLink") {
            imgWrapChildDiv = btn.nextElementSibling.children[0];
            if (currElID != 0) {
                targetElID = Number(currElID) - 1;
                imgWrapChildDiv.children[targetElID].scrollIntoView();
                setNewTargID(targetElID);
            }
        } else if (btnType == "nextItemLink") {
            imgWrapChildDiv = btn.previousElementSibling.children[0];
            if (currElID != imgWrapChildDiv.childElementCount - 1) {
                targetElID = Number(currElID) + 1;
                imgWrapChildDiv.children[targetElID].scrollIntoView();
                setNewTargID(targetElID);
            }
        }

        function setNewTargID(newTargID) {
            document
                .querySelectorAll(`#${parentID} .cNavLink`)
                .forEach((btn) => {
                    btn.dataset.currelid = newTargID;
                    checkDisable(btn, newTargID);
                });
        }
    }

    function closeCarousel(carsID) {
        // console.log(carsID);
        let carslEl = document.getElementById(carsID);
        carslEl.classList.remove("open");
        body.classList.remove("menu-open");
    }

    showAUBtn = document.getElementById("showAUBtn");
    aboutUsDiv = document.getElementById("aboutUsDiv");
    closeAUBtn = document.getElementById("closeAUBtn");
    showCFBtn = document.getElementById("showCFBtn");
    contactDiv = document.getElementById("contactDiv");
    contactForm = document.getElementById("contactForm");
    closeCFBtn = document.getElementById("closeCFBtn");

    showAUBtn.addEventListener("click", () => {
        aboutUsDiv.classList.add("open");
        body.classList.add("menu-open");
    });
    closeAUBtn.addEventListener("click", () => {
        aboutUsDiv.classList.remove("open");
        body.classList.remove("menu-open");
    });

    showCFBtn.addEventListener("click", () => {
        contactDiv.classList.add("open");
        body.classList.add("menu-open");
    });
    closeCFBtn.addEventListener("click", () => {
        contactDiv.classList.remove("open");
        body.classList.remove("menu-open");
    });
    contactForm.addEventListener("submit", (e) => {
        e.preventDefault();
        alert("Contact form submitted successfully");
        contactDiv.classList.remove("open");
        contactForm.reset();
        body.classList.remove("menu-open");
    });
}