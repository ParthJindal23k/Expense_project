from rest_framework.decorators import api_view, parser_classes
from rest_framework.parsers import MultiPartParser, FormParser
from django.core.mail import send_mail
from django.contrib.auth.hashers import make_password, check_password
from rest_framework.response import Response
from datetime import timedelta, date

from .models import Employee,Expense,ExpenseRequest,Policy
from .serializers import RegisterSerializer,ExpenseSerializer
import random
from django.conf import settings



@api_view(['POST'])
def register_user(request):
    print("Request data:", request.data)  

    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        email = serializer.validated_data['email']
        if Employee.objects.filter(email = email).exists():
            return Response({"error": "Email already exists"}, status=400)

        otp = str(random.randint(100000,999999))
        emp = Employee.objects.create(
            username = serializer.validated_data['username'],
            email = email,
            password = make_password(serializer.validated_data['password']),
            phone_number = serializer.validated_data['phone_number'],
            otp = otp,

        )
        try:
            send_mail(
                'Hello from Clovia ReimburseX',
                f'Your OTP is {otp}. Please use this to verify your account.',
                settings.DEFAULT_FROM_EMAIL,
                [email],
            )
        except Exception as e:
            return Response({"error": f"Failed to send email: {str(e)}"}, status=500)
        
        print("Validation errors:", serializer.errors)
        return Response({"message":"OTP sent succesfully"} , status=201 )
    return Response(serializer.errors, status=400)

@api_view(['POST'])
def verify_otp(request):
    otp = request.data.get('otp')
    email = request.data.get('email')

    if not email or not otp :
        return Response({'error':'Email and OTP both are required'},status=400)
    try:
        emp = Employee.objects.get(email= email)
    except:
        return Response({'error':'Employee Not Found'},status=404)

    if emp.otp == otp:
        emp.is_verified = True
        emp.save()
        return Response({"message": "OTP verified successfully, Login with your Credentials when department is alloted"}, status=200)
    else:
        return Response({"error": "Invalid OTP"}, status=400)
    
@api_view(['POST'])
def login_emp(request):
    email = request.data.get('email')
    password = request.data.get('password')

    try:
        emp = Employee.objects.get(email = email)
    except:
        return Response({'error':"User not Found"}, status=404)
    
    if not emp.is_verified:
        return Response({"error":"User not verified"}, status=403)
    
    if not check_password(password , emp.password):
        return Response({"error":"Incorrect Password"}, status=401)
    
    if not emp.role:
        return Response({'message': 'Role not assigned. Contact admin.'}, status=400)

    return Response({'message': 'Login successful', 'username': emp.username , 'email':emp.email , 'role':emp.role , 'phone_number':emp.phone_number}, status=200)

        


@api_view(['POST'])
def manager_dashboard(request):
    email = request.data.get('email')

    try:
        emp = Employee.objects.get(email = email)

    except:
        return Response({'error':"User not found"}, status=404)
    
    username = emp.username
    role = emp.role
    department = emp.department.name_department
    phone_number = emp.phone_number
    grade = emp.grade
    id = emp.id
    

    return Response({'username':username,'email':email,'role':role , 'department':department, 'phone_number':phone_number, 'grade':grade , 'id' : id})


@api_view(['POST'])
def reset_password(request):
    email = request.data.get('email')
    password = request.data.get('password')

    try:
        emp = Employee.objects.get(email = email)
        emp.password = make_password(password)
        emp.save()

        return Response({'message': 'Password reset successful'}, status=200)
    except:

        return Response({'error': 'User not found'}, status=404)        


@api_view(['POST'])
@parser_classes([MultiPartParser, FormParser])  
def expense_request(request):
    email = request.data.get('email')

    try:
        employee = Employee.objects.get(email=email)
    except :
        return Response({'error': "Employee not found"}, status=404)

    data = request.data.copy()
    data.pop('email', None)

    serializer = ExpenseSerializer(data=data)
    if serializer.is_valid():
        expense = serializer.save(emp=employee)

        if employee.role == 'Employee':
            required_by = Employee.objects.get(role = 'Manager', department = employee.department)
            level = 'L1'
        else:
            required_by = employee.department.HOD
            level = 'HoD'
        

        ExpenseRequest.objects.create(
            expense = expense,
            required_by=required_by,
            level=level,
            status = "Pending",

        )

        return Response({
            "message": "Expense and request created successfully"
        }, status=201)
    else:
        print(serializer.errors)  
        return Response(serializer.errors, status=400)
    


@api_view(['POST'])
def expense_history(request):
    email = request.data.get('email')
    try:
        emp = Employee.objects.get(email = email)

    except:
        return Response({'error':"User not found"}, status=404)
    
    expense_requested = ExpenseRequest.objects.filter(expense__emp = emp).order_by('-time')

    history_data = []
    for req in expense_requested:
        history_data.append({
            "expense_date" : req.expense.date,
            'request_date': req.time,
            'note': req.expense.note,
            'amount': req.expense.amount,
            'status': req.status
        })

    return Response(history_data)


