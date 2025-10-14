from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Product, Inventory

@receiver(post_save, sender=Product)
def ensure_inventory(sender, instance: Product, created: bool, **kwargs):
    if created:
        Inventory.objects.get_or_create(product=instance, defaults={"quantity": 0})
