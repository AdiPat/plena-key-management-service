# Introduction

This document covers the core architectural and design decisions that were taken when building the microservice.

# Assumptions

- Since we're not building an auth service, we replicate the JWT signing key across services. The JWT signing key lives in the .env file. The `gen-token` script is used to generate a token that can be used to test the service.
- Auth system is not implemented, but we check the validity of JWT token for every request. It is assumed that the gateway simply forwards the request to the server with relevant headers.
- Apart from the register user endpoint and create key endpoint, all the other endpoints on `/keys` require the presence of a valid API key.
- There is no dynamic rate limiting applied on the keys/ API. This is because the API is not expected to receive many requests. Instead, there is a static rate limit applied to these APIs.
