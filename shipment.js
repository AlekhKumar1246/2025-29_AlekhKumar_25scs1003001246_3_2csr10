/* =====================================================
   LASTKM — SHIPMENT DETAILS
   LOCATION + PACKAGE ENGINE
===================================================== */


/* =====================================================
   DOM ELEMENTS
===================================================== */

const pickup =
    document.getElementById("pickup");

const destination =
    document.getElementById("destination");

const pickupResults =
    document.getElementById("pickupResults");

const destinationResults =
    document.getElementById("destinationResults");

const pickupHint =
    document.getElementById("pickupHint");

const destinationHint =
    document.getElementById("destinationHint");

const pickupCurrentButton =
    document.getElementById(
        "pickupCurrentButton"
    );

const destinationCurrentButton =
    document.getElementById(
        "destinationCurrentButton"
    );


const packageType =
    document.getElementById("packageType");

const weight =
    document.getElementById("weight");

const length =
    document.getElementById("length");

const width =
    document.getElementById("width");

const height =
    document.getElementById("height");

const time =
    document.getElementById("time");


const continueButton =
    document.getElementById(
        "continueButton"
    );

const backButton =
    document.getElementById(
        "backButton"
    );

const homeButton =
    document.getElementById(
        "homeButton"
    );

const errorMessage =
    document.getElementById(
        "errorMessage"
    );


/* =====================================================
   LOCATION STATE
===================================================== */

let pickupLocation = null;

let destinationLocation = null;


let pickupSearchTimer = null;

let destinationSearchTimer = null;


/*
   Prevents stale search results from
   replacing newer results.
*/

let pickupSearchId = 0;

let destinationSearchId = 0;


/* =====================================================
   LOAD SAVED DATA
===================================================== */

const savedShipment =
    JSON.parse(
        localStorage.getItem(
            "lastkmShipment"
        )
    ) || {};


pickup.value =
    savedShipment.pickup || "";

destination.value =
    savedShipment.destination || "";


packageType.value =
    savedShipment.packageType || "";

weight.value =
    savedShipment.weight || "";

length.value =
    savedShipment.length || "";

width.value =
    savedShipment.width || "";

height.value =
    savedShipment.height || "";

time.value =
    savedShipment.time || "";


/* =====================================================
   RESTORE SAVED LOCATIONS
===================================================== */

if (
    savedShipment.pickupLocation
) {

    pickupLocation =
        savedShipment.pickupLocation;

    pickupHint.textContent =
        "✓ Location selected";

}


if (
    savedShipment.destinationLocation
) {

    destinationLocation =
        savedShipment.destinationLocation;

    destinationHint.textContent =
        "✓ Location selected";

}


/* =====================================================
   LOCATION SEARCH
===================================================== */


/*
   OpenStreetMap Nominatim is used for the
   internship prototype.

   It returns:
   - place name
   - address
   - latitude
   - longitude
*/


async function searchLocation(
    query,
    resultContainer,
    hintElement,
    searchNumber
) {

    if (
        !query ||
        query.trim().length < 2
    ) {

        resultContainer.classList.remove(
            "show"
        );

        return;

    }


    resultContainer.innerHTML = `
        <div class="location-searching">
            Searching locations...
        </div>
    `;

    resultContainer.classList.add(
        "show"
    );


    try {

        const url =
            "https://nominatim.openstreetmap.org/search?" +
            new URLSearchParams({

                q: query.trim(),

                format: "json",

                addressdetails: "1",

                limit: "5",

                countrycodes: "in"

            });


        const response =
            await fetch(url, {
                headers: {
                    "Accept":
                        "application/json"
                }
            });


        if (!response.ok) {
            throw new Error(
                "Location search failed."
            );
        }


        const data =
            await response.json();


        /*
           Ignore old search responses.
        */

        if (
            resultContainer === pickupResults &&
            searchNumber !== pickupSearchId
        ) {
            return;
        }


        if (
            resultContainer === destinationResults &&
            searchNumber !== destinationSearchId
        ) {
            return;
        }


        resultContainer.innerHTML =
            "";


        if (!data.length) {

            resultContainer.innerHTML = `
                <div class="location-error">
                    No location found. Try a nearby landmark, sector, area or city.
                </div>
            `;

            return;

        }


        data.forEach(
            function (place) {

                const button =
                    document.createElement(
                        "button"
                    );


                button.type =
                    "button";


                button.className =
                    "location-result";


                const title =
                    getPlaceTitle(place);


                const address =
                    getPlaceAddress(place);


                button.innerHTML = `

                    <span class="location-result-icon">
                        ⌖
                    </span>

                    <span class="location-result-text">

                        <span class="location-result-title">
                            ${escapeHtml(title)}
                        </span>

                        <span class="location-result-address">
                            ${escapeHtml(address)}
                        </span>

                    </span>

                `;


                button.addEventListener(
                    "click",
                    function () {

                        selectLocation(
                            place,
                            resultContainer,
                            hintElement
                        );

                    }
                );


                resultContainer.appendChild(
                    button
                );

            }
        );

    }
    catch (error) {

        resultContainer.innerHTML = `

            <div class="location-error">
                Location search is temporarily unavailable.
                You can try again.
            </div>

        `;

    }

}


