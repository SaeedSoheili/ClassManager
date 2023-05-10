const screenWidth = window.innerWidth;
const pageHeight = document.documentElement.scrollHeight;
const Page2Middle = document.querySelector(".Page2Middle")
const Page2RightMenu = document.querySelector(".Page2RightMenu")

// Initialize Parse
Parse.initialize(
    "AhXuzTm5NWUatOedSxHkoFjODdl81HyDSAvpWqIf",
    "PnVkQY4cMuCbglhkyNfFOLtZUAouIyEEsPx0rYvI"
); //PASTE HERE YOUR Back4App APPLICATION ID AND YOUR JavaScript KEY
Parse.serverURL = "https://parseapi.back4app.com/";

let userName;
let userUserName;
let userPassword;
let userLoggedIn = false

let $ = document
let Page1LoginBtn = $.querySelector(".Page1LoginBtn")

let Page1 = $.querySelector(".Page1")
let Page2 = $.querySelector(".Page2")

let wichPageYouAreIn = "Page1"

let websitePages = $.querySelectorAll(".websitePages")
let websitePagesMneu = $.querySelectorAll(".websitePagesMneu")

let Page2HeaderPageTitle = $.querySelector(".Page2HeaderPageTitle")
let Page2RightMenuListItemsExit = $.querySelector(".Page2RightMenuListItemsExit")
let Page2HeaderIconsExit = $.querySelector(".Page2HeaderIconsExit")
let Page2HeaderIconsProfile = $.querySelector(".Page2HeaderIconsProfile")
let Page2MiddleRightTopBox = $.querySelector(".Page2MiddleRightTopBox")
let Page2MiddleBottomBoxBtn = $.querySelector(".Page2MiddleBottomBoxBtn")
let Page2MiddleLeftTopBox = $.querySelector(".Page2MiddleLeftTopBox")
let LearnPageItemChooseYourDevice = $.querySelector(".LearnPageItemChooseYourDevice")
let LearnPageItemVideos = $.querySelector(".LearnPageItemVideos")



//////// for responsive the middle of the page with big screen sizes ///////////////
function changeMiddleOfThePageBoxWidth() {
    if (screenWidth >= 1240) {
        let marginLeftSize = (screenWidth - 1240) / 2 + "px"
        websitePages.forEach(function (thatPage) {
            thatPage.style.marginLeft = marginLeftSize
        })
    }
    Page2RightMenu.style.height = pageHeight + "px"
}

async function login() {
    const username = document.getElementById("Page1InputUsername").value;
    const password = document.getElementById("Page1InputPassword").value;
    try {
        // Use the static logIn method of the Parse.User object to log in the user
        const user = await Parse.User.logIn(username, password);
        // If successful, redirect to the home page or do something else
        // console.log(`Logged in successfully as ${user.get("username")}`);
        userName = user.get("name");
        userUserName = user.get("username");
        userPassword = user.get("globalpassword");
        userLoggedIn = true;

        generateCookie("token", generateToken(), generateExpireTime())
        showPages("fromLoginPage")
        loadUserProfile()
    } catch (error) {
        userLoggedIn = false
    }
}


// For Generating Login Cookie For User
function generateCookie(name, value, expireTime) {
    if (document.cookie.indexOf(`${name}=`) === -1) {

        const CreateLoginCookieDB = Parse.Object.extend("UsersSessions");
        const createLoginCookieDB = new CreateLoginCookieDB();
        createLoginCookieDB.set("token", value)
        createLoginCookieDB.set("username", userUserName)
        createLoginCookieDB.save().then((result) => {
            document.cookie = `${name}=${value};expires=${expireTime.toUTCString()};path=/`;
        }).catch((error) => {
            console.log("Error saving user login session:", error);
        });
    }
}

function generateExpireTime() {
    const expireTime = new Date();
    expireTime.setHours(expireTime.getHours() + 24);
    return expireTime;
}

function generateToken() {
    const tokenBytes = new Uint8Array(16);
    crypto.getRandomValues(tokenBytes);
    const token = btoa(String.fromCharCode.apply(null, tokenBytes));
    return token;
}

async function autoUserLogInWithCookie() {
    // Check if the "token" cookie exists
    if (document.cookie.indexOf('token=') !== -1) {
        // Get the value of the "token" cookie
        const tokenValue = getCookie('token');

        // Query the "UsersSessions" class to find the row with the given token
        const UsersSessions = Parse.Object.extend('UsersSessions');
        const query = new Parse.Query(UsersSessions);
        query.equalTo('token', tokenValue);
        const results = await query.find();

        // If the query returns a result, use the username to find the email and password in the "User" class
        if (results.length > 0) {
            const username = results[0].get('username');
            const User = Parse.Object.extend('User');
            const userQuery = new Parse.Query(User);
            userQuery.equalTo('username', username);
            const userResults = await userQuery.find();

            // If the user is found, log in with their email and password
            if (userResults.length > 0) {
                const userusername = userResults[0].get('username');
                const password = userResults[0].get('globalpassword');
                autoLoginWithCookie(userusername, password);
            }
        }
    }
}

function getCookie(name) {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.startsWith(`${name}=`)) {
            return cookie.substring(`${name}=`.length, cookie.length);
        }
    }
    return null;
}

async function autoLoginWithCookie(userusername, password) {
    try {
        // Use the static logIn method of the Parse.User object to log in the user
        const user = await Parse.User.logIn(userusername, password);
        // If successful, redirect to the home page or do something else
        // console.log(`Logged in successfully as ${user.get("username")}`);
        userName = user.get("name");
        userUserName = user.get("username");
        userPassword = user.get("globalpassword");
        userLoggedIn = true;

        generateCookie("token", generateToken(), generateExpireTime())
        showPages("fromLoginPage")
        loadUserProfile()
    } catch (error) {
        // If unsuccessful, notify the user or do something else
        // console.log(`Error: ${error.message}`);
        userLoggedIn = false
    }
}

