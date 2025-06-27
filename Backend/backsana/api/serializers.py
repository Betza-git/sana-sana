from .models import clientes, especialistas, empleados, citas, encuestas_estres, sesiones_terapia, especialistas_servicios, servicios, especialidades, metodopago, pago
from django.core.validators import EmailValidator
from django.utils import timezone
from rest_framework import serializers
from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import clientes, especialistas, empleados

class ClienteLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, style={'input_type': 'password'})

    def validate(self, data):
        email = data.get('email')
        password = data.get('password')

        if email and password:
            cliente = authenticate(username=email, password=password)
            if not cliente:
                try:
                    cliente = clientes.objects.get(email=email, password=password)
                except clientes.DoesNotExist:
                    raise serializers.ValidationError("Credenciales inválidas")
            
            if not cliente:
                raise serializers.ValidationError("No se puede iniciar sesión con las credenciales proporcionadas")
        else:
            raise serializers.ValidationError("Debe incluir email y contraseña")

        data['user'] = cliente
        return data

class EspecialistaLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, style={'input_type': 'password'})

    def validate(self, data):
        email = data.get('email')
        password = data.get('password')

        if email and password:
            especialista = authenticate(username=email, password=password)
            if not especialista:
                try:
                    especialista = especialistas.objects.get(email=email, password=password)
                except especialistas.DoesNotExist:
                    raise serializers.ValidationError("Credenciales inválidas")
            
            if not especialista.estado:
                raise serializers.ValidationError("Este especialista está inactivo")
        else:
            raise serializers.ValidationError("Debe incluir email y contraseña")

        data['user'] = especialista
        return data

class EmpleadoLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, style={'input_type': 'password'})

    def validate(self, data):
        email = data.get('email')
        password = data.get('password')

        if email and password:
            empleado = authenticate(username=email, password=password)
            if not empleado:
                try:
                    empleado = empleados.objects.get(email=email, password=password)
                except empleados.DoesNotExist:
                    raise serializers.ValidationError("Credenciales inválidas")
            
            if not empleado.estado:
                raise serializers.ValidationError("Este empleado está inactivo")
        else:
            raise serializers.ValidationError("Debe incluir email y contraseña")

        data['user'] = empleado
        return data


class ClientesSerializer(serializers.ModelSerializer):
    class Meta:
        model = clientes
        fields = '__all__'

    def validate_email(self, value):
        EmailValidator(message="El email debe tener un formato válido.")(value)
        return value
    def validate_telefono(self, value):
        if not value.isdigit() or len(value) < 8: #value.isdigit() es para asegurarse de que el teléfono contenga solo números
            raise serializers.ValidationError("El teléfono debe contener solo números y tener al menos 8 dígitos.")
        return value
    def validate_password(self, value):
        if len(value) < 8:
            raise serializers.ValidationError("La contraseña debe tener al menos 8 caracteres.")
        return value
    def validate(self, data):
        required_fields = ['nombre', 'numero_identificacion', 'email', 'password', 'telefono']
        for field in required_fields:
            if not data.get(field):   # Verifica si el campo está vacío
                raise serializers.ValidationError({field: "Este campo es requerido."})
        return data
    


class EspecialistasSerializer(serializers.ModelSerializer):
    class Meta:
        model = especialistas
        fields = '__all__'
    
    def validate_email(self, value):
        EmailValidator(message="El email debe tener un formato válido.")(value)
        return value

    def validate_password(self, value):
        if len(value) < 8:
            raise serializers.ValidationError("La contraseña debe tener al menos 8 caracteres.")
        return value
    
    def validate(self, data):
        required_fields = ['nombre', 'email', 'especialidades', 'password', 'genero']
        for field in required_fields:
            if not data.get(field):
                raise serializers.ValidationError({field: "Este campo es requerido."})
        return data

class EmpleadosSerializer(serializers.ModelSerializer):
    class Meta:
        model = empleados
        fields = '__all__'
    
    def validate_email(self, value):
        EmailValidator(message="El email debe tener un formato válido.")(value)
        return value
    
    def validate_telefono(self, value):
        if not value.isdigit() or len(value) < 8:
            raise serializers.ValidationError("El teléfono debe contener solo números y tener al menos 8 dígitos.")
        return value

    def validate_password(self, value):
        if len(value) < 8:
            raise serializers.ValidationError("La contraseña debe tener al menos 8 caracteres.")
        return value
    
    def validate(self, data):
        required_fields = ['nombre', 'email', 'telefono', 'cargo', 'password']
        for field in required_fields:
            if not data.get(field):
                raise serializers.ValidationError({field: "Este campo es requerido."})
        return data

