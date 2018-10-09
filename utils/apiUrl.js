var e = "https://qu.xinli001.com", t = "/lingxi/fun";

module.exports = {
    root: e,
    cpRoot: "https://cp" + e.match(/\/\/\w*(.*?)(?=\.)/)[1] + ".xinli001.com",
    version: "" + e + t + "/version",
    homePage: "" + e + t + "/getIndexData",
    category: "" + e + t + "/getCategory",
    detail: "" + e + t + "/getDetail",
    recommend: "" + e + t + "/getRecommends",
    search: "" + e + t + "/search",
    recommendsSearch: "" + e + t + "/recommendsSearch",
    getMyScale: "" + e + t + "/getMyScales",
    question: "" + e + t + "/getQuestionsOptions",
    sendAnswer: "" + e + t + "/postOptions",
    getResult: "" + e + t + "/getResult",
    getSessionKey: "" + e + t + "/miniApp/getSessionKey",
    saveUserInfo: "" + e + t + "/miniApp/saveUserInfo"
};