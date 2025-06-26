from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView 
from .models import clientes, especialistas, empleados, citas, encuestas_estres, sesiones_terapia, especialistas_servicios, servicios, especialidades, metodopago, pago
from django.contrib.auth.models import User
from .serializers import ClienteLoginSerializer, EspecialistaLoginSerializer, EmpleadosSerializer, ClientesSerializer, EspecialistasSerializer, EmpleadosSerializer, CitasSerializer, EncuestasEstresSerializer, SesionesTerapiaSerializer, EspecialistasServiciosSerializer, ServiciosSerializer, EspecialidadesSerializer, MetodosPagoSerializer , PagosSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from django.shortcuts import get_object_or_404
"""Vistas:
Implementar vistas para cada modelo usando las clases genéricas
ListCreateAPIView y RetrieveUpdateDestroyAPIView.
api views"""

class AdminDashboardAPIView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, id=None):
        if id:
            empleado_obj = get_object_or_404(empleados, id=id)
            serializer = EmpleadosSerializer(empleado_obj)
            return Response(serializer.data)
        else:
            empleados_list = empleados.objects.all()
            serializer = EmpleadosSerializer(empleados_list, many=True)
            return Response(serializer.data)

    def post(self, request):
        serializer = EmpleadosSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
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
        empleado_obj.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    

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
        serializer = EmpleadosSerializer(data=request.data)
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
    permission_classes = [AllowAny]

class ClientesRetrieveUpdateDestroy(RetrieveUpdateDestroyAPIView):
    queryset = clientes.objects.all()
    serializer_class = ClientesSerializer
    permission_classes = [AllowAny]
    

class EspecialistasListCreate(ListCreateAPIView):
    queryset = especialistas.objects.all()
    serializer_class = EspecialistasSerializer
    permission_classes = [AllowAny]

class EspecialistasRetrieveUpdateDestroy(RetrieveUpdateDestroyAPIView):
    queryset = especialistas.objects.all()
    serializer_class = EspecialistasSerializer
    permission_classes = [AllowAny]

class EmpleadosListCreate(ListCreateAPIView):
    queryset = empleados.objects.all()
    serializer_class = EmpleadosSerializer
    permission_classes = [AllowAny]

class EmpleadosRetrieveUpdateDestroy(RetrieveUpdateDestroyAPIView):
    queryset = empleados.objects.all()
    serializer_class = EmpleadosSerializer
    permission_classes = [AllowAny]

class CitasListCreate(ListCreateAPIView):
    queryset = citas.objects.all()
    serializer_class = CitasSerializer
    permission_classes = [AllowAny]

class CitasRetrieveUpdateDestroy(RetrieveUpdateDestroyAPIView):
    queryset = citas.objects.all()
    serializer_class = CitasSerializer
    permission_classes = [AllowAny]

class EncuestasEstresListCreate(ListCreateAPIView):
    queryset = encuestas_estres.objects.all()
    serializer_class = EncuestasEstresSerializer
    permission_classes = [AllowAny]

class EncuestasEstresRetrieveUpdateDestroy(RetrieveUpdateDestroyAPIView):
    queryset = encuestas_estres.objects.all()
    serializer_class = EncuestasEstresSerializer
    permission_classes = [AllowAny]

class SesionesTerapiaListCreate(ListCreateAPIView):
    queryset = sesiones_terapia.objects.all()
    serializer_class = SesionesTerapiaSerializer
    permission_classes = [AllowAny]

class SesionesTerapiaRetrieveUpdateDestroy(RetrieveUpdateDestroyAPIView):
    queryset = sesiones_terapia.objects.all()
    serializer_class = SesionesTerapiaSerializer
    permission_classes = [AllowAny]

class EspecialistasServiciosListCreate(ListCreateAPIView):
    queryset = especialistas_servicios.objects.all()
    serializer_class = EspecialistasServiciosSerializer
    permission_classes = [AllowAny]

class EspecialistasServiciosRetrieveUpdateDestroy(RetrieveUpdateDestroyAPIView):
    queryset = especialistas_servicios.objects.all()
    serializer_class = EspecialistasServiciosSerializer
    permission_classes = [AllowAny]

class ServiciosListCreate(ListCreateAPIView):
    queryset = servicios.objects.all()
    serializer_class = ServiciosSerializer
    permission_classes = [AllowAny]

class ServiciosRetrieveUpdateDestroy(RetrieveUpdateDestroyAPIView):
    queryset = servicios.objects.all()
    serializer_class = ServiciosSerializer
    permission_classes = [AllowAny]

class EspecialidadesListCreate(ListCreateAPIView):
    queryset = especialidades.objects.all()
    serializer_class = EspecialidadesSerializer
    permission_classes = [AllowAny]

class EspecialidadesRetrieveUpdateDestroy(RetrieveUpdateDestroyAPIView):
    queryset = especialidades.objects.all()
    serializer_class = EspecialidadesSerializer

class MetodoPagoListCreate(ListCreateAPIView):
    queryset = metodopago.objects.all()
    serializer_class = MetodosPagoSerializer

class MetodosPagoRetrieveUpdateDestroy(RetrieveUpdateDestroyAPIView):
    queryset = metodopago.objects.all()
    serializer_class = MetodosPagoSerializer

class PagoListCreate(ListCreateAPIView):
    queryset = pago.objects.all()
    serializer_class = PagosSerializer

class PagoRetrieveUpdateDestroy(RetrieveUpdateDestroyAPIView):
    queryset = pago.objects.all()
    serializer_class = PagosSerializer


