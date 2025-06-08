from rest_framework import serializers
from .models import Employee

class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employee
        fields = ['username', 'email', 'password', 'phone_number']
