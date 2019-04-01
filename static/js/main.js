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
}
function loadUserInfo(){
    post("http://www.finalexam.cn/tasksystem/user/get/info", null, "测试获取用户信息",
        function(res){
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
function refreshBind(){
    $(".task").click(bindTask)
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
    refreshBind() //重新绑定任务点击事件
    loadTaskContent(dirId, taskSle)
}
function loadTaskContent(dirId, taskSle){
    if (tasks[dirId][taskSle]["content"] == null){
        post("http://www.finalexam.cn/tasksystem/task/get/" + taskSle, null, "测试获取任务详情",
            function(res){
                tasks[dirId][taskSle]["contact"] = res.data["contact"]
                tasks[dirId][taskSle]["author"] = res.data["author"]
                tasks[dirId][taskSle]["content"] = res.data["content"]
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
}
function loadProgress(dirId){
    post("http://www.finalexam.cn/tasksystem/sub/progress/" + dirId, null, "测试获取对应培养方向的完成进度",
        function(res){
            progressList[dirId] = res.data
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
        mimeType: "multipart/form-data",
        success: function(res, textStatus, jqXHR){
            // console.log(desc + res)
            res = JSON.parse(res)
            console.log(desc, res.code, res.data)
            if(res.code == 200){
                callback(res)
            }
            else if (res.code == 202){
                alert(res.msg)
                $(window).attr('location','login.html')
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