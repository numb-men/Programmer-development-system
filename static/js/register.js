/**
 *
 * @param $phoneInput
 * @returns {boolean}
 */
function isPoneAvailable($phoneInput) {
    const regular = /^[1][3,4578][0-9]{9}$/;
    if (!regular.test($phoneInput.val())) {
        $("#send").attr("data-target", "#phoneErrorModal");
        console.log(false);
        return false;
    } else {
        $("#send").attr("data-target", "#phoneRightModal");
        console.log("手机格式：" + true);
        ajax_sms();
        return true;
    }
}


function isPasswordAvailable() {
    const password = $("#password_register").val();
    if (password.toString() === "") {
        alert("密码不能为空值");
        return false;
    }
    if (password !== $("#password_confirmation").val()) {
        alert("请确认两次输入的密码一致");
        return false;
    } else {
        return true;
    }
}


function register_send() {

    if (isPasswordAvailable()) {
        if ($("#name").val() !== "") {
            if ($("#stdNum") !== "") {
                if ($("#email") !== "") {
                    if ($("#gender") !== "") {
                        if ($("#college") !== "") {
                            if ($("#interest") !== "") {
                                ajax_info();
                            } else {
                                alert("请选择你的兴趣方向");
                            }
                        } else {
                            alert("请选择你的学校");
                        }
                    } else {
                        alert("请选择你的性别");
                    }
                } else {
                    alert("邮箱不能为空");
                }
            } else {
                alert("学号不能为空");
            }
        } else {
            alert("姓名不能为空")
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
        "xhrFields": {
            "withCredentials": true
        },
        "headers": {
            "cache-control": "no-cache",
        },
        "processData": false,
        "contentType": false,
        "mimeType": "multipart/form-data",
        "data": form
    };

    $.ajax(settings).done(function (response) {
        console.log("短信验证接口：" + response);
    });
}

function ajax_info() {
    let form = new FormData();
    form.append("phone", $("#telephone").val().toString().trim());
    form.append("stuid", $("#stdNum").val().toString().trim());
    form.append("name", $("#name").val().toString().trim());
    form.append("password", $("#password_register").val());
    form.append("sex", $("#gender").val().toString().trim());
    form.append("birthdate", $("#birthday").val().toString().trim());
    form.append("professional", $("#major").val().toString().trim());
    form.append("understand", $("#known").val().toString().trim());
    form.append("dream", $("#dream").val().toString().trim());
    form.append("direction", $("#interest").val().toString().trim());
    form.append("code", $("#validNum").val().toString().trim());
    form.append("email", $("#email").val().toString().trim());

    // console.log($("#telephone").val().toString().trim());
    // console.log($("#stdNum").val().toString().trim());
    // console.log($("#name").val().toString().trim());
    // console.log($("#password_register").val().toString().trim());
    // console.log($("#gender").val().toString().trim());
    // console.log($("#birthday").val().toString().trim());
    // console.log($("#major").val().toString().trim());
    // console.log($("#known").val().toString().trim());
    // console.log($("#dream").val().toString().trim());
    // console.log($("#validNum").val().toString().trim());
    // console.log($("#email").val().toString().trim());

    let settings = {
        "async": true,
        "crossDomain": true,
        "url": "http://www.finalexam.cn/tasksystem/user/register",
        "method": "POST",
        "xhrFields": {
            "withCredentials": true
        },
        "headers": {
            "cache-control": "no-cache",
        },
        "processData": false,
        "contentType": false,
        "mimeType": "multipart/form-data",
        "data": form
    };

    $.ajax(settings).done(function (response) {
        console.log("注册接口：" + response);
        for (let i in response.data) {
            if (response.data.hasOwnProperty(i))
                console.log(i);
        }
    });
}