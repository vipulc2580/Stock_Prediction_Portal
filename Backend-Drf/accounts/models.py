from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager

# Create your models here.
class UserManager(BaseUserManager):

    def create_user(
            self,
            first_name,
            last_name,
            username,
            email,
            phone_number,
            password=None):
        if not email:
            raise ValueError('User must have an email Address')
        if not username:
            raise ValueError('User must have an username')

        user = self.model(
            email=self.normalize_email(email),  # capital letter to lowercase
            username=username,
            first_name=first_name,
            last_name=last_name,
            phone_number=phone_number
        )

        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(
            self,
            first_name,
            last_name,
            email,
            username,
            password,phone_number=None):
        user = self.create_user(
            first_name=first_name,
            last_name=last_name,
            username=username,
            password=password,
            phone_number=phone_number,
            email=self.normalize_email(email),
        )
        user.is_admin = True
        user.is_active = True
        user.is_staff = True
        user.is_superadmin = True
        user.save(using=self._db)
        return user


class User(AbstractBaseUser):
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    username = models.CharField(max_length=50, unique=True)
    email = models.EmailField(max_length=100, unique=True)
    phone_number = models.CharField(max_length=12, blank=True, null=True)

    # required Fields
    created_at = models.DateTimeField(auto_now=False, auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True, auto_now_add=False)
    is_admin = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=False)
    is_superadmin = models.BooleanField(default=False)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', 'first_name', 'last_name']

    objects = UserManager()

    def __str__(self):
        return self.email

    def has_perm(self, perm, obj=None):
        return self.is_admin

    def has_module_perms(self, add_label):
        return True

    def full_name(self):
        return f"{self.first_name} {self.last_name}"

