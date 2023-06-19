from rest_framework import serializers
from django.contrib.auth.models import User
from file.models import HomeWork


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('username', 'id')
        read_only_fields = ('username', 'id')

class HomeWorkSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    status= serializers.SerializerMethodField()


    
    def get_status(self, obj):
        return obj.get_status_display()
    
    
    class Meta:
        model = HomeWork
        fields = ('id','username','date', 'status', 'title', 'user', 'file', 'image')
        read_only_fields = ('status', 'user')
        
        
class TeacherHomeWorkSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    # status = serializers.SerializerMethodField(method_name="get_status", read_only=False)
    
    
    def get_status(self, obj):
        return obj.get_status_display()
    
    
    def to_representation(self, instance):
        rep = super().to_representation(instance)
        rep['status'] = instance.get_status_display()
        return rep
    
    
    class Meta:
        model = HomeWork
        fields = ('id', 'username' , 'status' ,'date', 'title', 'file', 'image')
        read_only_fields = ('date','user', 'title', 'file', 'image')
        
        
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('username', 'email', 'password', )
        
        
        
        