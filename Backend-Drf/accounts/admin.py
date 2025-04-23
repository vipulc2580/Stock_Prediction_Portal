from django.contrib import admin
from .models import User
from django.contrib.auth.admin import UserAdmin
from .forms import CustomUserCreationForm,CustomUserChangeForm
# Register your models here.
class CustomUserAdmin(UserAdmin):
    form = CustomUserChangeForm
    add_form = CustomUserCreationForm
    
    list_display = [
        'email', 'first_name', 'last_name',
        'username', 'updated_at', 'created_at', 'is_active'
    ]
    list_display_links = ('email', 'first_name', 'last_name')
    readonly_fields = ('updated_at', 'created_at')
    ordering = ('-created_at',)
    filter_horizontal = ()
    list_filter = ()

    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Personal Info', {'fields': ('first_name', 'last_name', 'username', 'phone_number')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_admin', 'is_superadmin')}),
        ('Important dates', {'fields': ('updated_at', 'created_at')}),
    )

    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': (
                'email', 'first_name', 'last_name', 'username','phone_number',
                'password1', 'password2'
            ),
        }),
    )


admin.site.register(User,CustomUserAdmin)