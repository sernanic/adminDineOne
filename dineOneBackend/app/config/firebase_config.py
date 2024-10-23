import firebase_admin
from firebase_admin import credentials

def initialize_firebase():
    cred = credentials.Certificate({
        "type": "service_account",
        "project_id": "adminrestaurantapp-7ae66",
        "private_key_id": "51245275e22bd4479145c6ee3efd0a437cf48db9",
        "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC8EhmyuDW586vx\nQyIA2l24OZmfCiiQH7tZZoKN+jqz4SPW7MFAQvB4UaX3HYDdF0R7gacQhvNIjrTY\n6jYTU8BoUPi1YzAS25IdRclgXO4o1ouyVHVuqXEV7W6zjADQJaJQNhQuPp4FBpyb\nW/sWCvqi2iozm+V3+g5s8Z9p7pYt7ISbi0xGOMGYcAMjirXaSNw/X4R1mqt811F1\nKMkMSF5/aHEDFUlyWbOdbLRmtfe3Lf7NPur6UF+s40J4+mXudnmqepMtmq3SivTc\nJC+r2UHjNGhCCm6R8I6GE7ciXDOP8UsU3w1IdV1GM8eaQJsmYaNIjisXjle8ZyKF\nKr/4hh8/AgMBAAECggEAHexWAQ+Pd3oDs4FWRFh6F45imOFe5Coy/t3Gi/HHq/Mj\nEVaIxkFgTWSASY8nf7CXXtHu05Gv3QLdAgj8eEVtFFaTG8PKVFXHK7fSJe44nnAf\nDff42etFE5NmzP52P/1HlAeRXReYFiif0Oro9PA47KGq8UcuqCY1wV5jBNHHPKBi\nnRi9nq1VxkBS4WYPUHh+avNNlYeAs/feR35oAMNuL1NlC0Zn2utJkF70TSDFE8R/\nE9uNSXJ6vA8HtYX3Z9PYq2ju83NsOqRLvZVzdfaJF0Cz45bBFLfqCmhl9OOWw9WF\n7oAPWka4WwuHI3Q2HEwdxih7xHw/3qbN+8Tqkc2xEQKBgQDlMD3i7zfuVhJIo4cy\nhmJyR6S2kxflLJMyo1bDkh/e1r1SlG0VZMkEp4Dfm8CUT3zJie/c5Jf3ZWKtiUL+\nTg94KMG9jBmJN5K5Tm8xOcsR1wimfSMEp+wp5JNjC3MTfW+62jvNoCJat2HiQzZY\nqxdLG4c2cQZdY8nfoT3oH5zeawKBgQDSEnXi7hUHFoxyEMJFpJhix53rV35ZjMMC\ncCgXuw1F5Yxr1TYYjmV6erInJpa7RH8rRSzzSJQ/ZagQtU9JTZo9UIP1npDIFGsF\n55lwRxds+LtRlLgpU1lBRQxfvn1W0YmWzuBAwyHLZ/NYkvGa3lsR68PA7DCRcVhS\nwKG1jn/PfQKBgQDCB1xtUi6cxRuHiYH84U5ZB5RHyTHSoDEiDqx2t6/pnQz865GK\nKiAQo6p0JE0egkjX6sI51QFeveOTnQAtgXKRPJgA26oGxBigbumt2Aq2WMEHCivq\nViuWr9+jW18aIfjETNuSUr6i5FunDVXmLTp0KKMJERjdWYzfmYdqi9DnbwKBgHAm\nguFAEeHS2/AZml3r3Z7+ywRVlZLhX0rx7bWdmxxxzGHVVigN/YdB8dKM+3PGwc2s\nBK9tVBf0gaFJ6qZL08hgL9L1cH4gyHJCjtwuWAdJU1feeeM2KDR8VHrZC7lJ7Jai\no35vrp8VRAlJicsQYrZSlBNvBQ7g4DJtvOdcyEdRAoGBANd3a4ZasFqv/rCO2hPp\n/nOtrhMgR1LTRiXR4fnHQIX0NEwVpQk459ykBJNJTkbnjxV5TATUFA2IFkICcZyt\nlEg8FWaUhok0yVgu7M2hiXuyjqPlvFCU6G9qTo0J2LTZby/hS9yuVIFAtEgUAQsj\nQUwaVjinPBMY5eq7xo97y/OU\n-----END PRIVATE KEY-----\n",
        "client_email": "firebase-adminsdk-2gqp0@adminrestaurantapp-7ae66.iam.gserviceaccount.com",
        "client_id": "106012017358653694947",
        "auth_uri": "https://accounts.google.com/o/oauth2/auth",
        "token_uri": "https://oauth2.googleapis.com/token",
        "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
        "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-2gqp0%40adminrestaurantapp-7ae66.iam.gserviceaccount.com"
    })
    
    firebase_admin.initialize_app(cred)

# Call this function when your app starts
# initialize_firebase()




