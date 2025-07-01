# serializers.py - Corregido y optimizado

from rest_framework import serializers
from django.core.validators import EmailValidator
from django.utils import timezone
from .models import clientes, especialistas, empleados, citas, encuestas_estres, sesiones_terapia, especialistas_servicios, servicios, especialidades, metodopago, pago, User


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, style={'input_type': 'password'})

    def validate(self, data):
        email = data.get('email')
        password = data.get('password')

        if not email or not password:
            raise serializers.ValidationError("Debe incluir email y contraseña")
        
        user = User.objects.filter(email=email).first()
        if user and user.check_password(password):
            data['user'] = user
        else:
            raise serializers.ValidationError("Credenciales inválidas")

        return data


class AdminDashboardSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'nombre', 'rol']

    def create(self, validated_data):
        user = User.objects.create_user(
            email=validated_data['email'],
            nombre=validated_data['nombre'],
            password=validated_data['password'],
            rol=validated_data.get('rol', 'cliente')
        )
        return user

    def update(self, instance, validated_data):
        instance.email = validated_data.get('email', instance.email)
        instance.nombre = validated_data.get('nombre', instance.nombre)
        instance.rol = validated_data.get('rol', instance.rol)
        if 'password' in validated_data:
            instance.set_password(validated_data['password'])
        instance.save()
        return instance

    def delete(self, instance):
        instance.delete()
        return instance


class ClientesSerializer(serializers.ModelSerializer):
    class Meta:
        model = clientes
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
        required_fields = ['nombre', 'numero_identificacion', 'email', 'password', 'telefono']
        for field in required_fields:
            if not data.get(field):
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
        required_fields = ['nombre', 'email', 'especialidad', 'password', 'genero']
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
        if value < timezone.now().date():
            raise serializers.ValidationError("No se puede crear una cita en el pasado.")
        return value

    def validate_estado(self, value):
        valid_estados = ['pendiente', 'confirmado', 'cancelado']
        if value.lower() not in valid_estados:
            raise serializers.ValidationError(f"Estado inválido. Los valores válidos son: {', '.join(valid_estados)}")
        return value

    def validate(self, data):
        required_fields = ['cliente', 'especialista', 'servicio', 'fecha', 'hora']
        for field in required_fields:
            if not data.get(field):
                raise serializers.ValidationError({field: "Este campo es requerido."})

        if data.get('fecha') == timezone.now().date() and data.get('hora'):
            if data['hora'] < timezone.now().time():
                raise serializers.ValidationError({"hora": "No se puede crear una cita con hora pasada para el día actual."})
        return data


class EncuestasEstresSerializer(serializers.ModelSerializer):
    class Meta:
        model = encuestas_estres
        fields = '__all__'


class SesionesTerapiaSerializer(serializers.ModelSerializer):
    class Meta:
        model = sesiones_terapia
        fields = '__all__'


class EspecialistasServiciosSerializer(serializers.ModelSerializer):
    class Meta:
        model = especialistas_servicios
        fields = '__all__'


class EspecialidadesSerializer(serializers.ModelSerializer):
    class Meta:
        model = especialidades
        fields = '__all__'


class ServiciosSerializer(serializers.ModelSerializer):
    class Meta:
        model = servicios
        fields = '__all__'


class MetodosPagoSerializer(serializers.ModelSerializer):
    class Meta:
        model = metodopago
        fields = '__all__'


class PagosSerializer(serializers.ModelSerializer):
    class Meta:
        model = pago
        fields = '__all__'
