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
    Vaccination Centres - <span>${distName}</span> - slots on ${todayDate}
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
            vaccine_data: {},
        };
        arr.forEach((dObj) => {
            vcdFullObj.center_id = dObj.center_id;
            vcdFullObj.name = dObj.name;
            vcdFullObj.address = `${dObj.address}, ${dObj.district_name}, ${dObj.state_name} - ${dObj.pincode}`;
            vcdFullObj.fee_type = dObj.fee_type;


            if (vcdFullObj.vaccine_data[dObj.vaccine] == undefined) {
                vcdFullObj.vaccine_data[dObj.vaccine] = {};
            }
            // console.log(dObj.min_age_limit, dObj.vaccine);
            if (dObj.min_age_limit == 45) {
                // console.log(dObj.available_capacity_dose1);
                if (
                    vcdFullObj.vaccine_data[dObj.vaccine].age45plus == undefined
                ) {
                    vcdFullObj.vaccine_data[dObj.vaccine].age45plus = {
                        d1: 0,
                        d2: 0,
                    };
                }
                vcdFullObj.vaccine_data[dObj.vaccine].age45plus.d1 =
                    dObj.available_capacity_dose1;
                vcdFullObj.vaccine_data[dObj.vaccine].age45plus.d2 =
                    dObj.available_capacity_dose2;
            } else if (dObj.min_age_limit == 18 && dObj.max_age_limit == 44) {
                // console.log(dObj.available_capacity_dose1);
                if (
                    vcdFullObj.vaccine_data[dObj.vaccine].age18to44 == undefined
                ) {
                    vcdFullObj.vaccine_data[dObj.vaccine].age18to44 = {
                        d1: 0,
                        d2: 0,
                    };
                }
                vcdFullObj.vaccine_data[dObj.vaccine].age18to44.d1 =
                    dObj.available_capacity_dose1;
                vcdFullObj.vaccine_data[dObj.vaccine].age18to44.d2 =
                    dObj.available_capacity_dose2;
            } else if (
                dObj.min_age_limit == 18 &&
                dObj.max_age_limit == undefined
            ) {
                // console.log(dObj.available_capacity_dose1);

                if (
                    vcdFullObj.vaccine_data[dObj.vaccine].age18plus == undefined
                ) {
                    vcdFullObj.vaccine_data[dObj.vaccine].age18plus = {
                        d1: 0,
                        d2: 0,
                    };
                }
                vcdFullObj.vaccine_data[dObj.vaccine].age18plus.d1 =
                    dObj.available_capacity_dose1;
                vcdFullObj.vaccine_data[dObj.vaccine].age18plus.d2 =
                    dObj.available_capacity_dose2;
            }
            vcdFullObj.vaccine_data[dObj.vaccine].fee = dObj.fee;
            // console.log(dObj.min_age_limit, vcdFullObj.vaccine_data);
        });
        // console.log(arr.length, vcdFullObj.vaccine_data);
        // console.log(Object.keys(vcdFullObj.vaccine_data));
        vaccCentreData.push(vcdFullObj);
    }
    // function getOneObj(arr) {
    //     let vcdFullObj = {
    //         center_id: 0,
    //         name: "",
    //         address: "",
    //         fee_type: "",
    //         fee: 0,
    //         vaccine_data: new sampleTblData(),
    //     };
    //     arr.forEach((dObj) => {
    //         vcdFullObj.center_id = dObj.center_id;
    //         vcdFullObj.name = dObj.name;
    //         vcdFullObj.address = `${dObj.address}, ${dObj.district_name}, ${dObj.state_name} - ${dObj.pincode}`;
    //         vcdFullObj.fee_type = dObj.fee_type;
    //         vcdFullObj.fee = dObj.fee;

    //         if (dObj.min_age_limit == 45) {
    //             // console.log(dObj.available_capacity_dose1);
    //             vcdFullObj.vaccine_data[dObj.vaccine].age45plus.d1 =
    //                 dObj.available_capacity_dose1;
    //             vcdFullObj.vaccine_data[dObj.vaccine].age45plus.d2 =
    //                 dObj.available_capacity_dose2;
    //         } else if (dObj.min_age_limit == 18 && dObj.max_age_limit == 44) {
    //             // console.log(dObj.available_capacity_dose1);
    //             vcdFullObj.vaccine_data[dObj.vaccine].age18to44.d1 =
    //                 dObj.available_capacity_dose1;
    //             vcdFullObj.vaccine_data[dObj.vaccine].age18to44.d2 =
    //                 dObj.available_capacity_dose2;
    //         } else if (
    //             dObj.min_age_limit == 18 &&
    //             dObj.max_age_limit == undefined
    //         ) {
    //             // console.log(dObj.available_capacity_dose1);
    //             vcdFullObj.vaccine_data[dObj.vaccine].age18plus.d1 =
    //                 dObj.available_capacity_dose1;
    //             vcdFullObj.vaccine_data[dObj.vaccine].age18plus.d2 =
    //                 dObj.available_capacity_dose2;
    //         }
    //     });
    //     // console.log(vcdFullObj);
    //     vaccCentreData.push(vcdFullObj);
    // }
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

        // function replaceUndefinedOrNull(key, value) {
        //     if (value === "NA") {
        //         return undefined;
        //     }
        //     return value;
        // }
        // fltrVcDObj = JSON.stringify(fltrVcDObj, replaceUndefinedOrNull);
        // fltrVcDObj = JSON.parse(fltrVcDObj);
        // function removeEmpty(obj) {
        //     const newObj = {};
        //     Object.entries(obj).forEach(([k, v]) => {
        //         console.log(k);
        //         console.log(v);
        //         if (v === Object(v)) {
        //             newObj[k] = removeEmpty(v);
        //         } else if (v != "NA") {
        //             newObj[k] = obj[k];
        //         }
        //     });
        //     return newObj;
        // }
        // fltrVcDObj = removeEmpty(fltrVcDObj);
        // console.log(vcDObj);
        // console.log(fltrVcDObj);
        // console.log(dObj.name, dObj.center_id, vcDObj);
        // console.log(dObj.center_id, vcDObj);

        let vcN = [],
            vcA = [],
            vA = Object.keys(vcDObj),
            vA2 = [];
        (() => {
            vA.forEach((vN) => {
                let vNAgeKeys = Object.keys(vcDObj[vN]);
                vNAgeKeys.forEach((vAge) => {
                    if (vAge == "age18plus") {
                        if (vA2.indexOf("Age 18+") == -1) vA2.push("Age 18+");
                    } else if (vAge == "age18to44") {
                        if (vA2.indexOf("Age 18-44") == -1)
                            vA2.push("Age 18-44");
                    } else if (vAge == "age45plus") {
                        if (vA2.indexOf("Age 45+") == -1) vA2.push("Age 45+");
                    }
                });
            });
            vA.forEach((v) => {
                let el = `<span class="vacc">${v}</span>`;
                vcN.push(el);
            });
            vA2.forEach((v) => {
                let el = `<span class="age">${v}</span>`;
                vcA.push(el);
            });
        })();
        // console.log(vA, vA2);

        /***************************** Getting Classes ***************************************/

        let vcICls = JSON.parse(JSON.stringify(vcDObj));

        (() => {
            vA.forEach((vN) => {
                let vNAgeKeys = Object.keys(vcICls[vN]);
                vNAgeKeys.forEach((vAge) => {
                    if (vAge != "fee") {
                        vcICls[vN][vAge].d1 =
                            vcICls[vN][vAge].d1 > 0 ?
                            "vc_avlbl" :
                            vcICls[vN][vAge].d1 == "NA" ?
                            "vc_na" :
                            "vc_bkd";
                        vcICls[vN][vAge].d2 =
                            vcICls[vN][vAge].d2 > 0 ?
                            "vc_avlbl" :
                            vcICls[vN][vAge].d2 == "NA" ?
                            "vc_na" :
                            "vc_bkd";
                    }
                });
            });
        })();

        // console.log(vcICls);

        let fltrVcDObj = JSON.parse(JSON.stringify(vcDObj));
        let tFees = [],
            trClasses = {},
            trhConts = {
                age18plus: "18 &amp; above",
                age18to44: "18 - 44 only",
                age45plus: "45 &amp; above",
            },
            tdD1Els = [],
            tdD2Els = [],
            thEls = [],
            trELs = [];
        Object.keys(fltrVcDObj).forEach((vN) => {
            thEls.push(`<th>${vN}</th>`);
            let tFee = `<span class="${dObj.fee_type}">${vN}: ₹${fltrVcDObj[vN].fee}</span>`;
            tFees.push(tFee);
            Object.keys(fltrVcDObj[vN]).forEach((vAge) => {
                if (vAge != "fee") {
                    if (trClasses[vAge] == undefined) {
                        trClasses[vAge] = vAge == "age18plus" ? "wrap18" : vAge == "age18to44" ? "wrap18to44" : "wrap45";
                    }
                    if (trhConts[vAge] == undefined) {
                        trhConts[vAge] = vAge == "age18plus" ? "18 &amp; above" : vAge == "age18to44" ? "18 - 44 only" : "45 &amp; above";
                    }

                    if (tdD1Els[vN] == undefined) tdD1Els[vN] = [];
                    if (tdD2Els[vN] == undefined) tdD2Els[vN] = [];
                    if (tdD1Els[vN][vAge] == undefined) tdD1Els[vN][vAge] = [];
                    if (tdD2Els[vN][vAge] == undefined) tdD2Els[vN][vAge] = [];

                    let tdD1El = `<td>
                            <span class="${vcICls[vN][vAge].d1}">${fltrVcDObj[vN][vAge].d1}</span>
                        </td>`;
                    let tdD2El = `<td>
                        <span class="${vcICls[vN][vAge].d2}">${fltrVcDObj[vN][vAge].d2}</span>
                    </td>`;
                    tdD1Els[vN][vAge].push(tdD1El);
                    tdD2Els[vN][vAge].push(tdD2El);
                }
            });
        });

        Object.keys(trClasses).forEach((vAge) => {
            let trIns1 = [],
                trIns2 = [];
            let trF = `<tr class="${trClasses[vAge]}">
            <th rowspan="2">${trhConts[vAge]}</th><td>D1</td>`;
            let trS = `<tr class="${trClasses[vAge]}"><td>D2</td>`;
            Object.keys(fltrVcDObj).forEach((vN) => {
                let trEl1 = `${tdD1Els[vN][vAge]}`;
                let trEl2 = `${tdD2Els[vN][vAge]}`;
                trIns1.push(trEl1);
                trIns2.push(trEl2);
            });
            let trVF = trIns1.join('');
            let trVS = trIns2.join('');
            let trElF1 = `${trF}${trVF}</tr>`;
            let trElF2 = `${trS}${trVS}</tr>`;
            trELs.push(trElF1);
            trELs.push(trElF2);
        });

        /*************************************************************************************/

        let vcItem = `<div class="vaccCentreItem card flex-cc">
    <div class="vaccCentreDetails">
        <ul class="flex-cc col noBullets">
            <li class="vcNameLi flex-cc">
                <h4>${dObj.name}</h4>
            </li>
            <li class="vcTagsLi">
                <span class="${dObj.fee_type}">${
                dObj.fee_type
            }</span>${vcN.join("")}${vcA.join("")}
            </li>
            <li class="vcTagsLi vcFeesLi">
                Fee: ${tFees.join(' ')}
            </li>
            <li class="vcAddressLi">${dObj.address}</li>
        </ul>
    </div>
    <div class="vaccData flex-cc col">
        <table class="vaccDataTable">
            <thead>
                <tr>
                    <th>Age Grp.</th>
                    <th>DOSE</th>
                    ${thEls.join('')}
                </tr>
            </thead>
            <tbody>
                ${trELs.join("")}
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

    [distID, todayDate] = [getDistID(distName), getDate()];

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

    let vaccURL = `https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByDistrict?district_id=${distID}&date=${todayDate}`;

    // console.log(distName, distID, todayDate, vaccURL);

    loadJSON(vaccURL).then((data) => {
        vcDataJSON = data.sessions;
        filterVCData(vcDataJSON);
        loadFilteredVCData(vaccCentreData);
        // console.log(vcDataJSON);
    });
}