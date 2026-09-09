/* =====================================================
   LASTKM — MATCHING ENGINE
   AI Matching + Price Comparison
===================================================== */


/* =====================================================
   LOAD SHIPMENT
===================================================== */

const shipment =
    JSON.parse(
        localStorage.getItem("lastkmShipment")
    ) || {};


/* =====================================================
   DOM ELEMENTS
===================================================== */

const pickupValue =
    document.getElementById("pickupValue");

const destinationValue =
    document.getElementById("destinationValue");

const packageValue =
    document.getElementById("packageValue");

const weightValue =
    document.getElementById("weightValue");

const timeValue =
    document.getElementById("timeValue");

const statusText =
    document.getElementById("statusText");

const matchesGrid =
    document.getElementById("matchesGrid");

const explanationText =
    document.getElementById("explanationText");

const backButton =
    document.getElementById("backButton");

const continueButton =
    document.getElementById("continueButton");

const homeButton =
    document.getElementById("homeButton");


/* =====================================================
   SHIPMENT DEFAULTS
===================================================== */

const packageWeight =
    Number(shipment.weight) || 8.1;

const packageType =
    shipment.packageType || "small-box";


/* =====================================================
   FORMAT HELPERS
===================================================== */

function formatText(value) {

    if (!value) {
        return "—";
    }

    return String(value)
        .trim()
        .replace(/\b\w/g, function(char) {
            return char.toUpperCase();
        });

}


function formatPackage(value) {

    const names = {

        "small-box":
            "Small Box",

        "medium-box":
            "Medium Box",

        "bag":
            "Bag",

        "crate":
            "Crate",

        "documents":
            "Documents",

        "groceries":
            "Groceries",

        "clothing":
            "Clothing",

        "electronics":
            "Electronics"

    };

    return names[value] ||
        formatText(value);

}


function formatTime(value) {

    const names = {

        current:
            "⚡ ASAP",

        morning:
            "9:00 AM – 12:00 PM",

        afternoon:
            "12:00 PM – 3:00 PM",

        evening:
            "3:00 PM – 6:00 PM",

        "late-evening":
            "6:00 PM – 9:00 PM"

    };

    return names[value] || "—";

}


/* =====================================================
   DISPLAY SHIPMENT SUMMARY
===================================================== */

pickupValue.textContent =
    formatText(
        shipment.pickup
    );


destinationValue.textContent =
    formatText(
        shipment.destination
    );


packageValue.textContent =
    formatPackage(
        packageType
    );


weightValue.textContent =
    `${packageWeight} kg`;


timeValue.textContent =
    formatTime(
        shipment.time
    );


/* =====================================================
   DEMO VEHICLES
===================================================== */

const vehicles = [

    {
        id:
            "LK-104",

        name:
            "Sharma Logistics",

        type:
            "Mini Truck",

        icon:
            "🚚",

        capacity:
            12,

        eta:
            8,

        routeScore:
            100,

        timeScore:
            100,

        packageScore:
            100,

        lastKMPrice:
            115
    },


    {
        id:
            "LK-217",

        name:
            "GreenMove Transport",

        type:
            "Pickup Van",

        icon:
            "🚐",

        capacity:
            16,

        eta:
            18,

        routeScore:
            100,

        timeScore:
            100,

        packageScore:
            100,

        lastKMPrice:
            125
    },


    {
        id:
            "LK-521",

        name:
            "NorthStar Movers",

        type:
            "Delivery Van",

        icon:
            "🚐",

        capacity:
            22,

        eta:
            42,

        routeScore:
            100,

        timeScore:
            65,

        packageScore:
            100,

        lastKMPrice:
            135
    },


    {
        id:
            "LK-308",

        name:
            "CityLink Cargo",

        type:
            "Cargo Van",

        icon:
            "🚛",

        capacity:
            7,

        eta:
            25,

        routeScore:
            90,

        timeScore:
            85,

        packageScore:
            100,

        lastKMPrice:
            110
    },


    {
        id:
            "LK-442",

        name:
            "EcoRoute Mobility",

        type:
            "Mini Van",

        icon:
            "🚙",

        capacity:
            14,

        eta:
            31,

        routeScore:
            88,

        timeScore:
            75,

        packageScore:
            100,

        lastKMPrice:
            120
    }

];


