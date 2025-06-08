from django.urls import path
from .views import register_user,verify_otp,login_emp

urlpatterns = [
    
    path('send-otp/', register_user),
    path('verify-otp/' , verify_otp),
    path('login/', login_emp)
]
