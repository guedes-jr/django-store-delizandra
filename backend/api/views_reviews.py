from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Avg, Count
from catalog.models import Product, ProductReview
from .serializers import ProductReviewOut, ProductReviewIn

class ProductReviewListCreate(APIView):
    def get(self, request, product_id: int):
        if not Product.objects.filter(id=product_id, is_active=True).exists():
            return Response({"detail": "Produto não encontrado."}, status=404)
        qs = ProductReview.objects.filter(product_id=product_id, is_approved=True).order_by("-created_at")
        data = ProductReviewOut(qs, many=True).data
        agg = qs.aggregate(avg=Avg("rating"), count=Count("id"))
        return Response({"results": data, "average": agg["avg"] or 0, "count": agg["count"]})

    def post(self, request, product_id: int):
        p = Product.objects.filter(id=product_id, is_active=True).first()
        if not p:
            return Response({"detail": "Produto não encontrado."}, status=404)
        ser = ProductReviewIn(data=request.data)
        if not ser.is_valid():
            return Response(ser.errors, status=400)
        r = ProductReview.objects.create(
            product=p,
            name=ser.validated_data["name"],
            rating=ser.validated_data["rating"],
            comment=ser.validated_data.get("comment", ""),
            is_approved=True,  # mude para False se quiser moderação manual no admin
        )
        out = ProductReviewOut(r).data
        return Response(out, status=201)
