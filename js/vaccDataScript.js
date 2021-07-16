import { distConv, loadJSON } from "./script.js";

class vacObj {
    constructor() {
        this.age18plus = {
            d1: "NA",
            d2: "NA",
        };
        this.age18to44 = {
            d1: "NA",
            d2: "NA",
        };
        this.age45plus = {
            d1: "NA",
            d2: "NA",
        };
    }
}
class sampleTblData {
    constructor() {
        this.COVAXIN = new vacObj();
        this.COVISHIELD = new vacObj();
        this["SPUTNIK V"] = new vacObj();
    }
}

let distIDs,
    distID,
    todayDate,
    /*** */
    vaccFilterIns,
    vaccFilterBtn,
    vaccClrFilterBtn,
    vaccSelFilters = [];
let vaccCentreSect,
    vaccDataWrap,
    vcDataJSON,
    vaccCentreData = [],
    vcdFiltered = {
        COVAXIN: [],
        COVISHIELD: [],
        "SPUTNIK V": [],
        age18plus: [],
        age18to44: [],
        age45plus: [],
        Paid: [],
        Free: [],
    },
    vcdCentIDs = [];
loadJSON("./json/data_Disrticts_IDs.json").then((data) => {
    distIDs = data;
});

function getDistID(distName) {
    return distIDs[distName].district_id;
}

function getDate() {
    let today = new Date();
    let dd = `${today.getDate()}`.padStart(2, "0");
    let mm = `${today.getMonth() + 1}`.padStart(2, "0");
    let yyyy = today.getFullYear();
    return dd + "-" + mm + "-" + yyyy;
}

function putVCHeaderData(vcSect, distName) {
    vcSect.textContent = "";
    // console.log(distName);
    let sectCont = `<h3 class="resSectHead">
    Vaccination Centres - <span>${distName}</span>
</h3>

<div id="vaccCentreTabWrapper">
    <!-- May Change them to a select -->
    <div class="filters flex-cc">
        <ul class="flex-cc col noBullets">
            <div class="flex-cc" >
                Vaccine:
                <li><label>Covaxin<input type="checkbox" value="COVAXIN"></label></li>
                <li><label>Covishield<input type="checkbox" value="COVISHIELD"></label></li>
                <li><label>Sputnik V<input type="checkbox" value="SPUTNIK V"></label></li>
            </div>
            <div class="flex-cc" >
                Age:
                <li><label>Age 18+<input type="checkbox" value="age18plus"></label></li>
                <li><label>Age 18-44<input type="checkbox" value="age18to44"></label></li>
                <li><label>Age 45+<input type="checkbox" value="age45plus"></label></li>
            </div>
            <div class="flex-cc" >
                Fee:
                <li><label>Paid<input type="checkbox" value="Paid"></label></li>
                <li><label>Free<input type="checkbox" value="Free"></label></li>
            </div>
        </ul>
        <div class="fltrBtnDiv flex-cc col">
            <button class="filterBtn flex-cc" id="vcFilterBtn" >Filter</button>
            <button class="clrFilterBtn flex-cc" id="vcClrFilterBtn" >Clear Filters</button>
        </div>
    </div>
    <div id="vaccCentreData" class="flex-cc col">
        <span class="flex-cc loadingSpan" >Fetching data<span class="material-icons loadIcon">refresh</span></span>
    </div>
</div>`;
    vcSect.insertAdjacentHTML("beforeend", sectCont);
}

