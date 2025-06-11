from django.db import models

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
    fecha_registro = models.DateField(auto_now_add=True)
    genero = models.CharField(max_length=10)  # Masculino, Femenino, Otro
    estado = models.BooleanField(default=True)     

class empleados(models.Model):
    nombre = models.CharField(max_length=100)
    email = models.EmailField()
    telefono = models.CharField(max_length=15)
    cargo = models.CharField(max_length=100)
    usuario = models.CharField(max_length=100)
    password = models.CharField(max_length=100)
    estado = models.BooleanField(default=True)  # Activo o inactivo
    

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


class metodos_pago(models.Model):
    nombre = models.CharField(max_length=100)  # Nombre del método de pago
    descripcion = models.TextField(blank=False, null=False)  # Descripción del método de pago
    requiere_autenticacion = models.BooleanField(default=False)  # Indica si requiere autenticación
    comision = models.DecimalField(max_digits=5, decimal_places=2, default=0.0)  # Comisión del método de pago
    fecha_hora = models.DateTimeField(auto_now_add=True)  # Fecha y hora de creación del método de pago

class pagos(models.Model):
    cliente = models.ForeignKey(clientes, on_delete=models.CASCADE)
    metodo_pago = models.ForeignKey(metodos_pago, on_delete=models.CASCADE)
    monto = models.DecimalField(max_digits=10, decimal_places=2)
    fecha_hora = models.DateTimeField(auto_now_add=True)
    estado = models.CharField(max_length=20, default='pendiente')  # pendiente, confirmado, cancelado
    observaciones = models.TextField(blank=False, null=False)
    