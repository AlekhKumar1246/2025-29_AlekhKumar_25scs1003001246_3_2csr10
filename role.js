const senderCard = document.getElementById("senderCard");
const driverCard = document.getElementById("driverCard");
const backButton = document.getElementById("backButton");


/* =========================
   ALWAYS OPEN PAGE FROM TOP
========================= */

history.scrollRestoration = "manual";

window.addEventListener("load", function () {
    window.scrollTo(0, 0);
});


/* =========================
   SENDER
========================= */

senderCard.addEventListener("click", function () {

    senderCard.style.transform = "translateY(-2px) scale(0.99)";

    setTimeout(function () {

        window.location.href = "shipment.html";

    }, 220);

});


/* =========================
   VEHICLE OWNER
========================= */

driverCard.addEventListener("click", function () {

    driverCard.style.transform = "translateY(-2px) scale(0.99)";

    setTimeout(function () {

        window.location.href = "vehicle.html";

    }, 220);

});


/* =========================
   BACK
========================= */

backButton.addEventListener("click", function () {

    window.location.href = "index.html";

});