@api_view(['POST'])
def get_other_request(request):
    email = request.data.get("email")

    try:
        emp= Employee.objects.get(email = email)
        department = emp.department
        emp_req = ExpenseRequest.objects.filter(
            expense__emp__department = department,
            level = 'L1'
        ).select_related('expense','required_by')

        result = []
        for req in emp_req:
            result.append({
                'request_id': req.request_id,
                'raised_by' : req.expense.emp.id,
                'expense_date' : str(req.expense.date),
                'request_date' : str(req.time),
                'note': req.expense.note,
                "amount" : req.expense.amount,
                "status": req.status,
                'remarks' : req.remarks or ''
            })

        return Response(result)
    except:
        return Response({'error': 'Manager not found'}, status=400)




@api_view(['POST'])
def update_request(request):

    request_id = request.data.get('request_id')
    action = request.data.get('action')  
    remarks = request.data.get('remarks', '')
    
    try:
        req = ExpenseRequest.objects.get(request_id=request_id)

        if action == 'approve':
            req.status = 'Approved'
            req.remarks = remarks
            req.save()

            ExpenseRequest.objects.create(
                expense=req.expense,
                required_by=req.required_by,
                level='HoD',
                status='Pending',

            )

        elif action == 'reject':
            req.status = 'Rejected'
            req.remarks = remarks
            req.save()

        else:
            return Response({'error': 'Invalid action'}, status=400)

        return Response({'success': True})

    except ExpenseRequest.DoesNotExist:
        return Response({'error': 'Request not found'}, status=404)



@api_view(['POST'])
def hod_dashboard(request):
    email = request.data.get('email')

    try:
        emp = Employee.objects.get(email = email)

    except:
        return Response({'error':"User not found"}, status=404)
    
    username = emp.username
    role = emp.role
    department = emp.department.name_department
    phone_number = emp.phone_number
    grade = emp.grade
    id = emp.id
    

    return Response({'username':username,'email':email,'role':role , 'department':department, 'phone_number':phone_number, 'grade':grade , 'id' : id})


@api_view(['POST'])
def get_Hod_Other_request(request):
    email = request.data.get("email")

    try:
        emp= Employee.objects.get(email = email)
        department = emp.department
        emp_req = ExpenseRequest.objects.filter(
            expense__emp__department = department,
            level = 'HoD'
        ).select_related('expense','required_by')

        result = []
        for req in emp_req:
            result.append({
                'request_id': req.request_id,
                'raised_by' : req.expense.emp.id,
                'expense_date' : str(req.expense.date),
                'request_date' : str(req.time),
                'note': req.expense.note,
                "amount" : req.expense.amount,
                "status": req.status,
                'remarks' : req.remarks or ''
            })

        return Response(result)
    except:
        return Response({'error': 'Manager not found'}, status=400)
    

@api_view(['POST'])
def summary_request(request):
    email = request.data.get('email')
    emp = Employee.objects.get(email = email)
    id_ = emp.id

    expense_id = Expense.objects.filter(expense_id = id_)
    


@api_view(['POST'])
def hod_update_request(request):
    request_id = request.data.get('request_id')
    action = request.data.get('action')  
    remarks = request.data.get('remarks', '')
    
    try:
        req = ExpenseRequest.objects.get(request_id=request_id)

        if action == 'approve':
            req.status = 'Approved'
            req.remarks = remarks
            req.save()


        elif action == 'reject':
            req.status = 'Rejected'
            req.remarks = remarks
            req.save()

        else:
            return Response({'error': 'Invalid action'}, status=400)

        return Response({'success': True})

    except ExpenseRequest.DoesNotExist:
        return Response({'error': 'Request not found'}, status=404)



@api_view(['POST'])
def comp_other_request(request):
    email = request.data.get("email")

    try:
        emp= Employee.objects.get(email = email)
        department = emp.department
        emp_req = ExpenseRequest.objects.filter(
            expense__emp__department = department,
            level = 'HoD',
            status__in = ['Approved', 'Paid'] 
        ).select_related('expense','required_by')

        result = []
        for req in emp_req:
            result.append({
                'request_id': req.request_id,
                'raised_by' : req.expense.emp.id,
                'expense_date' : str(req.expense.date),
                'request_date' : str(req.time),
                'note': req.expense.note,
                "amount" : req.expense.amount,
                "status": req.status,
                'remarks' : req.remarks or ''
            })

        return Response(result)
    except:
        return Response({'error': 'Manager not found'}, status=400)
    

@api_view(['POST'])
def Comp_update_request(request):
    request_id = request.data.get('request_id')
    action = request.data.get('action')  
    remarks = request.data.get('remarks', '')
    
    try:
        req = ExpenseRequest.objects.get(request_id=request_id)

        if action == 'paid':
            req.status = 'Paid'
            req.remarks = remarks
            req.save()

        else:
            return Response({'error': 'Invalid action'}, status=400)

        return Response({'success': True})

    except ExpenseRequest.DoesNotExist:
        return Response({'error': 'Request not found'}, status=404)
    

@api_view(['POST'])
def check_policy(request):
    email = request.data.get('email')
    amount = request.data.get('amount')
    try:
        emp = Employee.objects.get(email = email)
    except:
        return Response({"status": "error", "message": "Employee not found"}, status=404)
    
    policies = Policy.objects.filter(grade = emp.grade ,department_id = emp.department_id  )
    today = date.today()

    for policy in policies:
        if policy.duration == 'weekly':
            weekday = today.weekday()
            

            

