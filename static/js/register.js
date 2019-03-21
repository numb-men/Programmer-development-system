/**
 *
 * @param $phoneInput
 * @returns {boolean}
 */
function isPoneAvailable($phoneInput) {
    var regular=/^[1][3,4,5,7,8][0-9]{9}$/;
    if (!regular.test($phoneInput.val())) {
        $("#send").attr("data-target","#phoneErrorModal");
        console.log(false);
        return false;
    } else {
        $("#send").attr("data-target","#phoneRightModal");
        console.log("手机格式："+true);
        ajax_sms();
        return true;
    }
}


function isPasswordAvailable() {
    return $("#password_register").val() === $("#password_confirmation").val();
}


function register_send() {
    console.log(isPasswordAvailable());
    if(isPasswordAvailable()){
        try {
            console.log(hex_sha1($("#password_register").val().toString().trim()));
            console.log($("#password_register").val().toString().trim());
            console.log($("#password_confirmation").val().toString().trim());
            console.log($("#validNum").val().toString().trim());
            console.log($("#name").val().toString().trim());
            console.log($("#stdNum").val().toString().trim());
            console.log($("#major").val().toString().trim());
            console.log($("#birthday").val().toString().trim());
            console.log($("#gender").val().toString().trim());
            console.log($("#college").val().toString().trim());
            console.log($("#interest").val().toString().trim());
            console.log($("#known").val().toString().trim());
        }catch (e) {

        }
        
    }
}

function ajax_sms() {
    let form = new FormData();
    form.append("phone", $("#telephone").val().toString().trim());

    console.log("正在向后端发送请求");
    let settings = {
        "async": true,
        "crossDomain": true,
        "url": "http://www.finalexam.cn/tasksystem/user/sms/register",
        "method": "POST",
        "headers": {
            "cache-control": "no-cache",
        },
        "processData": false,
        "contentType": false,
        "mimeType": "multipart/form-data",
        "data": form
    };

    $.ajax(settings).done(function (response) {
        console.log("短信验证接口："+response.code);
    });
}

function ajax_info() {

}