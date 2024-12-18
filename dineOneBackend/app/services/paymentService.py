from app.services.clover_service import CloverService
from app.models.order import Order
from app.models.lineItem import LineItem
from datetime import datetime
from app import db

class PaymentService:
    def __init__(self):
        self.cloverService = CloverService()

    def formatLineItem(self, item):
        # Initialize the modifications list
        modifications = []
        
        # Check if there are selected modifiers and format them
        if 'selectedModifiers' in item and item['selectedModifiers']:
            for modifierGroupId, modifiersDict in item['selectedModifiers'].items():
                for modifierId, modifier in modifiersDict.items():
                    modifications.append({
                        "modifier": {
                            "available": str(modifier['available']).lower(),  # Convert to string and lowercase
                            "price": modifier['price'],
                            "modifierGroup": {
                                "id": modifierGroupId  # Use the modifier group ID
                            },
                            "name": modifier['name'],
                            "id": modifierId
                        },
                        "id": modifierId, 
                        "name": modifier['name'],  
                        "amount": modifier['price'] 
                    })

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
            "modifications": modifications,  # Add the formatted modifiers here
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

    def storeOrderAndLineItems(self, clientId, merchantId, cloverResponse):
        """
        Store order and line items from Clover response in the database
        """
        # Convert timestamps from milliseconds to datetime
        createdTime = datetime.fromtimestamp(cloverResponse['createdTime'] / 1000)
        clientCreatedTime = datetime.fromtimestamp(cloverResponse['clientCreatedTime'] / 1000)
        modifiedTime = datetime.fromtimestamp(cloverResponse['modifiedTime'] / 1000)

        # Create Order instance
        order = Order(
            orderId=cloverResponse['id'],
            merchantId=merchantId,
            employeeId=cloverResponse['employee']['id'],
            employeeName=cloverResponse['employee']['name'],
            currency=cloverResponse['currency'],
            total=cloverResponse['total'],
            state=cloverResponse['state'],
            taxRemoved=cloverResponse['taxRemoved'],
            isVat=cloverResponse['isVat'],
            manualTransaction=cloverResponse['manualTransaction'],
            groupLineItems=cloverResponse['groupLineItems'],
            testMode=cloverResponse['testMode'],
            createdTime=createdTime,
            clientCreatedTime=clientCreatedTime,
            modifiedTime=modifiedTime,
            clientId=clientId
        )

        try:
            db.session.add(order)
            db.session.flush()  # Get the order.id before committing

            # Process line items one at a time instead of batch
            for element in cloverResponse['lineItems']['elements']:
                lineItemCreatedTime = datetime.fromtimestamp(element['createdTime'] / 1000)
                orderClientCreatedTime = datetime.fromtimestamp(element['orderClientCreatedTime'] / 1000)

                lineItem = LineItem(
                    lineItemId=str(element['id']),  # Ensure ID is string
                    orderId=str(order.orderId),     # Ensure orderId is string
                    itemId=str(element['item']['id']) if 'item' in element else None,  # Ensure itemId is string
                    name=str(element['name']),
                    price=int(element['price']),    # Ensure price is integer
                    note=str(element['note']),
                    printed=bool(element['printed']),
                    createdTime=lineItemCreatedTime,
                    orderClientCreatedTime=orderClientCreatedTime,
                    exchanged=bool(element['exchanged']),
                    refunded=bool(element['refunded']),
                    isRevenue=bool(element['isRevenue']),
                    isOrderFee=bool(element['isOrderFee']),
                    clientId=int(clientId),         # Ensure clientId is string
                    merchantId=str(merchantId)      # Ensure merchantId is string
                )
                db.session.add(lineItem)
                db.session.flush()  # Flush after each line item

            db.session.commit()
            return order
        except Exception as e:
            db.session.rollback()
            raise Exception(f"Failed to store order and line items: {str(e)}")

    def getOrders(self, clientId, merchantId):
        """
        Retrieve all orders for a specific client and merchant
        
        Args:
            clientId (str): The ID of the client
            merchantId (str): The ID of the merchant
            
        Returns:
            list: List of orders without line items
        """
        try:
            orders = Order.query.filter_by(
                clientId=clientId,
                merchantId=merchantId
            ).order_by(Order.createdTime.desc()).all()
            
            # Format the orders into a serializable format
            formattedOrders = [{
                'orderId': order.orderId,
                'total': order.total,
                'state': order.state,
                'createdTime': order.createdTime.isoformat(),
                'currency': order.currency,
                'employeeName': order.employeeName
            } for order in orders]
                
            return formattedOrders
                
        except Exception as e:
            raise Exception(f"Failed to retrieve orders: {str(e)}")

    def getLineItems(self, clientId, orderId):
        print("clientId", clientId)
        print("orderId", orderId)
        """
        Retrieve all line items for a specific order
        
        Args:
            clientId (str): The ID of the client
            merchantId (str): The ID of the merchant
            orderId (str): The ID of the order
            
        Returns:
            list: List of line items for the specified order
        """
        try:

            lineItems = LineItem.query.filter_by(
                orderId=orderId,
                clientId=clientId,
            ).all()
            
            # Format the line items into a serializable format
            formattedLineItems = [{
                'lineItemId': item.lineItemId,
                'name': item.name,
                'price': item.price,
                'note': item.note,
                'printed': item.printed,
                'createdTime': item.createdTime.isoformat(),
                'exchanged': item.exchanged,
                'refunded': item.refunded,
                'isRevenue': item.isRevenue,
                'isOrderFee': item.isOrderFee
            } for item in lineItems]
                
            return formattedLineItems
                
        except Exception as e:
            raise Exception(f"Failed to retrieve line items: {str(e)}")
