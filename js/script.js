import { loadMedData as LMD } from "./medDataScript.js";
import { loadHspData as LHD } from "./hspDataScript.js";
import { loadVaccCentreData as LVCD } from "./vaccDataScript.js";

export const distConv = {
    Anantapur: "Anantapur",
    Chittoor: "Chittoor",
    "East godavari": "East Godavari",
    Guntur: "Guntur",
    Krishna: "Krishna",
    Kurnool: "Kurnool",
    Prakasam: "Prakasam",
    "Spsr nellore": "Nellore",
    Srikakulam: "Srikakulam",
    Visakhapatnam: "Visakhapatnam",
    Vizianagaram: "Vizianagaram",
    "West godavari": "West Godavari",
    "Y.s.r.": "Kadapa",
};
let distConv2 = {
    Anantapuram: "Anantapur",
    Chittoor: "Chittoor",
    "East Godavari": "East godavari",
    Guntur: "Guntur",
    Kadapa: "Y.s.r.",
    Krishna: "Krishna",
    Kurnool: "Kurnool",
    Prakasam: "Prakasam",
    "Sri Potti Sri Ramulu Nellore": "Spsr nellore",
    Srikakulam: "Srikakulam",
    Visakhapatnam: "Visakhapatnam",
    Vizianagaram: "Vizianagaram",
    "West Godavari": "West godavari",
};

let root, body, menuBtn, navEl, navLinks, tabBtns;

/**** Hanuma - START ****/
let searchSect,
    distSel,
    infoModel,
    iMsgSWrap,
    iMsgicon,
    iMsgCont,
    locateMeBtn,
    distName,
    distNmReadable,
    typeCheckBoxes,
    typeValues = ["", "", ""],
    chkSelNo,
    searchBtn,
    tabContentWrapper,
    disclaimerDiv,
    link2bottom,
    showAUBtn,
    aboutUsDiv,
    closeAUBtn,
    showCFBtn,
    contactDiv,
    contactForm,
    closeCFBtn;
/**** Hanuma - END ****/

window.addEventListener("DOMContentLoaded", () => {
    init();
});

