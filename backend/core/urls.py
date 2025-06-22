from django.urls import path
from .views import register_user,verify_otp,login_emp,manager_dashboard,reset_password,expense_request, expense_history,get_other_request, hod_dashboard, update_request, get_Hod_Other_request,hod_update_request, comp_other_request, Comp_update_request, check_policy

urlpatterns = [
    
    path('send-otp/', register_user),
    path('verify-otp/' , verify_otp),
    path('login/', login_emp),
    path('manager/dashboard/',manager_dashboard),
    path('reset-password/' , reset_password),
    path('expenses/' , expense_request),
    path('expense-history/', expense_history),
    path('manager-other-request/' ,get_other_request),
    path('Hod/dashboard/',hod_dashboard),
    path('update_request/',update_request ),
    path('Hod-other-request/' ,get_Hod_Other_request ),
    path('hod_update_request/' , hod_update_request),
    path('Comp-other-request/', comp_other_request),
    path('Comp_update_request/', Comp_update_request),
    path('check-policy/', check_policy)



]
