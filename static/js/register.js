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
        // $("#send").attr("data-target", "#phoneRightModal");
        // console.log("手机格式：" + true);
        sendSms();
        return true;
    }
}
//
//
//
//
//
//  TODO: 修改注册验证码未填写BUG
//
//
//
//
//
//
//

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


function bindRegister() {
    if (isPasswordAvailable()) {
        if ($("#name").val() == "") {
            alert("姓名不能为空")
        }
        else if ($("#stdNum") == "") {
            alert("学号不能为空")
        }
        else if ($("#email") == "") {
            alert("邮箱不能为空")
        }
        else if ($("#gender") == "") {
            alert("请选择你的性别")
        }
        else if ($("#college") == "") {
            alert("请选择你的学校")
        }
        else if ($("#interest") == "") {
            alert("请选择你的兴趣方向")
        }
        else{
            sendInfo()
        }
    }
}

function sendSms() {
    let formData = new FormData();
    formData.append("phone", $("#telephone").val().toString().trim());

    post("http://www.finalexam.cn/tasksystem/user/sms/register", formData, "测试手机验证码",
        function(){
            alert("短信已发送！请在手机上查看！")
        }
    )
}

function sendInfo() {
    let formData = new FormData();
    formData.append("phone", $("#telephone").val().toString().trim());
    formData.append("stuid", $("#stdNum").val().toString().trim());
    formData.append("name", $("#name").val().toString().trim());
    formData.append("password", $("#password_register").val());
    formData.append("sex", $("#gender").val().toString().trim());
    formData.append("birthdate", $("#birthday").val().toString().trim());
    formData.append("professional", $("#major").val().toString().trim());
    formData.append("understand", $("#known").val().toString().trim());
    formData.append("dream", $("#dream").val().toString().trim());
    formData.append("direction", $("#interest").val().toString().trim());
    formData.append("code", $("#validNum").val().toString().trim());
    formData.append("email", $("#email").val().toString().trim());

    post("http://www.finalexam.cn/tasksystem/user/register", formData, "测试注册",
        function(){
            alert("注册成功！")
            $(window).attr('location', 'login.html')
        }
    )
}

function post(url, formData, desc, callback){
    $.ajax({
        type: "POST",
        url: url,
        data: formData,
        cahce: false,
        async: true,
        processData: false,
        contentType: false,
        mimeType: "multipart/formData-data",
        success: function(res, textStatus, jqXHR){
            console.log(desc + res)
            res = JSON.parse(res)
            console.log(res.code, res.data)
            if(res.code == 200){
                callback()
            }else {
                alert(res.msg)
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown){
            reqFail()
        }
    })
}
function reqFail(){
    alert("连接服务器失败！")
}