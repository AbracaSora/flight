#!/usr/bin/env python
"""Django's command-line utility for administrative tasks."""
import os
import sys
import pymysql
# 连接database
conn = pymysql.connect(
host="你的数据库地址", 
user="用户名",
password="密码",
database="数据库名",
charset="utf8")
# 得到一个可以执行SQL语句的光标对象
cursor = conn.cursor()
# 定义要执行的SQL语句
sql = ("select passenger.pass_name, "
       "flight.fli_num, "
       "flight.fli_dep_loc, "
       "flight.fli_arr_loc, "
       "ticket.seat_type from "
       "ticket, flight, passenger")
# 执行SQL语句
cursor.execute(sql)
# 关闭光标对象
cursor.close()
# 关闭数据库连接
conn.close()


def main():
    """Run administrative tasks."""
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'flight.settings')
    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed and "
            "available on your PYTHONPATH environment variable? Did you "
            "forget to activate a virtual environment?"
        ) from exc
    execute_from_command_line(sys.argv)


if __name__ == '__main__':
    main()
