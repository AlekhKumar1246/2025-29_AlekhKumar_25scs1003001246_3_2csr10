const getStartedBtn = document.getElementById("getStartedBtn");
const navGetStarted = document.getElementById("navGetStarted");

function openRolePage() {
    window.location.href = "role.html";
}

getStartedBtn.addEventListener("click", openRolePage);

navGetStarted.addEventListener("click", openRolePage);