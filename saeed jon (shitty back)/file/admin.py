from django.contrib import admin
from .models import HomeWork
# Register your models here.

@admin.register(HomeWork)
class HomeWorkAdmin(admin.ModelAdmin):
    list_display = ('user', 'title', 'status')