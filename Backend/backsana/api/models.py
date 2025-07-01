from django.db import models
from django.contrib.auth.models import User
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.utils import timezone

# ================================
# User personalizado para autenticación de roles
# ================================
class UserManager(BaseUserManager):
    def create_user(self, email, nombre, password, rol='cliente', **extra_fields):
        if not email:
            raise ValueError('El email es obligatorio')
        email = self.normalize_email(email)
        user = self.model(email=email, nombre=nombre, rol=rol, password=password, **extra_fields)
        user.set_password(password)  # hashing automático
        user.save(using=self._db)
        return user

    def create_superuser(self, email, nombre, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(email, nombre, password, rol='empleado', **extra_fields)

# ================================
# User model extendido con los roles
# ================================
class User(AbstractBaseUser, PermissionsMixin):
    ROLES = (
        ('admin', 'Admin'),
        ('cliente', 'Cliente'),
        ('especialista', 'Especialista'),
        ('empleado', 'Empleado'),
    )

    email = models.EmailField(unique=True)
    nombre = models.CharField(max_length=100)
    rol = models.CharField(max_length=20, choices=ROLES)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['nombre', 'rol']
    objects = UserManager()

   
class clientes(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='cliente_profile')
    nombre = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=128)  # Almacenado como hash 
    numero_identificacion = models.CharField(max_length=20, unique=True)
    fechaNac = models.DateField()
    genero1 = models.CharField(max_length=10)
    telefono = models.CharField(max_length=15)


class especialidades(models.Model):
    nombre = models.CharField(max_length=100)
    descripcion = models.TextField()

    
class especialistas(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='especialista_profile')
    nombre = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=128)  # Almacenado como hash 
    especialidad = models.ForeignKey(especialidades, related_name='especialistas', on_delete=models.CASCADE)
    fecha_registro = models.DateField(default=timezone.now)
    genero = models.CharField(max_length=10)
    estado = models.BooleanField(default=True)


class empleados(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='empleado_profile')
    numero_identificacion = models.CharField(max_length=20, unique=True)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=128)  # Almacenado como hash
    fecha_nacimiento = models.DateField()
    telefono = models.CharField(max_length=15)
    cargo = models.CharField(max_length=100)
    fecha_contratacion = models.DateField()
    estado = models.CharField(max_length=10)


class citas(models.Model):
    cliente = models.ForeignKey(User, on_delete=models.CASCADE, related_name='citas_cliente')
    especialista = models.ForeignKey(User, on_delete=models.CASCADE, related_name='citas_especialista')
    servicio = models.CharField(max_length=100)
    fecha = models.DateField()
    hora = models.TimeField()
    estado = models.CharField(max_length=20, default='pendiente')
    observaciones = models.TextField()


class encuestas_estres(models.Model):
    cliente = models.ForeignKey(User, on_delete=models.CASCADE, related_name='encuestas_estres')
    fecha = models.DateField()
    nivel_estres = models.IntegerField()
    puntuacion = models.IntegerField()
    comentarios = models.TextField()


class sesiones_terapia(models.Model):
    cliente = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sesiones_cliente')
    especialista = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sesiones_especialista')
    cita = models.ForeignKey('citas', on_delete=models.CASCADE)
    fecha = models.DateField()
    hora = models.TimeField()
    duracion = models.IntegerField()
    observaciones = models.TextField()


class especialistas_servicios(models.Model):
    especialista = models.ForeignKey(especialistas, on_delete=models.CASCADE)
    servicio = models.CharField(max_length=100)


class servicios(models.Model):
    nombre = models.CharField(max_length=100)
    descripcion = models.TextField()
    precio = models.DecimalField(max_digits=10, decimal_places=3)
    duracion = models.CharField(max_length=100)


class metodopago(models.Model):
    nombre = models.CharField(max_length=100)
    descripcion = models.TextField()
    requiere_autenticacion = models.TextField()
    comision = models.DecimalField(max_digits=5, decimal_places=2, default=0.0)


class pago(models.Model):
    empleado = models.ForeignKey(empleados, on_delete=models.CASCADE)
    metodopago = models.ForeignKey(metodopago, on_delete=models.PROTECT)
    monto = models.DecimalField(max_digits=11, decimal_places=3)
    descripcion = models.TextField(blank=True)
    fecha_pago = models.DateTimeField(auto_now_add=True)
    confirmado = models.CharField(max_length=10)

 


  
    
