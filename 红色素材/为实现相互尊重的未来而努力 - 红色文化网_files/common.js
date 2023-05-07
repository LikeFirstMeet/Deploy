/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
addLoadEvent(showToday);

function showToday() {
    var date = new Date();
    var weekDay = ["星期天", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var week = weekDay[date.getDay()];
    strToday = "今天是 " + year + "年" + month + "月" + day + "日 " + week;
    document.getElementById("div_today").innerHTML = strToday;

}


function addLoadEvent(func) {
    var oldOnload = window.onload;
    if (oldOnload != null) {
        window.onload = function () {
            oldOnload();
            func();
        }

    } else {
        window.onload = function () {
            func();
        }
    }
}


function setDivHeight(strLeftDivId, strRightDivId) {
    var divLeft = document.getElementById(strLeftDivId);
    var divRight = document.getElementById(strRightDivId);

    var heightLeft = divLeft.clientHeight;
    var heightRight = divRight.clientHeight;
    var ah = new Array(heightLeft, heightRight);

    ah.sort(ascOrder);

    divLeft.style.height = ah[ah.length - 1] + "px";
    divRight.style.height = ah[ah.length - 1] + "px";
}
function ascOrder(x, y) {
    if (x > y) {
        return 1;
    } else {
        return -1;
    }
}