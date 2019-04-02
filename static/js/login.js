$(document).ready(function(){
    $(".login-btn").click(bindLogin)
})
function bindLogin(){
    if (checkFormData() == false){ return }
    var formData = new FormData()
    formData.append("phone", $("#phonenum").val().toString().trim())
    formData.append("password", $("#password").val())
    //
    //
    //TODO: 使用sha1加密密码
    //
    //
    // console.log(hex_sha1($("#password").val()))
    post("http://www.finalexam.cn/tasksystem/user/login", formData, "测试登录",
        function(){
            alert("登录成功！")
            console.log(document.cookie)
            // //保存cookie
            // let exp = new Date();
            // exp.setTime(exp.getTime() + 1000 * 60 * 60 * 24); //这里表示保存24小时
            // document.cookie = "music_identify=" + id + ";expires=" + exp.toGMTString();
            $(window).attr('location', 'main.html')
        }
    )
}
function checkFormData(){
    result = false
    const regular = /^[1][3,4578][0-9]{9}$/
    if ($("#phonenum").val().toString().length == 0){
        alert("请输入手机号！")
    }
    else if ($("#password").val().toString().length == 0){
        alert("请输入密码！")
    }
    else if (!regular.test($("#phonenum").val())){
        alert("手机格式错误！")
    }
    else {
        result = true
    }
    return result
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
        mimeType: "multipart/form-data",
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