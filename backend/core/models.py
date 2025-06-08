from django.db import models

class Employee(models.Model):
    username = models.CharField(max_length = 100)
    email = models.EmailField(unique = True)
    password = models.CharField(max_length = 100)
    phone_number = models.CharField(max_length = 10, unique = True)
    otp = models.CharField(max_length = 6, blank = True, null = True)
    is_verified = models.BooleanField(default = False)
    GRADE_CHOICES = [('A1','Grade A1'),('A2', 'Grade A2'), ('B1', 'Grade B1'), ('B2', 'Grade B2'), ('B3', 'Grade B3')]
    grade = models.CharField(max_length=2,choices=GRADE_CHOICES, blank=True, null=True)

    ROLE_CHOICES = [
        ('Hod', 'Hod'),
        ('Manager', 'Manager'),
        ('Employee', 'Employee'),
        ('Compensator', 'Compensator'),
    ]   
    role = models.CharField(max_length=20 , choices=ROLE_CHOICES, blank=True, null=True)

    department = models.ForeignKey('Department', on_delete=models.SET_NULL , null=True,related_name='employees')



    def __str__(self):
        return self.username
    

class Department(models.Model):
    department_id = models.IntegerField(primary_key=True)
    name_department = models.CharField(max_length=100)
    HOD = models.ForeignKey('Employee', on_delete=models.SET_NULL, null=True, related_name='headed_department')

    def __str__(self):
        return self.name_department


