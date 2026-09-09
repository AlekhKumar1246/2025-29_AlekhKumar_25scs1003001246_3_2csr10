document.addEventListener("DOMContentLoaded", () => {

    const shipment =
        JSON.parse(localStorage.getItem("lastkmShipment")) || {};

    const match =
        JSON.parse(localStorage.getItem("lastkmMatch")) || {};

    const booking =
        JSON.parse(localStorage.getItem("lastkmBooking")) || {};


    /* ELEMENTS */

    const pickupMap =
        document.getElementById("pickupMap");

    const destinationMap =
        document.getElementById("destinationMap");

    const routeTitle =
        document.getElementById("routeTitle");

    const vehicleName =
        document.getElementById("vehicleName");

    const vehicleType =
        document.getElementById("vehicleType");

    const vehicleId =
        document.getElementById("vehicleId");

    const driverName =
        document.getElementById("driverName");

    const packageType =
        document.getElementById("packageType");

    const packageWeight =
        document.getElementById("packageWeight");

    const etaText =
        document.getElementById("etaText");

    const routeDistance =
        document.getElementById("routeDistance");

    const progressFill =
        document.getElementById("progressFill");

    const statusText =
        document.getElementById("statusText");

    const vehicleMarker =
        document.getElementById("vehicleMarker");

    const nearbyStep =
        document.getElementById("nearbyStep");

    const completeBtn =
        document.getElementById("completeBtn");

    const homeBtn =
        document.getElementById("homeBtn");


    /* DATA */

    const pickup =
        shipment.pickup ||
        shipment.pickupLocation ||
        "Pickup location";

    const destination =
        shipment.destination ||
        shipment.destinationLocation ||
        "Destination";

    const vehicle =
        match.vehicle ||
        match.vehicleName ||
        "Sharma Logistics";

    const type =
        match.type ||
        match.vehicleType ||
        "Mini Truck";

    const id =
        match.id ||
        match.vehicleId ||
        "LK-104";

    const driver =
        match.driver ||
        vehicle;

    const pkg =
        shipment.packageType ||
        "Package";

    const weight =
        shipment.weight
            ? `${shipment.weight} kg`
            : "Package weight";


    /* DISPLAY */

    pickupMap.textContent = pickup;

    destinationMap.textContent = destination;

    routeTitle.textContent =
        `${pickup} → ${destination}`;

    vehicleName.textContent =
        vehicle;

    vehicleType.textContent =
        type;

    vehicleId.textContent =
        `Vehicle ${id}`;

    driverName.textContent =
        driver;

    packageType.textContent =
        pkg;

    packageWeight.textContent =
        weight;

    routeDistance.textContent =
        "Active delivery route";


    /* ETA */

    let eta = Number(
        match.eta ||
        booking.eta ||
        12
    );

    if (!Number.isFinite(eta) || eta <= 0) {
        eta = 12;
    }

    etaText.textContent =
        `${Math.round(eta)} min`;


    /* VEHICLE MOVEMENT */

    let progress = 0.42;

    function moveVehicle() {

        progress += 0.06;

        if (progress > 0.82) {
            progress = 0.42;
        }

        const left =
            25 + progress * 48;

        const top =
            58 - progress * 17;

        vehicleMarker.style.left =
            `${left}%`;

        vehicleMarker.style.top =
            `${top}%`;
    }

    moveVehicle();

    const movementTimer =
        setInterval(moveVehicle, 4500);


    /* SIMULATED ETA */

    let remainingEta =
        Math.round(eta);

    const etaTimer =
        setInterval(() => {

            if (remainingEta > 1) {

                remainingEta--;

                etaText.textContent =
                    `${remainingEta} min`;
            }

        }, 10000);


    /* NEARBY STATE */

    setTimeout(() => {

        nearbyStep.classList.add("active");

        nearbyStep.querySelector(".step-circle")
            .textContent = "✓";

        progressFill.style.width = "78%";

        statusText.textContent =
            "Driver is nearby";

    }, 12000);


    /* HOME */

    homeBtn.addEventListener("click", () => {

        clearInterval(movementTimer);
        clearInterval(etaTimer);

        window.location.href =
            "index.html";
    });


    /* COMPLETE */

    completeBtn.addEventListener("click", () => {

        clearInterval(movementTimer);
        clearInterval(etaTimer);

        const deliveryData = {

            completed: true,

            completedAt:
                new Date().toISOString(),

            pickup: pickup,

            destination: destination,

            vehicle: vehicle,

            vehicleType: type,

            vehicleId: id,

            driver: driver,

            packageType: pkg,

            weight: shipment.weight || "",

            price:
                match.lastKmPrice ||
                booking.price ||
                115

        };


        localStorage.setItem(
            "lastkmDelivery",
            JSON.stringify(deliveryData)
        );


        window.location.href =
            "delivery.html";

    });

});