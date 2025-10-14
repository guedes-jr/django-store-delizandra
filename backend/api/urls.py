from django.urls import path
from .views import ProductListView, ProductDetailView, CheckoutWhatsAppView, BuyNowWhatsAppView
from .views_media import ProductImageListCreateView, ProductImageDeleteView
from .views_dashboard import DashboardKPIView
from .views_reviews import ProductReviewListCreate


urlpatterns = [
    path("products/", ProductListView.as_view()),
    path("products/<int:pk>/", ProductDetailView.as_view()),
    path("checkout/whatsapp/", CheckoutWhatsAppView.as_view()),
    path("buynow/whatsapp/", BuyNowWhatsAppView.as_view()),

    path("products/<int:product_id>/images/", ProductImageListCreateView.as_view()),
    path("products/<int:product_id>/images/<int:image_id>/", ProductImageDeleteView.as_view()),
    path("products/<int:product_id>/reviews/", ProductReviewListCreate.as_view()),

    path("dashboard/kpis/", DashboardKPIView.as_view()),
]