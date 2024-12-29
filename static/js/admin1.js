/*
let billP, flightP, seatP

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}


const csrftoken = getCookie('csrftoken');


function logout() {
    window.location.href = '/logout'
}


function changepwd() {
    let mBody = document.getElementById("mBody")
    document.getElementById("mTitle").innerHTML = "密码修改结果"
    if (document.getElementById('pwd0I').value === '') {
        mBody.innerHTML = "原密码不得为空"
        return
    }
    if (document.getElementById('pwdI').value === '') {
        mBody.innerHTML = "新密码不得为空 "
        return
    } else if (document.getElementById('pwdI').value.length < 8) {
        mBody.innerHTML = "密码要求8~40位"
        return
    } else {
        let passwd = document.getElementById('pwdI').value
        let letter = false, number = false
        for (let i = 0; i < passwd.length; i++) {
            if (letter && number) break
            if (!isNaN(Number(passwd[i])))
                number = true
            else if (passwd[i] >= 'a' && passwd[i] <= 'z' || passwd[i] >= 'A' && passwd[i] <= 'Z')
                letter = true
        }
        if (letter && number)
            mBody.innerHTML = ""
        else {
            mBody.innerHTML = "需要包含字母和数字两种字符"
            return
        }
    }
    if (document.getElementById('pwd2I').value !== document.getElementById('pwdI').value) {
        mBody.innerHTML = "两次密码输入不同"
        return
    }
    let xhttp = new XMLHttpRequest()
    xhttp.open('POST', '/post_changepwd')
    xhttp.setRequestHeader("opwd", document.getElementById('pwd0I').value)
    xhttp.setRequestHeader("npwd", document.getElementById('pwdI').value)
    xhttp.setRequestHeader("X-CSRFToken", csrftoken);
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState === 4 && xhttp.status === 200) {
            if (xhttp.responseText === '')
                mBody.innerHTML = "密码修改成功"
            else mBody.innerHTML = xhttp.responseText
        }
    }
    xhttp.send()

}


function flight_print() {
    let xhttp = new XMLHttpRequest()
    xhttp.open('POST', '/flight_print')
    xhttp.setRequestHeader("X-CSRFToken", csrftoken);
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState === 4 && xhttp.status === 200) {
            flightP = xhttp.responseText.split(';')
            document.getElementById("tt3").innerHTML = ""
            if (document.getElementById("flightI") != null)
                document.getElementById("flightI").remove()
            if (flightP.length <= 1) {
                let tag = "<div id='flightI' class=' p-5 m-5 fs-3 text-center'>未搜索到航班信息</div>"
                document.getElementById("flightForm").insertAdjacentHTML("beforeend", tag)
            } else {
                for (let i = 0; i < flightP.length / 5; i++) {
                    let tag = "<tr style='line-height:36px' ><td>" + flightP[5 * i] + "</td><td>" + flightP[5 * i + 1] +
                        "</td><td>" + flightP[5 * i + 2] + "</td><td>" + flightP[5 * i + 3] + "</td><td>" + flightP[5 * i + 4] +
                        "</td><td><button class='btn btn-primary me-2' data-bs-toggle='modal' data-bs-target='#flightM' " +
                        "onclick='seat_print(" + i + ")' >详情</button><button class='btn btn-warning me-2' data-bs-toggle='modal' " +
                        "data-bs-target='#flightM3' onclick='change_flight(" + i + ")' >修改</button><button class='btn btn-danger' " +
                        "onclick='del_flight(" + i + ")' data-bs-toggle='modal' data-bs-target='#Modal' >删除</button></td></tr>"
                    document.getElementById("tt3").insertAdjacentHTML("beforeend", tag)
                }
            }
        }
    }
    xhttp.send()
}


function seat_print(index) {
    document.getElementById("mTitle2").innerHTML = "航班" + flightP[5 * index] + "详情"
    document.getElementById("tt5").innerHTML = "<tr><th>航班号</th><th>舱位类型</th><th>票价</th><th>总座位数</th><th>剩余座位数</th></tr>"
    document.getElementById("tt4").innerHTML = ""
    let xhttp = new XMLHttpRequest()
    xhttp.open('POST', '/seat_print')
    xhttp.setRequestHeader("flight", flightP[5 * index])
    xhttp.setRequestHeader("X-CSRFToken", csrftoken)
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState === 4 && xhttp.status === 200) {
            seatP = xhttp.responseText.split(';')
            if (document.getElementById("mI2") != null)
                document.getElementById("mI2").remove()
            if (seatP.length <= 1) {
                let tag = "<div id='mI2' class=' p-5 m-5 fs-3 text-center'>未搜索到座位信息</div>"
                document.getElementById("mBody2").insertAdjacentHTML("beforeend", tag)
            } else {
                for (let i = 0; i < seatP.length / 4; i++) {
                    let tag = "<tr style='line-height:36px' ><td>" + flightP[5 * index] + "</td><td>" +
                        seatP[4 * i] + "</td><td>" + seatP[4 * i + 1] + "</td><td>" + seatP[4 * i + 2] + "</td><td>" + seatP[4 * i + 3] + "</td>"
                    document.getElementById("tt4").insertAdjacentHTML("beforeend", tag)
                }
            }
        }
    }
    xhttp.send()
}


function change_flight(index) {
    document.getElementById("flight3I").value = flightP[5 * index]
    document.getElementById("flight3I2").value = flightP[5 * index + 1]
    document.getElementById("flight3I2").placeholder = flightP[5 * index + 1]
    document.getElementById("flight3I3").value = flightP[5 * index + 2]
    document.getElementById("flight3I3").placeholder = flightP[5 * index + 2]
    document.getElementById("flight3I4").value = flightP[5 * index + 3].split(' ')[0]
    document.getElementById("flight3I5").value = flightP[5 * index + 3].split(' ')[1]
    document.getElementById("flight3I6").value = flightP[5 * index + 4].split(' ')[0]
    document.getElementById("flight3I7").value = flightP[5 * index + 4].split(' ')[1]
    document.getElementById("chflf").classList.remove("hide")
    seatP = null
    seat_print(index)
    let wait = setInterval(() => {
        if (seatP != null) {
            let target = document.getElementById("mBody3").getElementsByTagName("td")
            for (let i = 0; i < 3; i++) {
                if (seatP[4 * i] === "头等舱") {
                    target[1].innerHTML = seatP[4 * i + 1]
                    target[5].innerHTML = seatP[4 * i + 2]
                    target[9].innerHTML = seatP[4 * i + 3]
                } else if (seatP[4 * i] === "商务舱") {
                    target[2].innerHTML = seatP[4 * i + 1]
                    target[6].innerHTML = seatP[4 * i + 2]
                    target[10].innerHTML = seatP[4 * i + 3]
                } else {
                    target[3].innerHTML = seatP[4 * i + 1]
                    target[7].innerHTML = seatP[4 * i + 2]
                    target[11].innerHTML = seatP[4 * i + 3]
                }
            }
            clearInterval(wait)
        }
    }, 50)

}


function change_flight2() {
    let flag = false
    if (document.getElementById("flight3I").value === "")
        flag = true
    else if (document.getElementById("flight3I2").value === "")
        flag = true
    else if (document.getElementById("flight3I3").value === "")
        flag = true
    else if (document.getElementById("flight3I4").value === "")
        flag = true
    else if (document.getElementById("flight3I5").value === "")
        flag = true
    else if (document.getElementById("flight3I6").value === "")
        flag = true
    else if (document.getElementById("flight3I7").value === "")
        flag = true
    let target = document.getElementById("mBody3").getElementsByTagName("td")
    for (let i = 0; i < target.length; i++) {
        if (target[i].innerHTML === "")
            flag = true
    }
    if (flag) {
        setTimeout(() => {
            let tag = "<div class='alert fade show alert-danger alert-dismissible' ><button type='button' class='btn-close'" +
                " data-bs-dismiss='alert'></button><strong>修改失败，有内容为空！</strong></div>"
            document.getElementById("flightForm").insertAdjacentHTML('beforebegin', tag)
        }, 400)
        return
    }
    for (let i = 0; i < 3; i++) {
        if (target[9 + i] > target[5 + i]) {
            setTimeout(() => {
                let tag = "<div class='alert fade show alert-danger alert-dismissible' ><button type='button' class='btn-close'" +
                    " data-bs-dismiss='alert'></button><strong>修改失败，剩余座位数不得少于总座位数！</strong></div>"
                document.getElementById("flightForm").insertAdjacentHTML('beforebegin', tag)
            }, 400)
            return
        }
    }
    if (document.getElementById("flight3I6").value < document.getElementById("flight3I4").value) {
        setTimeout(() => {
            let tag = "<div class='alert fade show alert-danger alert-dismissible' ><button type='button' class='btn-close'" +
                " data-bs-dismiss='alert'></button><strong>修改失败，抵达时间不得早于起飞时间！</strong></div>"
            document.getElementById("flightForm").insertAdjacentHTML('beforebegin', tag)
        }, 400)
        return
    } else if (document.getElementById("flight3I6").value === document.getElementById("flight3I4").value) {
        if (document.getElementById("flight3I7").value < document.getElementById("flight3I5").value) {
            setTimeout(() => {
                let tag = "<div class='alert fade show alert-danger alert-dismissible' ><button type='button' class='btn-close'" +
                    " data-bs-dismiss='alert'></button><strong>修改失败，抵达时间不得早于起飞时间！</strong></div>"
                document.getElementById("flightForm").insertAdjacentHTML('beforebegin', tag)
            }, 400)
            return
        }
    }

    let xhttp = new XMLHttpRequest()
    xhttp.open('POST', '/change_flight')
    let msg = document.getElementById("flight3I").value
    for (let i = 2; i <= 7; i++) {
        msg += ";" + document.getElementById("flight3I" + i).value
    }
    for (let i = 1; i < 12; i++) {
        if (i % 4 === 0) continue
        msg += ';' + target[i].innerHTML
    }
    console.info(encodeURIComponent(msg))
    xhttp.setRequestHeader("msg", encodeURIComponent(msg))
    xhttp.setRequestHeader("X-CSRFToken", csrftoken)
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState === 4 && xhttp.status === 200) {
            document.getElementById("mTitle").innerHTML = '航班修改结果'
            if (xhttp.responseText === "") {
                setTimeout(() => {
                    let tag = "<div class='alert fade show alert-success alert-dismissible' ><button type='button' class='btn-close'" +
                        " data-bs-dismiss='alert'></button><strong>航班修改成功，立即刷新界面更新内容！</strong></div>"
                    document.getElementById("flightForm").insertAdjacentHTML('beforebegin', tag)
                }, 200)
            } else {
                setTimeout(() => {
                    let tag = "<div class='alert fade show alert-danger alert-dismissible' ><button type='button' class='btn-close'" +
                        " data-bs-dismiss='alert'></button><strong>修改失败，" + xhttp.responseText + "</strong></div>"
                    document.getElementById("flightForm").insertAdjacentHTML('beforebegin', tag)
                }, 200)
            }
        }
    }
    xhttp.send()
}


function del_flight(index) {
    let xhttp = new XMLHttpRequest()
    xhttp.open('POST', '/del_flight')
    xhttp.setRequestHeader("flight", flightP[5 * index])
    xhttp.setRequestHeader("X-CSRFToken", csrftoken)
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState === 4 && xhttp.status === 200) {
            let mBody = document.getElementById("mBody")
            document.getElementById("mTitle").innerHTML = '航班删除结果'
            if (xhttp.responseText === "")
                mBody.innerHTML = "航班删除成功"
            else mBody.innerHTML = xhttp.responseText
        }
    }
    xhttp.send()
}


function add_flight() {
    document.getElementById("mTitle").innerHTML = "航班添加结果"
    let flag = false
    if (document.getElementById("addFlightI").value === "")
        flag = true
    else if (document.getElementById("addFlightI2").value === "")
        flag = true
    else if (document.getElementById("addFlightI3").value === "")
        flag = true
    else if (document.getElementById("addFlightI4").value === "")
        flag = true
    else if (document.getElementById("addFlightI5").value === "")
        flag = true
    else if (document.getElementById("addFlightI6").value === "")
        flag = true
    else if (document.getElementById("addFlightI7").value === "")
        flag = true
    let target = document.getElementById("chflw").getElementsByTagName("td")
    for (let i = 0; i < target.length; i++) {
        if (target[i].innerHTML === "") {
            flag = true
            break
        }
    }
    if (flag) {
        document.getElementById("mBody").innerHTML = "添加失败，有内容为空！"
        return
    }
    for (let i = 0; i < 3; i++) {
        if (target[9 + i] > target[5 + i]) {
            document.getElementById("mBody").innerHTML = "添加失败，剩余座位数不得多于总座位数！"
            return
        }
    }
    if (document.getElementById("flight3I6").value < document.getElementById("flight3I4").value) {
        document.getElementById("mBody").innerHTML = "添加失败，抵达时间不得早于起飞时间！"
        return
    } else if (document.getElementById("flight3I6").value === document.getElementById("flight3I4").value) {
        if (document.getElementById("flight3I7").value < document.getElementById("flight3I5").value) {
            document.getElementById("mBody").innerHTML = "添加失败，抵达时间不得早于起飞时间！"
            return
        }
    }

    let xhttp = new XMLHttpRequest()
    xhttp.open('POST', '/add_flight')
    let msg = document.getElementById("addFlightI").value
    for (let i = 2; i <= 7; i++) {
        msg += ";" + document.getElementById("addFlightI" + i).value
    }
    for (let i = 1; i < 12; i++) {
        if (i % 4 === 0) continue
        msg += ';' + target[i].innerHTML
    }
    console.info(encodeURIComponent(msg))
    xhttp.setRequestHeader("msg", encodeURIComponent(msg))
    xhttp.setRequestHeader("X-CSRFToken", csrftoken)
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState === 4 && xhttp.status === 200) {
            let mBody = document.getElementById("mBody")
            if (xhttp.responseText === "") {
                document.getElementById("mBody").innerHTML = "航班添加成功！"
            } else {
                document.getElementById("mBody").innerHTML = xhttp.responseText
            }
        }
    }
    xhttp.send()
}


function checkNumber(code) {
    return code <= 105 && code >= 96 || code === 8 || code >= 48 && code <= 57;
}


function check() {
    document.getElementById("mTitle").innerHTML = "管理员注册结果"
    let mBody = document.getElementById("mBody")
    if (document.getElementById('anameI').value === '') {
        mBody.innerHTML = "用户名不得为空"
        return
    } else if (document.getElementById('anameI').value.length < 2) {
        mBody.innerHTML = "用户名要求2~40位"
        return
    }
    if (document.getElementById('apwdI').value === '') {
        mBody.innerHTML = "密码不得为空"
        return
    } else if (document.getElementById('apwdI').value.length < 8) {
        mBody.innerHTML = "密码要求8~40位"
        return
    } else {
        let passwd = document.getElementById('apwdI').value
        let letter = false, number = false
        for (let i = 0; i < passwd.length; i++) {
            if (letter && number) break
            if (!isNaN(Number(passwd[i])))
                number = true
            else if (passwd[i] >= 'a' && passwd[i] <= 'z' || passwd[i] >= 'A' && passwd[i] <= 'Z')
                letter = true
        }
        if (!letter || !number) {
            mBody.innerHTML = "需要包含字母和数字两种字符"
            return
        }
    }
    if (document.getElementById('apwd2I').value !== document.getElementById('apwdI').value) {
        mBody.innerHTML = "两次密码输入不同"
        return
    }
    let xhttp = new XMLHttpRequest()
    xhttp.open('POST', '/post_registerA')
    xhttp.setRequestHeader("uname", document.getElementById("anameI").value)
    xhttp.setRequestHeader("pwd", document.getElementById("apwdI").value)
    xhttp.setRequestHeader("X-CSRFToken", csrftoken)
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState === 4 && xhttp.status === 200) {
            if (xhttp.responseText === "") {
                document.getElementById("mBody").innerHTML = "管理员注册成功！"
            } else document.getElementById("mBody").innerHTML = xhttp.responseText
        }
    }
    xhttp.send()
}


function bill_print() {
    let xhttp = new XMLHttpRequest()
    xhttp.open('POST', '/all_bill_print')
    xhttp.setRequestHeader("X-CSRFToken", csrftoken);
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState === 4 && xhttp.status === 200) {
            billP = xhttp.responseText.split(';')
            document.getElementById("tt5").innerHTML = ""
            if (document.getElementById("billI") != null)
                document.getElementById("billI").remove()
            if (billP.length === 1) {
                let tag = "<div id='billI' class=' p-5 m-5 fs-3 text-center'>未搜索到订单信息</div>"
                document.getElementById("billForm").insertAdjacentHTML("beforeend", tag)
            } else {
                for (let i = 0; i < billP.length / 10; i++) {
                    let tag = "<tr style='line-height:36px' ><td>" + billP[10 * i] + "</td><td>" + billP[10 * i + 1] +
                        "</td><td>" + billP[10 * i + 2] + "</td><td>" + billP[10 * i + 3] +
                        " &nbsp;<i class='fas fa-angle-double-right'></i>&nbsp; " + billP[10 * i + 4] + "</td><td>" +
                        billP[10 * i + 5] + " &nbsp;<i class='fas fa-angle-double-right'></i>&nbsp; " + billP[10 * i + 6] +
                        "</td><td>" + billP[10 * i + 7] + "</td><td>" + billP[10 * i + 8] + "</td><td>" + billP[10 * i + 9];
                    tag += "</td><td><div><button class='btn btn-warning me-1' data-bs-toggle='modal' " +
                        "data-bs-target='#bill2M' type='button' onclick='change_bill(" + i + ")'>修改</button>" +
                        "<button class='btn btn-danger' data-bs-toggle='modal' data-bs-target='#Modal' " +
                        "type='button' onclick='del_bill(" + i + ")'>取消</button></td></div></tr>";
                    document.getElementById("tt5").insertAdjacentHTML("beforeend", tag)
                }
            }
        }
    }
    xhttp.send()
}


function change_bill(index){
    document.getElementById("bill2I").value = billP[10 * index]
    document.getElementById("bill2I2").value = billP[10 * index + 2]
    switch(billP[10 * index + 7]){
        case "头等舱":
            document.getElementById("bill2I3").selectedIndex = 0;break;
        case "商务舱":
            document.getElementById("bill2I3").selectedIndex = 1;break;
        case "经济舱":
            document.getElementById("bill2I3").selectedIndex = 2;break;
    }
    if(billP[10*index+9] === "是"){
        document.getElementById("bill2I4").checked = true
    } else {
      document.getElementById("bill2I5").checked = true
    }
}


function change_bill2(){
    let msg = document.getElementById("bill2I").value+";"+
        document.getElementById("bill2I2").value+";"+
        document.getElementById("bill2I3").value +";"
    if(document.getElementById("bill2I4").checked===true)
        msg += "是"
    else msg += "否"
    let xhttp = new XMLHttpRequest()
    xhttp.open('POST', '/change_bill')
    xhttp.setRequestHeader("msg", encodeURIComponent(msg))
    xhttp.setRequestHeader("X-CSRFToken", csrftoken)
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState === 4 && xhttp.status === 200) {
            document.getElementById("mTitle").innerHTML = '订单修改结果'
            if (xhttp.responseText === "") {
                setTimeout(() => {
                    let tag = "<div class='alert fade show alert-success alert-dismissible' ><button type='button' class='btn-close'" +
                        " data-bs-dismiss='alert'></button><strong>订单修改成功，立即刷新界面更新内容！</strong></div>"
                    document.getElementById("billForm").insertAdjacentHTML('beforebegin', tag)
                }, 200)
            } else {
                setTimeout(() => {
                    let tag = "<div class='alert fade show alert-danger alert-dismissible' ><button type='button' class='btn-close'" +
                        " data-bs-dismiss='alert'></button><strong>修改失败，" + xhttp.responseText + "</strong></div>"
                    document.getElementById("billForm").insertAdjacentHTML('beforebegin', tag)
                }, 200)
            }
        }
    }
    xhttp.send()
}


function del_bill(index){
    let xhttp = new XMLHttpRequest()
    xhttp.open('POST', '/del_bill')
    xhttp.setRequestHeader("flight", billP[10 * index])
    xhttp.setRequestHeader("id", billP[10 * index + 2])
    xhttp.setRequestHeader("X-CSRFToken", csrftoken)
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState === 4 && xhttp.status === 200) {
            let mBody = document.getElementById("mBody")
            document.getElementById("mTitle").innerHTML = '订单删除结果'
            if (xhttp.responseText === "")
                mBody.innerHTML = "订单删除成功"
            else mBody.innerHTML = xhttp.responseText
        }
    }
    xhttp.send()
}


function add_bill(){
    document.getElementById("mTitle").innerHTML="订单添加结果"
    let mBody = document.getElementById("mBody")
    if(document.getElementById("bill3I").value === ""){
        mBody.innerHTML="添加失败，航班号不得为空！"
        return
    }
    let ID=document.getElementById("bill3I2").value
    if(ID.length !== 18){
        mBody.innerHTML="添加失败，身份证长度错误！"
        return
    } else if (isNaN(Number(ID.slice(0, 17))) || (isNaN(Number(ID[17])) && ID[17] !== 'X')) {
            mBody.innerHTML = "身份证号格式错误！"
            return
    }
    let xhttp = new XMLHttpRequest()
    xhttp.open('POST', '/add_bill')
    let msg = document.getElementById("bill3I").value + ";"
        + document.getElementById("bill3I2").value + ";"
        + document.getElementById("bill3I3").value + ";"
    if(document.getElementById("bill3I4").checked === true)
        msg += "是"
    else msg += "否"
    xhttp.setRequestHeader("X-CSRFToken", csrftoken)
    xhttp.setRequestHeader("msg", encodeURIComponent(msg))

    xhttp.onreadystatechange = () => {
        if (xhttp.readyState === 4 && xhttp.status === 200) {
            let mBody = document.getElementById("mBody")
            document.getElementById("mTitle").innerHTML = '订单添加结果'
            if (xhttp.responseText === "")
                mBody.innerHTML = "订单添加成功"
            else mBody.innerHTML = xhttp.responseText
        }
    }
    xhttp.send()


}*/
