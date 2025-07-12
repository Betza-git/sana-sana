from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from django.shortcuts import get_object_or_404
from django.contrib.auth import get_user_model
from .models import *
from .serializers import *
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated


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


# CLIENTES 
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
    
@api_view(['GET', 'PATCH', 'DELETE'])
@permission_classes([IsAuthenticated])
def cliente_me(request):
    """
    Endpoint para obtener, actualizar o eliminar el cliente autenticado.
    """
    try:
        cliente = request.user.cliente_profile
    except clientes.DoesNotExist:
        return Response({"detail": "Cliente no encontrado para este usuario."}, status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'GET':
        serializer = ClientesSerializer(cliente)
        return Response(serializer.data)
    
    elif request.method == 'PATCH':
        serializer = ClientesSerializer(cliente, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'DELETE':
        cliente.delete()
        request.user.delete()  # Elimina también el User si deseas
        return Response({"detail": "Cliente y usuario eliminados correctamente."}, status=status.HTTP_204_NO_CONTENT)

# ESPECIALISTAS 
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
    permission_classes = []

    def delete(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.user:
            instance.user.delete()
        instance.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


#  EMPLEADOS 
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


# CITAS
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def mis_citas(request):
    """
    Obtener todas las citas del usuario autenticado
    """
    try:
        cliente = request.user.cliente_profile
        citas_usuario = citas.objects.filter(cliente=cliente).select_related('servicio', 'especialista')
        
        citas_data = []
        for cita in citas_usuario:
            citas_data.append({
                'id': cita.id,
                'servicio': cita.servicio.nombre if cita.servicio else '',
                'servicio_id': cita.servicio.id if cita.servicio else None,
                'especialista': cita.especialista.nombre if cita.especialista else '',
                'especialista_id': cita.especialista.id if cita.especialista else None,
                'fecha': cita.fecha,
                'hora': cita.hora,
                'estado': cita.estado,
                'observaciones': cita.observaciones or '',
            })
        
        return Response(citas_data)
    except clientes.DoesNotExist:
        return Response({"detail": "Cliente no encontrado para este usuario."}, status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def crear_cita(request):
    """
    Crear una nueva cita para el usuario autenticado
    """
    try:
        cliente = request.user.cliente_profile
        data = request.data.copy()
        
        # Obtener servicio por nombre
        servicio_nombre = data.get('servicio')
        if not servicio_nombre:
            return Response({"error": "Servicio es requerido"}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            servicio_obj = servicios.objects.get(nombre=servicio_nombre)
        except servicios.DoesNotExist:
            return Response({"error": "Servicio no encontrado"}, status=status.HTTP_404_NOT_FOUND)
        
        # Obtener especialista por nombre
        especialista_nombre = data.get('especialista')
        if not especialista_nombre:
            return Response({"error": "Especialista es requerido"}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            especialista_obj = especialistas.objects.get(nombre=especialista_nombre)
        except especialistas.DoesNotExist:
            return Response({"error": "Especialista no encontrado"}, status=status.HTTP_404_NOT_FOUND)
        
        # Crear la cita
        nueva_cita = citas.objects.create(
            cliente=cliente,
            servicio=servicio_obj,
            especialista=especialista_obj,
            fecha=data.get('fecha'),
            hora=data.get('hora'),
            observaciones=data.get('observaciones', ''),
            estado='pendiente'
        )
        
        return Response({
            'id': nueva_cita.id,
            'servicio': nueva_cita.servicio.nombre,
            'especialista': nueva_cita.especialista.nombre,
            'fecha': nueva_cita.fecha,
            'hora': nueva_cita.hora,
            'estado': nueva_cita.estado,
            'observaciones': nueva_cita.observaciones,
            'message': 'Cita creada exitosamente'
        }, status=status.HTTP_201_CREATED)
        
    except clientes.DoesNotExist:
        return Response({"detail": "Cliente no encontrado para este usuario."}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def actualizar_cita(request, cita_id):
    """
    Actualizar una cita específica del usuario autenticado
    """
    try:
        cliente = request.user.cliente_profile
        cita = get_object_or_404(citas, id=cita_id, cliente=cliente)
        data = request.data.copy()
        
        # Actualizar servicio si se proporciona
        if 'servicio' in data:
            try:
                servicio_obj = servicios.objects.get(nombre=data['servicio'])
                cita.servicio = servicio_obj
            except servicios.DoesNotExist:
                return Response({"error": "Servicio no encontrado"}, status=status.HTTP_404_NOT_FOUND)
        
        # Actualizar especialista si se proporciona
        if 'especialista' in data:
            try:
                especialista_obj = especialistas.objects.get(nombre=data['especialista'])
                cita.especialista = especialista_obj
            except especialistas.DoesNotExist:
                return Response({"error": "Especialista no encontrado"}, status=status.HTTP_404_NOT_FOUND)
        
        # Actualizar otros campos
        if 'fecha' in data:
            cita.fecha = data['fecha']
        if 'hora' in data:
            cita.hora = data['hora']
        if 'observaciones' in data:
            cita.observaciones = data['observaciones']
        
        cita.save()
        
        return Response({
            'id': cita.id,
            'servicio': cita.servicio.nombre,
            'especialista': cita.especialista.nombre,
            'fecha': cita.fecha,
            'hora': cita.hora,
            'estado': cita.estado,
            'observaciones': cita.observaciones,
            'message': 'Cita actualizada exitosamente'
        })
        
    except clientes.DoesNotExist:
        return Response({"detail": "Cliente no encontrado para este usuario."}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def eliminar_cita(request, cita_id):
    """
    Eliminar una cita específica del usuario autenticado
    """
    try:
        cliente = request.user.cliente_profile
        cita = get_object_or_404(citas, id=cita_id, cliente=cliente)
        cita.delete()
        return Response({"message": "Cita eliminada exitosamente"}, status=status.HTTP_204_NO_CONTENT)
        
    except clientes.DoesNotExist:
        return Response({"detail": "Cliente no encontrado para este usuario."}, status=status.HTTP_404_NOT_FOUND)

# ENDPOINTS AUXILIARES
@api_view(['GET'])
@permission_classes([AllowAny])
def servicios_disponibles(request):
    """
    Obtener todos los servicios disponibles
    """
    servicios_list = servicios.objects.all()
    data = [{'id': s.id, 'nombre': s.nombre, 'descripcion': s.descripcion} for s in servicios_list]
    return Response(data)

@api_view(['GET'])
@permission_classes([AllowAny])
def especialistas_disponibles(request):
    """
    Obtener todos los especialistas disponibles
    """
    especialistas_list = especialistas.objects.all()
    data = [{'id': e.id, 'nombre': e.nombre, 'especialidad': e.especialidad} for e in especialistas_list]
    return Response(data)

@api_view(['GET'])
@permission_classes([AllowAny])
def especialistas_por_servicio(request, servicio_id):
    """
    Obtener especialistas que ofrecen un servicio específico
    """
    try:
        servicio = get_object_or_404(servicios, id=servicio_id)
        especialistas_servicio = especialistas_servicios.objects.filter(servicio=servicio).select_related('especialista')
        data = [{'id': es.especialista.id, 'nombre': es.especialista.nombre, 'especialidad': es.especialista.especialidad} 
                for es in especialistas_servicio]
        return Response(data)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

class CitasListCreate(ListCreateAPIView):
    queryset = citas.objects.all()
    serializer_class = CitasSerializer
    permission_classes = [AllowAny]


class CitasRetrieveUpdateDestroy(RetrieveUpdateDestroyAPIView):
    queryset = citas.objects.all()
    serializer_class = CitasSerializer
    permission_classes = [AllowAny]




# ENCUESTAS ESTRES 
class EncuestasEstresListCreate(ListCreateAPIView):
    queryset = encuestas_estres.objects.all()
    serializer_class = EncuestasEstresSerializer
    permission_classes = [AllowAny]


class EncuestasEstresRetrieveUpdateDestroy(RetrieveUpdateDestroyAPIView):
    queryset = encuestas_estres.objects.all()
    serializer_class = EncuestasEstresSerializer
    permission_classes = [AllowAny]


# SESIONES TERAPIA 
class SesionesTerapiaListCreate(ListCreateAPIView):
    queryset = sesiones_terapia.objects.all()
    serializer_class = SesionesTerapiaSerializer
    permission_classes = [AllowAny]


class SesionesTerapiaRetrieveUpdateDestroy(RetrieveUpdateDestroyAPIView):
    queryset = sesiones_terapia.objects.all()
    serializer_class = SesionesTerapiaSerializer
    permission_classes = [AllowAny]


#ESPECIALISTAS 
class EspecialistasServiciosListCreate(ListCreateAPIView):
    queryset = especialistas_servicios.objects.all()
    serializer_class = EspecialistasServiciosSerializer
    permission_classes = [AllowAny]


class EspecialistasServiciosRetrieveUpdateDestroy(RetrieveUpdateDestroyAPIView):
    queryset = especialistas_servicios.objects.all()
    serializer_class = EspecialistasServiciosSerializer
    permission_classes = [AllowAny]


#SERVICIOS
class ServiciosListCreate(ListCreateAPIView):
    queryset = servicios.objects.all()
    serializer_class = ServiciosSerializer
    permission_classes = [AllowAny]


class ServiciosRetrieveUpdateDestroy(RetrieveUpdateDestroyAPIView):
    queryset = servicios.objects.all()
    serializer_class = ServiciosSerializer
    permission_classes = [AllowAny]


#ESPECIALIDADES
class EspecialidadesListCreate(ListCreateAPIView):
    queryset = especialidades.objects.all()
    serializer_class = EspecialidadesSerializer
    permission_classes = [AllowAny]


class EspecialidadesRetrieveUpdateDestroy(RetrieveUpdateDestroyAPIView):
    queryset = especialidades.objects.all()
    serializer_class = EspecialidadesSerializer
    permission_classes = [AllowAny]


#METODOS PAGO 
class MetodoPagoListCreate(ListCreateAPIView):
    queryset = metodopago.objects.all()
    serializer_class = MetodosPagoSerializer
    permission_classes = [AllowAny]


class MetodosPagoRetrieveUpdateDestroy(RetrieveUpdateDestroyAPIView):
    queryset = metodopago.objects.all()
    serializer_class = MetodosPagoSerializer
    permission_classes = [AllowAny]


#PAGOS 
class PagoListCreate(ListCreateAPIView):
    queryset = pago.objects.all()
    serializer_class = PagosSerializer
    permission_classes = [AllowAny]


class PagoRetrieveUpdateDestroy(RetrieveUpdateDestroyAPIView):
    queryset = pago.objects.all()
    serializer_class = PagosSerializer
    permission_classes = [AllowAny]
