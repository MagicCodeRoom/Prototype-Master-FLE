from django.urls import re_path

from . import consumers


websocket_urlpatterns = [
    re_path(r'ws/quickstart/(?P<room_name>\w+)/$', consumers.ConsumerTest.as_asgi()),
]
