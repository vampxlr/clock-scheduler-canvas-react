import _$ from 'jquery'
import jsdom from 'jsdom'
import jsdomify from 'jsdomify';


// Config ************************************
global.__username = "weekplan.test"
global.__password = "kothin007"
global.__asyncdelay = 10000
global.__asyncSkip = false
// Config ************************************





console.log("Global Configurations:")
console.log("Hint: You can change these settings from app_builder/global.js")
console.log("Test Username: "+ global.__username)
console.log("Test Password: "+ global.__password)
console.log("Delay between asynchronous requests : "+ global.__asyncdelay+ " ms")
console.log("Skip asynchronous requests : "+ global.__asyncSkip)
global.location = {}
global.location.hostname = 'localhost'
global.document = jsdom.jsdom('<!doctype html><html><body><div id="app"></div></body></html>');

global.window = document.defaultView;


global._$ = _$
global.$ = _$(window)
global.navigator = window.navigator;
global.window.location.hostname='localhost'
global.chrome = require('sinon-chrome');
global.environment='test'



//enables jquery http requests from node console and cookie management--------------
var XMLHttpRequest = require('./xhr').XMLHttpRequest;
global.ajax = function (request_type,url,data,content_type, complete) {
    data = $.param(data)
    var xhr = new XMLHttpRequest();
    xhr.debug = true;
    xhr.onreadystatechange = function() {
     if (xhr.readyState === 4) {
            complete(xhr);
        }
    };
    xhr.open(request_type, url, true);
    xhr.setRequestHeader("Content-Type", content_type);
    xhr.send(data);
};
var dataToSend = { EmailAddress: __username, Password: __password }
var content_type="application/x-www-form-urlencoded; charset=UTF-8"
var request_type = "POST"
var url = "https://api.weekplan.net/v2/sessions"
ajax(request_type,url,dataToSend,content_type,function (xhr) {
    var cookie = xhr.getResponseHeader("Set-Cookie")
    cookie = JSON.stringify(cookie)
    cookie = cookie.substring(1, cookie.length-1);
    cookie = cookie.replace(/['"]+/g, ' ');
    cookie = cookie.replace(/[,]+/g, ';');
    global.cookie = cookie
    $.support.cors = true;
    $.ajaxSettings.xhr = function() {
        try {return new XMLHttpRequest();
        } catch ( e ) {}
        console.log(e)
    };
});
//enables jquery http requests from node console and cookie management--------------





global.__check = function check( done, f ) {
    try {
        f()
        done()
    } catch( e ) {
        done( e )
    }
}





