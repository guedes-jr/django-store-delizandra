from typing import Any
from rest_framework import serializers
from catalog.models import Category, Product, ProductImage

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
