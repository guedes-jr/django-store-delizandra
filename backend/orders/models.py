from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class Order(models.Model):
    customer_name = models.CharField(max_length=140, blank=True)
    customer_phone = models.CharField(max_length=32, blank=True)
    channel = models.CharField(max_length=32, default="whatsapp")
    status = models.CharField(max_length=32, default="created")
    total = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    snapshot = models.JSONField(default=dict)
    created_at = models.DateTimeField(auto_now_add=True)
    created_by = models.ForeignKey(User, null=True, blank=True, on_delete=models.SET_NULL)

    def __str__(self) -> str:
        return f"Order #{self.pk}"


class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name="items")
    product_id = models.IntegerField()
    name = models.CharField(max_length=180)
    qty = models.PositiveIntegerField()
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)
    line_total = models.DecimalField(max_digits=12, decimal_places=2)