/* =====================================================
   PLACE TITLE
===================================================== */

function getPlaceTitle(place) {

    const address =
        place.address || {};


    return (
        address.suburb ||
        address.neighbourhood ||
        address.village ||
        address.town ||
        address.city_district ||
        address.city ||
        place.display_name
            .split(",")[0]
    );

}


/* =====================================================
   PLACE ADDRESS
===================================================== */

function getPlaceAddress(place) {

    const address =
        place.address || {};


    const parts = [

        address.road,

        address.suburb,

        address.city_district,

        address.city,

        address.state

    ].filter(Boolean);


    return (
        [...new Set(parts)]
            .slice(0, 4)
            .join(", ")
    ) || place.display_name;

}


/* =====================================================
   SELECT LOCATION
===================================================== */

function selectLocation(
    place,
    resultContainer,
    hintElement
) {

    const location = {

        displayName:
            place.display_name,

        title:
            getPlaceTitle(place),

        address:
            getPlaceAddress(place),

        latitude:
            Number(place.lat),

        longitude:
            Number(place.lon),

        source:
            "search"

    };


    if (
        resultContainer === pickupResults
    ) {

        pickupLocation =
            location;

        pickup.value =
            location.title;

        pickup.dataset.selected =
            "true";

    }
    else {

        destinationLocation =
            location;

        destination.value =
            location.title;

        destination.dataset.selected =
            "true";

    }


    hintElement.textContent =
        "✓ Location selected";


    hintElement.style.color =
        "#3b9164";


    resultContainer.innerHTML =
        "";


    resultContainer.classList.remove(
        "show"
    );


    clearError();

}


/* =====================================================
   CURRENT LOCATION
===================================================== */

