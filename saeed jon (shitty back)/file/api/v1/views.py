from rest_framework.generics import ListCreateAPIView, RetrieveUpdateAPIView, ListAPIView, CreateAPIView
from rest_framework.permissions import IsAuthenticated, BasePermission
from rest_framework.views import Response

from file.models import HomeWork
from .serializer import HomeWorkSerializer, TeacherHomeWorkSerializer, UserSerializer

class ListHomeWork(ListCreateAPIView):
    model = HomeWork
    serializer_class = HomeWorkSerializer
    permission_classes = (IsAuthenticated, )
    
    def get_queryset(self):
        return self.model.objects.filter(user=self.request.user)
  
  
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class IsStaff(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_staff
    
    
class TeacherApiView(ListAPIView):
    serializer_class = TeacherHomeWorkSerializer
    queryset = HomeWork.objects.all()
    permission_classes = (IsStaff, )
    

class TeacherUpdateGetApiView(RetrieveUpdateAPIView):
    serializer_class = TeacherHomeWorkSerializer
    permission_classes = (IsStaff,)
    queryset = HomeWork.objects
    
    
class UserSignin(CreateAPIView):
    serializer_class = UserSerializer
    
    
    def perform_create(self, serializer):
        serializer.is_valid()
        serializer.save()
    