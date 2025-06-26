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
    

class Expense(models.Model):

    STATUS_CHOICES = [
        ('Pending', 'Pending'),
        ('Approved', 'Approved'),
        ('Rejected', 'Rejected'),
        ('Paid', 'Paid')
    ]

    
    expense_id = models.AutoField(primary_key=True)
    emp = models.ForeignKey(Employee , on_delete=models.CASCADE , related_name='expenses')
    date = models.DateField()
    note = models.CharField(max_length=500)
    amount = models.IntegerField()
    proof= models.FileField(upload_to='expense_proofs/')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Pending')
    reason_for_hod = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)


    def __str__(self):
        return  f"Expense {self.expense_id} by {self.emp.email}"


class ExpenseRequest(models.Model):
    LEVEL_CHOICES = [
        ('L1', 'L1'),
        ('HoD', 'HoD'),
        
    ]

    STATUS_CHOICES = [
        ('Pending', 'Pending'),
        ('Approved', 'Approved'),
        ('Rejected', 'Rejected'),
        ('Paid', 'Paid')
    ]

    request_id = models.AutoField(primary_key=True)
    expense = models.ForeignKey(Expense, on_delete=models.CASCADE, related_name='requests')
    required_by = models.ForeignKey(Employee, on_delete=models.SET_NULL, null=True, related_name='approval_requests')
    level = models.CharField(max_length=10, choices=LEVEL_CHOICES)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Pending')
    remarks = models.CharField(max_length=255, null=True, blank=True)
    time = models.DateTimeField(auto_now=True)



    def __str__(self):
        return f"{self.level} approval for Expense {self.expense.expense_id}"
    


class Policy(models.Model):
    GRADE_CHOICES = [('A1','Grade A1'),('A2', 'Grade A2'), ('B1', 'Grade B1'), ('B2', 'Grade B2'), ('B3', 'Grade B3')]
    PRIORITY_CHOICES = [(1, 'Higher Priority') , (2, "Lower Priority")]

    policy_name = models.CharField(max_length= 100)
    grade = models.CharField(max_length=2,choices=GRADE_CHOICES, blank=True, null=True)
    department_id = models.IntegerField()
    limit_amount = models.IntegerField()
    duration = models.CharField(max_length= 10 , choices=[('Weekly', 'Weekly'), ('Monthly','Monthly')])
    policy_type = models.CharField(max_length=10, choices=[('Hard', 'Hard'), ('Soft', 'Soft')])
    priority = models.IntegerField(default=1, choices= PRIORITY_CHOICES)


    def __str__(self):
        return self.policy_name