/* =====================================================
   ASAP / CURRENT TIME LOGIC
===================================================== */

function calculateTimeScore(vehicle) {

    /*
       Current / ASAP request:
       nearer vehicle gets higher score.
    */

    if (
        shipment.time !== "current"
    ) {

        return vehicle.timeScore;

    }


    if (
        vehicle.eta <= 10
    ) {

        return 100;

    }


    if (
        vehicle.eta <= 20
    ) {

        return 92;

    }


    if (
        vehicle.eta <= 30
    ) {

        return 78;

    }


    if (
        vehicle.eta <= 45
    ) {

        return 65;

    }


    return 50;

}


/* =====================================================
   CAPACITY SCORE
===================================================== */

function calculateCapacityScore(vehicle) {

    if (
        vehicle.capacity >=
        packageWeight
    ) {

        return 100;

    }


    return 35;

}


/* =====================================================
   MATCH SCORE
===================================================== */

function calculateMatchScore(vehicle) {

    const route =
        vehicle.routeScore;


    const capacity =
        calculateCapacityScore(
            vehicle
        );


    const time =
        calculateTimeScore(
            vehicle
        );


    const package =
        vehicle.packageScore;


    /*
       AI-style weighted score

       Route       35%
       Capacity    25%
       Timing      25%
       Package     15%
    */

    const score =

        (
            route * 0.35 +
            capacity * 0.25 +
            time * 0.25 +
            package * 0.15
        );


    return Math.round(
        score
    );

}


/* =====================================================
   DEDICATED DELIVERY PRICE
===================================================== */

function calculateDedicatedPrice() {

    /*
       Prototype comparison price.

       IMPORTANT:
       Location coordinates are NOT directly
       converted into rupees.

       Dedicated delivery baseline = ₹180.
    */

    return 180;

}


/* =====================================================
   SAVING CALCULATION
===================================================== */

function calculateSaving(
    dedicatedPrice,
    lastKMPrice
) {

    const amount =
        Math.max(
            0,
            dedicatedPrice -
            lastKMPrice
        );


    const percentage =
        Math.round(
            (
                amount /
                dedicatedPrice
            ) * 100
        );


    return {

        amount:
            amount,

        percentage:
            percentage

    };

}


/* =====================================================
   RANK VEHICLES
===================================================== */

const rankedVehicles =

    vehicles

        .map(
            function(vehicle) {

                const score =
                    calculateMatchScore(
                        vehicle
                    );


                const dedicatedPrice =
                    calculateDedicatedPrice();


                const saving =
                    calculateSaving(
                        dedicatedPrice,
                        vehicle.lastKMPrice
                    );


                return {

                    ...vehicle,

                    score,

                    dedicatedPrice,

                    saving

                };

            }
        )


        .filter(
            function(vehicle) {

                /*
                   Only vehicles with enough
                   available capacity are suitable.
                */

                return (
                    vehicle.capacity >=
                    packageWeight
                );

            }
        )


        .sort(
            function(a, b) {

                if (
                    b.score !==
                    a.score
                ) {

                    return (
                        b.score -
                        a.score
                    );

                }


                return (
                    a.eta -
                    b.eta
                );

            }
        );


/* =====================================================
   VISIBLE VEHICLES
===================================================== */

const visibleVehicles =
    rankedVehicles.slice(
        0,
        3
    );


/* =====================================================
   SELECTED VEHICLE
===================================================== */

let selectedVehicleId =

    visibleVehicles.length > 0

        ? visibleVehicles[0].id

        : null;


/* =====================================================
   CREATE VEHICLE CARD
===================================================== */