function filterVCData(vcData) {

    vaccCentreData = [];
    let historyIDs = [],
        centID,
        duplicates = [];

    vcData.forEach((el) => {
        centID = el.center_id;
        if (historyIDs.indexOf(centID) == -1) {
            historyIDs.push(centID);
            vcData.forEach((obj) => {
                if (obj.center_id == centID) duplicates.push(obj);
            });
            getOneObj(duplicates);
            duplicates = [];
        }
    });

    function getOneObj(arr) {
        let vcdFullObj = {
            center_id: 0,
            name: "",
            address: "",
            fee_type: "",
            fee: 0,
            vaccine_data: new sampleTblData(),
        };
        arr.forEach((dObj) => {
            vcdFullObj.center_id = dObj.center_id;
            vcdFullObj.name = dObj.name;
            vcdFullObj.address = `${dObj.address}, ${dObj.district_name}, ${dObj.state_name} - ${dObj.pincode}`;
            vcdFullObj.fee_type = dObj.fee_type;
            vcdFullObj.fee = dObj.fee;

            if (dObj.min_age_limit == 45) {
                // console.log(dObj.available_capacity_dose1);
                vcdFullObj.vaccine_data[dObj.vaccine].age45plus.d1 =
                    dObj.available_capacity_dose1;
                vcdFullObj.vaccine_data[dObj.vaccine].age45plus.d2 =
                    dObj.available_capacity_dose2;
            } else if (dObj.min_age_limit == 18 && dObj.max_age_limit == 44) {
                // console.log(dObj.available_capacity_dose1);
                vcdFullObj.vaccine_data[dObj.vaccine].age18to44.d1 =
                    dObj.available_capacity_dose1;
                vcdFullObj.vaccine_data[dObj.vaccine].age18to44.d2 =
                    dObj.available_capacity_dose2;
            } else if (
                dObj.min_age_limit == 18 &&
                dObj.max_age_limit == undefined
            ) {
                // console.log(dObj.available_capacity_dose1);
                vcdFullObj.vaccine_data[dObj.vaccine].age18plus.d1 =
                    dObj.available_capacity_dose1;
                vcdFullObj.vaccine_data[dObj.vaccine].age18plus.d2 =
                    dObj.available_capacity_dose2;
            }
        });
        // console.log(vcdFullObj);
        vaccCentreData.push(vcdFullObj);
    }
    // console.log(vcData);

    vcData.forEach((e) => {
        let [cID, minAge, maxAge] = [
            e.center_id,
            e.min_age_limit,
            e.max_age_limit,
        ];
        // console.log(cID, minAge, maxAge);
        if (minAge == 45) {
            if (vcdFiltered["age45plus"].indexOf(cID) == -1)
                vcdFiltered["age45plus"].push(cID);
        }
        if (minAge == 18) {
            if (maxAge == 44) {
                if (vcdFiltered["age18to44"].indexOf(cID) == -1)
                    vcdFiltered["age18to44"].push(cID);
            } else if (maxAge == undefined) {
                if (vcdFiltered["age18plus"].indexOf(cID) == -1)
                    vcdFiltered["age18plus"].push(cID);
            }
        }
        if (vcdFiltered[e.fee_type].indexOf(cID) == -1)
            vcdFiltered[e.fee_type].push(cID);
        if (vcdFiltered[e.vaccine].indexOf(cID) == -1)
            vcdFiltered[e.vaccine].push(cID);
    });
    // console.log(vcdFiltered);
}

function filterVData(arr) {
    let indArr = arr.map((el) => {
        return vcdFiltered[el];
    });
    let fltrIndArr,
        fltrData = [];
    if (indArr.length > 0) {
        fltrIndArr = indArr.reduce((acc, currEl, currInd) => {
            if ((currInd = 0)) acc = currEl;
            else {
                let arr1 = acc.filter((value) => currEl.includes(value));
                acc = arr1;
            }
            // console.log(acc,currEl);
            return acc;
        });
        // console.log(arr, indArr, fltrIndArr);
        fltrIndArr.forEach((el) => {
            vaccCentreData.forEach((elem) => {
                if (elem.center_id == el) fltrData.push(elem);
            });
        });
    } else fltrData = vaccCentreData;
    // console.log(arr, indArr);
    loadFilteredVCData(fltrData);
}

