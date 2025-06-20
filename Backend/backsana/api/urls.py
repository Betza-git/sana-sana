from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from .views import (
    ClienteLoginAPIView,
    EspecialistaLoginAPIView,
    EmpleadoLoginAPIView,
    ClientesListCreate,
    ClientesRetrieveUpdateDestroy,
    EspecialistasListCreate,
    EspecialistasRetrieveUpdateDestroy,
    EmpleadosListCreate,
    EmpleadosRetrieveUpdateDestroy,
    CitasListCreate,
    CitasRetrieveUpdateDestroy,
    EncuestasEstresListCreate,
    EncuestasEstresRetrieveUpdateDestroy,
    SesionesTerapiaListCreate,
    SesionesTerapiaRetrieveUpdateDestroy,
    EspecialistasServiciosListCreate,
    EspecialistasServiciosRetrieveUpdateDestroy,
    EspecialidadesListCreate,
    EspecialidadesRetrieveUpdateDestroy,
    ServiciosListCreate,
    ServiciosRetrieveUpdateDestroy,
    MetodosPagoListCreate,
    MetodosPagoRetrieveUpdateDestroy,
    PagosListCreate,
    PagosRetrieveUpdateDestroy,
)

urlpatterns = [
    path('clientes/login/', ClienteLoginAPIView.as_view(), name='cliente-login'),
    path('especialistas/login/', EspecialistaLoginAPIView.as_view(), name='especialista-login'),
    path('empleados/login/', EmpleadoLoginAPIView.as_view(), name='empleado-login'),

    path('clientes/', ClientesListCreate.as_view(), name='clientes-list-create'),
    path('clientes/<int:pk>/', ClientesRetrieveUpdateDestroy.as_view(), name='clientes-detail'),

    path('especialistas/', EspecialistasListCreate.as_view(), name='especialistas-list-create'),
    path('especialistas/<int:pk>/', EspecialistasRetrieveUpdateDestroy.as_view(), name='especialistas-detail'),

    path('empleados/', EmpleadosListCreate.as_view(), name='empleados-list-create'),
    path('empleados/<int:pk>/', EmpleadosRetrieveUpdateDestroy.as_view(), name='empleados-detail'),

    path('citas/', CitasListCreate.as_view(), name='citas-list-create'),
    path('citas/<int:pk>/', CitasRetrieveUpdateDestroy.as_view(), name='citas-detail'),

    path('encuestas-estres/', EncuestasEstresListCreate.as_view(), name='encuestas-estres-list-create'),
    path('encuestas-estres/<int:pk>/', EncuestasEstresRetrieveUpdateDestroy.as_view(), name='encuestas-estres-detail'),

    path('sesiones-terapia/', SesionesTerapiaListCreate.as_view(), name='sesiones-terapia-list-create'),
    path('sesiones-terapia/<int:pk>/', SesionesTerapiaRetrieveUpdateDestroy.as_view(), name='sesiones-terapia-detail'),

    path('especialistas-servicios/', EspecialistasServiciosListCreate.as_view(), name='especialistas-servicios-list-create'),
    path('especialistas-servicios/<int:pk>/', EspecialistasServiciosRetrieveUpdateDestroy.as_view(), name='especialistas-servicios-detail'),

    path('servicios/', ServiciosListCreate.as_view(), name='servicios-list-create'),
    path('servicios/<int:pk>/', ServiciosRetrieveUpdateDestroy.as_view(), name='servicios-detail'),

    path('especialidades/', EspecialidadesListCreate.as_view(), name='especialidades-list-create'),
    path('especialidades/<int:pk>/', EspecialidadesRetrieveUpdateDestroy.as_view(), name='especialidades-detail'),

    path('metodos-pago/', MetodosPagoListCreate.as_view(), name='metodos-pago-list-create'),
    path('metodos-pago/<int:pk>/', MetodosPagoRetrieveUpdateDestroy.as_view(), name='metodos-pago-detail'),

    path('pagos/', PagosListCreate.as_view(), name='pagos-list-create'),
    path('pagos/<int:pk>/', PagosRetrieveUpdateDestroy.as_view(), name='pagos-detail'),

]