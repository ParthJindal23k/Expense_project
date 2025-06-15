from django.urls import path
from .views import register_user,verify_otp,login_emp,manager_dashboard,reset_password,expense_request, expense_history,get_other_request

urlpatterns = [
    
    path('send-otp/', register_user),
    path('verify-otp/' , verify_otp),
    path('login/', login_emp),
    path('manager/dashboard/',manager_dashboard),
    path('reset-password/' , reset_password),
    path('expenses/' , expense_request),
    path('expense-history/', expense_history),
    path('manager-other-request/' ,get_other_request )

]