function loadFilteredVCData(dataArr) {
    // center_id: 0,
    // name: "",
    // address: "",
    // fee_type: "",
    // fee: 0,
    // vaccine_data: {}

    vaccDataWrap = document.getElementById("vaccCentreData");
    vaccDataWrap.textContent = "";

    dataArr.forEach((dObj) => {
        let vcDObj = dObj.vaccine_data;
        // console.log(dObj.name, dObj.center_id, vcDObj);
        // console.log(dObj.center_id, vcDObj);
        let vcN = [],
            vcA = [];
        (() => {
            let vA = [],
                vA2 = [];
            ["COVAXIN", "COVISHIELD", "SPUTNIK V"].forEach((vN) => {
                if (
                    vcDObj[vN].age18plus.d1 != "NA" ||
                    vcDObj[vN].age18plus.d2 != "NA" ||
                    vcDObj[vN].age18to44.d1 != "NA" ||
                    vcDObj[vN].age18to44.d2 != "NA" ||
                    vcDObj[vN].age45plus.d1 != "NA" ||
                    vcDObj[vN].age45plus.d2 != "NA"
                )
                    vA.push(vN);
                if (
                    vcDObj[vN].age18plus.d1 != "NA" ||
                    vcDObj[vN].age18plus.d2 != "NA"
                ) {
                    if (vA2.indexOf("Age 18+") == -1) {
                        vA2.push("Age 18+");
                    }
                }
                if (
                    vcDObj[vN].age18to44.d1 != "NA" ||
                    vcDObj[vN].age18to44.d2 != "NA"
                ) {
                    if (vA2.indexOf("Age 18-44") == -1) {
                        vA2.push("Age 18-44");
                    }
                }
                if (
                    vcDObj[vN].age45plus.d1 != "NA" ||
                    vcDObj[vN].age45plus.d2 != "NA"
                ) {
                    if (vA2.indexOf("Age 45+") == -1) {
                        vA2.push("Age 45+");
                    }
                }
            });
            // console.log(vA,vA2);
            vA.forEach((v) => {
                let el = `<span class="vacc">${v}</span>`;
                vcN.push(el);
            });
            vA2.forEach((v) => {
                let el = `<span class="age">${v}</span>`;
                vcA.push(el);
            });
        })();

        /***************************** Getting Classes ***************************************/

        let vcICls = new sampleTblData();

        (() => {
            vcICls.COVAXIN.age18plus.d1 =
                vcDObj.COVAXIN.age18plus.d1 > 0 ?
                "vc_avlbl" :
                vcDObj.COVAXIN.age18plus.d1 == "NA" ?
                "vc_na" :
                "vc_bkd";
            vcICls.COVAXIN.age18plus.d2 =
                vcDObj.COVAXIN.age18plus.d2 > 0 ?
                "vc_avlbl" :
                vcDObj.COVAXIN.age18plus.d2 == "NA" ?
                "vc_na" :
                "vc_bkd";
            vcICls.COVAXIN.age18to44.d1 =
                vcDObj.COVAXIN.age18to44.d1 > 0 ?
                "vc_avlbl" :
                vcDObj.COVAXIN.age18to44.d1 == "NA" ?
                "vc_na" :
                "vc_bkd";
            vcICls.COVAXIN.age18to44.d2 =
                vcDObj.COVAXIN.age18to44.d2 > 0 ?
                "vc_avlbl" :
                vcDObj.COVAXIN.age18to44.d2 == "NA" ?
                "vc_na" :
                "vc_bkd";
            vcICls.COVAXIN.age45plus.d1 =
                vcDObj.COVAXIN.age45plus.d1 > 0 ?
                "vc_avlbl" :
                vcDObj.COVAXIN.age45plus.d1 == "NA" ?
                "vc_na" :
                "vc_bkd";
            vcICls.COVAXIN.age45plus.d2 =
                vcDObj.COVAXIN.age45plus.d2 > 0 ?
                "vc_avlbl" :
                vcDObj.COVAXIN.age45plus.d2 == "NA" ?
                "vc_na" :
                "vc_bkd";
            vcICls.COVISHIELD.age18plus.d1 =
                vcDObj.COVISHIELD.age18plus.d1 > 0 ?
                "vc_avlbl" :
                vcDObj.COVISHIELD.age18plus.d1 == "NA" ?
                "vc_na" :
                "vc_bkd";
            vcICls.COVISHIELD.age18plus.d2 =
                vcDObj.COVISHIELD.age18plus.d2 > 0 ?
                "vc_avlbl" :
                vcDObj.COVISHIELD.age18plus.d2 == "NA" ?
                "vc_na" :
                "vc_bkd";
            vcICls.COVISHIELD.age18to44.d1 =
                vcDObj.COVISHIELD.age18to44.d1 > 0 ?
                "vc_avlbl" :
                vcDObj.COVISHIELD.age18to44.d1 == "NA" ?
                "vc_na" :
                "vc_bkd";
            vcICls.COVISHIELD.age18to44.d2 =
                vcDObj.COVISHIELD.age18to44.d2 > 0 ?
                "vc_avlbl" :
                vcDObj.COVISHIELD.age18to44.d2 == "NA" ?
                "vc_na" :
                "vc_bkd";
            vcICls.COVISHIELD.age45plus.d1 =
                vcDObj.COVISHIELD.age45plus.d1 > 0 ?
                "vc_avlbl" :
                vcDObj.COVISHIELD.age45plus.d1 == "NA" ?
                "vc_na" :
                "vc_bkd";
            vcICls.COVISHIELD.age45plus.d2 =
                vcDObj.COVISHIELD.age45plus.d2 > 0 ?
                "vc_avlbl" :
                vcDObj.COVISHIELD.age45plus.d2 == "NA" ?
                "vc_na" :
                "vc_bkd";
            vcICls["SPUTNIK V"].age18plus.d1 =
                vcDObj["SPUTNIK V"].age18plus.d1 > 0 ?
                "vc_avlbl" :
                vcDObj["SPUTNIK V"].age18plus.d1 == "NA" ?
                "vc_na" :
                "vc_bkd";
            vcICls["SPUTNIK V"].age18plus.d2 =
                vcDObj["SPUTNIK V"].age18plus.d2 > 0 ?
                "vc_avlbl" :
                vcDObj["SPUTNIK V"].age18plus.d2 == "NA" ?
                "vc_na" :
                "vc_bkd";
            vcICls["SPUTNIK V"].age18to44.d1 =
                vcDObj["SPUTNIK V"].age18to44.d1 > 0 ?
                "vc_avlbl" :
                vcDObj["SPUTNIK V"].age18to44.d1 == "NA" ?
                "vc_na" :
                "vc_bkd";
            vcICls["SPUTNIK V"].age18to44.d2 =
                vcDObj["SPUTNIK V"].age18to44.d2 > 0 ?
                "vc_avlbl" :
                vcDObj["SPUTNIK V"].age18to44.d2 == "NA" ?
                "vc_na" :
                "vc_bkd";
            vcICls["SPUTNIK V"].age45plus.d1 =
                vcDObj["SPUTNIK V"].age45plus.d1 > 0 ?
                "vc_avlbl" :
                vcDObj["SPUTNIK V"].age45plus.d1 == "NA" ?
                "vc_na" :
                "vc_bkd";
            vcICls["SPUTNIK V"].age45plus.d2 =
                vcDObj["SPUTNIK V"].age45plus.d2 > 0 ?
                "vc_avlbl" :
                vcDObj["SPUTNIK V"].age45plus.d2 == "NA" ?
                "vc_na" :
                "vc_bkd";
        })();

        /*************************************************************************************/

        let vcItem = `<div class="vaccCentreItem card flex-cc">
    <div class="vaccCentreDetails">
        <ul class="flex-cc col noBullets">
            <li class="vcNameLi flex-cc">
                <h4>${dObj.name}</h4>
            </li>
            <li class="vcChargesLi">
                <span class="${dObj.fee_type}">${
            dObj.fee_type
        }</span>${vcN.join("")}${vcA.join("")}
            </li>
            <li class="vcAddressLi">${dObj.address}</li>
        </ul>
    </div>
    <div class="vaccData flex-cc col">
        <table class="vaccDataTable">
            <thead>
                <tr><th>Age Grp.</th>
                <th>DOSE</th>
                <th>COVAXIN</th>
                <th>COVISHIELD</th>
                <th>SPUTNIK V</th>
            </tr></thead>
            <tbody>
                <tr class="wrap18">
                    <th rowspan="2">18 &amp; above</th>
                    <td>D1</td>
                    <td>
                        <span class="${vcICls.COVAXIN.age18plus.d1}">${
            vcDObj.COVAXIN.age18plus.d1
        }</span>
                    </td>
                    <td>
                        <span class="${vcICls.COVISHIELD.age18plus.d1}">${
            vcDObj.COVISHIELD.age18plus.d1
        }</span>
                    </td>
                    <td>
                        <span class="${vcICls["SPUTNIK V"].age18plus.d1}">${
            vcDObj["SPUTNIK V"].age18plus.d1
        }</span>
                    </td>
                </tr>
                <tr class="wrap18">
                    <td>D2</td>
                    <td>
                        <span class="${vcICls.COVAXIN.age18plus.d2}">${
            vcDObj.COVAXIN.age18plus.d2
        }</span>
                    </td>
                    <td>
                        <span class="${vcICls.COVISHIELD.age18plus.d2}">${
            vcDObj.COVISHIELD.age18plus.d2
        }</span>
                    </td>
                    <td>
                        <span class="${vcICls["SPUTNIK V"].age18plus.d2}">${
            vcDObj["SPUTNIK V"].age18plus.d2
        }</span>
                    </td>
                </tr>
                <tr class="wrap18to44">
                    <th rowspan="2">18 - 44</th>
                    <td>D1</td>
                    <td>
                        <span class="${vcICls.COVAXIN.age18to44.d1}">${
            vcDObj.COVAXIN.age18to44.d1
        }</span>
                    </td>
                    <td>
                        <span class="${vcICls.COVISHIELD.age18to44.d1}">${
            vcDObj.COVISHIELD.age18to44.d1
        }</span>
                    </td>
                    <td>
                        <span class="${vcICls["SPUTNIK V"].age18to44.d1}">${
            vcDObj["SPUTNIK V"].age18to44.d1
        }</span>
                    </td>
                </tr>
                <tr class="wrap18t044">
                    <td>D2</td>
                    <td>
                        <span class="${vcICls.COVAXIN.age18to44.d2}">${
            vcDObj.COVAXIN.age18to44.d2
        }</span>
                    </td>
                    <td>
                        <span class="${vcICls.COVISHIELD.age18to44.d2}">${
            vcDObj.COVISHIELD.age18to44.d2
        }</span>
                    </td>
                    <td>
                        <span class="${vcICls["SPUTNIK V"].age18to44.d2}">${
            vcDObj["SPUTNIK V"].age18to44.d2
        }</span>
                    </td>
                </tr>
                <tr class="wrap45">
                    <th rowspan="2">45 &amp; above</th>
                    <td>D1</td>
                    <td>
                        <span class="${vcICls.COVAXIN.age45plus.d1}">${
            vcDObj.COVAXIN.age45plus.d1
        }</span>
                    </td>
                    <td>
                        <span class="${vcICls.COVISHIELD.age45plus.d1}">${
            vcDObj.COVISHIELD.age45plus.d1
        }</span>
                    </td>
                    <td>
                        <span class="${vcICls["SPUTNIK V"].age45plus.d1}">${
            vcDObj["SPUTNIK V"].age45plus.d1
        }</span>
                    </td>
                </tr>
                <tr class="wrap45">
                    <td>D2</td>
                    <td>
                        <span class="${vcICls.COVAXIN.age45plus.d2}">${
            vcDObj.COVAXIN.age45plus.d2
        }</span>
                    </td>
                    <td>
                        <span class="${vcICls.COVISHIELD.age45plus.d2}">${
            vcDObj.COVISHIELD.age45plus.d2
        }</span>
                    </td>
                    <td>
                        <span class="${vcICls["SPUTNIK V"].age45plus.d2}">${
            vcDObj["SPUTNIK V"].age45plus.d2
        }</span>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</div>`;
        vaccDataWrap.insertAdjacentHTML("beforeend", vcItem);
    });
    if (dataArr.length == 0) {
        let el = `<h3 style="text-align:center">Sorry!
        <br>
        Unable to find vaccination centres related to your search.
        <br>
        Change your search criteria and try again</h3>`;
        vaccDataWrap.insertAdjacentHTML("beforeend", el);
    }
}