function useCurrentLocation(
    input,
    resultContainer,
    hintElement,
    button,
    isPickup
) {

    if (
        !navigator.geolocation
    ) {

        hintElement.textContent =
            "Location services are not supported by this browser.";

        return;

    }


    button.classList.add(
        "loading"
    );


    hintElement.textContent =
        "Getting your current location...";


    navigator.geolocation.getCurrentPosition(

        async function (position) {

            const latitude =
                position.coords.latitude;

            const longitude =
                position.coords.longitude;


            try {

                /*
                   Reverse geocoding converts
                   GPS coordinates into a readable
                   location name.
                */

                const url =
                    "https://nominatim.openstreetmap.org/reverse?" +
                    new URLSearchParams({

                        lat: latitude,

                        lon: longitude,

                        format: "json",

                        addressdetails: "1"

                    });


                const response =
                    await fetch(url);


                if (!response.ok) {
                    throw new Error(
                        "Reverse geocoding failed."
                    );
                }


                const place =
                    await response.json();


                const location = {

                    displayName:
                        place.display_name ||
                        "Current location",

                    title:
                        getPlaceTitle(place),

                    address:
                        getPlaceAddress(place),

                    latitude:
                        latitude,

                    longitude:
                        longitude,

                    source:
                        "current-location"

                };


                if (isPickup) {

                    pickupLocation =
                        location;

                    pickup.value =
                        location.title;

                }
                else {

                    destinationLocation =
                        location;

                    destination.value =
                        location.title;

                }


                hintElement.textContent =
                    "✓ Current location selected";


                hintElement.style.color =
                    "#3b9164";


                resultContainer.classList.remove(
                    "show"
                );


                clearError();

            }
            catch (error) {

                /*
                   Even if reverse geocoding fails,
                   GPS coordinates are still useful.
                */

                const location = {

                    displayName:
                        "Current location",

                    title:
                        "Current location",

                    address:
                        `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`,

                    latitude:
                        latitude,

                    longitude:
                        longitude,

                    source:
                        "current-location"

                };


                if (isPickup) {

                    pickupLocation =
                        location;

                    pickup.value =
                        "Current location";

                }
                else {

                    destinationLocation =
                        location;

                    destination.value =
                        "Current location";

                }


                hintElement.textContent =
                    "✓ GPS location selected";

            }


            button.classList.remove(
                "loading"
            );

        },


        function (error) {

            button.classList.remove(
                "loading"
            );


            let message =
                "Unable to get your location.";


            if (
                error.code ===
                error.PERMISSION_DENIED
            ) {

                message =
                    "Location permission was denied. Please allow location access.";

            }
            else if (
                error.code ===
                error.POSITION_UNAVAILABLE
            ) {

                message =
                    "Your current location is unavailable.";

            }


            hintElement.textContent =
                message;

        },


        {

            enableHighAccuracy:
                true,

            timeout:
                10000,

            maximumAge:
                30000

        }

    );

}


/* =====================================================
   PICKUP SEARCH
===================================================== */

pickup.addEventListener(
    "input",
    function () {

        pickupLocation = null;

        pickup.dataset.selected =
            "false";

        pickupHint.textContent =
            "Searching for locations...";


        clearTimeout(
            pickupSearchTimer
        );


        pickupSearchId++;


        const currentSearch =
            pickupSearchId;


        pickupSearchTimer =
            setTimeout(
                function () {

                    searchLocation(
                        pickup.value,
                        pickupResults,
                        pickupHint,
                        currentSearch
                    );

                },
                450
            );


        clearError();

    }
);


/* =====================================================
   DESTINATION SEARCH
===================================================== */

destination.addEventListener(
    "input",
    function () {

        destinationLocation =
            null;

        destination.dataset.selected =
            "false";

        destinationHint.textContent =
            "Searching for locations...";


        clearTimeout(
            destinationSearchTimer
        );


        destinationSearchId++;


        const currentSearch =
            destinationSearchId;


        destinationSearchTimer =
            setTimeout(
                function () {

                    searchLocation(
                        destination.value,
                        destinationResults,
                        destinationHint,
                        currentSearch
                    );

                },
                450
            );


        clearError();

    }
);


/* =====================================================
   CURRENT LOCATION BUTTONS
===================================================== */

pickupCurrentButton.addEventListener(
    "click",
    function () {

        useCurrentLocation(
            pickup,
            pickupResults,
            pickupHint,
            pickupCurrentButton,
            true
        );

    }
);


destinationCurrentButton.addEventListener(
    "click",
    function () {

        useCurrentLocation(
            destination,
            destinationResults,
            destinationHint,
            destinationCurrentButton,
            false
        );

    }
);


/* =====================================================
   CLOSE LOCATION DROPDOWNS
===================================================== */

document.addEventListener(
    "click",
    function (event) {

        if (
            !event.target.closest(
                ".location-field"
            )
        ) {

            pickupResults.classList.remove(
                "show"
            );

            destinationResults.classList.remove(
                "show"
            );

        }

    }
);


/* =====================================================
   VALIDATION
===================================================== */

