from logging import raiseExceptions
from django.contrib.auth.models import User, Group
from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework import permissions
from  rest_framework.response import Response 
from rest_framework import generics
from .models import Person, Profile, ReadyRoom
from .serializers import CreateUserSerializer, PersonSerializer, LoginSerializer, ProfileSerializer
from knox.models import AuthToken

import json 


from quickstart.serializers import UserSerializer, GroupSerializer


class UserViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]


class GroupViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows groups to be viewed or edited.
    """
    queryset = Group.objects.all()
    serializer_class = GroupSerializer
    permission_classes = [permissions.IsAuthenticated]



class CreateUserView(generics.GenericAPIView):
    serializer_class = CreateUserSerializer
     
    def post(self, request, format =None):
        try:
            user = User.objects.get(username=request.data['username'])
        except User.DoesNotExist:    
            print("requested data", request.data )
            serializer = self.get_serializer(data= request.data)
            serializer.is_valid(raise_exception=False)
            user_type = serializer.validated_data["user_type"]
            print("val data", serializer.validated_data)
            class_number = serializer.validated_data["class_number"]
            user = serializer.save()
            # attention c'est moche là double user !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
            profile = Profile.objects.create(id_name= user , user_type=user_type,ss_name=user, class_number =class_number)
            profile.save()
            return Response({
                'user':UserSerializer(user,context=self.get_serializer_context()).data,
                "token": AuthToken.objects.create(user)[1]
            })
        return Response("user exists")


class LoginUserView(generics.GenericAPIView):
    serializer_class = LoginSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data
        return Response({
            "user":UserSerializer(user, context=self.get_serializer_context()).data,
            "token": AuthToken.objects.create(user)[1]
        })


class RetrieveNamesView(generics.GenericAPIView):

    def get(self, request, format=None):
        print("request")
        ss_name = "lou"
        # ss_name = request.query_params["username"]
        queryNmame = Person.objects.filter(group_id= 1)
        serializer = PersonSerializer(queryNmame)
        print(">>> hey ", queryNmame)
        return Response(serializer.data)

class GroupsList(generics.GenericAPIView):

    def get(self, request, format = None):
        # need to get the groups
        profiles = Profile.objects.filter(my_teacher="ft")
        class_number_list = []
        for ss in profiles:
            if ss.class_number not in class_number_list:
                class_number_list.append(ss.class_number)
        return Response({"class_number_list":class_number_list})