function createVehicleCard(
    vehicle,
    index
) {

    const card =
        document.createElement(
            "article"
        );


    card.className =
        "match-card";


    if (
        index === 0
    ) {

        card.classList.add(
            "best"
        );

    }


    if (
        vehicle.id ===
        selectedVehicleId
    ) {

        card.classList.add(
            "selected"
        );

    }


    const capacityFits =
        vehicle.capacity >=
        packageWeight;


    const timeScore =
        calculateTimeScore(
            vehicle
        );


    const timeFits =
        timeScore >= 75;


    const routeFits =
        vehicle.routeScore >= 80;


    const packageFits =
        vehicle.packageScore >= 80;


    card.innerHTML = `

        ${
            index === 0
                ? `
                    <div class="best-badge">
                        BEST MATCH
                    </div>
                  `
                : ""
        }


        <!-- VEHICLE HEADER -->

        <div class="vehicle-header">

            <div class="vehicle-icon">
                ${vehicle.icon}
            </div>


            <div class="vehicle-info">

                <div class="vehicle-name">
                    ${vehicle.name}
                </div>


                <div class="vehicle-type">
                    ${vehicle.type}
                    ·
                    ${vehicle.id}
                </div>

            </div>

        </div>



        <!-- MATCH SCORE -->

        <div class="score-section">

            <div class="score-top">

                <span class="score-label">
                    AI MATCH SCORE
                </span>


                <strong class="score-number">
                    ${vehicle.score}%
                </strong>

            </div>


            <div class="score-bar">

                <div
                    class="score-fill"
                    style="width:${vehicle.score}%"
                ></div>

            </div>

        </div>



        <!-- VEHICLE DETAILS -->

        <div class="vehicle-details">


            <div class="detail-row">

                <span>
                    Route
                </span>

                <strong>
                    ${formatText(
                        shipment.pickup
                    )}

                    →

                    ${formatText(
                        shipment.destination
                    )}
                </strong>

            </div>


            <div class="detail-row">

                <span>
                    Available capacity
                </span>

                <strong>
                    ${vehicle.capacity} kg
                </strong>

            </div>


            <div class="detail-row">

                <span>
                    Pickup ETA
                </span>

                <strong>
                    ~${vehicle.eta} min
                </strong>

            </div>


        </div>



        <!-- COMPATIBILITY -->

        <div class="compatibility-grid">


            <div class="compatibility ${
                routeFits
                    ? ""
                    : "warning"
            }">

                ${
                    routeFits
                        ? "✓ Route compatible"
                        : "• Route nearby"
                }

            </div>


            <div class="compatibility ${
                capacityFits
                    ? ""
                    : "warning"
            }">

                ${
                    capacityFits
                        ? "✓ Capacity fits"
                        : "• Capacity tight"
                }

            </div>


            <div class="compatibility ${
                timeFits
                    ? ""
                    : "warning"
            }">

                ${
                    timeFits
                        ? "✓ Time compatible"
                        : "• Time nearby"
                }

            </div>


            <div class="compatibility ${
                packageFits
                    ? ""
                    : "warning"
            }">

                ${
                    packageFits
                        ? "✓ Package fits"
                        : "• Check package"
                }

            </div>


        </div>



        <!-- PRICE COMPARISON -->

        <div class="price-section">


            <div class="price-title">
                PRICE COMPARISON
            </div>


            <div class="price-comparison">


                <div class="price-box">

                    <span>
                        LastKM
                    </span>

                    <strong>
                        ₹${vehicle.lastKMPrice}
                    </strong>

                </div>


                <div class="price-vs">
                    VS
                </div>


                <div class="price-box dedicated">

                    <span>
                        Dedicated
                    </span>

                    <strong>
                        ₹${vehicle.dedicatedPrice}
                    </strong>

                </div>


            </div>



            <div class="saving-line">

                <span>
                    💚 You save
                </span>


                <strong>
                    ₹${vehicle.saving.amount}
                    ·
                    ${vehicle.saving.percentage}%
                </strong>

            </div>


        </div>



        <!-- SELECT -->

        <div class="select-row">

            <span>

                ${
                    vehicle.id ===
                    selectedVehicleId

                        ? "Selected vehicle"

                        : "Select this vehicle"

                }

            </span>


            <div class="select-indicator">

                ${
                    vehicle.id ===
                    selectedVehicleId
                        ? "✓"
                        : ""
                }

            </div>

        </div>

    `;


    /* =================================================
       CARD CLICK
    ================================================= */

    card.addEventListener(
        "click",
        function() {

            selectVehicle(
                vehicle.id
            );

        }
    );


    return card;

}


/* =====================================================
   RENDER MATCH CARDS
===================================================== */

matchesGrid.innerHTML =
    "";


visibleVehicles.forEach(
    function(vehicle, index) {

        matchesGrid.appendChild(

            createVehicleCard(
                vehicle,
                index
            )

        );

    }
);