function init() {
    root = document.documentElement;
    body = document.body;
    menuBtn = document.getElementById("menu");
    navEl = document.getElementById("nav_el");

    menuBtn.addEventListener("click", () => {
        menuBtn.classList.toggle("open");
        navEl.classList.toggle("open");
        body.classList.toggle("menu-open");
    });

    activateTabBtns();
    activateNavLinks();

    /**** Hanuma - START ****/

    searchSect = document.getElementById("searchSection");
    distSel = document.getElementById("distSel");

    infoModel = document.getElementById("info-model");
    iMsgSWrap = document.getElementById("info-msg-wrap");
    iMsgicon = document.getElementById("msg-icon");
    iMsgCont = document.getElementById("msg-span");

    locateMeBtn = document.getElementById("locateMeBtn");
    typeCheckBoxes = document.querySelectorAll("#typeChkWrapper > div input");
    searchBtn = document.getElementById("searchBtn");
    disclaimerDiv = document.getElementById("disclaimer");
    link2bottom = document.getElementById("link2bottom");

    link2bottom.addEventListener("click", (e) => {
        e.preventDefault();
        showCFBtn.click();
    });

    distSel.addEventListener("input", (e) => {
        //console.log('value changed');
        distName = distSel.options[distSel.selectedIndex].value;
        distNmReadable = distSel.options[distSel.selectedIndex].textContent;
        // console.log(`selected option: ${locValue}`);
        if (!distSel.classList.contains("selected")) {
            distSel.classList.add("selected");
            // console.log(`distSel.selected: ${distSel.classList.contains('selected')}`);
        }
        locateMeBtn.classList.remove("selected");
        locateMeBtn.textContent = "";
        locateMeBtn.innerHTML = `<span>Locate Me</span>
        <span class="material-icons">location_searching</span>`;
        // console.log(`locateMeBtn.selected: ${locateMeBtn.classList.contains('selected')}`);
        setSearchbtnStatus();
    });

    locateMeBtn.addEventListener("click", (e) => {
        // console.log(locateMeBtn.children[0]);
        locateMeBtn.children[0].textContent = "Locating...";
        locateMeBtn.children[1].textContent = "refresh";
        locateMeBtn.children[1].classList.add("loadIcon");
        locateMe();
        // setSearchbtnStatus();
    });

    typeCheckBoxes.forEach((chkBox) => {
        chkBox.addEventListener("input", () => {
            // console.log(chkBox.parentElement.outerHTML);
            if (chkBox.checked) {
                // console.log(chkBox.value, chkBox.dataset.labelid);
                typeValues[chkBox.dataset.labelid] = chkBox.value;
            } else {
                typeValues[chkBox.dataset.labelid] = "";
            }
            chkSelNo = typeValues.filter((val) => val.length > 0).length;
            // console.log(chkSelNo);
            setSearchbtnStatus();
        });
    });

    let resSectIDs = [
        "medStoreTabContainer",
        "hospitalTabContainer",
        "vaccCentreTabContainer",
    ];
    let tabBtnElObj = {
        "Medical Stores": {
            targetEl: resSectIDs[0],
            iconName: "medication",
        },
        Hospitals: {
            targetEl: resSectIDs[1],
            iconName: "local_hospital",
        },
        "Vaccination Centres": {
            targetEl: resSectIDs[2],
            iconName: "vaccines",
        },
    };
    let secElObj = {
        "Medical Stores": {
            elID: resSectIDs[0],
            elCont: `<h3 class="medStoreHead ">
            Medical Stores in - <label>Kadapa</label>
        </h3>`,
        },
        Hospitals: {
            elID: resSectIDs[1],
            elCont: `<div class="container flex-cc col">
            <h3 class="Hsptl_list_name">
                Hospitals in - <label>Kadapa</label>
            </h3>
            <table class="total_hospitals_list">
                <thead>
                    <th>Total Hospitals</th>
                    <th>Regular Beds</th>
                    <th>Oxygen Beds</th>
                    <th>ICU Beds</th>
                    <th>Ventilator Beds</th>
                </thead>
                <tbody>
                    <tr>
                        <td>15</td>
                        <td>100</td>
                        <td>30</td>
                        <td>25</td>
                        <td>20</td>
                    </tr>
                </tbody>
            </table>

            <form class="frm_filtr">

                <select name="Select Beds" id="Slct_Beds">
                    <option value="">
                        Regular Beds
                    </option>
                    <option value="">
                        Oxygen Beds
                    </option>
                    <option value="">
                        ICU Beds
                    </option>
                    <option value="">
                        Ventilator Beds
                    </option>
                </select>



                <select name="Type" id="Hsp_type">
                    <option value="Private">Private</option>
                    <option value="Government">Government</option>
                    <option value="Arogyashree">Arogyashree</option>
                </select>
                <input type="text" placeholder="Hospital Name.." name="search" class="sbt_btn">
                <button type="submit">Submit</button>

                <div class="clr_fix"></div>
            </form>

            <div id="hospitalData" class="flex-cc col">
            </div>

        </div>`,
        },
        "Vaccination Centres": {
            elID: resSectIDs[2],
            elCont: `<h3>
            Vaccination Centres in - <label>Kadapa</label>
        </h3>

        <div id="vaccCentreTabWrapper">
            <div class="filters flex-cc">
                <ul class="flex-cc noBullets">
                    <li><label>Covaxin</label></li>
                    <li><label>Covishield</label></li>
                    <li><label>Sputnik V</label></li>
                    <li><label>Age 18+</label></li>
                    <li><label>Age 45+</label></li>
                    <li><label>Paid</label></li>
                    <li><label>Free</label></li>
                </ul>
                <button class="filterBtn" id="vcFilterBtn">Filter</button>
            </div>

            <div id="vaccCentreData" class="flex-cc col">
            </div>
            
        </div>`,
        },
    };

    setSearchbtnStatus();
    searchBtn.addEventListener("click", (e) => {
        let resLinkLi = document.getElementById("resLinkLi");
        let resTabDiv = document.getElementById("resTabWrapper");
        let resSect = document.getElementById("resultSection");
        //console.log(resTabDiv == undefined, resSect == undefined);

        if (!(resLinkLi == undefined) &&
            !(resTabDiv == undefined) &&
            !(resSect == undefined)
        ) {
            resLinkLi.remove();
            resTabDiv.remove();
            resSect.remove();
        }

        let resultLink = `<li id="resLinkLi" >
        <a href="#resTabWrapper" id="resLink">
            Results
            <span class="material-icons">list_alt</span>
        </a>
    </li>`;
        navEl.children[0].insertAdjacentHTML("beforeend", resultLink);

        // get non-empty values
        let fltrArr = typeValues.filter((el) => {
            if (el.length > 0) return el;
        });

        let tabBtnEls = fltrArr.map((el, ind) => {
            // console.log(el, ind);
            let clsNm = ind == 0 ? "active" : "";
            let tabBtnEl = `<label class="tabBtn flex-cc ${clsNm}" data-targetelem="${tabBtnElObj[el].targetEl}">
        <input type="checkbox">
        <span class="material-icons">${tabBtnElObj[el].iconName}</span>
        ${el}
    </label>`;
            return tabBtnEl;
        });
        let sectionEls = fltrArr.map((el, ind) => {
            let secEl = `<section class="flex-cc col" id="${secElObj[el].elID}"></section>`;
            return secEl;
        });

        // console.log(distName, distNmReadable);
        // console.log(distName, fltrArr);
        // console.log(distName, fltrArr, tabBtnEls, sectionEls);
        // console.log(resTabDiv == undefined, resSect == undefined);

        let resTabWrapper = `<div id="resTabWrapper" class="tabBtnWrapper flex-cc">
        <div class="flex-cc">
            ${tabBtnEls.join("")}
        </div>
    </div>`;
        let resultSection = `<section id="resultSection" class="flex-cc col">
        <div class="tabContentWrapper flex-cc">
            ${sectionEls.join("")}
        </div>
    </section>`;

        disclaimerDiv.insertAdjacentHTML("beforebegin", resTabWrapper);
        disclaimerDiv.insertAdjacentHTML("beforebegin", resultSection);

        tabContentWrapper = document.querySelector(".tabContentWrapper");
        let tabCW = `calc(${fltrArr.length} * 94vw)`;
        tabContentWrapper.style.setProperty("--w", tabCW);

        activateTabBtns();
        activateNavLinks();

        resTabDiv = document.getElementById("resTabWrapper");
        resTabDiv.scrollIntoView();
        // setTimeout(()=>{
        //     document.querySelectorAll("#resultSection .tabContentWrapper section")[0].scrollIntoView({
        //         behavior: "smooth",
        //         block: "nearest",
        //         inline: "start",
        //     });
        // },1000);

        fltrArr.forEach((e, ind) => {
            switch (e) {
                case "Medical Stores":
                    LMD(distName);
                    break;
                case "Hospitals":
                    LHD(distName);
                    break;
                case "Vaccination Centres":
                    LVCD(distName);
                    break;
            }
        });

        setTimeout(() => {
            searchSect.classList.add("resultAdded");
        }, 2000);
    });

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
    closeCFBtn.addEventListener("click", (e) => {
        e.preventDefault();
        contactDiv.classList.remove("open");
        body.classList.remove("menu-open");
        showCFBtn.focus();
    });
    contactForm.addEventListener("submit", (e) => {
        e.preventDefault();
        alert("Contact form submitted successfully");
        contactDiv.classList.remove("open");
        contactForm.reset();
        body.classList.remove("menu-open");
    });

    /**** Hanuma - END ****/
}

