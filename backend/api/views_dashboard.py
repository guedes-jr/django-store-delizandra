from datetime import timedelta
from django.utils import timezone
from django.db.models import Sum, Count
from rest_framework.views import APIView
from rest_framework.response import Response
from orders.models import Order, OrderItem

class DashboardKPIView(APIView):
    def get(self, request):
        now = timezone.now()
        start = now - timedelta(days=7)

        orders_qs = Order.objects.filter(created_at__gte=start)
        revenue = orders_qs.aggregate(total=Sum("total"))["total"] or 0
        top = (
            OrderItem.objects.filter(order__created_at__gte=start)
            .values("product_id", "name")
            .annotate(qty=Sum("qty"), linhas=Count("id"))
            .order_by("-qty")[:5]
        )
        return Response({
            "orders_last_7_days": orders_qs.count(),
            "revenue_last_7_days": str(revenue),
            "top_products": list(top)
        })
