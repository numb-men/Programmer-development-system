var dirs = null //培养方向
var tasks = null //任务列表
var tasksSle = null //对应培养方案的任务列表的当前选择列表
var dirSle = 1  //当前选择的培养方向
const defaultDir = 1 //初始加载时选择的培养方向
const defaultSle = 0 //初始选择为0，即第一个任务
const statusDict = { "-1": "lock", "0": "time", "1": "complete"}

$(document).ready(function(){
    init()
})
function init(){
    loadUserInfo()
    loadDirs()
    bindSleDir()
    bindTaskList()
    bindSubmitTask()
    bindSubmitOk()
}
function bindSubmitOk(){
    $(".submit-ok").click(function(){
        if (!checkUrl($("#blogUrl").val())){
            alert("博客文章地址有误，请重新输入！")
        }
        else if (!checkUrl($("#githubUrl").val())){
            alert("github仓库地址有误，请重新输入！")
        }
        else{
            taskid = tasks[dirSle][tasksSle[dirSle]]["id"]
            var formData = new FormData()
            formData.append("dirid", dirSle.toString())
            formData.append("taskid", taskid.toString())
            formData.append("blog", $("#blogUrl").val().toString().trim())
            formData.append("github", $("#githubUrl").val().toString().trim())
            console.log(formData, dirSle, taskid,
                        $("#blogUrl").val(), $("#githubUrl").val())
            console.log(formData.get("dirid"), formData.get("taskid"), formData.get("blog"), formData.get("github"))
            post("http://www.finalexam.cn/tasksystem/sub/commit", formData, "测试提交任务",
                function(res){
                    if (res.code == 200){
                        $(".submit-task-box").toggleClass("show unshow")
                        alert("真棒啊，看来你已经完成这次任务了呢！\r\n那么，请耐心等待管理员的审核，"
                            + "审核结果会以邮件通知.\r\n审核通过后系统会自动开启下一个任务.\r\n加油喔~ ( ˘ ³˘)♥")
                    }
                }
            )
        }
    })
}
function bindSubmitTask(){
    $(".submit-task").click(function(){
        $(".submit-task-box").toggleClass("show unshow")
    })
}
function loadUserInfo(){
    post("http://www.finalexam.cn/tasksystem/user/get/info", null, "测试获取用户信息",
        function(res){
            //
            //
            // TODO:由用户的方向设置初始的Dir
            //
            //
            //
            //
            $(".nickname").append(res.data["name"])
        }
    )
}
function bindSleDir(){
    $(".category").change(function(){
        console.log($(this).val())
        dirSle = parseInt($(this).val().split('-')[1])
        loadTasks(dirSle)
    })
}
function bindTaskList(){
    $(".task").click(bindTask)
}
function bindTask(){
    let taskSle = parseInt($(this).attr("id").split('-')[1])
    console.log('click task', taskSle)
    if (tasks[dirSle][taskSle]["status"] >= 0){
        $(".task-sle").click(bindTask)
        $(".task-sle").toggleClass("task-sle task")
        $(this).toggleClass("task task-sle")
        loadTaskContent(dirSle, taskSle)
    } else{
        alert("先完成低级别的任务之后才能解锁高级别的任务")
    }
}
function loadDirs(){
    post("http://www.finalexam.cn/tasksystem/dir/get", null, "测试获取培养方向",
        function(res){
            dirs = res.data
            for (let i in dirs){
                dir = dirs[i]
                let option = '<option value="dir-' + dir["id"] + '">' + dir["name"] + '</option>'
                // console.log(dir, option)
                $(".category").append(option)
            }
            tasks = new Array(dirs.length)
            tasksSle = new Array(dirs.length)
            for (let i = 0; i < dirs.length; i++){
                tasksSle[i] = defaultSle
            }
            loadTasks(defaultDir)
        }
    )
}
function loadTasks(dirId){
    if (!tasks[dirId]){
        post("http://www.finalexam.cn/tasksystem/task/get/" + dirId, null, "测试获取对应培养方向的任务列表",
            function(res){
                //
                //
                //TODO: 按任务level排序tasks
                //      存取stasus
                //
                //
                tasks[dirId] = res.data
                for (let i in tasks[dirId]){
                    tasks[dirId][i]["status"] = -1 // 默认任务为未完成
                    tasks[dirId][i]["content"] = null // 设置内容为空
                }
                // loadProgress(defaultDir)
                renderTasks(dirId)
            }
        )
    }
    else {
        renderTasks(dirId)
    }
}
function renderTasks(dirId){
    $(".tasks").empty()
    // console.log(tasksSle)
    let tasksList = tasks[dirId]
    let taskSle = tasksSle[dirId]
    // ********** 测试使用，模拟已完成和待完成的情况
    tasksList[0]["status"] = 1
    tasksList[1]["status"] = 0
    // **********
    for (let i in tasksList){
        task = tasksList[i]
        let icon = statusDict[task["status"].toString()]
        task = '<div class="' + (taskSle == i ? "task-sle":"task") + '"\
                     id="task-'+ i +'">\
                    <div class="task-name">' + task["title"] + '</div>\
                    <img src="static/img/' + icon + '.png" class="task-icon">\
                </div>'
        // console.log(task)
        $(".tasks").append(task)
    }
    bindTaskList() //重新绑定任务点击事件
    loadTaskContent(dirId, taskSle)
}
function loadTaskContent(dirId, taskSle){
    if (tasks[dirId][taskSle]["content"] == null){
        taskid = tasks[dirId][taskSle]["id"]
        console.log(taskid)
        post("http://www.finalexam.cn/tasksystem/task/get/detial/" + taskid, null, "测试获取任务详情",
            function(res){
                tasks[dirId][taskSle]["contact"] = res.data["contact"]
                tasks[dirId][taskSle]["author"] = res.data["author"]
                tasks[dirId][taskSle]["content"] = res.data["content"]
                console.log(tasks[dirId][taskSle])
                renderTaskContent(tasks[dirId][taskSle])
            }
        )
    }
    else {
        renderTaskContent(tasks[dirId][taskSle])
    }
}
function renderTaskContent(task){
    // 渲染任务详情
    $(".right-content").empty()
    taskContent =  '' +
        '<div class="task-title">' + task["title"] + '</div>\
         <p>\
             <b class="author">' + task["author"] + '</b>\
             <b class="update-time">更新于 ' + task["date"] + '</b>\
         </p>\
         <div class="dv-line"></div>\
         <div class="task-content">' + task["content"] + '</div>\
         <div class="submit-task">提交任务</div>'

    $(".right-content").append(taskContent)
    bindSubmitTask()
}
function loadProgress(dirId){
    post("http://www.finalexam.cn/tasksystem/sub/progress/" + dirId, null, "测试获取对应培养方向的完成进度",
        function(res){
            progressList[dirId] = res.data
        }
    )
}
function checkUrl(url){
    var regexp = /((http|https):\/\/([\w\-]+\.)+[\w\-]+(\/[\w\u4e00-\u9fa5\-\.\/?\@\%\!\&=\+\~\:\#\;\,]*)?)/
    var url = url.match(regexp);
    if (url && typeof(url) != "undefined" && url != 0){
        return true
    }
    return false
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
            console.log(desc, res.code, res.data)
            if(res.code == 200){
                callback(res)
            }
            else if (res.code == 202){
                alert(res.msg)
                // $(window).attr('location','login.html')
            }
            else{
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