export function loadVaccCentreData(distName) {

    console.log(distName);
    // console.log(distConv[distName]); // display name

    vaccCentreSect = document.getElementById("vaccCentreTabContainer");
    putVCHeaderData(vaccCentreSect, distConv[distName]);

    vaccFilterIns = document.querySelectorAll(
        "#vaccCentreTabContainer .filters input"
    );
    vaccFilterBtn = document.getElementById("vcFilterBtn");
    vaccClrFilterBtn = document.getElementById("vcClrFilterBtn");
    // console.log(vaccFilterIns.length, vaccFilterbtn);

    vaccFilterIns.forEach((chk) => {
        chk.addEventListener("input", (e) => {
            e.target.parentElement.classList.toggle("selected");
            // console.log(e.target.checked);
        });
    });
    vaccFilterBtn.addEventListener("click", () => {
        vaccFilterIns.forEach((chk) => {
            if (chk.checked) {
                vaccSelFilters.push(chk.value);
            }
        });
        // console.log(vaccSelFilters);
        filterVData(vaccSelFilters);
        vaccSelFilters = [];
    });
    vaccClrFilterBtn.addEventListener("click", () => {
        vaccFilterIns.forEach((chk) => {
            chk.checked = false;
            chk.parentElement.classList.remove("selected");
        });
        vaccFilterBtn.click();
    });

    [distID, todayDate] = [getDistID(distName), getDate()];

    let vaccURL = `https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByDistrict?district_id=${distID}&date=${todayDate}`;

    // console.log(distName, distID, todayDate, vaccURL);

    loadJSON(vaccURL).then((data) => {
        vcDataJSON = data.sessions;
        filterVCData(vcDataJSON);
        loadFilteredVCData(vaccCentreData);
        // console.log(vcDataJSON);
    });
}