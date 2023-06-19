from rest_framework.urls import path
from .views import ListHomeWork, TeacherApiView, TeacherUpdateGetApiView, UserSignin

urlpatterns = [
    path('home-work/', ListHomeWork.as_view(), name="home-work-list"),
    path('teacher/', TeacherApiView.as_view(), name="teacher-home-work-list"),
    
    path('teacher/<int:pk>/', TeacherUpdateGetApiView.as_view(), name="home-work-update"),
    path('test/', UserSignin.as_view(), name="test"),
    
    
]
