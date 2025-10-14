from django.contrib import admin
from .models import Category, Product, ProductImage, Inventory, ProductReview

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ["name", "slug", "is_active", "position"]
    prepopulated_fields = {"slug": ("name",)}
    list_editable = ["is_active", "position"]

class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 0

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ["name", "sku", "price", "promo_price", "category", "is_active", "featured", "created_at"]
    search_fields = ["name", "sku"]
    list_filter = ["is_active", "featured", "category"]
    prepopulated_fields = {"slug": ("name",)}
    inlines = [ProductImageInline]

@admin.register(Inventory)
class InventoryAdmin(admin.ModelAdmin):
    list_display = ["product", "quantity"]

@admin.register(ProductReview)
class ProductReviewAdmin(admin.ModelAdmin):
    list_display = ["product", "name", "rating", "is_approved", "created_at"]
    list_filter = ["is_approved", "rating", "product"]
    search_fields = ["name", "comment", "product__name"]