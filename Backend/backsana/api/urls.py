from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from .views import *

urlpatterns = [
    path("admin/", AdminDashboardAPIView.as_view(), name="admin-dashboard"),
    path('admin/<int:id>/', AdminDashboardAPIView.as_view()),

    #Login único usando LoginAPIView  
    path('login/', LoginAPIView.as_view(), name='login'),
    path('clientes/me/', cliente_me, name='cliente-me'),
    path('clientes/me/', cliente_me, name='cliente-me'),


    path('clientes/', ClientesListCreate.as_view(), name='clientes-list-create'),
    path('clientes/<int:pk>/', ClientesRetrieveUpdateDestroy.as_view(), name='clientes-detail'),

    path('especialistas/', EspecialistasListCreate.as_view(), name='especialistas-list-create'),
    path('especialistas/<int:pk>/', EspecialistasRetrieveUpdateDestroy.as_view(), name='especialistas-detail'),

    path('empleados/', EmpleadosListCreate.as_view(), name='empleados-list-create'),
    path('empleados/<int:pk>/', EmpleadosRetrieveUpdateDestroy.as_view(), name='empleados-detail'),

    path('citas/', CitasListCreate.as_view(), name='citas-list-create'),
    path('citas/<int:pk>/', CitasRetrieveUpdateDestroy.as_view(), name='citas-detail'),


    path('mis-citas/', mis_citas, name='mis-citas'),
    path('crear-cita/', crear_cita, name='crear-cita'),
    path('actualizar-cita/<int:cita_id>/', actualizar_cita, name='actualizar-cita'),
    path('eliminar-cita/<int:cita_id>/', eliminar_cita, name='eliminar-cita'),

    # URLs auxiliares
    path('servicios-disponibles/', servicios_disponibles, name='servicios-disponibles'),
    path('especialistas-disponibles/', especialistas_disponibles, name='especialistas-disponibles'),
    path('especialistas-por-servicio/<int:servicio_id>/', especialistas_por_servicio, name='especialistas-por-servicio'),

  

    
    

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

    path('metodopago/', MetodoPagoListCreate.as_view(), name='metodopago-list-create'),
    path('metodopago/<int:pk>/', MetodosPagoRetrieveUpdateDestroy.as_view(), name='metodopago-detail'),

    path('pago/', PagoListCreate.as_view(), name='pago-list-create'),
    path('pago/<int:pk>/', PagoRetrieveUpdateDestroy.as_view(), name='pago-detail'),
]
