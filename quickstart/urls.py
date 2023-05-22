from django.urls import path 
from .views import RetrieveNamesView, CreateUserView, LoginUserView, GroupsList
    

urlpatterns =[
 
    path("createuser/", CreateUserView.as_view(), name="create-user-view"),
    path("login/", LoginUserView.as_view(), name = "login-view"),
    path('names/', RetrieveNamesView.as_view(), name="retrive-names"),
    path("groupslist/", GroupsList.as_view(), name="group-list"),
]
