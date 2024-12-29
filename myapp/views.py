import random

import pymysql
from django.http import response
from django.shortcuts import render, redirect, HttpResponse
import json
import urllib.parse

# 连接数据库
cnxn = pymysql.connect(host='localhost',  # my
                      user='root',  # my
                      passwd='Mysql@123',  # my
                      port=3306,  # my
                      db='flight',  # my
                      charset='utf8',  # my
                      autocommit=True
                      )  # my
cursor = cnxn.cursor()  # 生成游标对象#my
# 将表单信息（二维数组）转换为字符串，前提是信息中无英文分号
def array_to_str(arr):
    ans = ""
    for i in range(len(arr)):
        for j in range(len(arr[i])):
            ans += arr[i][j] + ";"
    return ans[:-1]


# 重定向至登录界面
def login_redirect(request):
    return redirect("/login")


# 退出登录，清除用户的会话信息，重定向至登录界面
def logout(request):
    if request.session.get('ULevel') is not None:
        del request.session['ULevel']
        del request.session['UID']
    return redirect("/login")


# 进入登录界面
def login(request):
    context = {}
    return render(request, "index.html", context)


# 进入取票界面
def get_ticket(request):
    context = {}
    return render(request, "getticket.html", context)


# 进入注册界面
def register(request):
    context = {}
    return render(request, "register.html", context)


# 进入旅行社界面
def tourism(request):
    if request.session.get('ULevel') != 1:
        return redirect("/login")

    context = {'name': request.session['UID']}
    return render(request, "tourism.html", context)


# 进入管理员界面
def admin(request):
    if request.session.get('ULevel') != 2:
        return redirect("/login")

    context = {'name': request.session['UID']}
    return render(request, "admin.html", context)


# 登录账户，正确跳至主界面，错误返回登录界面
def login_post(request):
    ######################
    # TODO 数据库匹配账户正确性，如登录失败，错误信息写入error_msg，传回前端，
    #  error_msg空表示成功
    ######################
    error_msg = ""
    name = request.POST.get('uname')
    pwd = request.POST.get('pwd')
    if request.POST.get('optradio') == '1':
        sql = "select * from normaluser where user_name ="+ "'" + name + "'" + "and user_password = " + "'" + pwd + "'"
        print(sql)
    else:
        sql = "select * from adminuser where admin_name ="+ "'" + name + "'" + "and admin_password = " + "'" + pwd + "'"
    cursor.execute(sql)
    exist = cursor.fetchall()
    print(exist)
    if not exist:
        print("yes")
        error_msg = "登录失败，请重试"
    context = {'name': name, 'pwd': pwd, 'error_msg': error_msg}
    print(error_msg)
    if error_msg != "":
        return render(request, "index.html", context)  # 返回登录界面
    elif request.POST.get('optradio') == '1':
        request.session['UID'] = context['name']
        request.session['ULevel'] = 1
        return redirect("/tourism")  # 前往用户主界面
    else:
        request.session['UID'] = context['name']
        request.session['ULevel'] = 2
        return redirect("/admin")  # 前往管理员主界面


# 注册旅行社，正确跳至注册成功页面，错误返回注册界面
def registerT_post(request):
    error_msg = ""
    name = request.POST.get('uname')
    pwd = request.POST.get('pwd')
    if name == "" or len(pwd) < 8 or len(pwd) > 40 or len(name) < 2 or len(name) > 40:
        error_msg = "格式不规范，请重试"
    sql = "insert into normaluser values(" + "'" + name + "','" + pwd + "')"
    cursor.execute(sql)
    print(sql)
    context = {'name': name, 'pwd': pwd, 'error_msg': error_msg}
    if error_msg == "":
        return render(request, 'registerSuccess.html', context)
    else:
        return render(request, 'register.html', context)


# 注册管理员
def registerA_post(request):#没有这块的前端,这里前端有问题
    error_msg = ""
    name = request.headers.get('uname')
    pwd = request.headers.get('pwd')

    ######################
    # TODO 数据库进行注册管理员，若注册失败，错误信息写入error_msg，传回前端
    #  目前前端检查内容是否为空，密码要求8-40位，至少包含字母和数字，用户名要求2-40位
    ######################
    print(1)
    print(name)
    print(pwd)
    print(len(name))
    print(len(pwd))
    if name == "" or len(pwd) < 8 or len(pwd) > 40 or len(name) < 2 or len(name) > 40:
        error_msg = "格式不规范，请重试"
    else:
        sql = "insert into adminuser values ('" + str(name) + "','" + str(pwd) + "')"
        print(sql)
        cursor.execute(sql)

    return HttpResponse(error_msg)


