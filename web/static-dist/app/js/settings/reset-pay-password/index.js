webpackJsonp(["app/js/settings/reset-pay-password/index"],{0:function(e,a){e.exports=jQuery},"5d6a33c80eace135e1c4":function(e,a,s){"use strict";var r=s("b334fd7e4c5a19234db2"),n=function(e){return e&&e.__esModule?e:{default:e}}(r);$("#settings-pay-password-form").validate({currentDom:"#password-save-btn",ajax:!0,rules:{oldPayPassword:{required:!0,minlength:5,maxlength:20},newPayPassword:{required:!0,minlength:5,maxlength:20},confirmPayPassword:{required:!0,equalTo:"#form_newPayPassword"}},submitSuccess:function(e){(0,n.default)("success",Translator.trans(e.message)),$(".modal").modal("hide"),window.location.reload()},submitError:function(e){(0,n.default)("danger",Translator.trans(e.responseJSON.message))}})}},["5d6a33c80eace135e1c4"]);