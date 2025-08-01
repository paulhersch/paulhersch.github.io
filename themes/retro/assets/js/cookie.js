let bgelem = document.getElementById("bg");
let toggler = document.getElementById("animation-toggle");
let group = document.getElementById("toggler-group");

function enable_animations() {
    toggler.checked = true;
    bgelem.classList.add("bg-animated")
}

function disable_animations() {
    toggler.checked = false;
    bgelem.classList.remove("bg-animated")
}

function create_cookie_string(animations_enabled) {
    return `animations=${animations_enabled.toString()}; path=/; SameSite=none; Secure`
}

// inform about functional cookie if not set
if (document.cookie.split("; ").find((row) => row.startsWith("animations=")) == undefined) {
    document.getElementById("consent-box").showModal();
    document.cookie = create_cookie_string(false)
}

// animate bg if true
if (document.cookie.split("; ").find((row) => row.startsWith("animations="))?.split("=")[1] == "true") {
    enable_animations()
}

group.addEventListener("click", (_) => {
    if (!toggler.checked) {
        document.cookie = create_cookie_string(true)
        enable_animations()
    } else {
        document.cookie = create_cookie_string(false)
        disable_animations()
    }
})
