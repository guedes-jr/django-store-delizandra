from decimal import Decimal
from typing import List
from django.conf import settings
from django.db.models import Q
from rest_framework import generics, views, response, status
from catalog.models import Product
from orders.models import Order, OrderItem
from .serializers import ProductSerializer, CheckoutIn, CheckoutOut, BuyNowIn, BuyNowOut, serialize_cart_snapshot
from .services import EnvPhoneProvider, OrderMessageBuilder, WhatsAppLinkService, CartLine

class ProductListView(generics.ListAPIView):
    serializer_class = ProductSerializer

    def get_queryset(self):
        qs = Product.objects.filter(is_active=True).select_related("category").prefetch_related("images").order_by("-featured", "-id")
        q = self.request.query_params.get("q", "").strip()
        cat = self.request.query_params.get("category")
        if q:
            qs = qs.filter(Q(name__icontains=q) | Q(description__icontains=q) | Q(sku__icontains=q))
        if cat:
            qs = qs.filter(category__slug=cat)
        return qs

class ProductDetailView(generics.RetrieveAPIView):
    serializer_class = ProductSerializer
    queryset = Product.objects.filter(is_active=True).select_related("category").prefetch_related("images")

class CheckoutWhatsAppView(views.APIView):
    def post(self, request):
        serializer = CheckoutIn(data=request.data)
        if not serializer.is_valid():
            return response.Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        items_in = serializer.validated_data["items"]
        customer_name = serializer.validated_data.get("customer_name", "")
        customer_phone = serializer.validated_data.get("customer_phone", "")

        products = {p.id: p for p in Product.objects.filter(id__in=[i["product_id"] for i in items_in], is_active=True)}
        if len(products) != len(items_in):
            return response.Response({"detail": "Produto inválido ou inativo."}, status=status.HTTP_400_BAD_REQUEST)

        lines: List[CartLine] = []
        total = Decimal("0")
        for it in items_in:
            p = products[it["product_id"]]
            unit = Decimal(p.promo_price or p.price)
            qty = int(it["qty"])
            total += unit * qty
            lines.append(CartLine(p.name, qty, unit))

        builder = OrderMessageBuilder(getattr(settings, "STORE_NAME", "Minha Loja"))
        msg = builder.build(lines, total, customer_name, customer_phone)

        link_service = WhatsAppLinkService(EnvPhoneProvider(getattr(settings, "WHATSAPP_PHONE", "")))
        link = link_service.build(msg)

        order = Order.objects.create(
            customer_name=customer_name,
            customer_phone=customer_phone,
            total=total,
            snapshot=serialize_cart_snapshot({"items": items_in}),
        )
        for l, it in zip(lines, items_in):
            OrderItem.objects.create(
                order=order,
                product_id=int(it["product_id"]),
                name=l.name,
                qty=int(it["qty"]),
                unit_price=l.unit_price,
                line_total=l.unit_price * int(it["qty"]),
            )

        out = CheckoutOut({"whatsapp_link": link, "total": total})
        return response.Response(out.data, status=status.HTTP_201_CREATED)

class BuyNowWhatsAppView(views.APIView):
    def post(self, request):
        serializer = BuyNowIn(data=request.data)
        if not serializer.is_valid():
            return response.Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        p = Product.objects.filter(id=serializer.validated_data["product_id"], is_active=True).first()
        if not p:
            return response.Response({"detail": "Produto inválido ou inativo."}, status=status.HTTP_400_BAD_REQUEST)

        qty = int(serializer.validated_data["qty"])
        unit = Decimal(p.promo_price or p.price)
        total = unit * qty
        line = CartLine(p.name, qty, unit)

        builder = OrderMessageBuilder(getattr(settings, "STORE_NAME", "Minha Loja"))
        msg = builder.build([line], total, "", "")

        link_service = WhatsAppLinkService(EnvPhoneProvider(getattr(settings, "WHATSAPP_PHONE", "")))
        link = link_service.build(msg)

        order = Order.objects.create(customer_name="", customer_phone="", total=total, snapshot={"items": [{"product_id": p.id, "qty": qty}]})
        OrderItem.objects.create(order=order, product_id=p.id, name=p.name, qty=qty, unit_price=unit, line_total=total)

        out = BuyNowOut({"whatsapp_link": link, "total": total})
        return response.Response(out.data, status=status.HTTP_201_CREATED)
