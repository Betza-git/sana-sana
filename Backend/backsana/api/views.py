# views.py - Corregido y optimizado

from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from django.shortcuts import get_object_or_404
from django.contrib.auth import get_user_model
from .models import User, clientes, especialistas, empleados, citas, encuestas_estres, sesiones_terapia, especialistas_servicios, servicios, especialidades, metodopago, pago
from .serializers import *

User = get_user_model()

# LOGIN VIEW
class LoginAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        print("🔐 LoginAPIView - Iniciando proceso de login")
        email = request.data.get('email')
        password = request.data.get('password')

        if not email or not password:
            return Response({"error": "Email y password son requeridos."}, status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.filter(email=email).first()
        if user:
            print(f"👤 Usuario encontrado: {user.email}, Rol: {user.rol}")
            if user.check_password(password):
                refresh = RefreshToken.for_user(user)
                return Response({
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                    'user': {
                        'id': user.id,
                        'email': user.email,
                        'tipo': user.rol
                    }
                }, status=status.HTTP_200_OK)
            else:
                print("❌ Contraseña incorrecta")
                return Response({"error": "Credenciales inválidas."}, status=status.HTTP_401_UNAUTHORIZED)
        else:
            print("❌ Usuario no encontrado")
            return Response({"error": "Credenciales inválidas."}, status=status.HTTP_401_UNAUTHORIZED)


# ADMIN DASHBOARD
class AdminDashboardAPIView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, id=None):
        if id:
            empleado_obj = get_object_or_404(empleados, id=id, user__rol='empleado')
            serializer = EmpleadosSerializer(empleado_obj)
            return Response(serializer.data)
        empleados_list = empleados.objects.filter(user__rol='empleado')
        serializer = EmpleadosSerializer(empleados_list, many=True)
        return Response(serializer.data)

    def post(self, request):
        data = request.data.copy()
        required_fields = ['email', 'password', 'nombre', 'telefono', 'cargo', 'fecha_contratacion']
        missing_fields = [field for field in required_fields if not data.get(field)]

        if missing_fields:
            return Response({'error': f'Campos requeridos faltantes: {", ".join(missing_fields)}'}, status=status.HTTP_400_BAD_REQUEST)

        if User.objects.filter(email=data.get('email')).exists():
            return Response({'email': ['Este email ya está registrado']}, status=status.HTTP_400_BAD_REQUEST)

        new_user = User.objects.create_user(
            email=data.get('email'),
            password=data.get('password'),
            nombre=data.get('nombre'),
            rol='empleado'
        )
        data['user'] = new_user.id

        serializer = EmpleadosSerializer(data=data)
        if serializer.is_valid():
            empleado = serializer.save()
            return Response({'id': empleado.id, 'message': 'Administrador creado exitosamente', 'admin': EmpleadosSerializer(empleado).data}, status=status.HTTP_201_CREATED)
        else:
            new_user.delete()
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request, id=None):
        if not id:
            return Response({"detail": "ID is required for update"}, status=status.HTTP_400_BAD_REQUEST)
        empleado_obj = get_object_or_404(empleados, id=id)
        serializer = EmpleadosSerializer(empleado_obj, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, id=None):
        if not id:
            return Response({"detail": "ID is required for delete"}, status=status.HTTP_400_BAD_REQUEST)
        empleado_obj = get_object_or_404(empleados, id=id)
        if empleado_obj.user:
            empleado_obj.user.delete()
        empleado_obj.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