function showPages(wichOne) {
    if (wichOne == "fromLoginPage") {
        Page2.style.display = "block"
        Page2Middle.style.display = "block"
        Page1.style.display = "none"
        wichPageYouAreIn = "Page2Middle"
    }
    if (wichOne == "fromHomePage") {
        Page2.style.display = "none"
        Page2Middle.style.display = "none"
        Page1.style.display = "block"
        wichPageYouAreIn = "Page1"
    }
    if (wichOne == "showDevices") {
        $.querySelector(".LearnPageItem").style.display = "none"
        $.querySelector(".LearnPageItemChooseYourDevice").style.display = "block"
    }
    if (wichOne == "mobileSelected") {
        $.querySelector(".LearnPageItemChooseYourDevice").style.display = "none"
        $.querySelector(".LearnPageItemVideos").style.display = "flex"
        $.querySelector(".LearnPageItemVideosVideo").setAttribute("src", "")
    }
    if (wichOne == "pcSelected") {
        $.querySelector(".LearnPageItemChooseYourDevice").style.display = "none"
        $.querySelector(".LearnPageItemVideos").style.display = "flex"
        $.querySelector(".LearnPageItemVideosVideo").setAttribute("src", "")
    }
}



// For when click on menu items show that page //////////////////////
websitePagesMneu.forEach(function (everyMenu) {
    everyMenu.addEventListener("click", function () {
        websitePages.forEach(function (everyPage) {
            everyPage.style.display = "none"
        })
        let everyMenuSecondClass = everyMenu.classList[1]
        everyMenuSecondClass = "." + everyMenuSecondClass.substring(0, everyMenuSecondClass.length - 4);
        $.querySelector(everyMenuSecondClass).style.display = "block";

        Page2HeaderPageTitle.innerHTML = "پنل کاربری / " + everyMenu.textContent

        if (LearnPageItemChooseYourDevice.style.display != "none" || LearnPageItemVideos.style.display != "none") {
            LearnPageItemChooseYourDevice.style.display = "none"
            LearnPageItemVideos.style.display = "none"
            $.querySelector(".LearnPageItem").style.display = "flex"
        }
    })
})
/////////////////////////////////////////////////////////////////////


function logOutUser() {
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    showPages("fromHomePage")
}

async function loadUserProfile() {
    document.querySelector(".ProfilePagePersonNameInput").value = userName
    document.querySelector(".ProfilePagePersonNumberInput").value = userUserName
    document.querySelector(".ProfilePagePersonPasswordInput").value = userPassword

}

function logIranDate() {
    let today = new Date().toLocaleDateString('fa-IR');
    return convertToEnglishNumber(today);
}


// For converting persian numbers to english numbers
function convertToEnglishNumber(persianNumber) {
    const persianDigits = /[\u06F0-\u06F9]/g;
    const persianToEnglish = {
        "۰": "0",
        "۱": "1",
        "۲": "2",
        "۳": "3",
        "۴": "4",
        "۵": "5",
        "۶": "6",
        "۷": "7",
        "۸": "8",
        "۹": "9",
    };
    return persianNumber.replace(
        persianDigits,
        (match) => persianToEnglish[match]
    );
}


function logIranTime() {
    let iranTime = new Date().toLocaleTimeString('fa-IR', { timeZone: 'Asia/Tehran' });
    return convertToEnglishNumber(iranTime);
}


function sendAnnouncement(sender, announceMessage, announceid) {
    // Get the current date in the format required by Back4App
    var date = logIranDate();

    // Create a new object with the data to be saved
    var announcement = {
        sender: sender,
        date: date,
        announceMessage: announceMessage,
        announceid: announceid
    };

    // Save the object to the "Announcements" collection using the Back4App SDK
    var Announcements = Parse.Object.extend("Announcements");
    var announcementObject = new Announcements();
    announcementObject.save(announcement).then(function (response) {
        console.log('Announcement saved successfully:', response);
    }, function (error) {
        console.error('Error while saving announcement:', error);
    });
}

sendAnnouncement("پشتیبانی سامانه مدیریت کلاس", "سلام ، به سامانه مدیریت کلاس خوش آمدید!", 1)















document.addEventListener('DOMContentLoaded', changeMiddleOfThePageBoxWidth);
Page1LoginBtn.addEventListener("click", login)
document.addEventListener("DOMContentLoaded", function () {
    autoUserLogInWithCookie();
});
Page2RightMenuListItemsExit.addEventListener("click", logOutUser)
Page2HeaderIconsExit.addEventListener("click", logOutUser)
Page2HeaderIconsProfile.addEventListener("click", function () {
    $.querySelector(".ProfilePageMenu").click()
})
Page2MiddleRightTopBox.addEventListener("click", function () {
    $.querySelector(".HomeWorkPageMenu").click()
})
Page2MiddleLeftTopBox.addEventListener("click", function () {
    $.querySelector(".AnnouncementsPageMenu").click()
})
Page2MiddleBottomBoxBtn.addEventListener("click", function () {
    $.querySelector(".SupportPageMenu").click()
})



$.querySelector(".LearnPageItem").addEventListener("click", function () {
    showPages("showDevices")
})
$.querySelector(".LearnPageItemChooseYourDeviceItemsMobile").addEventListener("click", function () {
    showPages("mobileSelected")
})
$.querySelector(".LearnPageItemChooseYourDeviceItemsPC").addEventListener("click", function () {
    showPages("pcSelected")
})