/**** Hanuma - START ****/

function locateMe() {
    let lat = -1,
        long = -1;
    navigator.geolocation.getCurrentPosition(
        (position) => {
            [lat, long] = [position.coords.latitude, position.coords.longitude];
            // console.log(lat,long);
            reverseGeoCode(lat, long).then((data) => displayLoc(data));
            // console.log(position.coords.latitude);
            // console.log(position.coords.longitude);
        },
        (error) => {
            // console.log(error.message);
            console.log("Couldn't locate. Try again");
            let msg = error.message == "User denied geolocation prompt" ? "Please enable location access and try again.!" : "Unknown error. Please try later.!";
            showInfoMsg("error", msg);
            locateMeBtn.children[0].textContent = "Locate Me";
            locateMeBtn.children[1].textContent = "location_searching";
            locateMeBtn.children[1].classList.remove("loadIcon");
            locateMeBtn.classList.remove("selected");
        }
    );

    async function reverseGeoCode(lat, long) {
        let url = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${long}&localityLanguage=en`;
        let data1 = loadJSON(url).then((data) => {
            return data;
        });
        return data1;
    }

    function displayLoc(data) {
        let locInfo = data["localityInfo"]["administrative"];
        let mandalName = locInfo[3]["name"].split(" ")[0];
        let districtName = locInfo[2]["name"].split(" ")[0];
        distNmReadable = (() => {
            let arr = locInfo[2]["name"].split(" ");
            arr.pop();
            return arr.join(" ");
        })();
        // console.log(locInfo, mandalName, districtName);
        distName = districtName;

        if (distConv2[`${distNmReadable}`] != undefined) proceedForward(`${mandalName}, ${distNmReadable}`);
        else {
            locateMeBtn.children[0].textContent = "Locate Me";
            locateMeBtn.children[1].textContent = "location_searching";
            locateMeBtn.children[1].classList.remove("loadIcon");
            locateMeBtn.classList.remove("selected");

            console.log(`Sorry! Service only in AP. You are currently in ${distNmReadable}`);
            let [status, msg] = ["error", "You are not in AP. Please select a option from the above dropdown menu"];
            showInfoMsg(status, msg);
        }

        function proceedForward(distStr) {
            distName = distConv2[`${distNmReadable}`];
            locateMeBtn.children[0].textContent = distStr;
            locateMeBtn.children[1].textContent = "my_location";
            locateMeBtn.children[1].classList.remove("loadIcon");
            distSel.selectedIndex = 0;
            distSel.classList.remove("selected");
            // console.log(
            //     `distSel.selected: ${distSel.classList.contains("selected")}`
            // );
            if (!locateMeBtn.classList.contains("selected")) {
                locateMeBtn.classList.add("selected");
                // console.log(
                //     `locateMeBtn.selected: ${locateMeBtn.classList.contains(
                //         "selected"
                //     )}`
                // );
            }
            let [status, msg] = ["success", "Location access successful.!"];
            showInfoMsg(status, msg);
        }

        setSearchbtnStatus();
    }

    function showInfoMsg(status, msg) {
        infoModel.classList.add(`throw-${status}`);
        // iMsgSWrap,
        let icon = status == "success" ? "done" : "error";
        iMsgicon.textContent = `${icon}`;
        iMsgCont.textContent = `${msg}`;
        setTimeout(() => {
            infoModel.classList.remove(`throw-${status}`);
            // iMsgSWrap,
            iMsgicon.textContent = "info";
            iMsgCont.textContent = `limit reached!`;
        }, 2400);
    }

}

