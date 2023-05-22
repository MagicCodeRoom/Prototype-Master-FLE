from django.contrib.auth.models import User, Group
from django.contrib.auth import authenticate
from rest_framework import serializers
from .models import Person, Profile, ReadyRoom

class ReadyRoomSerializer(serializers.ModelSerializer):
    ready = serializers.ReadOnlyField()

    class Meta:
        model = ReadyRoom
        fields=("ready")


class ProfileSerializer(serializers.ModelSerializer):
    ss_name = serializers.ReadOnlyField()
    ss_age = serializers.ReadOnlyField()
    offer_box = serializers.ReadOnlyField()
    class_number = serializers.ReadOnlyField()
    my_teacher = serializers.ReadOnlyField()

    class Meta:
        model = Profile
        fields=("ss_name","ss_age","offer_box","class_number","my_teacher")




class UserSerializer(serializers.ModelSerializer):
    # url = serializers.HyperlinkedIdentityField(view_name="user-detail", lookup_field = 'pk')
    user_type = serializers.ReadOnlyField(source="id_profile.user_type")
    class_number = serializers.ReadOnlyField(source="id_profile.class_number")
    class Meta:
        model = User
        fields = ['id', 'username', 'user_type',"class_number"]


class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = ['url', 'name']

class PersonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Person
        fields = ["name", "birthdate"] 

class CreateUserSerializer(serializers.ModelSerializer):
    user_type = serializers.CharField(max_length= 1)
    class_number = serializers.CharField(max_length= 1)

    class Meta:
        model= User
        fields = ("id", "username", "password", "user_type","class_number")
        extra_kwargs =  {
            'password': {"write_only":True}
        }

    def create(self, validated_data):
        return User.objects.create_user(validated_data['username'], None, validated_data["password"])

class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()

    def validate(self, data):
        user = authenticate(**data)
        if user and user.is_active:
            return user
        raise serializers.ValidationError("Unable to log in with provided credentials.")



