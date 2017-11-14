webpackJsonp(["app/js/review/list/index"],{0:function(t,e){t.exports=jQuery},"29cf60bbbbb4e174f0f6":function(t,e,n){"use strict";function r(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(e,"__esModule",{value:!0});var o=function(){function t(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}return function(e,n,r){return n&&t(e.prototype,n),r&&t(e,r),e}}(),a=n("b334fd7e4c5a19234db2"),s=function(t){return t&&t.__esModule?t:{default:t}}(a),i=function(){function t(e){r(this,t),this.ele=$(e.element),this.init()}return o(t,[{key:"init",value:function(){this.initEvent(),$("[name=access-intercept-check]").length>0&&$.get($("[name=access-intercept-check]").val(),function(t){t||$(".access-intercept-modal").modal("show")},"json"),this.initPostForm()}},{key:"initEvent",value:function(){var t=this,e=this.ele;e.on("click",".js-post-more",function(e){return t.onClickPostMore(e)}),e.on("click",".js-reply",function(e){return t.onClickReply(e)}),e.on("click",".js-post-delete",function(e){return t.onPostDelete(e)}),e.on("click",".js-post-up",function(e){return t.onPostUp(e)}),e.on("click","[data-role=confirm-btn]",function(e){return t.onConfirmBtn(e)}),e.on("click",".js-toggle-subpost-form",function(e){return t.onClickToggleSubpostForm(e)}),e.on("click",".js-event-cancel",function(e){return t.onClickEventCancelBtn(e)}),e.on("click",".thread-subpost-container .pagination a",function(e){return t.onClickSubpost(e)})}},{key:"onClickPostMore",value:function(t){t.stopPropagation();var e=$(t.currentTarget);e.parents(".thread-subpost-moretext").addClass("hide"),e.parents(".thread-post").find(".thread-subpost").removeClass("hide"),e.parents(".thread-post").find(".pagination").removeClass("hide")}},{key:"onClickReply",value:function(t){t.stopPropagation();var e=$(t.currentTarget),n=e.parents(".thread-subpost-list").length>0,r=e.parents(".thread-post").find(".thread-subpost-container"),o=r.find(".thread-subpost-form");if(n){o.removeClass("hide");var a=Translator.trans("thread.post.reply")+" @ "+e.parents(".thread-post").data("authorName")+"： ";o.find("textarea").val(a).trigger("focus")}else r.toggleClass("hide");e.html()==Translator.trans("thread.post.reply")?e.html(Translator.trans("thread.post.put_away")):e.html(Translator.trans("thread.post.reply")),this.initSubpostForm(o)}},{key:"onPostDelete",value:function(t){t.stopPropagation();var e=this.ele,n=$(t.currentTarget);if(confirm(Translator.trans("thread.post.delete_hint"))){var r=n.parents(".thread-subpost-list").length>0;$.post(n.data("url"),function(){if(r){var t=n.parents(".thread-post").find(".subposts-num");t.text(parseInt(t.text())-1)}else e.find(".thread-post-num").text(parseInt(e.find(".thread-post-num").text())-1);$(n.data("for")).remove()})}}},{key:"onPostUp",value:function(t){t.stopPropagation();var e=$(t.currentTarget);$.post(e.data("url"),function(t){"ok"==t.status?e.find(".post-up-num").text(parseInt(e.find(".post-up-num").text())+1):"votedError"==t.status?(0,s.default)("danger",Translator.trans("thread.post.like_hint")):(0,s.default)("danger",Translator.trans("thread.post.like_error_hint"))},"json")}},{key:"onConfirmBtn",value:function(t){t.stopPropagation();var e=$(t.currentTarget);confirm(e.data("confirmMessage"))&&$.post(e.data("url"),function(){if(e.data("afterUrl"))return void(window.location.href=e.data("afterUrl"));window.location.reload()})}},{key:"onClickToggleSubpostForm",value:function(t){t.stopPropagation();var e=$(t.currentTarget),n=e.parents(".thread-subpost-container").find(".thread-subpost-form");n.toggleClass("hide"),this.initSubpostForm(n)}},{key:"onClickEventCancelBtn",value:function(t){$.post($(t.currentTarget).data("url"),function(t){window.location.reload()})}},{key:"onClickSubpost",value:function(t){t.preventDefault();var e=$(t.currentTarget);$.post(e.attr("href"),function(t){var n=e.parents(".thread-post").attr("id");$("body,html").animate({scrollTop:$("#"+n).offset().top},300),e.closest(".thread-subpost-container .thread-subpost-content").html(t)})}},{key:"initPostForm",value:function(){var t=$(".thread-pripost-list"),e=$("#thread-post-form");if(0!=e.length){var n=null,r=e.find("textarea[name=content]");r.data("imageUploadUrl")&&(n=CKEDITOR.replace(r.attr("id"),{toolbar:"Thread",filebrowserImageUploadUrl:r.data("imageUploadUrl")}),n.on("change",function(){r.val(n.getData())}));var o=e.find("[type=submit]");e.validate({ajax:!0,currentDom:o,rules:{content:"required"},submitSuccess:function(a){o.button("reset"),r.data("imageUploadUrl")?(t.append(a),n.setData("")):(t.prepend(a),r.val(""));var s=t.find("li:last-child").offset();$("body").scrollTop(s.top),e.find(".thread-post-num").text(parseInt(e.find(".thread-post-num").text())+1),t.find("li.empty").remove(),t.closest(".top-reply").removeClass("hidden"),$(".js-attachment-list").empty(),$(".js-attachment-ids").val(""),$(".js-upload-file").show()},submitError:function(t){o.button("reset"),t=$.parseJSON(t.responseText),t.error?(0,s.default)("danger",t.error.message):(0,s.default)("danger",Translator.trans("thread.post.reply_error_hint"))}})}}},{key:"initSubpostForm",value:function(t){var e=t.find("[type=submit]");t.validate({ajax:!0,currentDom:e,rules:{content:"required"},submitSuccess:function(n){if(n.error)return void(0,s.default)("danger",n.error);e.button("reset"),t.parents(".thread-subpost-container").find(".thread-subpost-list").append(n),t.find("textarea").val("");var r=t.parents(".thread-post").find(".subposts-num");r.text(parseInt(r.text())+1),r.parent().removeClass("hide")},submitError:function(t){e.button("reset"),t=$.parseJSON(t.responseText),t.error?(0,s.default)("danger",t.error.message):(0,s.default)("danger",Translator.trans("thread.post.reply_error_hint"))}})}},{key:"undelegateEvents",value:function(t,e){this.ele.off(t,e)}}]),t}();e.default=i},"3b07a1d68c954db2a6b9":function(t,e,n){"use strict";function r(t){return t&&t.__esModule?t:{default:t}}var o=n("b334fd7e4c5a19234db2"),a=(r(o),n("29cf60bbbbb4e174f0f6")),s=r(a),i=$("#review-form"),l=i.validate({rules:{rating:{required:!0,raty_star:!0},content:{required:!0}},messages:{rating:{required:Translator.trans("course.marking_hint")}}});i.length>0&&(i.find(".rating-btn").raty({path:i.find(".rating-btn").data("imgPath"),hints:[Translator.trans("course.marking_one_star"),Translator.trans("course.marking_two_star"),Translator.trans("course.marking_three_star"),Translator.trans("course.marking_four_star"),Translator.trans("course.marking_five_star")],score:function(){return $(this).attr("data-rating")},click:function(t,e){i.find("[name=rating]").val(t)}}),i.find(".js-btn-save").on("click",function(){l.form()&&(i.find(".js-btn-save").button("loading"),$.post(i.attr("action"),i.serialize(),function(t){i.find(".js-review-remind").fadeIn("fast",function(){window.location.reload()})},"json"))}),$(".js-hide-review-form").on("click",function(){$(this).hide(),$(".js-show-review-form").show(),i.hide()}),$(".js-show-review-form").on("click",function(){$(this).hide(),$(".js-hide-review-form").show(),i.show()}));var u=$(".js-reviews");if($(".js-reviews").hover(function(){$(this).find(".full-content").text().length>100&&0==$(this).find(".short-content").is(":hidden")?$(this).find(".show-full-btn").show():$(this).find(".show-full-btn").hide()}),u.on("click",".show-full-btn",function(){var t=$(this).parents(".media");t.find(".short-content").slideUp("fast",function(){t.find(".full-content").slideDown("fast")}),$(this).hide(),t.find(".show-short-btn").show()}),u.on("click",".show-short-btn",function(){var t=$(this).parents(".media");t.find(".full-content").slideUp("fast",function(){t.find(".short-content").slideDown("fast")}),$(this).hide(),t.find(".show-full-btn").show()}),$(".js-reviews").length>0){var d=new s.default({element:".js-reviews"});d.undelegateEvents(".js-toggle-subpost-form","click"),$(".js-toggle-subpost-form").click(function(t){if(t.stopPropagation(),$(this).closest(".thread-subpost-container").find(".thread-subpost-content .thread-subpost-list .thread-subpost").length>=5)return void Notify.danger("course.manage.post_limit_hint");var e=$(this).parents(".thread-subpost-container").find(".thread-subpost-form");e.toggleClass("hide"),d._initSubpostForm(e)})}}},["3b07a1d68c954db2a6b9"]);