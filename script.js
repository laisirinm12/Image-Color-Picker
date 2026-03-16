const imageInput = document.getElementById("imageInput")
const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d")
let lockedHex = null
let tooltip = null
let tooltipColor = null
let tooltipHex = null

let img = new Image()

function ensureTooltipElements() {

    if (!tooltip) tooltip = document.getElementById("colorTooltip")
    if (!tooltipColor) tooltipColor = document.getElementById("tooltipColor")
    if (!tooltipHex) tooltipHex = document.getElementById("tooltipHex")

    return tooltip && tooltipColor && tooltipHex

}

imageInput.addEventListener("change", function (e) {

    const file = e.target.files[0]

    const reader = new FileReader()

    reader.onload = function (event) {
        img.src = event.target.result
    }

    reader.readAsDataURL(file)

})

img.onload = function () {

    const maxWidth = 700
    const maxHeight = 500

    let ratio = Math.min(maxWidth / img.width, maxHeight / img.height)

    canvas.width = img.width * ratio
    canvas.height = img.height * ratio

    ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

}


// CLICK TO PICK COLOR

canvas.addEventListener("click", function (event) {

    const rect = canvas.getBoundingClientRect()

    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height

    const x = Math.floor((event.clientX - rect.left) * scaleX)
    const y = Math.floor((event.clientY - rect.top) * scaleY)

    const pixel = ctx.getImageData(x, y, 1, 1).data

    const r = pixel[0]
    const g = pixel[1]
    const b = pixel[2]

    const hex = rgbToHex(r, g, b)

    lockedHex = hex   // 🔒 lock color

    document.getElementById("rgb").textContent = `(${r}, ${g}, ${b})`
    document.getElementById("hex").textContent = hex
    document.getElementById("preview").style.backgroundColor = hex

})


// LIVE COLOR PREVIEW ON HOVER

canvas.addEventListener("mousemove", function (event) {

    const rect = canvas.getBoundingClientRect()

    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height

    const x = Math.floor((event.clientX - rect.left) * scaleX)
    const y = Math.floor((event.clientY - rect.top) * scaleY)

    const pixel = ctx.getImageData(x, y, 1, 1).data

    const r = pixel[0]
    const g = pixel[1]
    const b = pixel[2]

    const hex = rgbToHex(r, g, b)

    if (!lockedHex) {

    document.getElementById("rgb").textContent = `(${r}, ${g}, ${b})`
    document.getElementById("hex").textContent = hex
    document.getElementById("preview").style.backgroundColor = hex

}

    /* TOOLTIP */

    if (ensureTooltipElements()) {

        tooltip.style.display = "flex"

        tooltip.style.left = event.pageX + 20 + "px"
        tooltip.style.top = event.pageY + 20 + "px"

        tooltipColor.style.backgroundColor = hex
        tooltipHex.textContent = hex

    }

})


// RGB → HEX FUNCTION

function rgbToHex(r, g, b) {

    return "#" +
        ((1 << 24) + (r << 16) + (g << 8) + b)
            .toString(16)
            .slice(1)

}


// COPY HEX BUTTON

const copyBtn = document.getElementById("copyBtn")
copyBtn.addEventListener("click", function () {

    const hex = lockedHex || document.getElementById("hex").textContent

    navigator.clipboard.writeText(hex)

    alert("HEX copied!")

})


// RESET WHEN CURSOR LEAVES IMAGE

canvas.addEventListener("mouseleave", function () {

    // document.getElementById("rgb").textContent = "-"
    // document.getElementById("hex").textContent = "-"

    if (ensureTooltipElements()) {
        tooltip.style.display = "none"
    }

})

document.addEventListener("keydown", function(e){

    if(e.key === "Escape"){
        lockedHex = null
    }

})