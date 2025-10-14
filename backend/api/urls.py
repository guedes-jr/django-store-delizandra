from django.urls import path
from .views import ProductListView, ProductDetailView, CheckoutWhatsAppView, BuyNowWhatsAppView

urlpatterns = [
    path("products/", ProductListView.as_view()),
    path("products/<int:pk>/", ProductDetailView.as_view()),
    path("checkout/whatsapp/", CheckoutWhatsAppView.as_view()),
    path("buynow/whatsapp/", BuyNowWhatsAppView.as_view()),
]