# 管理员或旅行社修改密码
def changepwd_post(request): #这里应该有点问题
    print("修改密码")
    error_msg = ""
    ulevel = request.session.get('ULevel')  # 1表示旅行社，2表示管理员
    uname = request.session.get("UID")
    old_pwd = request.headers.get('opwd')
    new_pwd = request.headers.get('npwd')
    print(new_pwd)
    if ulevel == 1:
        sql = "select * from normaluser where user_name =" + "'" + uname + "'" + "and user_password = " + "'" + old_pwd + "'"
        cursor.execute(sql)
        print(sql)
        exist = cursor.fetchall()
        print(exist)
        if not exist:
            error_msg = "旧密码错误，修改失败"
        else:
            sql = "update normaluser set user_password = '" + new_pwd+ "' where user_name= '" + uname + "'"
            cursor.execute(sql)
        sql = "select * from normaluser where user_name =" + "'" + uname + "'" + "and user_password = " + "'" + new_pwd + "'"
        cursor.execute(sql)
        print(cursor.fetchone())
    else:
        sql = "select * from adminuser where admin_name =" + "'" + uname + "'" + "and admin_password = " + "'" + old_pwd + "'"
        cursor.execute(sql)
        print(sql)
        exist = cursor.fetchall()
        print(exist)
        if not exist :
            error_msg = "旧密码错误，修改失败"
        else:
            sql = "update adminuser set admin_password = '" + new_pwd + "' where admin_name= '" + uname + "'"
            cursor.execute(sql)
        sql = "select * from adminuser where admin_name =" + "'" + uname + "'" + "and admin_password = " + "'" + new_pwd + "'"
        cursor.execute(sql)
        print(cursor.fetchall())
    ######################
    # TODO 修改旅行社或管理员的密码，错误信息写入error_msg，传回前端
    #  目前前端仅检查新旧密码是否为空，长度至多40位
    ######################
    # 写一下错误信息
    context = {'error_msg': error_msg}
    return HttpResponse(error_msg)


# 存储身份证，然后对网页重定向
def ticket_post(request):
    request.session['uidCard'] = request.POST.get('uidCard')
    return redirect("/ticket_print")


# 进入旅客取票界面
def ticket_print(request): #修改一下支付按钮
    if request.session.get('uidCard') is None:
        return redirect("/getticket")
    IDCard = request.session.get('uidCard')  # 身份证
    uname = ''  # 旅客名称
    ticket_list = []
    sql = "select * from passenger where pass_idnum = '" + IDCard + "'"
    cursor.execute(sql)
    data1 = cursor.fetchall()
    print(data1)
    if len(data1) != 0:
        uname = data1[0][1]
        sql = "select * from ticket where pass_idnum = '" + IDCard + "'"
        cursor.execute(sql)
        data2 = cursor.fetchall()
        for data3 in iter(data2):
            list = []
            print(data3)
            id = data3[0]
            sql = "select * from flight where fli_num = '" + id + "'"
            cursor.execute(sql)
            data4 = cursor.fetchone()
            print(data4)
            sql = "select seat_price from seat where fli_num =" + "'" + id + "'" + "and seat_type = " + "'" + data3[2] + "'"
            cursor.execute(sql)
            price = cursor.fetchone()[0]
            print(price)
            #list.append(data4[0],data4[1],data4[2],data4[3],data4[4],price,data3[2],data3[3])
            list.append(data4[0])
            list.append(data4[1])
            list.append(data4[2])
            list.append(data4[3])
            list.append(data4[4])
            list.append(price)
            list.append(data3[2])
            list.append(data3[3])
            ticket_list.append(list)
    ######################
    # TODO 数据库检查该身份证的旅客是否存在身份证查询订单信息，
    #  ticket_list：航班号、出发地点、到达地点、出发时间、到达时间、座位类型、票价、是否支付（是/否）
    #  uname为空表示无对应身份证的旅客，ticket_list为空表示该旅客无订票记录
    #  以下为前端测试用例：

    ######################

    context = {'IDCard': IDCard, "uname": uname}
    ticket_list = json.dumps(ticket_list)
    context["ticket"] = ticket_list
    return render(request, "ticketPrint.html", context)