class CitasSerializer(serializers.ModelSerializer):
    class Meta:
        model = citas
        fields = '__all__'
    
    def validate_fecha(self, value):
        if value < timezone.now().date():   # Verifica si la fecha es en el pasado
            raise serializers.ValidationError("No se puede crear una cita en el pasado.")
        return value
    
    def validate_estado(self, value):
        valid_estados = ['pendiente', 'confirmado', 'cancelado']
        if value.lower() not in valid_estados:    #value.lower() es para que no importe si se escribe en mayúsculas o minúsculas
            raise serializers.ValidationError(f"Estado inválido. Los valores válidos son: {', '.join(valid_estados)}")
        return value
    
    def validate(self, data):
        required_fields = ['cliente', 'especialista', 'servicio', 'fecha', 'hora']
        for field in required_fields:
            if not data.get(field):     #data.get(field) verifica si el campo existe y no es None
                raise serializers.ValidationError({field: "Este campo es requerido."})
        
        # Validar que la hora no sea en el pasado si es para hoy
        if data.get('fecha') == timezone.now().date() and data.get('hora'):
            if data['hora'] < timezone.now().time():
                raise serializers.ValidationError({"hora": "No se puede crear una cita con hora pasada para el día actual."})
        return data

class EncuestasEstresSerializer(serializers.ModelSerializer):
    class Meta:
        model = encuestas_estres
        fields = '__all__'
    
    def validate_nivel_estres(self, value):
        if not (1 <= value <= 10):
            raise serializers.ValidationError("El nivel de estrés es entre 1 y 10.")
        return value
    
    def validate_puntuacion(self, value):
        if not (1 <= value <= 5):
            raise serializers.ValidationError("La puntuación es entre 1 y 5.")
        return value

    def validate_fecha(self, value):
        if value > timezone.now().date():
            raise serializers.ValidationError("La fecha no puede ser en el futuro.")
        return value
    
    def validate(self, data):
        required_fields = ['cliente', 'fecha', 'nivel_estres', 'puntuacion']
        for field in required_fields:
            if not data.get(field):
                raise serializers.ValidationError({field: "Este campo es requerido."})
        return data

class SesionesTerapiaSerializer(serializers.ModelSerializer):
    class Meta:
        model = sesiones_terapia
        fields = '__all__'

    def validate_duracion(self, value):
        if value <= 0:
            raise serializers.ValidationError("La duración debe ser un valor positivo.")
        return value
    
    def validate(self, data):
        required_fields = ['cliente', 'especialista', 'cita', 'fecha', 'hora', 'duracion']
        for field in required_fields:
            if not data.get(field):
                raise serializers.ValidationError({field: "Este campo es requerido."})
        return data

class EspecialistasServiciosSerializer(serializers.ModelSerializer):
    class Meta:
        model = especialistas_servicios
        fields = '__all__'
    
    def validate(self, data):
        if not data.get('especialista') or not data.get('servicio'):
            raise serializers.ValidationError("Debe especificar tanto el especialista como el servicio.")
        return data
    
class EspecialidadesSerializer(serializers.ModelSerializer):
    class Meta:
        model = especialidades
        fields = '__all__'
    
    def validate_nombre(self, value):
        if len(value) < 3:
            raise serializers.ValidationError("El nombre de la especialidad debe tener al menos 3 caracteres.")
        return value
    
    def validate(self, data):
        required_fields = ['nombre']
        for field in required_fields:
            if not data.get(field):
                raise serializers.ValidationError({field: "Este campo es requerido."})
        return data
    
class ServiciosSerializer(serializers.ModelSerializer):
    class Meta:
        model = servicios
        fields = '__all__'
    
    def validate_nombre(self, value):
        if len(value) < 3:
            raise serializers.ValidationError("El nombre del servicio debe tener al menos 3 caracteres.")
        return value
    
    def validate_precio(self, value):
        if value <= 0:
            raise serializers.ValidationError("El precio debe ser un valor positivo.")
        return value
    
    
    def validate(self, data):
        required_fields = ['nombre', 'descripcion', 'precio', 'duracion']
        for field in required_fields:
            if not data.get(field):
                raise serializers.ValidationError({field: "Este campo es requerido."})
        return data

class MetodosPagoSerializer(serializers.ModelSerializer):
    class Meta:
        model = metodopago
        fields = '__all__'
    
    def validate_comision(self, value):
        if value < 0:
            raise serializers.ValidationError("La comisión debe ser un valor positivo.")
        return value

class PagosSerializer(serializers.ModelSerializer):
    class Meta:
        model = pago
        fields = '__all__'
    
    def validate_monto(self, value):
        if value <= 0:
            raise serializers.ValidationError("El monto debe ser un valor positivo.")
        return value
    
    def validate_estado(self, value):
        valid_estados = ['confirmado']
        if value.lower() not in valid_estados:
            raise serializers.ValidationError(f"Estado inválido. Los valores válidos son: {', '.join(valid_estados)}") #{', '.join(valid_estados)}") es para que se muestre una lista de los estados válidos
        return value
    
    def validate(self, data):
        required_fields = ['metodopago', 'monto']
        for field in required_fields:
            if not data.get(field):
                raise serializers.ValidationError({field: "Este campo es requerido."})#data.get(field) verifica si el campo existe y no es None
        return data