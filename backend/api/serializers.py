from typing import Any
from rest_framework import serializers
from catalog.models import Category, Product, ProductImage, ProductReview

class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ["url", "position"]

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ["id", "name", "slug"]

class ProductSerializer(serializers.ModelSerializer):
    category = CategorySerializer()
    images = ProductImageSerializer(many=True)

    class Meta:
        model = Product
        fields = ["id", "name", "slug", "description", "sku", "price", "promo_price", "is_active", "featured", "category", "images"]

class CheckoutItemIn(serializers.Serializer):
    product_id = serializers.IntegerField()
    qty = serializers.IntegerField(min_value=1)

    def validate_qty(self, value: int) -> int:
        from django.conf import settings
        max_qty = getattr(settings, "MAX_QTY_PER_ITEM", 10)
        if value > max_qty:
            raise serializers.ValidationError(f"Quantidade máxima por item é {max_qty}.")
        return value

class CheckoutIn(serializers.Serializer):
    items = CheckoutItemIn(many=True)
    customer_name = serializers.CharField(allow_blank=True, required=False)
    customer_phone = serializers.CharField(allow_blank=True, required=False)

class CheckoutOut(serializers.Serializer):
    whatsapp_link = serializers.CharField()
    total = serializers.DecimalField(max_digits=12, decimal_places=2)

class BuyNowIn(serializers.Serializer):
    product_id = serializers.IntegerField()
    qty = serializers.IntegerField(min_value=1)

class BuyNowOut(serializers.Serializer):
    whatsapp_link = serializers.CharField()
    total = serializers.DecimalField(max_digits=12, decimal_places=2)

def serialize_cart_snapshot(payload: dict[str, Any]) -> dict[str, Any]:
    return payload

class ProductReviewOut(serializers.ModelSerializer):
    class Meta:
        model = ProductReview
        fields = ["id", "name", "rating", "comment", "created_at"]

class ProductReviewIn(serializers.Serializer):
    name = serializers.CharField(max_length=80)
    rating = serializers.IntegerField(min_value=1, max_value=5)
    comment = serializers.CharField(allow_blank=True, required=False)