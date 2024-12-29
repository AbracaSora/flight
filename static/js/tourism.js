/*
let billP, touristP, flightP, seatP

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
            if (xhttp.responseText === "")
                mBody.innerHTML = "密码修改成功"
            else mBody.innerHTML = xhttp.responseText
        }
    }
    xhttp.send()
}


function bill_print() {
    let xhttp = new XMLHttpRequest()
    xhttp.open('POST', '/bill_print')
    xhttp.setRequestHeader("X-CSRFToken", csrftoken);
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState === 4 && xhttp.status === 200) {
            billP = xhttp.responseText.split(';')
            document.getElementById("tt").innerHTML = ""
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
                    if (billP[10 * i + 9] === '否') {
                        tag += "</td><td><div><button class='btn btn-warning me-1' data-bs-toggle='modal' " +
                            "data-bs-target='#Modal' type='button' onclick='bill_pay(" + i + ")'>支付</button>" +
                            "<button class='btn btn-danger' data-bs-toggle='modal' data-bs-target='#Modal' " +
                            "type='button' onclick='bill_cancel(" + i + ")'>取消</button></td></div></tr>";
                    } else {
                        tag += "</td><td><div><button class='btn btn-warning me-1 disabled' data-bs-toggle='modal' " +
                            "data-bs-target='#Modal' type='button' onclick='bill_pay(" + i + ")'>支付</button>" +
                            "<button class='btn btn-danger' data-bs-toggle='modal' data-bs-target='#Modal' " +
                            "type='button' onclick='bill_cancel(" + i + ")'>取消</button></td></div></tr>";
                    }
                    document.getElementById("tt").insertAdjacentHTML("beforeend", tag)
                }
            }
        }
    }
    xhttp.send()
}


function bill_pay(index) {
    let xhttp = new XMLHttpRequest()
    xhttp.open('POST', '/bill_pay/')
    xhttp.setRequestHeader("index", billP[10 * index])
    xhttp.setRequestHeader("ID", billP[10 * index + 2])
    xhttp.setRequestHeader("X-CSRFToken", csrftoken)
    xhttp.onreadystatechange = () => {
        let mBody = document.getElementById("mBody")
        document.getElementById("mTitle").innerHTML = '订单支付结果'
        if (xhttp.responseText === "")
            mBody.innerHTML = "订单支付成功"
        else mBody.innerHTML = xhttp.responseText
    }
    xhttp.send()
}


function bill_cancel(index) {
    let xhttp = new XMLHttpRequest()
    xhttp.open('POST', '/bill_cancel/')
    xhttp.setRequestHeader("index", billP[10 * index])
    xhttp.setRequestHeader("ID", billP[10 * index + 2])
    xhttp.setRequestHeader("X-CSRFToken", csrftoken)
    xhttp.onreadystatechange = () => {
        let mBody = document.getElementById("mBody")
        document.getElementById("mTitle").innerHTML = '订单取消结果'
        if (xhttp.responseText === "")
            mBody.innerHTML = "订单取消成功"
        else mBody.innerHTML = xhttp.responseText
    }
    xhttp.send()
}


function tourist_print() {
    let xhttp = new XMLHttpRequest()
    xhttp.open('POST', '/tourist_print')
    xhttp.setRequestHeader("X-CSRFToken", csrftoken);

    xhttp.onreadystatechange = () => {
        if (xhttp.readyState === 4 && xhttp.status === 200) {
            touristP = xhttp.responseText.split(';')
            document.getElementById("tt2").innerHTML = ""
            if (document.getElementById("touristI") != null)
                document.getElementById("touristI").remove()
            if (touristP.length === 1) {
                let tag = "<div id='touristI' class=' p-5 m-5 fs-3 text-center'>未搜索到订单信息</div>"
                document.getElementById("touristForm").insertAdjacentHTML("beforeend", tag)
            } else {
                for (let i = 0; i < touristP.length / 4; i++) {
                    let tag = "<tr style='line-height:36px' ><td>" + touristP[4 * i] + "</td><td>" + touristP[4 * i + 1] +
                        "</td><td>" + touristP[4 * i + 2] + "</td><td>" + touristP[4 * i + 3] + "</td><td><button " +
                        "data-bs-toggle='modal' data-bs-target='#Modal' onclick='tourist_del(" + i +
                        ")' class='btn btn-danger' type='button'>删除</button></td></tr>"
                    document.getElementById("tt2").insertAdjacentHTML("beforeend", tag)
                }
            }
        }
    }
    xhttp.send()
}


function add_tourist() {
    let mBody = document.getElementById("mBody")
    document.getElementById("mTitle").innerHTML = '旅客添加结果'
    if (document.getElementById('tname').value === '') {
        mBody.innerHTML = "姓名不得为空！"
        return
    } else if (document.getElementById('tID').value === '') {
        mBody.innerHTML = "身份证不得为空！"
        return
    } else {
        let ID = document.getElementById("tID").value
        if (ID.length !== 18) {
            mBody.innerHTML = "身份证号长度有误！"
            return
        } else if (isNaN(Number(ID.slice(0, 17))) || (isNaN(Number(ID[17])) && ID[17] !== 'X')) {
            mBody.innerHTML = "身份证号格式错误！"
            return
        } else if (document.getElementById(("tTel")).value===""){
            mBody.innerHTML = "联系方式不得为空！"
            return
        }
    }
    let xhttp = new XMLHttpRequest()
    xhttp.open('POST', '/add_tourist')
    xhttp.setRequestHeader("tName",encodeURIComponent(document.getElementById("tname").value))
    xhttp.setRequestHeader("tID", document.getElementById("tID").value)
    if (document.getElementById("male").checked)
        xhttp.setRequestHeader("tSex", "male")
    else xhttp.setRequestHeader("tSex", "female")
    xhttp.setRequestHeader("tTel", document.getElementById(("tTel")).value)
    xhttp.setRequestHeader("X-CSRFToken", csrftoken)
    xhttp.onreadystatechange = () => {
        let mBody = document.getElementById("mBody")
        if (xhttp.responseText === "")
            mBody.innerHTML = "旅客添加成功"
        else mBody.innerHTML = xhttp.responseText
    }
    xhttp.send()
}


function tourist_del(index) {
    let xhttp = new XMLHttpRequest()
    xhttp.open('POST', '/tourist_del')
    xhttp.setRequestHeader("ID", touristP[4 * index + 1])
    xhttp.setRequestHeader("X-CSRFToken", csrftoken)
    xhttp.onreadystatechange = () => {
        console.info("11111")
        let mBody = document.getElementById("mBody")
        document.getElementById("mTitle").innerHTML = '旅客删除结果'
        if (xhttp.responseText === "")
            mBody.innerHTML = "旅客删除成功"
        else mBody.innerHTML = xhttp.responseText
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
            if (flightP.length === 1) {
                let tag = "<div id='flightI' class=' p-5 m-5 fs-3 text-center'>未搜索到航班信息</div>"
                document.getElementById("flightForm").insertAdjacentHTML("beforeend", tag)
            } else {
                for (let i = 0; i < flightP.length / 5; i++) {
                    let tag = "<tr style='line-height:36px' ><td>" + flightP[5 * i] + "</td><td>" +
                        flightP[5 * i + 1] + "</td><td>" + flightP[5 * i + 2] + "</td><td>" +
                        flightP[5 * i + 3] + "</td><td>" + flightP[5 * i + 4] + "</td>"
                    let da = flightP[5 * i + 3].split(' ')[0].split('/')
                    let ti = flightP[5 * i + 3].split(' ')[1].split(':')
                    let d = new Date()
                    let dayCnt = d.getDate() + (d.getMonth() + 1) * 32 + (d.getFullYear() - 1960) * 400
                    let minCnt = d.getHours() * 60 + d.getMinutes()
                    let flag = true
                    if ((Number(da[0]) - 1960) * 400 + Number(da[1]) * 32 + Number(da[2]) < dayCnt) {
                        flag = false
                    }

                    // 航班提前一小时停止售票
                    else if ((Number(da[0]) - 1960) * 400 + Number(da[1]) * 32 + Number(da[2]) === dayCnt
                        && Number(ti[0]) * 60 + Number(ti[1]) < minCnt + 60) {
                        flag = false
                    }
                    if (flag) {
                        tag += "<td><button class='btn btn-primary' data-bs-toggle='modal' data-bs-target='#flightM' " +
                            "onclick='seat_print(" + i + ")'>购票</button></td></tr>"
                    } else {
                        tag += "<td><button class='btn btn-primary disabled'>购票</button></td></tr>"
                    }
                    document.getElementById("tt3").insertAdjacentHTML("beforeend", tag)
                }
            }
        }
    }
    xhttp.send()
}


function seat_print(index) {
    document.getElementById("mTitle2").innerHTML = "航班" + flightP[5 * index] + "-选择舱位"
    document.getElementById("tt5").innerHTML = "<tr><th>航班号</th><th>舱位类型</th><th>票价</th><th>总座位数</th><th>剩余座位数</th><th>选项</th></tr>"
    document.getElementById("tt4").innerHTML = ""
    if (document.getElementById("mfoot2") != null)
        document.getElementById("mfoot2").remove()
    let xhttp = new XMLHttpRequest()
    xhttp.open('POST', '/seat_print')
    xhttp.setRequestHeader("flight", flightP[5 * index])
    xhttp.setRequestHeader("X-CSRFToken", csrftoken)
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState === 4 && xhttp.status === 200) {
            seatP = xhttp.responseText.split(';')
            if (document.getElementById("mI2") != null)
                document.getElementById("mI2").remove()
            if (seatP.length === 1) {
                let tag = "<div id='mI2' class=' p-5 m-5 fs-3 text-center'>未搜索到座位信息</div>"
                document.getElementById("mBody2").insertAdjacentHTML("beforeend", tag)
            } else {
                for (let i = 0; i < seatP.length / 4; i++) {
                    let tag = "<tr style='line-height:36px' ><td>" + flightP[5 * index] + "</td><td>" +
                        seatP[4 * i] + "</td><td>" + seatP[4 * i + 1] + "</td><td>" + seatP[4 * i + 2] + "</td><td>" + seatP[4 * i + 3] + "</td>"
                    if (seatP[4 * i + 3] === '0') {
                        tag += "<td><button class='btn btn-primary disabled'>购票</button></td></tr>"
                    } else {
                        tag += "<td><button class='btn btn-primary' onclick='choose_tourist(" + i + ")'>购票</button></td></tr>"
                    }
                    document.getElementById("tt4").insertAdjacentHTML("beforeend", tag)
                }
            }
        }
    }
    xhttp.send()
}


function choose_tourist(index) {
    console.info("tour")
    if (document.getElementById("mfoot2") == null)
        document.getElementById("mcontent").insertAdjacentHTML("beforeend",
            "<div class=\"modal-footer\" id=\"mfoot2\"><button type=\"button\" class=\"btn btn-primary\" " +
            "onclick=\"book_flight()\">提交</button></div>")
    let title = document.getElementById("mTitle2")
    title.innerHTML = title.innerHTML.split('-')[0] + "-" + seatP[4 * index] + "-选择旅客"
    document.getElementById("tt5").innerHTML = "<tr><th>姓名</th><th>身份证</th><th>性别</th><th>联系方式</th><th>选取</th></tr>"
    document.getElementById("tt4").innerHTML = ""
    let xhttp = new XMLHttpRequest()
    xhttp.open('POST', '/tourist_print')
    xhttp.setRequestHeader("flight", title.innerHTML.split('-')[0].slice(2))
    xhttp.setRequestHeader("X-CSRFToken", csrftoken)
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState === 4 && xhttp.status === 200) {
            touristP = xhttp.responseText.split(';')
            if (document.getElementById("mI2") != null)
                document.getElementById("mI2").remove()
            if (touristP.length === 1) {
                console.info(1)
                let tag = "<div id='mI2' class=' p-5 m-5 fs-3 text-center'>未搜索到旅客信息</div>"
                document.getElementById("mBody2").insertAdjacentHTML("beforeend", tag)
            } else {
                console.info(2)
                for (let i = 0; i < touristP.length / 4; i++) {
                    let tag = "<tr style='line-height:30px' ><td>" + touristP[4 * i] + "</td><td>" + touristP[4 * i + 1] +
                        "</td><td>" + touristP[4 * i + 2] + "</td><td>" + touristP[4 * i + 3] +
                        "</td><td><input type='checkbox' class='form-check-input bookTo'></td></tr>"
                    document.getElementById("tt4").insertAdjacentHTML("beforeend", tag)
                }
            }

        }
    }
    xhttp.send()
}


function book_flight() {
    let table = document.getElementsByClassName("bookTo")
    let cnt = 0
    let tourist_list = []
    for (let i = 0; i < table.length; i++) {
        if (table[i].checked === true) {
            cnt += 1
            tourist_list.push(touristP[4 * i + 1])
        }
    }
    let tag
    if (cnt === 0) {
        tag = "<div id='mI2' class=' p-4 m-4 fs-3 text-center'>未选中旅客</div>"
        document.getElementById("mBody2").insertAdjacentHTML("beforeend", tag)
    } else {
        let xhttp = new XMLHttpRequest()
        let name = document.getElementById("mTitle2").innerHTML
        let ans = ""
        for (let i = 0; i < tourist_list.length; i++) {
            ans += tourist_list[i] + ";"
        }
        xhttp.open('POST', '/book_flight')
        xhttp.setRequestHeader("flight", name.split('-')[0].slice(2))
        xhttp.setRequestHeader("seat", encodeURIComponent(name.split('-')[1]))
        xhttp.setRequestHeader("tID", ans)
        xhttp.setRequestHeader("X-CSRFToken", csrftoken)
        xhttp.onreadystatechange = () => {
            if (xhttp.readyState === 4 && xhttp.status === 200) {
                if (xhttp.responseText === "")
                    tag = "<div id='mI2' class=' p-4 m-4 fs-3 text-center'>订票成功</div>"
                else
                    tag = "<div id='mI2' class=' p-4 m-4 fs-3 text-center'>" + xhttp.responseText + "</div>"
                document.getElementById("mBody2").insertAdjacentHTML("beforeend", tag)

            }
        }
        xhttp.send()
    }
    document.getElementById("mfoot2").remove()
    document.getElementById("mTitle2").innerHTML = "订票结果"
    document.getElementById("tt5").innerHTML = ""
    document.getElementById("tt4").innerHTML = ""


}*/
