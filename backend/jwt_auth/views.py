from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.request import Request
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken


class LogoutView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request: Request) -> Response:
        try:
            refresh_token = RefreshToken(request.data["refresh"])
            refresh_token.blacklist()
            return Response({"message": "Successfully logged out"})
        except Exception:
            return Response(
                {"error": "Invalid refresh token"},
                status=status.HTTP_400_BAD_REQUEST,
            )