# CLIENTES CRUD
class ClientesListCreate(ListCreateAPIView):
    queryset = clientes.objects.all()
    serializer_class = ClientesSerializer
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        data = request.data.copy()
        if not data.get('email'):
            return Response({"detail": "Email is required."}, status=status.HTTP_400_BAD_REQUEST)

        new_user = User.objects.create_user(
            email=data.get('email'),
            password=data.get('password'),
            nombre=data.get('nombre'),
            rol='cliente'
        )
        data['user'] = new_user.id

        serializer = ClientesSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        new_user.delete()
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ClientesRetrieveUpdateDestroy(RetrieveUpdateDestroyAPIView):
    queryset = clientes.objects.all()
    serializer_class = ClientesSerializer
    permission_classes = [AllowAny]

    def delete(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.user:
            instance.user.delete()
        instance.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


# ESPECIALISTAS CRUD
class EspecialistasListCreate(ListCreateAPIView):
    queryset = especialistas.objects.all()
    serializer_class = EspecialistasSerializer
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        data = request.data.copy()
        if not data.get('email'):
            return Response({"detail": "Email is required."}, status=status.HTTP_400_BAD_REQUEST)

        new_user = User.objects.create_user(
            email=data.get('email'),
            password=data.get('password'),
            nombre=data.get('nombre'),
            rol='especialista'
        )
        data['user'] = new_user.id

        serializer = EspecialistasSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        new_user.delete()
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class EspecialistasRetrieveUpdateDestroy(RetrieveUpdateDestroyAPIView):
    queryset = especialistas.objects.all()
    serializer_class = EspecialistasSerializer
    permission_classes = [AllowAny]

    def delete(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.user:
            instance.user.delete()
        instance.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


#  EMPLEADOS CRUD
class EmpleadosListCreate(ListCreateAPIView):
    queryset = empleados.objects.all()
    serializer_class = EmpleadosSerializer
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        data = request.data.copy()
        if not data.get('email'):
            return Response({"detail": "Email is required."}, status=status.HTTP_400_BAD_REQUEST)

        new_user = User.objects.create_user(
            email=data.get('email'),
            password=data.get('password'),
            nombre=data.get('nombre'),
            rol='empleado'
        )
        data['user'] = new_user.id

        serializer = EmpleadosSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        new_user.delete()
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class EmpleadosRetrieveUpdateDestroy(RetrieveUpdateDestroyAPIView):
    queryset = empleados.objects.all()
    serializer_class = EmpleadosSerializer
    permission_classes = [AllowAny]


# CITAS CRUD
class CitasListCreate(ListCreateAPIView):
    queryset = citas.objects.all()
    serializer_class = CitasSerializer
    permission_classes = [AllowAny]


class CitasRetrieveUpdateDestroy(RetrieveUpdateDestroyAPIView):
    queryset = citas.objects.all()
    serializer_class = CitasSerializer
    permission_classes = [AllowAny]


# ENCUESTAS ESTRES CRUD
class EncuestasEstresListCreate(ListCreateAPIView):
    queryset = encuestas_estres.objects.all()
    serializer_class = EncuestasEstresSerializer
    permission_classes = [AllowAny]


class EncuestasEstresRetrieveUpdateDestroy(RetrieveUpdateDestroyAPIView):
    queryset = encuestas_estres.objects.all()
    serializer_class = EncuestasEstresSerializer
    permission_classes = [AllowAny]


# SESIONES TERAPIA CRUD
class SesionesTerapiaListCreate(ListCreateAPIView):
    queryset = sesiones_terapia.objects.all()
    serializer_class = SesionesTerapiaSerializer
    permission_classes = [AllowAny]


class SesionesTerapiaRetrieveUpdateDestroy(RetrieveUpdateDestroyAPIView):
    queryset = sesiones_terapia.objects.all()
    serializer_class = SesionesTerapiaSerializer
    permission_classes = [AllowAny]


# ✅ ESPECIALISTAS SERVICIOS CRUD
class EspecialistasServiciosListCreate(ListCreateAPIView):
    queryset = especialistas_servicios.objects.all()
    serializer_class = EspecialistasServiciosSerializer
    permission_classes = [AllowAny]


class EspecialistasServiciosRetrieveUpdateDestroy(RetrieveUpdateDestroyAPIView):
    queryset = especialistas_servicios.objects.all()
    serializer_class = EspecialistasServiciosSerializer
    permission_classes = [AllowAny]


# ✅ SERVICIOS CRUD
class ServiciosListCreate(ListCreateAPIView):
    queryset = servicios.objects.all()
    serializer_class = ServiciosSerializer
    permission_classes = [AllowAny]


class ServiciosRetrieveUpdateDestroy(RetrieveUpdateDestroyAPIView):
    queryset = servicios.objects.all()
    serializer_class = ServiciosSerializer
    permission_classes = [AllowAny]


# ✅ ESPECIALIDADES CRUD
class EspecialidadesListCreate(ListCreateAPIView):
    queryset = especialidades.objects.all()
    serializer_class = EspecialidadesSerializer
    permission_classes = [AllowAny]


class EspecialidadesRetrieveUpdateDestroy(RetrieveUpdateDestroyAPIView):
    queryset = especialidades.objects.all()
    serializer_class = EspecialidadesSerializer
    permission_classes = [AllowAny]


# ✅ METODOS PAGO CRUD
class MetodoPagoListCreate(ListCreateAPIView):
    queryset = metodopago.objects.all()
    serializer_class = MetodosPagoSerializer
    permission_classes = [AllowAny]


class MetodosPagoRetrieveUpdateDestroy(RetrieveUpdateDestroyAPIView):
    queryset = metodopago.objects.all()
    serializer_class = MetodosPagoSerializer
    permission_classes = [AllowAny]


# ✅ PAGOS CRUD
class PagoListCreate(ListCreateAPIView):
    queryset = pago.objects.all()
    serializer_class = PagosSerializer
    permission_classes = [AllowAny]


class PagoRetrieveUpdateDestroy(RetrieveUpdateDestroyAPIView):
    queryset = pago.objects.all()
    serializer_class = PagosSerializer
    permission_classes = [AllowAny]
