from app.services.clover_service import CloverService

class PaymentService:
    def __init__(self):
        self.cloverService = CloverService()

    def formatLineItem(self, item):
        return {
            "printed": "false",
            "exchanged": "false",
            "refunded": "false",
            "item": {
                "id": item["itemId"],
                "name": item["name"],
                "price": item["price"]
            },
            "name": item["name"],
            "price": item["price"],
            "unitQty": item["quantity"],
            "note": "",
            "modifications": [],
            "discounts": [],
            "refund": {
                "transactionInfo": {
                    "isTokenBasedTx": "false",
                    "emergencyFlag": "false"
                }
            },
            "isRevenue": "false",
            "taxRates": []
        }

    def createOrderPayload(self, lineItems, totalAmount):
        return {
            "orderCart": {
                "groupLineItems": "false",
                "lineItems": lineItems,
                "total": totalAmount,
                "state": "open",
                "manualTransaction": "false",
                "testMode": "false",
                "payType": "FULL"
            }
        }

    def processPaymentData(self, paymentData):
        lineItems = []
        totalAmount = 0
        
        for itemId, item in paymentData.items():
            lineItem = self.formatLineItem(item)
            lineItems.append(lineItem)
            totalAmount += item["price"] * item["quantity"]
            
        return lineItems, totalAmount

    def formatResponseData(self, cloverOrder, totalAmount, clientId):
        return {
            'orderId': cloverOrder.get('id'),
            'amount': totalAmount,
            'currency': 'USD',
            'status': 'SUCCESS',
            'merchantName': 'Restaurant Name',
            'date': '2024-03-21',
            'clientId': clientId,
            'orderDetails': cloverOrder
        }