# 打印旅行社相关的订单
def bill_print(request):
    uname = request.session.get("UID")  # 旅行社用户名
    if uname is None:
        return redirect("/login")
    sql = "select * from passenger where user_name = '" + uname + "'"
    cursor.execute(sql)
    data = cursor.fetchall()
    bill_list = []
    for ddata in iter(data):
        IDCard = ddata[3]
        print(IDCard)
        sql = "select * from passenger where pass_idnum = '" + IDCard + "'"
        cursor.execute(sql)
        data1 = cursor.fetchall()
        print(data1)
        uname = data1[0][1]
        sql = "select * from ticket where pass_idnum = '" + IDCard + "'"
        cursor.execute(sql)
        data2 = cursor.fetchall()
        for data3 in iter(data2):
            list = []
            print(data3)
            id = data3[0]
            sql = "select * from flight where fli_num = '" + id + "'"
            cursor.execute(sql)
            data4 = cursor.fetchone()
            print(data4)
            sql = "select seat_price from seat where fli_num =" + "'" + id + "'" + "and seat_type = " + "'" + data3[
                2] + "'"
            print(sql)
            cursor.execute(sql)
            price = cursor.fetchone()[0]
            print(price)
            # list.append(data4[0],data4[1],data4[2],data4[3],data4[4],price,data3[2],data3[3])
            list.append(data4[0])
            list.append(ddata[1])
            list.append(IDCard)
            list.append(data4[1])
            list.append(data4[2])
            list.append(data4[3])
            list.append(data4[4])
            list.append(data3[2])
            list.append(str(price))
            list.append(data3[3])
            print(list)
            bill_list.append(list)
    print(bill_list)

    ######################
    # TODO 数据库根据旅行社用户返回相关的旅行社订单
    #  bill_list：航班号 姓名 身份证 出发地点 到达地点 出发时间 到达时间 座位类型 票价 是否支付（是/否）
    #  以下为前端测试用例：
    ######################
    return HttpResponse(array_to_str(bill_list))


# 打印所有的机票订单
def all_bill_print(request):
    ######################
    # TODO 数据库打印所有的机票订单
    #  bill_list：航班号 姓名 身份证 出发地点 到达地点 出发时间 到达时间 座位类型 票价 是否支付（是/否）
    #  以下为前端测试用例：
    bill_list = [["123", "张三", "111111111111111111", "郑州", "北京", "2022-11-28 22:44", "2022-11-29 22:44",
                  "商务舱", "1500", "是"],
                 ["124", "张三", "111111111111111111", "北京", "郑州", "2022-11-29 22:44", "2022-11-30 22:44",
                  "头等舱", "2300", "否"],
                 ["123", "李四", "111111111111111112", "郑州", "北京", "2022-11-28 22:44", "2022-11-29 22:44",
                  "商务舱", "1500", "是"],
                 ["124", "李四", "111111111111111112", "北京", "郑州", "2022-11-29 22:44", "2022-11-30 22:44",
                  "头等舱", "2300", "否"],
                 ]
    ######################
    sql = "select * from normaluser"
    cursor.execute(sql)
    Data = cursor.fetchall()
    bill_list = []
    for DData in iter(Data):
        uname = DData[0]
        sql = "select * from passenger where user_name = '" + uname + "'"
        cursor.execute(sql)
        data = cursor.fetchall()
        for ddata in iter(data):
            IDCard = ddata[3]
            print(IDCard)
            sql = "select * from passenger where pass_idnum = '" + IDCard + "'"
            cursor.execute(sql)
            data1 = cursor.fetchall()
            print(data1)
            uname = data1[0][1]
            sql = "select * from ticket where pass_idnum = '" + IDCard + "'"
            cursor.execute(sql)
            data2 = cursor.fetchall()
            for data3 in iter(data2):
                list = []
                print(data3)
                id = data3[0]
                sql = "select * from flight where fli_num = '" + id + "'"
                cursor.execute(sql)
                data4 = cursor.fetchone()
                print(data4)
                sql = "select seat_price from seat where fli_num =" + "'" + id + "'" + "and seat_type = " + "'" + data3[
                    2] + "'"
                cursor.execute(sql)
                price = cursor.fetchone()[0]
                print(price)
                # list.append(data4[0],data4[1],data4[2],data4[3],data4[4],price,data3[2],data3[3])
                list.append(data4[0])
                list.append(ddata[1])
                list.append(IDCard)
                list.append(data4[1])
                list.append(data4[2])
                list.append(data4[3])
                list.append(data4[4])
                list.append(data3[2])
                list.append(str(price))
                list.append(data3[3])
                print("list")
                print(list)
                bill_list.append(list)
                print(bill_list)
    print(bill_list)
    return HttpResponse(array_to_str(bill_list))


