from typing import Optional
from catalog.models import Product
from django.conf import settings

def get_primary_image_url(p: Product) -> str:
    img = p.images.order_by("position", "id").first()
    if img:
        return img.url
    return getattr(settings, "DEFAULT_PRODUCT_IMAGE", "")
