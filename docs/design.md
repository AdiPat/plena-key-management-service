# Introduction

This document covers the core architectural and design decisions that were taken when building the microservice.

**NOTE:** The service is Dockerized, but not integration tested with Docker. The service works standalone with Docker but might not work with the `plena-token-service` because the latter uses the Redis instance on the machine whereas the former uses the Redis container in the Docker volume.

# Assumptions

- Since we're not building an auth service, we replicate the JWT signing key across services. The JWT signing key lives in the .env file. The `gen-token` script is used to generate a token that can be used to test the service.
- Auth system is not implemented, but we check the validity of JWT token for every request. It is assumed that the gateway simply forwards the request to the server with relevant headers.
- Apart from the register user endpoint and create key endpoint, all the other endpoints on `/keys` require the presence of a valid API key.
- There is no dynamic rate limiting applied on the keys/ API. This is because the API is not expected to receive many requests. Instead, there is a static rate limit applied to these APIs.
- The testing is done with the same set of Redis instance and DB. This is kept for simplicity and to show functionality. The correct approach would be to have a seperate Redis and DB instance for testing.
- There is no special endpoint for "plan" or any entity called "plan" because it holds the same information that the `/all` endpoint returns. If, for user-experience we want to add a "plan" endpoint, then it would simply replicate the data from `/all` and present it differently. This has been skipped to avoid duplication.