# 支付订单
def bill_pay(request):
    bill_index = request.headers.get("index")  # 航班号
    userID = request.headers.get("ID")  # 用户身份证

    error_msg = ""
    sql = "update ticket set pay = '是' where fli_num = '" + bill_index + "' and pass_idnum = '" + userID + "'"
    cursor.execute(sql)
    ######################
    # TODO 数据库根据航班号与身份证，将对应的订单设置为已支付订单
    #  如有问题，将报错写入error_msg
    ######################

    return HttpResponse(error_msg)


# 取消订单
def bill_cancel(request):
    bill_index = request.headers.get("index")  # 航班号
    userID = request.headers.get("ID")  # 用户身份证

    error_msg = ""
    sql = "delete from ticket where fli_num = '" + bill_index + "' and pass_idnum = '" + userID + "'"
    cursor.execute(sql)
    ######################
    # TODO 数据库根据航班号与身份证，取消对应的订单
    #  如有问题，将报错写入error_msg
    ######################

    return HttpResponse(error_msg)


# 打印旅客订单
def tourist_print(request):
    uname = request.session.get("UID")  # 旅行社用户名
    flight = request.headers.get("flight")  # 航班号
    if uname is None:
        return redirect("/login")
    ######################
    # TODO 数据库根据旅行社用户返回相关的旅客信息
    #  tourist_list：姓名 身份证 性别 联系方式
    #  假如flight为None，返回所有的该旅行社的旅客，用于显示旅客
    #  如果flight非None，则返回没有订过这个航班的该旅行社旅客，避免订票时显示已订过该票的旅客
    #  以下为前端测试用例：
    tourist_list = []
    if not flight:
        sql = "select * from passenger where user_name = '" + uname + "'"
        cursor.execute(sql)
        data = cursor.fetchall()
        for ddata in iter(data):
            list = []
            list.append(ddata[1])
            list.append(ddata[3])
            list.append(ddata[2])
            list.append(ddata[4])
            tourist_list.append(list)
    else:
        sql = "select * from passenger where user_name = '" + uname + "'"
        print(sql)
        cursor.execute(sql)
        data = cursor.fetchall()
        for ddata in iter(data):
            ID = ddata[3]
            sql = "select * from ticket where fli_num = '" + flight + "'and pass_idnum = '" + ID + "'"
            print(sql)
            cursor.execute(sql)
            exist = cursor.fetchall()
            print(exist)
            if not exist:
                list = []
                list.append(ddata[1])
                list.append(ddata[3])
                list.append(ddata[2])
                list.append(ddata[4])
                tourist_list.append(list)
    ######################

    return HttpResponse(array_to_str(tourist_list))


# 添加旅客

def add_tourist(request):
    error_list = ""
    tourismID =request.session.get("UID")  # 旅行社用户名
    tName = urllib.parse.unquote(request.headers.get("tName"))  # 旅客姓名
    tid = request.headers.get("tID")  # 旅客身份证
    tSex = request.headers.get("tSex")  # 返回值包括 male female
    tTel = request.headers.get("tTel")  # 旅客联系电话
    if tSex=="male":
        tSex="男"
    else:
        tSex="女"
    sql = "insert into flight.passenger values ('"+tourismID + "','" + tName + "','" + tSex + "','" + tid + "','" + tTel+"')"
    print(sql)
    cursor.execute(sql)
    ######################
    # TODO 数据库添加旅客信息
    #  error_list记录报错信息
    #  以下为前端测试用例：
    ######################
    return HttpResponse(error_list)


# 删除旅客
def tourist_del(request):
    userID = request.headers.get("ID")  # 旅客身份证
    tourismID = request.session.get("UID")  # 旅行社用户名
    error_msg = ""
    sql = "delete from passenger where pass_idnum = '" + userID + "' and user_name = '" + tourismID + "'"
    print(sql)
    cursor.execute(sql)

    return HttpResponse(error_msg)