function validateShipment() {

    if (!pickup.value.trim()) {

        return "Please select the pickup location.";

    }


    if (!destination.value.trim()) {

        return "Please select the destination.";

    }


    if (!pickupLocation) {

        return "Please select a pickup location from the suggestions or use current location.";

    }


    if (!destinationLocation) {

        return "Please select a destination from the suggestions or use current location.";

    }


    /*
       Coordinate based same-location check.
    */

    if (
        pickupLocation &&
        destinationLocation &&
        pickupLocation.latitude &&
        destinationLocation.latitude
    ) {

        const distance =
            calculateDistance(
                pickupLocation.latitude,
                pickupLocation.longitude,
                destinationLocation.latitude,
                destinationLocation.longitude
            );


        if (distance < 0.05) {

            return "Pickup and destination are too close or the same.";

        }

    }


    if (!packageType.value) {

        return "Please select a package type.";

    }


    if (
        !weight.value ||
        Number(weight.value) <= 0
    ) {

        return "Please enter a valid package weight.";

    }


    if (
        !length.value ||
        Number(length.value) <= 0
    ) {

        return "Please enter the package length.";

    }


    if (
        !width.value ||
        Number(width.value) <= 0
    ) {

        return "Please enter the package width.";

    }


    if (
        !height.value ||
        Number(height.value) <= 0
    ) {

        return "Please enter the package height.";

    }


    if (!time.value) {

        return "Please select your preferred delivery time.";

    }


    if (
        Number(weight.value) > 25
    ) {

        return "For this prototype, packages above 25 kg are not supported.";

    }


    return "";

}


/* =====================================================
   DISTANCE CALCULATION
===================================================== */

function calculateDistance(
    lat1,
    lon1,
    lat2,
    lon2
) {

    const earthRadius =
        6371;


    const dLat =
        toRadians(lat2 - lat1);

    const dLon =
        toRadians(lon2 - lon1);


    const a =
        Math.sin(dLat / 2) *
        Math.sin(dLat / 2) +

        Math.cos(
            toRadians(lat1)
        ) *

        Math.cos(
            toRadians(lat2)
        ) *

        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);


    const c =
        2 *
        Math.atan2(
            Math.sqrt(a),
            Math.sqrt(1 - a)
        );


    return earthRadius * c;

}


function toRadians(
    degrees
) {

    return degrees *
        Math.PI /
        180;

}


/* =====================================================
   SAVE SHIPMENT
===================================================== */

function saveShipment() {

    const shipment = {

        pickup:
            pickup.value.trim(),

        destination:
            destination.value.trim(),


        pickupLocation:
            pickupLocation,

        destinationLocation:
            destinationLocation,


        packageType:
            packageType.value,

        weight:
            Number(weight.value),

        length:
            Number(length.value),

        width:
            Number(width.value),

        height:
            Number(height.value),

        time:
            time.value,


        /*
           Useful later for pricing,
           tracking and environmental impact.
        */

        createdAt:
            new Date().toISOString()

    };


    localStorage.setItem(
        "lastkmShipment",
        JSON.stringify(shipment)
    );

}


/* =====================================================
   CONTINUE
===================================================== */

continueButton.addEventListener(
    "click",
    function () {

        const error =
            validateShipment();


        if (error) {

            errorMessage.textContent =
                error;

            return;

        }


        errorMessage.textContent =
            "";


        saveShipment();


        continueButton.innerHTML =
            "<span>Finding matches...</span><span class='arrow'>✓</span>";


        continueButton.disabled =
            true;


        setTimeout(
            function () {

                window.location.href =
                    "matching.html";

            },
            650
        );

    }
);


/* =====================================================
   BACK
===================================================== */

backButton.addEventListener(
    "click",
    function () {

        window.location.href =
            "role.html";

    }
);


/* =====================================================
   HOME
===================================================== */

homeButton.addEventListener(
    "click",
    function () {

        window.location.href =
            "index.html";

    }
);


/* =====================================================
   CLEAR ERROR
===================================================== */

function clearError() {

    errorMessage.textContent =
        "";

}


/* =====================================================
   OTHER FIELD EVENTS
===================================================== */

const fields = [

    packageType,
    weight,
    length,
    width,
    height,
    time

];


fields.forEach(
    function (field) {

        field.addEventListener(
            "input",
            clearError
        );

        field.addEventListener(
            "change",
            clearError
        );

    }
);


/* =====================================================
   ESCAPE HTML
===================================================== */

function escapeHtml(
    value
) {

    return String(value || "")
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}