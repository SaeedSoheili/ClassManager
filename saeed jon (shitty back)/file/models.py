from django.db import models
from django.contrib.auth.models import User

# Create your models here.


class HomeWork(models.Model):
    PENDING = 1
    ACCEPTED = 2
    REJECTED = 3
    status_type = (
        (PENDING, "pending"),
        (ACCEPTED, 'accepted'),
        (REJECTED, 'rejected'),
    )
    
    file = models.FileField(null=True, blank=True, upload_to='files/')
    image = models.ImageField(null=True, blank=True, upload_to='images/')
    user = models.ForeignKey(User, related_name='homeworks', on_delete=models.CASCADE)
    date = models.DateTimeField(auto_now_add=True)
    status = models.PositiveSmallIntegerField(choices=status_type, default=PENDING)
    title = models.CharField(max_length=45)
    
    def __str__(self):
        return self.title
    