# 打印旅行社航班
def flight_print(request):
    uname = request.session.get("UID")
    if uname is None:
        return redirect("/login")

    ######################
    # TODO 数据库返回所有的航班
    #  flight_list：航班号 航班出发地 航班目的地 航班起飞时间 航班降落时间
    #  以下为前端测试用例：
    sql = "select * from flight"
    cursor.execute(sql)
    data = cursor.fetchall()
    flight_list = []
    for ddata in iter(data):
        print(ddata)
        list = []
        for i in iter(ddata):
            list.append(i)
        flight_list.append(list)
    print(flight_list)
    # flight_list = [["1", "郑州", "北京", "2022-11-28 22:44", "2022-11-29 22:44"],
    #                ["2", "北京", "郑州", "2022-11-29 22:44", "2022-11-30 22:44"],
    #                ["3", "北京", "三亚", "2022-12-03 10:00", "2022-12-03 15:30"]]
    ######################
    print(flight_list)
    return HttpResponse(array_to_str(flight_list))
    #有问题

# 打印某航班不同舱位的信息
def seat_print(request):
    flight = request.headers.get("flight")  # 航班号
    ######################
    # TODO 根据航班号返回该航班的各舱位信息
    #  seat_list：舱位类型 票价 总座位数 剩余座位数
    #  以下为前端测试用例：
    seat_list = [["经济舱", "1000", "300", "80"],
                 ["商务舱", "1500", "60", "30"],
                 ["头等舱", "1900", "25", "10"]]
    seat_list=[]
    ######################
    sql = "select * from seat where fli_num = '" + flight + "'"
    print(sql)
    cursor.execute(sql)
    data = cursor.fetchall()
    for ddata in iter(data):
        list = []
        list.append(ddata[1])
        list.append(str(ddata[2]))
        list.append(str(ddata[3]))
        list.append(str(ddata[4]))
        seat_list.append(list)
    print(seat_list)
    return HttpResponse(array_to_str(seat_list))


# 订票
def book_flight(request):
    print("book_flight")
    tourismName = request.session.get("UID")  # 旅行社用户名
    flight = request.headers.get("flight")  # 航班号
    seat = urllib.parse.unquote(request.headers.get("seat"))  # 座位类型（商务舱、经济舱、头等舱），urllib用于中文解码，
    touristID = request.headers.get("tID")[:-1].split(';')  # 要订票的旅客身份证
    error_msg = ""
    for i in range(len(touristID)):
        sql = "insert into ticket values ('" + flight + "','" + touristID[i] + "','" + seat + "','否')"
        cursor.execute(sql)
    ######################
    # TODO 根据旅客身份证，座位类型、旅行社用户名、航班名进行订票，错误信息写回error_msg
    ######################

    return HttpResponse(error_msg)


# 删除航班
def delete_flight(request):
    error_msg = ""
    flight = request.headers.get("flight")  # 航班号

    sql = "delete from seat where fli_num = '" + flight + "'"
    cursor.execute(sql)
    sql = "delete from flight where fli_num = '" + flight + "'"
    cursor.execute(sql)
    ######################
    # TODO 删除目标航班号，前端保证航班号存在
    #  错误信息写回error_msg
    ######################

    return HttpResponse(error_msg)


# 修改航班
def change_flight(request):
    print("change_flight")
    error_msg = ""
    msg = urllib.parse.unquote(request.headers.get("msg")).split(';')

    flight = msg[0]  # 要修改的航班号
    place = [msg[1], msg[2]]  # 出发地点，到达地点
    time = [msg[3] + " " + msg[4], msg[5] + " " + msg[6]]  # 出发时间 到达时间
    price = [msg[7], msg[8], msg[9]]  # 头等舱、商务舱、经济舱 票价
    all_seat = [msg[10], msg[11], msg[12]]  # 头等舱、商务舱、经济舱 总座位数
    ava_seat = [msg[13], msg[14], msg[15]]  # 头等舱、商务舱、经济舱 剩余座位数
    print("message")
    for i in range(15):
        print(msg[i])
    sql = "update flight set fli_dep_loc = '" + msg[1] + "', fli_arr_loc ='" + msg[2] + "', fli_dep_time='"+msg[3]+" "+msg[4] +"', fli_arr_time='"+msg[5]+" "+msg[6]+"'where fli_num ='" + flight +"'"
    print(sql)
    cursor.execute(sql)
    sql = "update seat set seat_price = '" + msg[7] + "', seat_ordered ='" + msg[10] + "', seat_remain='" + msg[
        13] +"'where fli_num ='" + flight + "'and seat_type = '经济舱'"
    print(sql)
    cursor.execute(sql)
    sql = "update seat set seat_price = '" + msg[8] + "', seat_ordered ='" + msg[11] + "', seat_remain='" + msg[
        14] + "'where fli_num ='" + flight + "'and seat_type = '商务舱'"
    print(sql)
    cursor.execute(sql)
    sql = "update seat set seat_price = '" + msg[9] + "', seat_ordered ='" + msg[12] + "', seat_remain='" + msg[
        15] + "'where fli_num ='" + flight + "'and seat_type = '头等舱'"
    print(sql)
    cursor.execute(sql)
    ######################
    # TODO 修改航班内容到数据库
    #  前端保证所有内容不为空，航班号必定存在，到达时间晚于出发时间，
    #  剩余座位数不大于总座位数，时间符合规范 yyyy-mm-dd hh:mm
    #  错误信息写回error_msg
    ######################

    return HttpResponse(error_msg)


