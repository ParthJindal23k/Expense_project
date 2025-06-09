from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.core.mail import send_mail
from django.contrib.auth.hashers import make_password, check_password

from .models import Employee
from .serializers import RegisterSerializer
import random
from django.conf import settings



@api_view(['POST'])
def register_user(request):
    print("Request data:", request.data)  # to check what you are receiving

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

    return Response({'message': 'Login successful', 'username': emp.username , 'email':emp.email , 'role':emp.role }, status=200)

        

        