function setSearchbtnStatus() {
    typeCheckBoxes.forEach((chkBox) => {
        // console.log(chkBox.parentElement.outerHTML);
        if (chkBox.checked) {
            // console.log(chkBox.value, chkBox.dataset.labelid);
            typeValues[chkBox.dataset.labelid] = chkBox.value;
        } else {
            typeValues[chkBox.dataset.labelid] = "";
        }
        chkSelNo = typeValues.filter((val) => val.length > 0).length;
        // console.log(chkSelNo);
    });
    // console.log(distSel.classList.contains("selected"), locateMeBtn.classList.contains("selected"), chkSelNo);
    if (
        chkSelNo > 0 &&
        (distSel.classList.contains("selected") ||
            locateMeBtn.classList.contains("selected"))
    ) {
        searchBtn.removeAttribute("disabled");
    } else searchBtn.setAttribute("disabled", "");
}

function activateTabBtns() {
    tabBtns = document.querySelectorAll(".tabBtn");

    tabBtns.forEach((btn) => {
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            tabBtns.forEach((btnIn) => {
                if (btnIn.classList.contains("active"))
                    btnIn.classList.remove("active");
            });
            // console.log(btn.children[0].value);
            //console.log(typeof e.target.dataset.targetelem);
            let targetElem = document.getElementById(btn.dataset.targetelem);
            targetElem.scrollIntoView({
                behavior: "smooth",
                block: "nearest",
                inline: "start",
            });
            btn.classList.toggle("active");
        });
    });
}

function activateNavLinks() {
    navLinks = document.querySelectorAll("#nav_el a");

    navLinks.forEach((el) => {
        el.addEventListener("click", () => {
            if (menuBtn.classList.contains("open")) menuBtn.click();
        });
    });
}

export async function loadJSON(link) {
    let response = await fetch(link);
    let data = await response.json();
    return data;
}

// loading JSON
// loadJSON('https://hanumaukkadapu.github.io/myCodeBits/materialColorPalette/materialColors.json')
// 	.then(data => /*console.log(data);*/JSONloaded(data));

/**** Hanuma - END ****/

// https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByDistrict?district_id=512&date=31-03-2021