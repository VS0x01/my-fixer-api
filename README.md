# my-fixer
## DB2 internship homework

### myFixer API

- Accounts: 

    - Auth: 

        | Method        | Endpoint          | Parameters        |
        |:-------------:|:-----------------:|:-----------------:|
        | POST          | /accounts/sign-in |                   |
        | PATCH/PUT     | /confirm          | token             |
        | GET           | /accounts/token   |                   |
    
    - CRUD:
    
        | Method        | Endpoint          | Parameters        |
        |:-------------:| ----------------- | ----------------- |
        | GET           | /accounts         |                   |
        | POST          | /accounts         |                   |
        | GET           | /accounts/:id     |                   |
        | PATCH/PUT     | /accounts/:id     |                   |
        | DELETE        | /accounts/:id     |                   |
