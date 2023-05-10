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
let userTeacherName;
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
let uploadedlinkInput = $.querySelector(".HomeWorkPageAddNewInput")



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
        userTeacherName = user.get("userTeacherName");
        userLoggedIn = true;

        generateCookie("token", generateToken(), generateExpireTime())
        showPages("fromLoginPage")
        loadUserProfile()
        loadAnnouncements()
        loadHomeworks()
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
        loadAnnouncements()
        loadHomeworks()
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
    return convertToEnglishNumber(iranTime).substring(0, iranTime.length - 3);;
}


async function sendAnnouncement(sender, announceMessage) {
    // Get the current date in the format required by Back4App
    let date = logIranTime() + " " + logIranDate();
    let announceid = await generateNewIdForAnnouncement();

    // Create a new object with the data to be saved
    let announcement = {
        sender: sender,
        date: date,
        announceMessage: announceMessage,
        announceid: announceid
    };

    // Save the object to the "Announcements" collection using the Back4App SDK
    let Announcements = Parse.Object.extend("Announcements");
    let announcementObject = new Announcements();
    announcementObject.save(announcement).then(function (response) {
        console.log('Announcement saved successfully:', response);
    }, function (error) {
        console.error('Error while saving announcement:', error);
    });
}

// sendAnnouncement("پشتیبانی سامانه مدیریت کلاس", "سلام ، به سامانه مدیریت کلاس خوش آمدید!")

async function generateNewIdForAnnouncement() {
    // Create a new query for the "Announcements" collection
    let Announcements = Parse.Object.extend("Announcements");
    let query = new Parse.Query(Announcements);

    // Sort the query by the "announceid" field in descending order
    query.descending("announceid");

    try {
        // Execute the query and get the first result
        let result = await query.first();

        if (result) {
            // If there is at least one announcement, add 1 to the highest existing ID
            let highestId = result.get("announceid");
            return highestId + 1;
        } else {
            // If there are no announcements, return 1 as the ID for the first announcement
            return 1;
        }
    } catch (error) {
        console.error('Error while generating ID for announcement:', error);
        throw error;
    }
}


function loadAnnouncements() {
    // Create a new query for the "Announcements" collection
    let Announcements = Parse.Object.extend("Announcements");
    let query = new Parse.Query(Announcements);

    // Limit the query to the 50 most recent announcements
    query.ascending("createdAt");
    query.limit(50);

    // Execute the query and process the results
    query.find().then(function (results) {
        // Get a reference to the element where the announcements will be displayed
        let announcementList = $.querySelector(".AnnouncementsPageDiv");

        // Clear any existing announcements from the list
        announcementList.innerHTML = "";

        // Loop through the results and add each announcement to the list
        for (let i = results.length - 1; i >= 0; i--) {
            let announcement = results[i];
            let sender = announcement.get("sender");
            let date = announcement.get("date");
            let message = announcement.get("announceMessage");
            let id = announcement.get("announceid");

            announcementList.innerHTML += `
            <div class="AnnouncementsPageItemsDiv">
            <span><strong>فرستنده: </strong>
            ${sender}
            </span>
            <br>
            <span><strong>تاریخ: </strong>
            ${date}
            </span>
            <p><strong>پیام: </strong>
            ${message}
            </p>
            </div>
            `
        }
    }, function (error) {
        console.error('Error while loading announcements:', error);
    });
}







async function sendHomework(sender, homeworklink, teachername, status) {
    // Get the current date in the format required by Back4App
    let date = logIranTime() + " " + logIranDate();
    let homeworkidgenerated = await generateNewIdForHomeworks(sender)
    // Create a new object with the data to be saved
    let newHomework = {
        sender: sender,
        date: date,
        homeworklink: homeworklink,
        homeworkid: homeworkidgenerated,
        status: status,
        teachername: teachername
    };

    // Save the object to the "Announcements" collection using the Back4App SDK
    let HomeWorks = Parse.Object.extend("Homeworks");
    let homeworksObject = new HomeWorks();
    homeworksObject.save(newHomework).then(function (response) {
        console.log('Homeworks saved successfully:', response);
        loadHomeworks()
        uploadedlinkInput.value = ""
    }, function (error) {
        console.error('Error while saving Homeworks:', error);
    });
}


async function generateNewIdForHomeworks(sender) {
    let Homeworks = Parse.Object.extend("Homeworks");
    let query = new Parse.Query(Homeworks);

    // Add a constraint to only find homeworks with the specified name
    query.equalTo("sender", sender);

    // Sort the results based on the "homeworkid" field in descending order
    query.descending("homeworkid");

    // Limit the query to return at most 1 result
    query.limit(1);

    // Execute the query and process the results
    let results = await query.find();

    if (results.length > 0) {
        // If there are any results, get the ID of the first one and add 1 to it
        let lastId = results[0].get("homeworkid");
        return lastId + 1;
    } else {
        // If there are no results, return 1
        return 1;
    }
}

function loadHomeworks() {
    // Create a new query for the "Homeworks" collection
    let Homeworks = Parse.Object.extend("Homeworks");
    let query = new Parse.Query(Homeworks);

    // Limit the query to the 50 most recent Homeworks
    query.ascending("createdAt");

    // Execute the query and process the results
    query.find().then(function (results) {
        // Get a reference to the element where the Homeworks will be displayed
        let homeworksList = $.querySelector(".HomeWorkPageTable");

        // Clear any existing Homeworks from the list
        homeworksList.innerHTML = `
        <tr>
        <th></th>
        <th>لینک تکلیف</th>
        <th>زمان تحویل</th>
        <th>وضعیت</th>
        </tr>
        `

        // Loop through the results and add each Homeworks to the list
        for (let i = results.length - 1; i >= 0; i--) {
            let homeworks = results[i];
            let sender = homeworks.get("sender");
            let date = homeworks.get("date");
            let homeworklink = homeworks.get("homeworklink");
            let homeworkid = homeworks.get("homeworkid");
            let status = homeworks.get("status");
            let teachername = homeworks.get("teachername");

            if (status == "pending") {
                status = "assets/status-icons/icons8-view-more-96.png"
            } else if (status == "accepted") {
                status = "assets/status-icons/icons8-ok-96.png"
            } else if (status == "rejected") {
                status = "assets/status-icons/icons8-cancel-96.png"
            }

            homeworksList.innerHTML += `
            <tr>
            <td>#${homeworkid}</td>
            <td><a href="${homeworklink}" target="_blank">دانلود فایل</a></td>
            <td>${date}</td>
            <td><img src="${status}"></td>
            </tr>
            `
        }
    }, function (error) {
        console.error('Error while loading homeworks:', error);
    });
}








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
$.querySelector(".HomeWorkPageAddNewLearnBtn").addEventListener("click", function () {
    $.querySelector(".LearnPageMenu").click()
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

$.querySelector(".HomeWorkPageAddNewBtn").addEventListener("click", function () {

    sendHomework(userName, uploadedlinkInput.value, userTeacherName, "pending")

})