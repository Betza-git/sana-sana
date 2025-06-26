from django.db import models
from django.contrib.auth.models import User
#crea una tabla de auth_user con relacion a la tabla de clientes




class clientes(models.Model):
    nombre = models.CharField(max_length=100)
    numero_identificacion = models.CharField(max_length=20, unique=True)  
    email = models.EmailField()
    password = models.CharField(max_length=100)
    fechaNac = models.DateField()
    genero1 = models.CharField(max_length=10)  
    telefono = models.CharField(max_length=15) 
    


class especialidades(models.Model):
    nombre = models.CharField(max_length=100) 
    descripcion = models.TextField(blank=False, null=False)    

class especialistas(models.Model):
    
    nombre = models.CharField(max_length=100)
    especialidades = models.ForeignKey(especialidades, related_name='especialistas', on_delete=models.CASCADE)
    email = models.EmailField()
    password = models.CharField(max_length=100)
    fecha_registro = models.DateField()
    genero = models.CharField(max_length=10)  
    estado = models.BooleanField(default=True)     

class empleados(models.Model):
    
    nombre = models.CharField(max_length=100)
    numero_identificacion = models.CharField(max_length=20, unique=True)
    fecha_nacimiento = models.DateField()
    telefono = models.CharField(max_length=15)
    cargo = models.CharField(max_length=100)
    email = models.EmailField()
    password = models.CharField(max_length=100)
    fecha_contratacion = models.DateField()
    estado = models.CharField(max_length=10)

    

class citas(models.Model):
    cliente = models.ForeignKey(clientes, on_delete=models.CASCADE)
    especialista = models.ForeignKey(especialistas, on_delete=models.CASCADE)
    servicio = models.CharField(max_length=100)
    fecha = models.DateField()
    hora = models.TimeField()
    estado = models.CharField(max_length=20, default='pendiente')  # pendiente, confirmado, cancelado
    observaciones = models.TextField(blank=False, null=False)

class encuestas_estres(models.Model):
    cliente = models.ForeignKey(clientes, on_delete=models.CASCADE)
    fecha = models.DateField()
    nivel_estres = models.IntegerField()  # Nivel de estrés del 1 al 10
    puntuacion = models.IntegerField()  # Puntuación del 1 al 5
    comentarios = models.TextField(blank=False, null=False)  # Comentarios adicionales

class sesiones_terapia(models.Model):
    cliente = models.ForeignKey(clientes, on_delete=models.CASCADE)
    especialista = models.ForeignKey(especialistas, on_delete=models.CASCADE)
    cita = models.ForeignKey(citas, on_delete=models.CASCADE)
    fecha = models.DateField()
    hora = models.TimeField()
    duracion = models.IntegerField()  # Duración en minutos
    observaciones = models.TextField(blank=False, null=False)  # Observaciones de la sesión     

class especialistas_servicios(models.Model):
    especialista = models.ForeignKey(especialistas, on_delete=models.CASCADE)
    servicio = models.CharField(max_length=100)

class servicios(models.Model):
    nombre = models.CharField(max_length=100)
    descripcion = models.TextField(blank=False, null=False)  # Descripción del servicio
    precio = models.DecimalField(max_digits=10, decimal_places=2)  # Precio del servicio
    duracion = models.IntegerField()  # Duración en minutos del servicio


class metodopago(models.Model):
    nombre = models.CharField(max_length=100)
    descripcion = models.TextField(blank=False, null=False)
    requiere_autenticacion = models.BooleanField(default=False)
    comision = models.DecimalField(max_digits=5, decimal_places=2, default=0.0)


class pago(models.Model):
    empleado = models.ForeignKey(empleados, on_delete=models.CASCADE)
    metodopago = models.ForeignKey(metodopago, on_delete=models.PROTECT)
    monto = models.DecimalField(max_digits=11, decimal_places=3)
    descripcion = models.TextField(blank=True)
    fecha_pago = models.DateTimeField(auto_now_add=True)
    confirmado = models.CharField(max_length=10)

 


  
    
