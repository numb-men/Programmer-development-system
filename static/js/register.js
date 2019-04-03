/**
 *
 * @param $phoneInput
 * @returns {boolean}
 */
$(document).ready(function(){
    loadDirs()
})
function loadDirs(){
    post("http://www.finalexam.cn/tasksystem/dir/get", null, "测试获取培养方向",
        function(res){
            let dirs = res.data

            for (let i in dirs){
                dir = dirs[i]
                let option = '<option value="dir-' + dir["id"] + '">' + dir["name"] + '</option>'
                // console.log(dir, option)
                $("#interest").append(option)
            }
        }
    )
}
function isPoneAvailable($phoneInput) {
    const regular = /^[1][3,4578][0-9]{9}$/;
    if (!regular.test($phoneInput.val())) {
        $("#send").attr("data-target", "#phoneErrorModal");
        // console.log(false);
        return false;
    } else {
        // console.log("手机格式：" + true);
        sendSms();
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


function bindRegister() {
    if (isPasswordAvailable()) {
        if ($("#name").val() == "") {
            alert("姓名不能为空")
        }
        else if ($("#validNum").val() == ""){
            alert("请填写验证码")
        }
        else if ($("#stdNum").val() == "") {
            alert("学号不能为空")
        }
        else if ($("#email").val() == "") {
            alert("邮箱不能为空")
        }
        else if ($("#gender").val() == "unknow") {
            alert("请选择你的性别")
        }
        else if ($("#college").val() == "unknow") {
            alert("请选择你的学校")
        }
        else if ($("#interest").val() == "unknow") {
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
            console.log("短信发送成功")
            // $("#send").attr("data-target", "#phoneRightModal");
        }
    )
}

function sendInfo() {
    let dir = $("#interest").find("option:selected").text()
    // console.log(dir)
    // console.log(hex_sha1($("#password_register").val()))
    let formData = new FormData();
    formData.append("phone", $("#telephone").val().toString().trim());
    formData.append("stuid", $("#stdNum").val().toString().trim());
    formData.append("name", $("#name").val().toString().trim());
    formData.append("password", hex_sha1($("#password_register").val()));
    formData.append("sex", $("#gender").val().toString().trim());
    formData.append("birthdate", $("#birthday").val().toString().trim());
    formData.append("professional", $("#major").val().toString().trim());
    formData.append("understand", $("#known").val().toString().trim());
    formData.append("dream", $("#dream").val().toString().trim());
    formData.append("direction", dir.toString().trim());
    formData.append("code", $("#validNum").val().toString().trim());
    formData.append("email", $("#email").val().toString().trim());
    // console.log(formData.get("code"));
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
        xhrFields: { withCredentials: true },
        crossDomain: true,
        mimeType: "multipart/formData-data",
        success: function(res, textStatus, jqXHR){
            // console.log(desc + res)
            res = JSON.parse(res)
            console.log(res.code, res.data)
            if(res.code == 200){
                callback(res)
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