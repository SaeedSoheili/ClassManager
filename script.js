const screenWidth = window.innerWidth;;
const Page2Middle = document.querySelector(".Page2Middle")

document.addEventListener('DOMContentLoaded', changeMiddleOfThePageBoxWidth);


function changeMiddleOfThePageBoxWidth() {
    if (screenWidth >= 1240) {
        let marginLeftSize = (screenWidth - 1240) / 2 + "px"
        console.log(Page2Middle)
        Page2Middle.style.marginLeft = marginLeftSize
    }
}