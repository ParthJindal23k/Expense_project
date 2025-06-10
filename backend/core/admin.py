from django.contrib import admin

# Register your models here.

from .models import Employee,Department,Expense,ExpenseRequest
admin.site.register(Employee)
admin.site.register(Department)
admin.site.register(ExpenseRequest)
admin.site.register(Expense)