/* =====================================================
   UPDATE EXPLANATION
===================================================== */

function updateExplanation(
    vehicle
) {

    if (!vehicle) {

        explanationText.textContent =
            "No suitable vehicle is available for this shipment.";

        return;

    }


    const timingText =

        shipment.time === "current"

            ? "your ASAP request"

            : "your selected delivery time";


    explanationText.textContent =

        `The AI ranked ${vehicle.name} at ${vehicle.score}% because its route is compatible, ${vehicle.capacity} kg of capacity is available for your ${packageWeight} kg shipment, and it can reach the pickup in about ${vehicle.eta} minutes for ${timingText}. LastKM is ₹${vehicle.lastKMPrice}, compared with an estimated dedicated-delivery price of ₹${vehicle.dedicatedPrice}, saving approximately ₹${vehicle.saving.amount}.`;

}


/* =====================================================
   SELECT VEHICLE
===================================================== */

function selectVehicle(
    vehicleId
) {

    selectedVehicleId =
        vehicleId;


    const selectedVehicle =
        rankedVehicles.find(
            function(vehicle) {

                return (
                    vehicle.id ===
                    vehicleId
                );

            }
        );


    if (!selectedVehicle) {

        return;

    }


    const cards =
        document.querySelectorAll(
            ".match-card"
        );


    cards.forEach(
        function(card) {

            card.classList.remove(
                "selected"
            );


            const indicator =
                card.querySelector(
                    ".select-indicator"
                );


            const selectText =
                card.querySelector(
                    ".select-row span"
                );


            const cardVehicleName =
                card.querySelector(
                    ".vehicle-name"
                );


            if (
                cardVehicleName &&
                cardVehicleName
                    .textContent
                    .trim() ===
                selectedVehicle.name
            ) {

                card.classList.add(
                    "selected"
                );


                if (indicator) {

                    indicator.textContent =
                        "✓";

                }


                if (selectText) {

                    selectText.textContent =
                        "Selected vehicle";

                }

            }

            else {

                if (indicator) {

                    indicator.textContent =
                        "";

                }


                if (selectText) {

                    selectText.textContent =
                        "Select this vehicle";

                }

            }

        }
    );


    updateExplanation(
        selectedVehicle
    );


    /* =================================================
       SAVE SELECTED MATCH
    ================================================= */

    localStorage.setItem(
        "lastkmMatch",
        JSON.stringify(
            selectedVehicle
        )
    );

}


/* =====================================================
   INITIAL SELECTION
===================================================== */

if (
    visibleVehicles.length > 0
) {

    selectVehicle(
        visibleVehicles[0].id
    );

}


/* =====================================================
   STATUS
===================================================== */

if (
    visibleVehicles.length > 0
) {

    statusText.textContent =

        `${visibleVehicles.length} suitable vehicles found for your shipment.`;

}

else {

    statusText.textContent =

        "No suitable vehicles found for your shipment.";

}


/* =====================================================
   CONTINUE
===================================================== */

continueButton.addEventListener(
    "click",
    function() {

        if (
            !selectedVehicleId
        ) {

            return;

        }


        const selectedVehicle =
            rankedVehicles.find(
                function(vehicle) {

                    return (
                        vehicle.id ===
                        selectedVehicleId
                    );

                }
            );


        if (!selectedVehicle) {

            return;

        }


        /* =============================================
           SAVE FINAL MATCH
        ============================================= */

        localStorage.setItem(
            "lastkmMatch",
            JSON.stringify(
                selectedVehicle
            )
        );


        /* =============================================
           BUTTON STATE
        ============================================= */

        continueButton.disabled =
            true;


        continueButton.innerHTML =

            `
                <span>
                    Preparing booking...
                </span>

                <span>
                    ✓
                </span>
            `;


        /* =============================================
           GO DIRECTLY TO CONFIRMATION
           
           Pricing page removed.
        ============================================= */

        setTimeout(
            function() {

                window.location.href =
                    "confirmation.html";

            },
            500
        );

    }
);


/* =====================================================
   BACK
===================================================== */

backButton.addEventListener(
    "click",
    function() {

        window.location.href =
            "shipment.html";

    }
);


/* =====================================================
   HOME
===================================================== */

homeButton.addEventListener(
    "click",
    function() {

        window.location.href =
            "index.html";

    }
);