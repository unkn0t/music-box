from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView, TokenObtainPairView

from jwt_auth.views import LogoutView

urlpatterns = [
    path("login/", TokenObtainPairView.as_view()),
    path("logout/", LogoutView.as_view()),
    path("refresh/", TokenRefreshView.as_view()),
]