# 新增航班
def add_flight(request):
    error_msg = ""
    msg = urllib.parse.unquote(request.headers.get("msg")).split(';')
    flight = msg[0]  # 要修改的航班号
    place = [msg[1], msg[2]]  # 出发地点，到达地点
    time = [msg[3] + " " + msg[4], msg[5] + " " + msg[6]]  # 出发时间 到达时间
    price = [msg[7], msg[8], msg[9]]  # 头等舱、商务舱、经济舱 票价
    all_seat = [msg[10], msg[11], msg[12]]  # 头等舱、商务舱、经济舱 总座位数
    ava_seat = [msg[13], msg[14], msg[15]]  # 头等舱、商务舱、经济舱 剩余座位数
    sql = "insert into flight values ('" + flight+"','"+msg[1]+"','"+msg[2]+"','"+msg[3]+" "+msg[4]+"','"+msg[5]+" "+msg[6]+"')"
    print(sql)
    cursor.execute(sql)
    sql = "insert into seat values ('" + flight + "','" + "头等舱" + "','" + msg[7] + "','" + msg[10] + "','" + msg[13] + "')"
    print(sql)
    cursor.execute(sql)
    sql = "insert into seat values ('" + flight + "','" + "商务舱" + "','" + msg[8] + "','" + msg[11] + "','" + msg[14] + "')"
    print(sql)
    cursor.execute(sql)
    sql = "insert into seat values ('" + flight + "','" + "经济舱" + "','" + msg[9] + "','" + msg[12] + "','" + msg[15] + "')"
    print(sql)
    cursor.execute(sql)
    ######################
    # TODO 新增航班内容到数据库
    #  前端保证所有内容不为空，到达时间晚于出发时间，
    #  剩余座位数不大于总座位数，时间符合规范 yyyy-mm-dd hh:mm
    #  错误信息写回error_msg
    ######################

    return HttpResponse(error_msg)


# 管理员删除订单
def delete_bill(request):
    error_msg = ""
    bill = request.headers.get("flight")  # 航班号
    ID = request.headers.get("id")    # 身份证
    sql = "delete from ticket where fli_num = '" + bill + "' and pass_idnum = '" + ID + "'"
    cursor.execute(sql)
    print(sql)
    ######################
    # TODO 删除订单，前端保证该订单存在
    #  错误信息写回error_msg
    ######################

    return HttpResponse(error_msg)


# 管理员修改订单
def change_bill(request):
    error_msg = ""
    msg = urllib.parse.unquote(request.headers.get("msg")).split(';')
    flight = msg[0]     # 航班号
    ID = msg[1]     # 身份证号
    seat = msg[2]   # 座位类型  头等舱/商务座/经济舱
    have_pay = msg[3]   # 是否支付 是/否
    sql = "update ticket set pay = '" + have_pay + "' , seat_type = '" + seat + "' where fli_num ='"+flight+\
          "' and pass_idnum ='"+ID+"'"
    cursor.execute(sql)
    ######################
    # TODO 修改订单，前端保证该订单存在
    #  错误信息写回error_msg
    ######################

    return HttpResponse(error_msg)


def add_bill(request):
    print("add_bill")
    error_msg = ""
    msg = urllib.parse.unquote(request.headers.get("msg")).split(';')
    flight = msg[0]     # 航班号
    ID = msg[1]     # 身份证号
    seat = msg[2]   # 座位类型  头等舱/商务座/经济舱
    pay = msg[3]
    if msg[3] == "是":
        have_pay = True
    else:
        have_pay = False
    sql = "insert into ticket values ('" + flight+ "','" + ID + "','" + seat + "','" + pay +"')"
    cursor.execute(sql)
    print(sql)
    ######################
    # TODO 添加订单，前端保证身份证号长度18，最后一位可为X
    #  错误信息写回error_msg
    ######################

    return HttpResponse(error_msg)
