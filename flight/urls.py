"""flight URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from myapp import views

urlpatterns = [
    path('admin/', views.admin),
    path('tourism/', views.tourism),
    path('login/', views.login),
    path('getticket/', views.get_ticket),
    path('post_ticket', views.ticket_post),
    path('tourist_del', views.tourist_del),
    path('ticket_print', views.ticket_print),
    path('bill_pay/', views.bill_pay),
    path('bill_cancel/', views.bill_cancel),
    path('bill_print', views.bill_print),
    path('all_bill_print', views.all_bill_print),
    path('flight_print', views.flight_print),
    path('change_flight', views.change_flight),
    path('add_flight', views.add_flight),
    path('register/', views.register),
    path('seat_print', views.seat_print),
    path('book_flight', views.book_flight),
    path('del_flight', views.delete_flight),
    path('del_bill', views.delete_bill),
    path('change_bill', views.change_bill),
    path('add_bill',views.add_bill),
    path('logout/', views.logout),
    path('post_login', views.login_post),
    path('post_registerT', views.registerT_post),
    path('post_registerA', views.registerA_post),
    path('post_changepwd', views.changepwd_post),
    path('tourist_print', views.tourist_print),
    path('add_tourist', views.add_tourist),
    path('', views.login_redirect),
]
