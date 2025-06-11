from rest_framework import serializers
from .models import Employee, Expense

class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employee
        fields = ['username', 'email', 'password', 'phone_number']

class ExpenseSerializer(serializers.ModelSerializer):
    emp = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = Expense
        fields = '__all__'



