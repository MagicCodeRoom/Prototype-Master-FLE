from django.contrib import admin

from .models import Person, Profile,ReadyRoom

admin.site.register(Profile)
admin.site.register(Person)
admin.site.register(ReadyRoom)