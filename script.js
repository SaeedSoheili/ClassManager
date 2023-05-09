///////for show/hide pages /////////
const screenWidth = window.innerWidth;
const pageHeight = document.documentElement.scrollHeight;
const Page2Middle = document.querySelector(".Page2Middle")
const HomeWorkPage = document.querySelector(".HomeWorkPage")
const AnnouncementsPage = document.querySelector(".AnnouncementsPage")
const Page2RightMenu = document.querySelector(".Page2RightMenu")
const LearnPage = document.querySelector(".LearnPage")
const ProfilePage = document.querySelector(".ProfilePage")
const SupportPage = document.querySelector(".SupportPage")
////////////////////////////////////
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
let Page2RightMenuListItemsHome = $.querySelector(".Page2RightMenuListItemsHome")
let Page2RightMenuListItemsHomeworks = $.querySelector(".Page2RightMenuListItemsHomeworks")
let Page2RightMenuListItemsAnouncements = $.querySelector(".Page2RightMenuListItemsAnouncements")
let Page2RightMenuListItemsLearn = $.querySelector(".Page2RightMenuListItemsLearn")
let Page2RightMenuListItemsProfile = $.querySelector(".Page2RightMenuListItemsProfile")
let Page2RightMenuListItemsSupport = $.querySelector(".Page2RightMenuListItemsSupport")
let Page2RightMenuListItemsExit = $.querySelector(".Page2RightMenuListItemsExit")





//////// for responsive the middle of the page with big screen sizes ///////////////
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
}







document.addEventListener('DOMContentLoaded', changeMiddleOfThePageBoxWidth);
Page1LoginBtn.addEventListener("click", login)
document.addEventListener("DOMContentLoaded", function () {
    autoUserLogInWithCookie();
});
