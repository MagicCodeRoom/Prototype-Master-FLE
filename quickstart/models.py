from django.db import models

# Create your models here.
from django.db import models

from django.contrib.auth.models import User

# Create your models here.

class BaseProfile(models.Model):

    USER_TYPES = (
        (0,"teacher"),
        (1,"student")
    )

    id_name= models.OneToOneField(User, related_name="id_profile", on_delete=models.CASCADE, primary_key=True)
    user_type = models.IntegerField(null=True, blank=True, choices=USER_TYPES)

    def __str__(self):
        return '{} is a {}'.format(self.id_name, "teacher" if self.user_type==0 else "student")

    class Meta:
            abstract = True

class TeacherProfile(models.Model):

    class Meta:
        abstract = True 

class StudentProfile(models.Model):
    ss_name = models.CharField(default="none",max_length=10, blank=True, null=True)
    ss_age =  models.DateField( null=True, blank=True)
    offer_box = models.TextField(default="none", blank=True, null=True)
    class_number = models.IntegerField(default=0,null=True) 
    my_teacher = models.CharField(default="none",max_length=40, blank=True, null=True)
    # for the class_number we could user IntergerSelection / tdl 

    class Meta:
        abstract = True

class Profile(TeacherProfile, StudentProfile, BaseProfile):
    pass        

class Person(models.Model):
    name = models.CharField(max_length=100, blank=True )
    birthdate = models.DateField( null=True, blank=True)

    def __str__(self):
        return f'{self.name}, {self.birthdate}'


class ReadyRoom(models.Model):
    readyName = models.CharField(max_length=10, blank=True )
    readyState = models.BooleanField(default=False)

    def __str__(self):
        return f'{self.readyName}'
