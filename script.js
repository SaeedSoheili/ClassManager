const screenWidth = window.innerWidth;
const pageHeight = document.documentElement.scrollHeight;
const Page2Middle = document.querySelector(".Page2Middle")
const HomeWorkPage = document.querySelector(".HomeWorkPage")
const AnnouncementsPage = document.querySelector(".AnnouncementsPage")
const Page2RightMenu = document.querySelector(".Page2RightMenu")
const LearnPage = document.querySelector(".LearnPage")
const ProfilePage = document.querySelector(".ProfilePage")
const SupportPage = document.querySelector(".SupportPage")
document.addEventListener('DOMContentLoaded', changeMiddleOfThePageBoxWidth);


function changeMiddleOfThePageBoxWidth() {
    if (screenWidth >= 1240) {
        let marginLeftSize = (screenWidth - 1240) / 2 + "px"
        Page2Middle.style.marginLeft = marginLeftSize
        HomeWorkPage.style.marginLeft = marginLeftSize
        AnnouncementsPage.style.marginLeft = marginLeftSize
        LearnPage.style.marginLeft = marginLeftSize
        ProfilePage.style.marginLeft = marginLeftSize
        SupportPage.style.marginLeft = marginLeftSize
    }
    Page2RightMenu.style.height = pageHeight + "px"

}