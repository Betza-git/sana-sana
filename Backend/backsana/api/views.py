from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView 
from .models import clientes, especialistas, empleados, citas, encuestas_estres, sesiones_terapia, especialistas_servicios, servicios, especialidades, metodos_pago, pagos
from .serializers import ClienteLoginSerializer, EspecialistaLoginSerializer, EmpleadoLoginSerializer, ClientesSerializer, EspecialistasSerializer, EmpleadosSerializer, CitasSerializer, EncuestasEstresSerializer, SesionesTerapiaSerializer, EspecialistasServiciosSerializer, ServiciosSerializer, EspecialidadesSerializer, MetodosPagoSerializer, PagosSerializer   
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
"""Vistas:
Implementar vistas para cada modelo usando las clases genéricas
ListCreateAPIView y RetrieveUpdateDestroyAPIView.
api views"""

class ClienteLoginAPIView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        serializer = ClienteLoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data['user']
            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'user': {
                    'id': user.id,
                    'nombre': user.nombre,
                    'email': user.email,
                    'tipo': 'cliente'
                }
            }, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class EspecialistaLoginAPIView(APIView):
    permission_classes = [AllowAny]
    
    
    def post(self, request):
        serializer = EspecialistaLoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data['user']
            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'user': {
                    'id': user.id,
                    'nombre': user.nombre,
                    'email': user.email,
                    'especialidad': user.especialidad,
                    'tipo': 'especialista'
                }
            }, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class EmpleadoLoginAPIView(APIView):
    permission_classes = [AllowAny]
    
    
    def post(self, request):
        serializer = EmpleadoLoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data['user']
            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'user': {
                    'id': user.id,
                    'nombre': user.nombre,
                    'email': user.email,
                    'cargo': user.cargo,
                    'tipo': 'empleado'
                }
            }, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ClientesListCreate(ListCreateAPIView):
    queryset = clientes.objects.all()
    serializer_class = ClientesSerializer
    permission_classes = [IsAuthenticated]

class ClientesRetrieveUpdateDestroy(RetrieveUpdateDestroyAPIView):
    queryset = clientes.objects.all()
    serializer_class = ClientesSerializer
    permission_classes = [IsAuthenticated]
    

class EspecialistasListCreate(ListCreateAPIView):
    queryset = especialistas.objects.all()
    serializer_class = EspecialistasSerializer
    permission_classes = [IsAuthenticated]

class EspecialistasRetrieveUpdateDestroy(RetrieveUpdateDestroyAPIView):
    queryset = especialistas.objects.all()
    serializer_class = EspecialistasSerializer
    permission_classes = [IsAuthenticated]

class EmpleadosListCreate(ListCreateAPIView):
    queryset = empleados.objects.all()
    serializer_class = EmpleadosSerializer
    permission_classes = [IsAuthenticated]

class EmpleadosRetrieveUpdateDestroy(RetrieveUpdateDestroyAPIView):
    queryset = empleados.objects.all()
    serializer_class = EmpleadosSerializer
    permission_classes = [IsAuthenticated]

class CitasListCreate(ListCreateAPIView):
    queryset = citas.objects.all()
    serializer_class = CitasSerializer
    permission_classes = [IsAuthenticated]

class CitasRetrieveUpdateDestroy(RetrieveUpdateDestroyAPIView):
    queryset = citas.objects.all()
    serializer_class = CitasSerializer
    permission_classes = [IsAuthenticated]

class EncuestasEstresListCreate(ListCreateAPIView):
    queryset = encuestas_estres.objects.all()
    serializer_class = EncuestasEstresSerializer

class EncuestasEstresRetrieveUpdateDestroy(RetrieveUpdateDestroyAPIView):
    queryset = encuestas_estres.objects.all()
    serializer_class = EncuestasEstresSerializer

class SesionesTerapiaListCreate(ListCreateAPIView):
    queryset = sesiones_terapia.objects.all()
    serializer_class = SesionesTerapiaSerializer

class SesionesTerapiaRetrieveUpdateDestroy(RetrieveUpdateDestroyAPIView):
    queryset = sesiones_terapia.objects.all()
    serializer_class = SesionesTerapiaSerializer

class EspecialistasServiciosListCreate(ListCreateAPIView):
    queryset = especialistas_servicios.objects.all()
    serializer_class = EspecialistasServiciosSerializer

class EspecialistasServiciosRetrieveUpdateDestroy(RetrieveUpdateDestroyAPIView):
    queryset = especialistas_servicios.objects.all()
    serializer_class = EspecialistasServiciosSerializer

class ServiciosListCreate(ListCreateAPIView):
    queryset = servicios.objects.all()
    serializer_class = ServiciosSerializer

class ServiciosRetrieveUpdateDestroy(RetrieveUpdateDestroyAPIView):
    queryset = servicios.objects.all()
    serializer_class = ServiciosSerializer

class EspecialidadesListCreate(ListCreateAPIView):
    queryset = especialidades.objects.all()
    serializer_class = EspecialidadesSerializer

class EspecialidadesRetrieveUpdateDestroy(RetrieveUpdateDestroyAPIView):
    queryset = especialidades.objects.all()
    serializer_class = EspecialidadesSerializer

class MetodosPagoListCreate(ListCreateAPIView):
    queryset = metodos_pago.objects.all()
    serializer_class = MetodosPagoSerializer
class MetodosPagoRetrieveUpdateDestroy(RetrieveUpdateDestroyAPIView):
    queryset = metodos_pago.objects.all()
    serializer_class = MetodosPagoSerializer

class PagosListCreate(ListCreateAPIView):
    queryset = pagos.objects.all()
    serializer_class = PagosSerializer

class PagosRetrieveUpdateDestroy(RetrieveUpdateDestroyAPIView):
    queryset = pagos.objects.all()
    serializer_class = PagosSerializer


